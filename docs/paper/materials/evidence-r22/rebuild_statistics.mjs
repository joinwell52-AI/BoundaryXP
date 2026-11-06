// Read saved annotations, proposals and typed checks. No model, network, or Core evaluation.
import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {fileURLToPath} from 'node:url';
// Research-only audit: no production reducer is imported or reimplemented.
const E=path.dirname(fileURLToPath(import.meta.url)),P=path.dirname(E),read=f=>JSON.parse(fs.readFileSync(f,'utf8'));
const sha=f=>createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const norm=v=>({VERIFIED:'未越界',NOT_VIOLATED:'未越界',VIOLATED:'越界',UNRESOLVED:'信息不足','不越界':'未越界','信息不全':'信息不足'}[v]??v);
const manifest=read(path.join(E,'SOURCE-MANIFEST.json')),byOrigin=new Map(manifest.entries.map(r=>[r.repository_path,r]));
for(const r of manifest.entries)assert.equal(sha(path.join(E,r.package_path)),r.sha256,r.repository_path);
const cache=new Map();
const original=rel=>{const r=byOrigin.get(rel);assert(r,rel);if(!cache.has(rel))cache.set(rel,read(path.join(E,r.package_path)));return cache.get(rel);};
const stats=read(path.join(P,'evidence-r18/STATISTICS-VERIFIED.json')),annotations=new Map();
const retainedRecords=read(path.join(E,'current-annotations.json')).records,retainedById=new Map(retainedRecords.map(r=>[r.case_id,r]));
for(const s of manifest.seven_actual_input_files){
 const record=byOrigin.get(s.file);assert.equal(record.sha256,s.sha256);
 const x=original(s.file),rows=x.rows??x.cases??x.latest_30?.rows;assert(Array.isArray(rows));
 for(const [index,r]of rows.entries())annotations.set(r.case_id??r.id,{label:norm(r.annotation??r.reference??r.verdict),source_path:record.package_path,row_index:index});
}
assert.equal(annotations.size,625);
const currentBasis=new Map();
function basis(rel,rows,meta){const ref=byOrigin.get(rel);for(const [index,r]of rows.entries())currentBasis.set(r.case_id??r.id,{path:ref.package_path,index,row:r,metadata:meta});}
const ridx=original('research/evaluation/R389-REFERENCE.json');
for(const [revision,v]of Object.entries(ridx.revisions)){
 const rel='research/evaluation/'+v.labels,x=original(rel);
 if(revision===ridx.current_revision)basis(rel,x.cases,x.provenance);
}
for(const r of original('research/evaluation/ALL469-label-llm-20261102-r02/COMPARISON.json').summary.reference_files.slice(1)){
 const x=original(r.reference_file);basis(r.reference_file,x.cases,x.provenance??{annotator:x.annotator,reviewer:x.revision_reviewer,basis:x.basis});
}
for(const rel of [
'research/evaluation/REAL10-preannotated-20261103-r01/ANNOTATIONS-CURRENT.json',
'research/evaluation/ALG40-parent-child-20261103-r01/ANNOTATIONS.json',
'.boundx/test-runs/english20/EN20-20261104-r01/ANNOTATIONS.json',
'.boundx/test-runs/english-graph20/ENG20-20261104-r01/ANNOTATIONS.json',
'.boundx/test-runs/manual30/MT30-Manual-20261105-r01/ANNOTATIONS.json',
'.boundx/test-runs/car-rental36/CAR36-Manual-20261105-r01/ANNOTATIONS.json']){
 const x=original(rel);basis(rel,x.cases,{at:x.at??null,authority:x.authority??null,origin:x.origin??null,revision:x.revision??null});
}
const counter=()=>({}),inc=(o,k,n=1)=>{o[k]=(o[k]??0)+n;},distribution=counter(),batches=new Map(),rows=[];
let nodes=0,queries=0;
for(const r of stats.rows){
 const pf=path.join(P,'evidence-r18/projects',r.id+'.json'),rf=path.join(P,'evidence-r18/results',r.id+'.json');
 assert.equal(sha(pf),r.project_sha256);assert.equal(sha(rf),r.result_sha256);
 const project=read(pf),saved=read(rf),a=annotations.get(r.id),b=currentBasis.get(r.id);assert(b,r.id+' annotation basis');
 const basisLabel=norm(b.row.label??b.row.verdict??b.row.annotation);assert.equal(basisLabel,a.label,r.id+' direct basis vs imported annotation');
 const llm=norm(saved.proposal.candidate_analysis.combined_verdict);
 const retained=retainedById.get(r.id);assert.equal(retained.result_sha256,sha(rf));
 const calc={status:({'未越界':'VERIFIED','越界':'VIOLATED','信息不足':'UNRESOLVED'})[retained.calculator],decisive_check_ids:retained.decisive_check_ids};assert(calc.status);
 for(const id of calc.decisive_check_ids)assert(saved.verification.checks.some(c=>c.id===id),'Saved decisive check missing: '+id);
 assert.equal(a.label,r.annotation);assert.equal(llm,r.llm);assert.equal(norm(calc.status),r.calculator);
 assert.equal(a.label,llm);assert.equal(llm,norm(calc.status));
 nodes+=project.nodes.length;queries+=saved.verification.checks.length;inc(distribution,llm);
 const batch=batches.get(r.batch)??{batch:r.batch,total:0,nodes:0,annotation_llm_equal:0,llm_calculator_equal:0,distribution:counter()};
 batch.total++;batch.nodes+=project.nodes.length;batch.annotation_llm_equal+=a.label===llm;batch.llm_calculator_equal+=llm===norm(calc.status);inc(batch.distribution,llm);batches.set(r.batch,batch);
 const revisions=[];
 if(r.id.startsWith('R389-'))for(const [revision,v]of Object.entries(ridx.revisions)){
  const q=original('research/evaluation/'+v.labels),c=q.cases.find(c=>c.case_id===r.id);
  revisions.push({revision,label:norm(c.label),path:byOrigin.get('research/evaluation/'+v.labels).package_path,revision_note:q.provenance?.revision_note??null,old_model_outputs_used:q.provenance?.old_model_outputs_used??null,independent_blind_review:q.provenance?.independent_blind_review??false});
 }
 if(r.id.startsWith('REAL10-')){
  const q=original('research/evaluation/REAL10-preannotated-20261103-r01/ANNOTATIONS.json'),c=q.cases.find(c=>c.id===r.id);
  revisions.push({revision:'initial',label:norm(c.verdict),path:byOrigin.get('research/evaluation/REAL10-preannotated-20261103-r01/ANNOTATIONS.json').package_path});
  revisions.push({revision:'r02',label:a.label,authority:b.metadata.authority,at:b.metadata.at,path:b.path});
 }
 const rationaleSources=[];
 if(r.id.startsWith('REAL10-')){
  const note=b.row.notes,base='research/evaluation/REAL10-preannotated-20261103-r01/';
  const file=note.split('#')[0],ref=byOrigin.get(base+file);assert(ref,note);
  const content=fs.readFileSync(path.join(E,ref.package_path),'utf8');assert(content.includes(r.id));
  const originalNotes=original(base+'ANNOTATIONS.json');
  if(file==='ANNOTATIONS.md')assert.equal(ref.sha256,originalNotes.notes_sha256);
  rationaleSources.push({path:ref.package_path,sha256:ref.sha256,source_reference:note,case_id:r.id});
 }
 if(r.id.startsWith('MP40-'))for(const dir of ['r03-20261029-mp40-009','r04-20261029-mp40-022','r05-20261029-native-label-enum']){
  const rel='research/evaluation/minimal-pairs-40-20261027/annotation-revisions/'+dir+'/author-labels.json';
  const q=original(rel),c=q.cases.find(c=>c.case_id===r.id);assert(c);
  revisions.push({revision:q.annotation_revision.id,raw_label:c.label,label:norm(c.label),path:byOrigin.get(rel).package_path,revision_note:q.annotation_revision.note,serialization_correction_only:q.annotation_revision.serialization_correction_only_in_this_revision??false,independent_blind_review:q.annotation_revision.independent_blind_annotation??false});
 }
 if(r.id==='JH-MT-017'){
  const rel='.boundx/test-runs/manual30/MT30-AnnotationCorrection-017-OPS-20261105-r02/CORRECTION.json',q=original(rel);
  revisions.push({revision:q.revision,scope:'LOCAL_ROLE_ONLY',node_id:q.node_id,role:q.role,previous_local_label:norm(q.old_local_result),local_label:norm(q.new_local_result),label:norm(q.overall_result),overall_result_changed:q.overall_result_changed,path:byOrigin.get(rel).package_path,revision_note:q.new_reason});
 }
 const job=stats.latest_jobs.find(j=>j.id===r.id);
 rows.push({case_id:r.id,project_sha256:r.project_sha256,result_sha256:r.result_sha256,result_key:r.result_key,job_id:job?.job_id??null,current_annotation:a.label,annotation_import:a,annotation_basis:{path:b.path,row_index:b.index,source_digest:b.row.source_sha256??b.row.source_text_sha256??null,reason:b.row.rationale??b.row.reason??b.row.notes??null,provenance:b.metadata,revision_history:revisions,rationale_sources:rationaleSources,unrecorded_history:'No undocumented initial label, timestamp, reviewer identity, or blindness is inferred.'},llm,calculator:norm(calc.status),decisive_check_ids:calc.decisive_check_ids});
}
assert.equal(nodes,3219);assert.equal(queries,3469);assert.deepEqual({...distribution},{'未越界':246,'越界':259,'信息不足':120});
// Rebuild the CAR36 role comparison from the original supplied node annotations and saved node conclusions.
const roleRef=byOrigin.get('.boundx/test-runs/car-rental36/CAR36-Retest-006-007-009-011-20261105-r02/original/manual_annotations.jsonl');
const manual=fs.readFileSync(path.join(E,roleRef.package_path),'utf8').trim().split(/\r?\n/).map(JSON.parse),roles=[];
const prior=original('.boundx/test-runs/car-rental36/CAR36-Retest-006-007-009-011-20261105-r02/LATEST-ROLE-COMPARISON.json').rows;
for(const c of manual){const saved=read(path.join(P,'evidence-r18/results',c.id+'.json'));for(const n of c.task_tree.filter(n=>n.parent_id!==null)){
 const ref=n.manual_boundary_annotation;assert(ref,n.id);const old=prior.find(r=>r.case_id===c.id&&r.node_id===n.id);assert(old);
 const actual=saved.proposal.candidate_analysis.children;
 // Native saved layouts are resolved explicitly; never use a report's prose as the reference.
 const list=Array.isArray(actual)?actual:Object.values(actual??{});
 const hit=list.find(r=>r.node_id===c.id+'-'+n.id||r.node_id===n.id||r.id===n.id);
 assert(hit,c.id+' '+n.id+' saved node verdict');const llm=norm(hit.verdict??hit.result??hit.status??hit.boundary_verdict);
 assert.equal(llm,norm(old.llm));assert.equal(norm(ref.label),norm(old.annotation));
 roles.push({case_id:c.id,node_id:n.id,reference:norm(ref.label),reference_reason:ref.reason,llm,equal:norm(ref.label)===llm,reference_path:roleRef.package_path});
}}
assert.equal(roles.length,180);assert.equal(roles.filter(r=>r.equal).length,177);
const result={passed:true,groups:rows.length,nodes,queries,annotation_llm_equal:rows.filter(r=>r.current_annotation===r.llm).length,llm_calculator_equal:rows.filter(r=>r.llm===r.calculator).length,distribution,batches:[...batches.values()],car36_role_total:roles.length,car36_role_equal:roles.filter(r=>r.equal).length,new_model_requests:0,new_core_evaluations:0,scope:'Reconstruct annotation and LLM columns from retained sources; audit retained calculator aggregate records and decisive-check bindings. Does not execute or reproduce the product reducer or all mathematical operations.'};
if(process.argv.includes('--record')){
 for(const [name,x]of [['current-annotations.json',{records:rows}],['car36-roles.json',{records:roles}],['rebuilt-statistics.json',result]]){assert(!fs.existsSync(path.join(E,name)),name);fs.writeFileSync(path.join(E,name),JSON.stringify(x,null,2)+'\n');}
}else{
 assert.deepEqual(read(path.join(E,'current-annotations.json')),{records:rows});assert.deepEqual(read(path.join(E,'car36-roles.json')),{records:roles});assert.deepEqual({...read(path.join(E,'rebuilt-statistics.json')),scope:result.scope},result);
}
console.log(JSON.stringify(result));
