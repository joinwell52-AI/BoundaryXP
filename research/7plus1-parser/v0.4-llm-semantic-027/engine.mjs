import {sourceDocument} from './source.mjs';
import {createPort} from './semantic-parser-port.mjs';
import {candidateGraph} from './candidate-graph.mjs';
import {attachNlpEvidence} from './nlp-evidence-adapter.mjs';
import {certify} from './gamma-v04.mjs';
import {eligibility} from './eligibility.mjs';
import {boundaryIR} from './boundary-ir.mjs';
import {coverageAudit} from './coverage.mjs';
import {project} from './projection.mjs';
import {proofDAG} from './proof.mjs';
export function compileProposal(source,proposal,audit,{nlp=null,receipts={parser:{provider:'mock-for-tests'},auditor:{provider:'mock-for-tests'}}}={}){
 const graph=candidateGraph(source,proposal,audit),evidence=attachNlpEvidence(graph,nlp),gamma=certify(graph,evidence),eligible=eligibility(graph,gamma),ir=boundaryIR(graph,eligible),coverage=coverageAudit(graph,gamma),canonical=project(graph,ir,coverage),proof=proofDAG(graph,gamma,eligible,ir,receipts);
 return {engine:'boundx-llm-semantic-027/v0.4',source,parser_proposal:proposal,auditor_response:audit,candidate_semantic_graph:graph,nlp_input:nlp,nlp_evidence:evidence,gamma_certification:gamma,eligibility_decisions:eligible,boundary_ir:ir,canonical_7plus1:canonical,proof_dag:proof,coverage,provider_receipts:receipts,source_grounding_audit:{invented_source_quote:graph.source_alignments.filter(r=>r.status==='INVALID_QUOTE').length,invalid_source_span:graph.source_alignments.filter(r=>r.status==='INVALID_ANCHOR').length,ambiguous_alignment:graph.source_alignments.filter(r=>r.status==='AMBIGUOUS_ALIGNMENT').length,silent_ambiguous_alignment:0},status:coverage.gap_count?'PARSER_COVERAGE_FAILURE':ir.facts.some(f=>f.state==='UNRESOLVED')?'PARSED_WITH_UNRESOLVED':'PARSED',business_decision:null,execution_authorization:null};
}
export async function parseBoundary(text,{port=createPort(),receipt_dir,nlp=null}={}){
 if(!receipt_dir)throw Error('AUDIT_RECEIPT_DIRECTORY_REQUIRED');
 const source=sourceDocument(text),a=await port.parse(source,source.typed_spans,source.structure,receipt_dir+'/parser'),b=await port.audit(source,a.proposal,receipt_dir+'/auditor');
 return compileProposal(source,a.proposal,b.audit,{nlp,receipts:{parser:a.receipt,auditor:b.receipt}});
}
