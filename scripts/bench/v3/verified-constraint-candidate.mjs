import { decideIndependentBuilderPreservation, answersEquivalent, validateOutputContract } from './gate.mjs';
import { canonicalizeOutputContract } from './canonicalizer.mjs';

export const VERIFIED_CONSTRAINT_CANDIDATE_VERSION = 'verified-constraint-candidate-r1588-research-v1';
const ALLOWED_DEFECT_TYPES = new Set(['constraint_violation','output_contract_error','arithmetic_error','contradiction']);
function parseExactJSON(s) {
  if (typeof s !== 'string') return null;
  try { return JSON.parse(s.trim()); } catch { return null; }
}
function keysExactly(x, keys) {
  return x && typeof x === 'object' && !Array.isArray(x) &&
    Object.keys(x).sort().join('|') === keys.slice().sort().join('|');
}
function parseList(list) {
  try {
    const x=JSON.parse(list);
    if (!Array.isArray(x)||x.length<2||x.length>30) return null;
    if (x.some(y=>!y||typeof y!=='object'||Array.isArray(y)||typeof y.id!=='string'||!y.id||Object.keys(y).length>8))return null;
    if (new Set(x.map(y=>y.id)).size!==x.length) return null;
    return x;
  }catch{return null;}
}
function uniqueWinner(items, cmp) {
  const a=items.slice().sort(cmp);
  if(a.length<1 || (a.length>1 && cmp(a[0],a[1])===0)) return null;
  return a[0];
}
function finiteInt(v){return typeof v==='number'&&Number.isSafeInteger(v);}
export function independentlyComputeConstrainedAnswer(taskPrompt) {
  const prompt=String(taskPrompt??'').trim();
  // Full-pattern matching is deliberate: no partial prompt extraction or guessed semantics.
  let m=prompt.match(/^Return only JSON with keys selected and score\. Select exactly one candidate satisfying cost <= (\d+) and risk <= (\d+)\. Among valid candidates select highest score; if scores tie, select lower cost\. Candidates: (\[[\s\S]*\])$/);
  if(m){
    const budget=Number(m[1]),risk=Number(m[2]),items=parseList(m[3]);
    if(!finiteInt(budget)||!finiteInt(risk)||!items) return {supported:false,reason:'invalid_selection_data'};
    if(items.some(x=>!keysExactly(x,['id','cost','risk','score'])||!['cost','risk','score'].every(k=>finiteInt(x[k]))))return{supported:false,reason:'invalid_selection_row'};
    const eligible=items.filter(x=>x.cost<=budget&&x.risk<=risk);
    const w=uniqueWinner(eligible,(a,b)=>b.score-a.score||a.cost-b.cost);
    if(!w)return{supported:false,reason:'no_unique_valid_selection'};
    return{supported:true,family:'constraint-selection',answer:{selected:w.id,score:w.score},evidence:{eligible_ids:eligible.map(x=>x.id),winner_id:w.id}};
  }
  m=prompt.match(/^Return only JSON with keys selected and score\. Keep only rows with active=true, tier=1, and age <= (\d+)\. From the survivors select the highest score\. Rows: (\[[\s\S]*\])$/);
  if(m){
    const ageLimit=Number(m[1]),items=parseList(m[2]);
    if(!finiteInt(ageLimit)||!items)return{supported:false,reason:'invalid_filter_data'};
    if(items.some(x=>!keysExactly(x,['id','active','tier','age','score'])||typeof x.active!=='boolean'||!['tier','age','score'].every(k=>finiteInt(x[k]))))return{supported:false,reason:'invalid_filter_row'};
    const eligible=items.filter(x=>x.active===true&&x.tier===1&&x.age<=ageLimit);
    const w=uniqueWinner(eligible,(a,b)=>b.score-a.score);
    if(!w)return{supported:false,reason:'no_unique_valid_filter'};
    return{supported:true,family:'filter-sort',answer:{selected:w.id,score:w.score},evidence:{eligible_ids:eligible.map(x=>x.id),winner_id:w.id}};
  }
  m=prompt.match(/^Return only JSON with key selected\. Rank candidates by highest priority, then highest quality, then lowest cost\. Select the single winner\. Candidates: (\[[\s\S]*\])$/);
  if(m){
    const items=parseList(m[1]);
    if(!items)return{supported:false,reason:'invalid_ranking_data'};
    if(items.some(x=>!keysExactly(x,['id','priority','quality','cost'])||!['priority','quality','cost'].every(k=>finiteInt(x[k]))))return{supported:false,reason:'invalid_ranking_row'};
    const w=uniqueWinner(items,(a,b)=>b.priority-a.priority||b.quality-a.quality||a.cost-b.cost);
    if(!w)return{supported:false,reason:'no_unique_valid_ranking'};
    return{supported:true,family:'ranking-tiebreak',answer:{selected:w.id},evidence:{winner_id:w.id}};
  }
  return{supported:false,reason:'unsupported_prompt_contract'};
}
function candidateText(v){
  if(typeof v==='string')return v;
  if(v&&typeof v==='object')return JSON.stringify(v);
  return null;
}
function parseVerifiedCritic(text){
  const x=parseExactJSON(text);
  if(!x||typeof x!=='object'||Array.isArray(x))return null;
  if(x.decision!=='replace'||x.defect_verified!==true||!ALLOWED_DEFECT_TYPES.has(x.defect_type))return null;
  if(typeof x.defect_claim!=='string'||x.defect_claim.trim().length<12)return null;
  if(!Array.isArray(x.evidence)||!x.evidence.some(s=>typeof s==='string'&&s.trim().length>=8))return null;
  if(typeof x.confidence!=='number'||!Number.isFinite(x.confidence)||x.confidence<0.95||x.confidence>1)return null;
  const candidate=candidateText(x.candidate_answer);
  if(!candidate)return null;
  return{candidate,defect_type:x.defect_type};
}
export function evaluateVerifiedConstraintCandidate({taskPrompt,builderAnswer,criticAText,criticBText}){
  const independent=independentlyComputeConstrainedAnswer(taskPrompt);
  const builder=canonicalizeOutputContract(taskPrompt,builderAnswer).answer;
  const original=decideIndependentBuilderPreservation({taskPrompt,builderAnswer:builder,criticAText,criticBText,minimumConfidence:0.95});
  if(!independent.supported)return{decision:'preserve_original',selected_answer:original.selected_answer,reason:'unsupported_contract_no_override',source_gate:original,verifier:independent,policy:'research'};
  const expected=JSON.stringify(independent.answer);
  // Protect against a bad original permitted arithmetic/contradiction replacement, too.
  if(original.decision==='replace'&&!answersEquivalent(original.selected_answer,expected)){
    return{decision:'veto_bad_original_replacement',selected_answer:builder,reason:'independent_verifier_rejected_original_candidate',source_gate:original,verifier:independent,policy:'research'};
  }
  if(answersEquivalent(builder,expected)){
    return{decision:'preserve_correct_builder',selected_answer:builder,reason:'independent_verifier_agrees_builder',source_gate:original,verifier:independent,policy:'research'};
  }
  const a=parseVerifiedCritic(criticAText),b=parseVerifiedCritic(criticBText);
  if(!a||!b||a.defect_type!==b.defect_type||!answersEquivalent(a.candidate,b.candidate)||
     !answersEquivalent(a.candidate,expected)||!validateOutputContract(taskPrompt,a.candidate).valid){
    return{decision:'preserve_unverified',selected_answer:builder,reason:'critics_not_unanimous_and_deterministically_correct',source_gate:original,verifier:independent,policy:'research'};
  }
  return{decision:'verified_replacement',selected_answer:expected,reason:'strict_deterministic_winner_and_unanimous_critic_candidate',source_gate:original,verifier:independent,policy:'research'};
}
