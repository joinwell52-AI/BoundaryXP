import fs from 'node:fs';import path from 'node:path';import {OUT,read,write,sha} from './audit-tools.mjs';
import {review as historicalMatcher} from '../7P-ADMIN-SHORT-019-LONG/review.mjs';
const suffix=process.argv[2]?'-'+process.argv[2]:'',first=read(OUT+'/ADMIN-FIRST-OUTPUTS'+suffix+'.json');
if(!fs.existsSync(OUT+'/FIRST-OUTPUT-SEAL'+suffix+'.json'))throw Error('FIRST_RESULTS_MUST_BE_SEALED');
const old50=read('docs/reports/7plus1/7P-ADMIN-SHORT-019-LONG/ADMIN-SHORT-050-ORACLE.json'),old100=read('fixtures/7plus1/admin-natural-blind-100/ORACLE.json');
const expectedRelations={I:['SCOPE_MEMBER','PATIENT','THEME'],O:['RESULT'],A:['PATIENT','THEME','RESULT'],P:['AGENT','RECIPIENT'],R:['LIMIT'],V:['BASIS','CONFORMS_TO'],C:['COMPLETION_OF','STOP_OF'],B:['FORBIDS','RESTRICTS']};
const norm=s=>String(s??'').replace(/\s|[`“”"']/gu,'').toLowerCase();
function locate(c,slot,value,predicate){
 const g=c.candidate_semantic_graph,target=typeof value==='string'?value:predicate;
 const types=slot==='P'?['ENTITY','UNKNOWN_REFERENT']:slot==='V'?['REFERENCE']:slot==='R'?['VALUE','EVENT']:['ENTITY','EVENT','STATE','UNKNOWN_REFERENT'];
 const nodes=g.semantic_nodes.filter(n=>types.includes(n.node_type)&&target&&(norm(n.surface)===norm(target)||n.node_type!=='STATE'&&norm(n.surface).includes(norm(target))));
 if(!nodes.length)return {stage:'SEMANTIC_NODE',reason:'No typed source endpoint matching the reviewed target; broad root text is not an endpoint.'};
 const rels=g.candidate_relations.filter(r=>expectedRelations[slot].includes(r.relation_type)&&nodes.some(n=>[r.head_node_id,r.tail_node_id].includes(n.node_id)));
 if(!rels.length)return {stage:'CANDIDATE_GENERATION',reason:'Typed endpoint exists but required relation hypothesis is missing.',node_ids:nodes.map(n=>n.node_id)};
 if(rels.some(r=>c.gamma_certification.decisions.find(d=>d.candidate_relation_id===r.candidate_relation_id)?.decision!=='CERTIFIED'))return {stage:'GAMMA_CERTIFICATION',reason:'Candidate exists but does not certify under type/scope/evidence constraints; inspect decision reason, not a request to force resolution.',candidate_ids:rels.map(r=>r.candidate_relation_id)};
 return {stage:'ELIGIBILITY',reason:'Relevant candidate relations certified; offline match still missing/different. Eligibility/IR/projection semantics require source review.',candidate_ids:rels.map(r=>r.candidate_relation_id)};
}
const rows=[],findings=[];
for(const p of first.rows){const base=path.dirname(p.trace??p.error),source=fs.readFileSync(path.join(OUT,base,'source.md'),'utf8');let result;
 if(p.execution_status!=='OUTPUT_SAVED'){
  const error=read(OUT+'/'+p.error),stage=/semantic-ownership|prepareCandidates/u.test(error.stack)&&!/BOUNDARY_SCOPE_INCONSISTENT/u.test(error.message)?'EVIDENCE_ATTACHMENT':'CANDIDATE_EXPRESSION';
  result={...p,status:'EXECUTION_ERROR',first_divergence:{stage,reason:error.message,exact_localization:stage==='EVIDENCE_ATTACHMENT'?'Malformed ownership adapter evidence object':'Missing source object scope candidate reaches the downstream consistency guard'},semantic_accuracy:'NOT_SCORED'};
 }else{
  const r=read(OUT+'/'+p.trace),c=r.compiler_v03,local=[];let matcher=null;
  if(p.corpus==='root-standard-050'){
   // Source-only diagnostic obligations. This is deliberately not a full Root Gold.
   const generated=[...source.matchAll(/(?:形成|生成|提交|交付|产出|写入|输出)\s*([A-Za-z0-9_-]+\.(?:md|json|csv|pdf|txt))/gu)];
   for(const m of generated){const file=m[1],facts=c.canonical_7plus1.O.entries.flatMap(e=>e.boundary_fact_ids.map(i=>c.boundary_ir.facts.find(f=>f.boundary_fact_id===i))),nm=new Map(c.semantic_nodes.map(n=>[n.node_id,n]));if(!facts.some(f=>f.state==='RESOLVED'&&f.object_node_ids.some(i=>nm.get(i)?.surface.includes(file))))local.push({kind:'MISSING_EXPLICIT_DELIVERABLE_DIAGNOSTIC',slot:'O',source_span:{start:[...source.slice(0,m.index)].length,end:[...source.slice(0,m.index+m[0].length)].length,text:m[0]},...locate(c,'O',file)});}
   matcher={status:'SOURCE_ONLY_PARTIAL_REVIEW',not_full_semantic_gold:true,checked_generated_files:generated.length};
  }else{
   const oracle=(p.corpus==='018-regression'?old50:old100).cases.find(o=>o.id===p.id);if(oracle?.facts){matcher=historicalMatcher(oracle,r);for(const row of matcher.rows.filter(x=>x.status==='MISSING_OR_DIFFERENT')){const e=row.expected;local.push({kind:'HISTORICAL_COMPARISON_MISSING_OR_DIFFERENT',slot:e.slot,expected:e,...locate(c,e.slot,e.value??e.object??e.identifier??e.subject??e.target,e.predicate)});}}
   else matcher={status:'ORACLE_SHAPE_UNSUPPORTED',reason:'Historical natural Oracle uses expected arrays; source/fact inventory retained separately.'};
  }
  const unresolved=c.unresolved.map(u=>({id:u.unresolved_id,kind:u.kind,reason:u.reason,related_span_ids:u.related_node_ids.flatMap(i=>c.semantic_nodes.find(n=>n.node_id===i)?.source_span_ids??[])}));
  result={...p,status:local.length?'DIAGNOSTIC_MISMATCH':'NOT_FULLY_SCORED',first_divergence:local[0]??null,findings:local,unresolved,comparison:matcher,semantic_accuracy:'NOT_CERTIFIED_BY_COMPONENT_MATCH',review_limits:'Candidate matches and source-only filename checks do not establish whole-case correctness. Extra/wrong resolved facts, scope, conditions, quantities and source ambiguities remain visible in the full inventory; no full accuracy score is claimed.'};
  findings.push(...local.map(f=>({corpus:p.corpus,id:p.id,...f})));
 }
 rows.push(result);write('semantic-review'+suffix+'/'+p.corpus+'/'+p.id+'.json',result);
}
write('ADMIN-REPLAY-MATRIX'+suffix+'.json',{total:first.total,outputs:first.outputs,errors:first.errors,corpus_order:first.corpus_order,review_method:'Offline inventory and partial source/historical comparison. No Parser or Source/Oracle modifications.',whole_case_semantic_accuracy:'NOT_ESTABLISHED',rows});
write('FIRST-DIVERGENCE'+suffix+'.json',{stage_order:['STRUCTURE','NLP_SIGNAL','SPAN_LATTICE','SEMANTIC_NODE','CANDIDATE_GENERATION','CANDIDATE_EXPRESSION','EVIDENCE_ATTACHMENT','GAMMA_CERTIFICATION','ELIGIBILITY','BOUNDARY_IR','PROJECTION','PROOF','COVERAGE'],first_confirmed_diagnostic:findings[0]??null,mismatch_items:findings,execution_errors:rows.filter(r=>r.status==='EXECUTION_ERROR').map(r=>({corpus:r.corpus,id:r.id,...r.first_divergence})),whole_semantic_review_complete:false,reason:'Partial matcher findings are not an exhaustive manually adjudicated review of every boundary. Do not claim all mismatches exhaustively classified.'});
