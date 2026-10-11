#!/usr/bin/env node
// Isolated, spend-bounded smoke benchmark. Uses the ORIGINAL historical Council v3 source,
// not the integrated production Council. Synthetic fixtures only, no private user data.
import { readFile, mkdir, writeFile, appendFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { performance } from 'node:perf_hooks';
import {
  createCanonicalizedDirectProvider,
  createSelfRefineCanonicalHarness,
  createBuilderPreservationHarnessV3,
} from './v3/harnesses.mjs';
import { scoreTask } from './lib.mjs';

const MODEL = 'gpt-4o-mini-2024-07-18';
const RATE_INPUT = 0.15 / 1000000;
const RATE_OUTPUT = 0.60 / 1000000;
const CAP = 0.30;
const MAX_OUTPUT_PER_CALL = 900;
const suiteFile = new URL('../../bench/pilot-20261011/suite.jsonl', import.meta.url);
const out = 'bench/results/pilot-20261011-ci';
const key = process.env.OPENAI_API_KEY;
let calls = 0, spent = 0, totalInput = 0, totalOutput = 0;
let uncertainBilling = false;

function fail(code) { throw new Error(code); }
function hash(value) { return createHash('sha256').update(value).digest('hex'); }
function pct(vals,q) {
  if (!vals.length) return null;
  const a = [...vals].sort((x,y)=>x-y);
  const p = (a.length - 1) * q;
  return Math.round((a[Math.floor(p)] + (a[Math.ceil(p)] - a[Math.floor(p)]) * (p % 1))*1000)/1000;
}
function rounded(v) { return Math.round(v*100000000)/100000000; }

if (process.env.PAID_BENCHMARK_APPROVED !== 'true') fail('PAID_EXECUTION_NOT_AUTHORIZED');
if (!key || key.length < 10) fail('OPENAI_API_KEY_NOT_CONFIGURED');
const suiteRaw = await readFile(suiteFile, 'utf8');
const suite = suiteRaw.trim().split(/\r?\n/).map(s=>JSON.parse(s));
if (suite.length !== 6 || new Set(suite.map(x=>x.id)).size !== 6) fail('FROZEN_SUITE_MISMATCH');
for(const task of suite) {
  if (!task.prompt || task.scorer?.type !== 'json_equals' || !task.id) fail('INVALID_SUITE_CASE');
}

const base = {
  id: 'openai', model: MODEL, availability: {available:true},
  async complete({prompt,maxOutputTokens}) {
    const max = Math.min(MAX_OUTPUT_PER_CALL, Math.max(1,Math.floor(Number(maxOutputTokens||MAX_OUTPUT_PER_CALL))));
    if (typeof prompt !== 'string' || Buffer.byteLength(prompt,'utf8')>20000) fail('PROMPT_TOO_LARGE');
    // Upper reservation: UTF-8 bytes + fixed overhead conservatively bounds tokenizer usage
    // for these English-only prompts. No retries, no parallel calls, no fallback model.
    const upper = (Buffer.byteLength(prompt,'utf8')+512)*RATE_INPUT + max*RATE_OUTPUT;
    if (spent + upper > CAP) fail('CAP_WOULD_BE_EXCEEDED');
    let response;
    const controller = new AbortController();
    const timer = setTimeout(()=>controller.abort(),45000);
    const start = performance.now();
    try {
      response = await fetch('https://api.openai.com/v1/chat/completions', {
        method:'POST', signal:controller.signal,
        headers:{'Content-Type':'application/json',Authorization:'Bearer '+key},
        body:JSON.stringify({model:MODEL,max_tokens:max,n:1,temperature:0,
          messages:[{role:'user',content:prompt}]}),
      });
    } catch {
      uncertainBilling=true; fail('PROVIDER_TRANSPORT_UNCERTAIN_STOP');
    } finally { clearTimeout(timer); }
    if (!response.ok) {
      uncertainBilling=true;
      fail('PROVIDER_HTTP_'+response.status+'_STOP');
    }
    let body;
    try { body=await response.json(); }
    catch { uncertainBilling=true; fail('PROVIDER_JSON_UNCERTAIN_STOP'); }
    if (body.model !== MODEL) fail('MODEL_MISMATCH_STOP');
    const usage=body.usage || {};
    if (![usage.prompt_tokens,usage.completion_tokens,usage.total_tokens].every(x=>Number.isInteger(x)&&x>=0)) fail('MISSING_USAGE_STOP');
    const text=body.choices?.[0]?.message?.content;
    if (typeof text !== 'string' || !text.trim()) fail('EMPTY_MODEL_RESPONSE_STOP');
    const cost=usage.prompt_tokens*RATE_INPUT+usage.completion_tokens*RATE_OUTPUT;
    calls += 1;spent += cost;totalInput += usage.prompt_tokens;totalOutput += usage.completion_tokens;
    if (spent > CAP) fail('PROVIDER_USAGE_EXCEEDED_CAP_STOP');
    return {text,model:MODEL,attempts:1,usage:{
      input_tokens:usage.prompt_tokens, output_tokens:usage.completion_tokens,
      total_tokens:usage.total_tokens},
      metadata:{provider:'openai',elapsed_ms:Math.round(performance.now()-start)},
      raw:{response_id:body.id,finish_reason:body.choices?.[0]?.finish_reason}};
  },
};
const providers=[
  {id:'direct',run:createCanonicalizedDirectProvider(base)},
  {id:'self_refinement',run:createSelfRefineCanonicalHarness(base)},
  {id:'historical_council_v3',run:createBuilderPreservationHarnessV3(base)},
];
await mkdir(out,{recursive:true});
const outputFile=out+'/trials.jsonl';
const manifest={time_utc:new Date().toISOString(),git_sha:process.env.GITHUB_SHA||null,
  suite_sha256:hash(suiteRaw),task_count:suite.length,model:MODEL,
  historical_council_source:'scripts/bench/v3/harnesses.mjs',
  current_urai_council:false,development_only:true,cap_usd:CAP,
  model_rate_usd_per_million:{input:0.15,output:0.60}};
await writeFile(out+'/manifest.json',JSON.stringify(manifest,null,2));
const rows=[];
let failure=null;
outer: for(let i=0;i<suite.length;i++) {
  const task=suite[i];
  for(let j=0;j<3;j++) {
    const entry=providers[(i+j)%3]; // deterministic interleaving
    const start=performance.now(),startIn=totalInput,startOut=totalOutput,startCalls=calls,startCost=spent;
    try {
      const result=await entry.run.complete({task,prompt:task.prompt,maxOutputTokens:900});
      const scored=scoreTask(task,result.text);
      const row={case_id:task.id,family:task.family,method:entry.id,
        model:MODEL,status:'completed',passed:scored.passed,score:scored.score,
        latency_ms:Math.round((performance.now()-start)*1000)/1000,
        usage:{input_tokens:totalInput-startIn,output_tokens:totalOutput-startOut,
          calls:calls-startCalls,estimated_cost_usd:rounded(spent-startCost)},
        gate_decision:result.metadata?.gate_decision||null,
        output:result.text};
      rows.push(row);
      await appendFile(outputFile,JSON.stringify(row)+'\n');
      console.log('case='+task.id+' mode='+entry.id+' '+(scored.passed?'PASS':'FAIL'));
    }catch(err) {
      failure=String(err.message||'RUNTIME_ERROR');
      const row={case_id:task.id,method:entry.id,status:'error',error_code:failure};
      rows.push(row);await appendFile(outputFile,JSON.stringify(row)+'\n');
      console.log('STOP='+failure);break outer;
    }
  }
}
const summary={time_utc:new Date().toISOString(),status:failure?'STOPPED':'COMPLETE',
  total_trials:rows.length,expected_trials:18,model_calls:calls,
  input_tokens:totalInput,output_tokens:totalOutput,
  estimated_spend_usd:rounded(spent),hard_local_cap_usd:CAP,
  uncertain_billing:uncertainBilling,fail_code:failure,
  methods:Object.fromEntries(providers.map(p=>{
    const d=rows.filter(r=>r.method===p.id&&r.status==='completed');
    return [p.id,{completed:d.length,correct:d.filter(r=>r.passed).length,
      accuracy:d.length?d.filter(r=>r.passed).length/d.length:null,
      mean_latency_ms:d.length?Math.round(d.reduce((a,x)=>a+x.latency_ms,0)/d.length*1000)/1000:null,
      p95_latency_ms:pct(d.map(x=>x.latency_ms),.95),
      model_calls:d.reduce((a,x)=>a+x.usage.calls,0),
      estimated_cost_usd:rounded(d.reduce((a,x)=>a+x.usage.estimated_cost_usd,0))}];
  }))};
await writeFile(out+'/summary.json',JSON.stringify(summary,null,2));
console.log('SUMMARY '+JSON.stringify({status:summary.status,trials:summary.total_trials,
  model_calls:calls,estimated_spend_usd:summary.estimated_spend_usd}));
if(failure)process.exitCode=2;
