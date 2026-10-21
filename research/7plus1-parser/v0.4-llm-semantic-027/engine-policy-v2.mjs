import {sourceDocument} from './source.mjs';
import {createPort} from './semantic-parser-port.mjs';
import {compileProposal as baseCompile} from './engine.mjs';
import {eligibility} from './eligibility-policy-v2.mjs';
import {boundaryIR} from './boundary-ir-policy-v2.mjs';
import {project} from './projection.mjs';
import {proofDAG} from './proof-policy-v2.mjs';
import {certify} from './gamma-policy-v2.mjs';
import {coverageAudit} from './coverage.mjs';
export function compileProposal(source,proposal,audit,options={}){
 const t=baseCompile(source,proposal,audit,options),g=t.candidate_semantic_graph,gamma=certify(g,t.nlp_evidence);
 const e=eligibility(g,gamma),ir=boundaryIR(g,e,gamma),coverage=coverageAudit(g,gamma),canonical=project({...g,expressions:ir.expressions},ir,coverage),proof=proofDAG(g,gamma,e,ir,t.provider_receipts);
 for(const s of Object.values(canonical.slots))for(const entry of s.entries){const f=ir.facts.find(f=>entry.boundary_fact_ids.includes(f.boundary_fact_id));entry.content_constraints=(f.content_constraint_refs??[]).map(i=>({id:i,node:g.nodes.find(n=>n.id===i)}));}
 return {...t,engine:'boundx-llm-semantic-027/v0.4-policy-v2',gamma_certification:gamma,eligibility_decisions:e,boundary_ir:ir,canonical_7plus1:canonical,proof_dag:proof,coverage,status:coverage.gap_count?'PARSER_COVERAGE_FAILURE':ir.facts.some(f=>f.state==='UNRESOLVED')?'PARSED_WITH_UNRESOLVED':'PARSED'};
}
export async function parseBoundary(text,{port=createPort(),receipt_dir,nlp=null}={}){
 if(!receipt_dir)throw Error('AUDIT_RECEIPT_DIRECTORY_REQUIRED');
 const source=sourceDocument(text),a=await port.parse(source,source.typed_spans,source.structure,receipt_dir+'/parser'),b=await port.audit(source,a.proposal,receipt_dir+'/auditor');
 return compileProposal(source,a.proposal,b.audit,{nlp,receipts:{parser:a.receipt,auditor:b.receipt}});
}
