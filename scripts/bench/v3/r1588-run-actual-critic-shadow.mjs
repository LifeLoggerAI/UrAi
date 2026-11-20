import fs from 'node:fs';
import {evaluateVerifiedConstraintCandidate} from './scripts/bench/v3/verified-constraint-candidate.mjs';
const source=JSON.parse(fs.readFileSync('/tmp/urai-r1588/bench/holdout/r1579-historical-24.json','utf8'));
const critic=JSON.parse(fs.readFileSync('/tmp/urai-r1588/bench/holdout/r1579-critic-outputs.json','utf8'));
const stable=x=>Array.isArray(x)?x.map(stable):x&&typeof x==='object'?Object.fromEntries(Object.keys(x).sort().map(k=>[k,stable(x[k])])):x;
const equal=(s,e)=>{try{return JSON.stringify(stable(JSON.parse(s)))===JSON.stringify(stable(e))}catch{return false}};
const rows=[];
for(const c of source.results){
 const s=critic.rows.filter(r=>r.id===c.id);
 const a=s.find(x=>x.stage===2),b=s.find(x=>x.stage===3);
 if(!a||!b||!a.output||!b.output){rows.push({id:c.id,stage_pairs_available:false});continue;}
 const result=evaluateVerifiedConstraintCandidate({taskPrompt:c.prompt,builderAnswer:c.builder,criticAText:a.output,criticBText:b.output});
 rows.push({id:c.id,stage_pairs_available:true,expected:c.expected,old_correct:c.original_correct,candidate_correct:equal(result.selected_answer,c.expected),decision:result.decision,reason:result.reason,original_gate:result.source_gate.decision,source_gate_reason:result.source_gate.reason,verifier_family:result.verifier.family??null,builder_correct:equal(c.builder,c.expected),original_final:c.original_final,candidate_final:result.selected_answer});
}
const matched=rows.filter(r=>r.stage_pairs_available);
const result={schema:'one-urai.r1588.shadow-actual-critic-replay.v1',cases:rows.length,paired:matched.length,original_correct:matched.filter(x=>x.old_correct).length,candidate_correct:matched.filter(x=>x.candidate_correct).length,useful:matched.filter(x=>!x.old_correct&&x.candidate_correct).length,harmful:matched.filter(x=>x.old_correct&&!x.candidate_correct).length,replacements:matched.filter(x=>x.decision==='verified_replacement').length,vetoes:matched.filter(x=>x.decision==='veto_bad_original_replacement').length,rows,production:'HOLD_NO_GO'};
fs.writeFileSync('/tmp/urai-r1588/receipts/r1588-actual-critic-shadow-replay.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({cases:result.cases,paired:result.paired,old_correct:result.original_correct,candidate_correct:result.candidate_correct,useful:result.useful,harmful:result.harmful,replacements:result.replacements,vetoes:result.vetoes,changes:matched.filter(x=>x.old_correct!==x.candidate_correct||x.decision==='veto_bad_original_replacement').map(x=>({id:x.id,was:x.old_correct,now:x.candidate_correct,decision:x.decision}))}));
