import {out,read,write,cases} from './common.mjs';
const SLOT=['I','O','A','P','R','V','C','B'];
export function compare(result,definition){
 const c=result.compiler_v03,nm=new Map(c.semantic_nodes.map(n=>[n.node_id,n])),ir=c.boundary_ir;
 const fact=e=>e.boundary_fact_ids.map(i=>ir.facts.find(f=>f.boundary_fact_id===i));
 const surface=i=>nm.get(nm.get(i)?.metadata.referent_node_id??i)?.surface;
 const expected={};for(const k of SLOT){const s=definition.expected_yaml.match(new RegExp('^'+k+':\\n([\\s\\S]*?)(?=^[A-Z][A-Za-z]*:|(?![\\s\\S]))','m'));if(!s)throw Error('Missing authority slot '+k);const text=s[1];expected[k]={status:text.match(/status: (\w+)/)[1],items:[...text.matchAll(/^    - (.+)([\s\S]*?)(?=^    - |(?![\s\S]))/gm)].map(m=>({identity:m[1],fields:m[2]}))};}
 const rows=[];
 function stateMeaning(i,seen=new Set()){if(seen.has(i))return {error:'CYCLE'};seen.add(i);const e=ir.condition_expr_nodes.find(e=>e.expr_id===i);if(!e)return {error:'MISSING_EXPR'};if(e.op==='STATE_REF'){const n=nm.get(e.state_node_id);return {kind:n?.metadata.sense,objects:(n?.metadata.object_node_ids??[]).map(surface),reviewer:surface(n?.metadata.reviewer_node_id),required_content:n?.metadata.required_content,quantifier:n?.metadata.quantifier,relative_predicate_token_ids:n?.metadata.relative_predicate_token_ids,state_id:n?.node_id,source:n?.surface};}return {kind:e.op,operands:(e.operand_expr_ids??[e.operand_expr_id]).filter(Boolean).map(i=>stateMeaning(i,new Set(seen)))};}
 for(const k of SLOT){const slot=c.canonical_7plus1[k],ex=expected[k],actual=slot.entries.map(e=>({entry:e,facts:fact(e)}));const matches=[],used=new Set();
  for(const item of ex.items){let ids=[];const i=item.identity;
   for(let j=0;j<actual.length;j++){const {facts,entry}=actual[j];if(entry.state!=='RESOLVED')continue;
    let ok=facts.some(f=>{
     const objects=f.object_node_ids.map(surface),p=nm.get(f.predicate_node_id);
     if(k==='I'||k==='O'){const m=i.match(/^(?:INPUT|GENERATED_OUTPUT|CONDITIONAL_OUTPUT) (.+)$/);return m&&objects.length===1&&objects[0]===m[1]&&(!i.startsWith('CONDITIONAL')||!!f.condition_expr_id);}
     if(k==='A'||k==='B'){const m=i.match(/^(REQUIRED|FORBIDDEN) (\w+) (.+)$/);if(!m)return false;const senses={READ:'read',GENERATE:'generate',CHECK:'review',SUBMIT:'send',MODIFY:'modify'};const agent=item.fields.match(/agent: (.+)/)?.[1],recipient=item.fields.match(/recipient: (.+)/)?.[1],basis=item.fields.match(/basis: (.+)/)?.[1],version=item.fields.match(/version: (.+)/)?.[1],cond=item.fields.match(/condition: (.+)/)?.[1];return p?.metadata.modality===m[1]&&p.metadata.sense===senses[m[2]]&&objects.length===1&&objects[0]===m[3]&&(!agent||f.subject_node_ids.some(n=>surface(n)===agent))&&(!recipient||f.relation_ids.some(id=>{const r=c.relations.find(r=>r.relation_id===id);return r?.relation_type==='RECIPIENT'&&surface(r.tail_node_id)?.endsWith(recipient);}))&&(!basis||f.relation_ids.some(id=>{const r=c.relations.find(r=>r.relation_id===id),n=nm.get(r?.tail_node_id);return r?.relation_type==='BASIS'&&n?.surface===basis&&(!version||n.metadata.basis_version===version);}))&&(!cond||stateMeaning(f.condition_expr_id).kind==='EXISTENCE'&&stateMeaning(f.condition_expr_id).objects.includes('差异'));}
     if(k==='P'){const m=i.match(/^(.+) \[(.+)\]/);return m&&f.participant_node_ids.some(id=>surface(id)?.endsWith(m[1])&&m[2].split(/,\s*/).every(role=>nm.get(id)?.metadata.participant_roles?.includes(role)));}
     if(k==='R'){const q=ir.quantity_expr_nodes.find(q=>q.expr_id===f.quantity_expr_id);return q?.metric==='TIME'&&q.upper_bound?.inclusive&&q.upper_bound.value===Number(item.fields.match(/value: (\d+)/)?.[1])&&/分钟|minute/iu.test(q.unit)&&q.target_node_ids.every(n=>nm.get(n)?.node_type==='DISCOURSE');}
     if(k==='V'){const m=i.match(/^BASIS (.+)/),v=item.fields.match(/version: (.+)/)?.[1];return m&&objects.some(n=>n===m[1])&&(!v||nm.get(f.object_node_ids[0])?.metadata.basis_version===v);}
     if(k==='C'){const meaning=stateMeaning(f.condition_expr_id);if(i.startsWith('OUTPUT_EXISTS('))return meaning.kind==='OUTPUT_EXISTS'&&meaning.objects.length===1&&meaning.objects[0]===i.slice(14,-1);if(i==='REVIEW_CONFIRMED')return meaning.kind===i&&meaning.reviewer?.endsWith(item.fields.match(/reviewer: (.+)/)?.[1])&&meaning.objects.includes(item.fields.match(/object: (.+)/)?.[1])&&meaning.required_content?.predicate==='CONTAINS'&&meaning.required_content.quantifier==='ALL'&&meaning.required_content.object.includes('检查结果');if(i==='AND'){const output=item.fields.match(/OUTPUT_EXISTS\(([^)]+)\)/)?.[1];return meaning.kind==='AND'&&meaning.operands?.length===2&&meaning.operands.some(m=>m.kind==='OUTPUT_EXISTS'&&m.objects.includes(output))&&meaning.operands.some(m=>m.kind==='ALL_RECORDED'&&m.quantifier==='ALL'&&m.objects.includes('差异')&&m.relative_predicate_token_ids?.length);}return false;}
     return false;
    });if(ok)ids.push(j);
   }
   ids.forEach(j=>used.add(j));matches.push({expected:item,matched_entry_ids:ids.map(j=>actual[j].entry.canonical_entry_id),state:ids.length?'MATCH':'MISSING_OR_PARTIAL'});
  }
  const extras=actual.filter((_,i)=>!used.has(i)).map(a=>a.entry),duplicates=actual.length-used.size-extras.length;
  rows.push({slot:k,expected_status:ex.status,actual_status:slot.status,status_match:ex.status===slot.status,matches,extras,duplicates,closed:ex.status===slot.status&&matches.every(m=>m.state==='MATCH')&&!extras.length&&!duplicates});
 }
 return {case_id:definition.id,contract:result.contract_gate_results.status,slots:rows,FULL_CASE_CLOSED:result.contract_gate_results.status==='PASS'&&rows.every(r=>r.closed),IOA_CLOSED:rows.filter(r=>['I','O','A'].includes(r.slot)).every(r=>r.closed),actual_completion:actualCompletion()};
 function actualCompletion(){return c.canonical_7plus1.C.entries.flatMap(e=>fact(e).map(f=>({fact_id:f.boundary_fact_id,condition:stateMeaning(f.condition_expr_id)})));}
}
if(process.argv[2]){const phase=process.argv[2];for(const def of cases().filter(c=>process.argv.slice(3).includes(c.id))){const dir=out+phase+'/'+def.id+'/',r=compare(read(dir+'trace.json'),def);write(dir+'comparison.json',r);console.log(JSON.stringify({case_id:def.id,full:r.FULL_CASE_CLOSED,joint:r.IOA_CLOSED,failed:r.slots.filter(s=>!s.closed).map(s=>s.slot)}));}}
