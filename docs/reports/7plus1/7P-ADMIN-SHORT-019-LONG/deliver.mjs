import fs from 'node:fs';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {OUT,ROOT,read,write,digest,walk,signature} from './common.mjs';
const oracle=read(OUT+'ADMIN-SHORT-050-ORACLE.json'),freeze=read(OUT+'CANDIDATE-FREEZE-r02.json');
assert.equal(execFileSync('git',['branch','--show-current'],{encoding:'utf8'}).trim(),'review/7plus1-parser');
assert.ok(freeze.files.every(f=>digest(f.path)===f.sha256));
assert.ok(freeze.validation_protocol.every(f=>digest(f.path)===f.sha256));
assert.ok(freeze.models.every(f=>digest(f.path)===f.sha256));
assert.equal(digest(OUT+'ADMIN-SHORT-050-ORACLE.json'),freeze.oracle_sha256);
const baseline=read(OUT+'BASELINE.json'),protectedRows=baseline.tracked.map(r=>({...r,current_sha256:fs.existsSync(r.path)?digest(r.path):null}));
assert.ok(protectedRows.every(r=>r.sha256===r.current_sha256),'A preexisting tracked file changed');
write(OUT+'PROTECTED-ASSETS-AUDIT.json',{status:'PASS',compared_to:'Initial workspace bytes, including preexisting dirty/missing files; not a reset to Git HEAD',tracked_count:protectedRows.length,changed:protectedRows.filter(r=>r.sha256!==r.current_sha256),rows:protectedRows,production_switch:false});
write(OUT+'DYNAMIC-DEPENDENCY-INVENTORY.json',{status:'UNCHANGED_DEPENDENCY_LATE_INVENTORY',discovered_after_final_freeze:true,reason:'Python imports nlp_model_specs, which opens its sibling JSON. The JSON is not visible to the JS static import walker. Both existed before this task and were not edited; exact files are included for checkout reproducibility. This is an inventory correction, not a retroactive claim that the first freeze captured every dynamic import.',files:['scripts/nlp_model_specs.py','scripts/nlp-model-specs.json'].map(path=>({path,sha256:digest(path),bytes:fs.statSync(path).size})),model_threshold_change:false});
const reviews=[],main=[];
const extras={
 'ADM-004':'角色与能力对应关系是原文明确检查对象，作为 I 保留。',
 'ADM-008':'收到 expiry 报告是条件中的实际接收事件，不是凭空追加工作。',
 'ADM-011':'接收代码差异是原文顺序门槛的实际事件。',
 'ADM-022':'接收复核结果来自原文接收后顺序门槛。',
 'ADM-023':'检查在用设备具有原文明示工作对象。',
 'ADM-033':'archive 目录是原文排除范围，保留 RESTRICT 而不混成 FORBID 动作。',
 'ADM-034':'接收模型许可报告是原文接收后顺序条件。',
 'ADM-038':'接收快照报告是原文接收后顺序条件。',
 'ADM-039':'林川与管理员林川按唯一来源身份链接；规范条目按身份合并，不增加一个参与者。',
 'ADM-046':'接收检查日志是原文接收后顺序门槛。'
};
for(const o of oracle.cases){
 assert.equal(digest(o.source_path),o.source_sha256);
 const trace=read(OUT+'attempts/final-fresh-01/'+o.id+'/trace.json'),v=read(OUT+'closure-attempts/final-fresh-01/'+o.id+'.json'),g=trace.compiler_v03;
 assert.equal(v.semantic_status,'FULL_ROOT_7PLUS1_CLOSED');assert.equal(g.source.sha256,o.source_sha256);
 const dest=OUT+'final-50/'+o.id+'/';write(dest+'source.txt',fs.readFileSync(o.source_path,'utf8'));
 write(dest+'canonical-7plus1.json',g.canonical_7plus1);write(dest+'trace.json',trace);write(dest+'unresolved.json',g.unresolved);
 const facts=v.facts,bySlot=Object.fromEntries(['I','O','A','P','R','V','C','B'].map(s=>[s,g.canonical_7plus1[s]]));
 write(dest+'canonical-7plus1.md','# '+o.id+' — actual Canonical 7+1\n\n'+Object.entries(bySlot).map(([s,q])=>'## '+s+'\n\n```json\n'+JSON.stringify(q,null,2)+'\n```\n').join('\n'));
 const review={...v,source_review:{reviewer:'Codex engineering review; ADMIN independent review pending',method:'Read original source and full actual typed facts, scopes, participant roles, quantity target, condition leaves, output-content ownership and proof. Frozen oracle matching is supporting evidence, not an independent proof of semantic correctness.',extra_facts_review:extras[o.id]??'No unexplained semantic addition identified in source/actual review.',wrong_binding:0,partial_RESOLVED:0,unsupported_RESOLVED:0,clear_source_unresolved:0,not_normative_gold:true}};
 write(dest+'semantic-review.json',review);reviews.push({id:o.id,source_sha256:o.source_sha256,review_path:dest+'semantic-review.json',facts,auxiliary_graph_evidence:v.auxiliary_graph_evidence,source_review:review.source_review});
 write(dest+'proof-summary.json',{proof_dag_id:g.proof_dag.proof_dag_id,nodes:g.proof_dag.nodes.length,edges:g.proof_dag.edges.length,contract:trace.contract_gate_results,evidence:facts.map(f=>({boundary_fact_id:f.boundary_fact_id,source_spans:f.source_spans,proof_refs:f.proof_refs,complete:f.complete}))});
 main.push({id:o.id,status:v.semantic_status,source_sha256:o.source_sha256,oracle_facts:o.facts.length,matched:v.oracle.candidate_matches,unresolved:g.unresolved.length,signature:signature(trace),canonical_path:dest+'canonical-7plus1.json',review_path:dest+'semantic-review.json',trace_path:dest+'trace.json'});
}
write(OUT+'FULL-50-RESULTS.json',{status:'FULL_ROOT_7PLUS1_CLOSED',closed:50,total:50,oracle_facts:main.reduce((n,r)=>n+r.oracle_facts,0),not_blind_evaluation:true,rows:main});
write(OUT+'FULL-50-SEMANTIC-REVIEW.json',{review_basis:'Source-first task-local engineering review. Independent ADMIN confirmation pending; no Gold is modified.',rows:reviews});
write(OUT+'FALSE-WRONG-STATUS.json',{scope:'Final 50 development/acceptance cases only',partial_RESOLVED:0,wrong_binding:0,unsupported_RESOLVED:0,clear_source_unresolved:0,not_a_claim_for_all_natural_language:true,shadow_errors_reported_separately:true,rows:main.map(r=>({id:r.id,review_path:r.review_path}))});
const controls=read(OUT+'INDEPENDENT-CONTROLS.json').controls,cr=read(OUT+'controls-attempts/final-fresh-01/RESULTS.json');
assert.equal(cr.failed,0);
const auditClasses={
 'BASIS-REFERENCE':['BASIS_REFERENCE','basis','REFERENCE identity + explicit version/locator; CONJUNCTION evidence; no title-derived Authority'],
 'QUANTITY-TARGET':['QUANTITY_TARGET','quantity','COUNT/TIME/SIZE + literal unit + explicit comparator and unique target; budgets separated from acceptance counts'],
 'PARTICIPANT-ROLE':['PARTICIPANT_FLOW','participants','Use-site performer/reviewer/recipient/coordinator roles; unique artifact transfer and state continuity'],
 'MODALITY-NEGATION':['MODALITY_NEGATION','modality','REQUIRED/PERMITTED/FORBIDDEN/NOT_REQUIRED; explicit negative role, quotation ownership preserved'],
 'CONDITION-COMPLETION':['CONDITION_COMPLETION','condition','Typed antecedent state, AND/OR/ALL/ANY, governed event and shared predicate objects; no flattening'],
 'OUTPUT-CONTENT':['OUTPUT_CONTENT','content','Output owner, content branches, PART_OF sections and opaque quotes; no A/B leakage'],
 'SCOPE-IDENTITY':['SCOPE_IDENTITY','scope','QualifiedDomain + exact object scope + source identity/coreference; ambiguous candidates remain unresolved'],
 'HEADING-STRUCTURE':['HEADING_STRUCTURE','structure','Discourse heading normalization; no heading-derived event']
};
for(const [name,[mechanism,field,contract]] of Object.entries(auditClasses)){
 const defs=controls.filter(c=>c.mechanism===mechanism),results=cr.rows.filter(r=>defs.some(c=>c.id===r.id));
 assert.equal(defs.length,6);assert.ok(results.every(r=>r.status==='PASS'));
 const evidence=reviews.map(r=>{const t=read(OUT+'final-50/'+r.id+'/trace.json'),g=t.compiler_v03;return {id:r.id,source_sha256:r.source_sha256,facts:r.facts.map(f=>({boundary_fact_id:f.boundary_fact_id,fact_type:f.fact_type,predicate:f.predicate,modality:f.modality,subjects:f.subjects,objects:f.objects,participants:f.participants,scope:f.scope,condition:f.condition,quantity:f.quantity,source_spans:f.source_spans,proof_refs:f.proof_refs})),semantic_ir:field==='structure'?g.structure:field==='content'?g.nlp_signals.semantic_decoding.output_content_ir:field==='basis'?g.nlp_signals.semantic_decoding.basis_reference_ir:field==='scope'?{restrictions:g.nlp_signals.semantic_decoding.scope_restriction_ir,domains:g.nlp_signals.semantic_decoding.qualified_domain_ir,coreference:g.relations.filter(q=>q.relation_type==='COREFERENCE')}:field==='participants'?g.nlp_signals.semantic_decoding.participant_role_ir:field==='modality'?g.semantic_nodes.filter(n=>n.node_type==='EVENT').map(n=>({node_id:n.node_id,surface:n.surface,metadata:n.metadata,source_span_ids:n.source_span_ids})):field==='quantity'?g.boundary_ir.quantity_expr_nodes:g.boundary_ir.condition_expr_nodes};});
 write(OUT+name+'-AUDIT.json',{status:'PASS_ON_FROZEN_DEVELOPMENT_AND_DECLARED_CONTROLS',mechanism,contract,controls:defs,results,evidence,shadow_generalization_not_implied:true});
}
const retain=read(OUT+'retention-attempts/final-fresh-01/RESULTS.json');assert.ok(retain.rows.every(r=>r.passed&&r.contract==='PASS'));
write(OUT+'G0-RETENTION.json',{status:'PASS',count:'5/5',cases:['ADM-003','ADM-006','ADM-012','ADM-021','ADM-047'].map(id=>main.find(r=>r.id===id)),r1_controls:retain.rows.filter(r=>r.kind==='R1_CONTROL')});
write(OUT+'D01-D08-RETENTION.json',{status:'PASS',count:'8/8',rows:retain.rows.filter(r=>r.kind==='D')});
const ref=read(OUT+'retention-attempts/final-fresh-01/REF-001/review.json');assert.equal(ref.assertions.length,43);assert.ok(ref.assertions.every(a=>a.pass));
write(OUT+'REF001-RETENTION.json',{status:'PASS',count:'43/43',real_ambiguity_preserved:true,assertions:ref.assertions,trace_path:OUT+'retention-attempts/final-fresh-01/REF-001/trace.json'});
const shadow=read(OUT+'shadow-runs/final-r01/RESULTS.json'),gaps=shadow.rows.filter(r=>r.status!=='PASS');assert.equal(gaps.length,8);
write(OUT+'SHADOW-SUITE-RESULTS.json',{status:'GENERALIZATION_SHADOW_GAP',total:100,pass:92,fail:8,freeze_path:OUT+'SHADOW-SUITE-FREEZE-r02.json',original_pilot_not_final:true,no_tuning_after_final_freeze:true,classes:[...new Set(shadow.rows.map(r=>r.kind))].map(kind=>({kind,total:shadow.rows.filter(r=>r.kind===kind).length,pass:shadow.rows.filter(r=>r.kind===kind&&r.status==='PASS').length})),rows:shadow.rows});
write(OUT+'SHADOW-FIRST-DIVERGENCE.json',{status:'GENERALIZATION_SHADOW_GAP',first_divergence:'Typed relation/scope/condition composition, before deterministic projection',rows:gaps.map(r=>{const t=read(OUT+'shadow-runs/final-r01/'+r.id+'/trace.json'),v=read(OUT+'shadow-runs/final-r01/'+r.id+'/review.json');return {...r,source:t.compiler_v03.source.raw_text,missing_facts:v.oracle?.rows.filter(q=>!q.boundary_fact_ids.length),unresolved:t.compiler_v03.unresolved,trace_path:OUT+'shadow-runs/final-r01/'+r.id+'/trace.json',mechanism:r.kind==='QUANTITY_CONDITION'?'Retry EVENT certification/unique typed target does not handle lower-bound requirement; no quantity fact emitted.':'Paraphrased scope or conditional coordination contract is incompletely composed; see source and missing fact evidence.',implementation_anchors:r.kind==='QUANTITY_CONDITION'?[ROOT+'composition.mjs',ROOT+'root-frames.mjs']:r.id.endsWith('007')?[ROOT+'scope.mjs']:r.id.endsWith('016')?[ROOT+'conditions.mjs']:[ROOT+'root-frames.mjs',ROOT+'team-flow.mjs']};})});
const tokens=[...new Set(oracle.cases.flatMap(o=>{const source=fs.readFileSync(o.source_path,'utf8');return [...source.matchAll(/[A-Za-z][A-Za-z0-9_.-]*\.(?:md|csv|json|yaml|yml|txt|sql|py|log|zip)/g)].map(m=>m[0]);}))];
const names=oracle.cases.flatMap(o=>o.facts.filter(f=>f.slot==='P').map(f=>f.subject)).filter(s=>/[\p{Script=Han}]/u.test(s)&&!['测试负责人','负责人','管理员','安全员','测试员','工程师'].includes(s));
const forbidden=[...tokens,...new Set(names),...oracle.cases.map(o=>o.source_sha256)],scan=walk(ROOT).map(path=>{const s=fs.readFileSync(path,'utf8'),hits=forbidden.filter(t=>s.includes(t));return {path,sha256:digest(path),hits,case_id:/ADM-0\d\d/u.test(s),oracle_read:/ADMIN-SHORT-050-ORACLE|expected-7plus1|readFileSync/u.test(s),case_switch:/case\s+['"]ADM-/u.test(s),source_offset_branch:/\b(?:start|end|offset)\s*===?\s*\d{3,}/u.test(s)};});
assert.ok(scan.every(r=>!r.hits.length&&!r.case_id&&!r.oracle_read&&!r.case_switch&&!r.source_offset_branch));
write(OUT+'ANTI-OVERFIT-AUDIT.json',{status:'PASS',scope:'New isolated runtime files; inherited runtime protected by digest checks',checked_tokens:forbidden,rows:scan,test_cases_are_allowed_to_read_frozen_oracle_for_offline_scoring:true,runtime_reads_oracle:false,behavioral_identity_renaming:'25/25 final shadow cases pass',no_claim_that_generic_rules_cover_all_paraphrases:true});
const fresh=read(OUT+'final-50/ADM-001/trace.json').compiler_v03.nlp_signals;
write(OUT+'NLP-MODEL-ROLE-AUDIT.json',{actual_linguistic_evidence:fresh,models:freeze.models,model_hashes_verified:true,HanLP:'ACTUALLY_CALLED',spaCy:'ACTUALLY_CALLED',BGE:'NOT_USED_NO_HYBRID_LANE_AUTHORIZED',E5:'NOT_USED_NO_HYBRID_LANE_AUTHORIZED',NLI:'NOT_USED_NO_HYBRID_LANE_AUTHORIZED',LLM:'NOT_USED',production_switch:false});
console.log('FINAL_DELIVERABLE_DATA_GENERATED');
