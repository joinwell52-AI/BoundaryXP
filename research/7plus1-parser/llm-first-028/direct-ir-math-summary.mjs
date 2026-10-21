// Summaries computed from typed IR only; no source text, label or note parsing.
import {compileCore} from '../../../src/bxp/ir-kernel/index.mjs';import {projectCore} from '../../../src/bxp/ir-kernel/projection.mjs';
import {typedInputDomains} from './direct-ir-sets.mjs';
import {completionSummary} from './direct-ir-completion-summary.mjs';
export function directMathSummary(ir,acceptance){
 if(ir.contract_version==='candidate-ir/2.0')return projectCore(compileCore(ir)).summary;
 const nodes=new Map(['entities','events','states','expressions','requirements'].flatMap(k=>ir[k].map(x=>[x.id,x]))),status=new Map(acceptance.rows.map(x=>[x.id,x.status]));
 const members=r=>r?.kind==='ENTITY'?(nodes.get(r.id)?.kind==='GROUP'?nodes.get(r.id).members.flatMap(members):[r.id]):[];
 const input_boundary=typedInputDomains(ir,acceptance),inputs=input_boundary.allowed;
 const outputs=[...new Set(ir.events.filter(e=>e.kind==='ACTION'&&e.use==='CURRENT_TASK'&&e.layer==='MAIN').flatMap(e=>e.roles.filter(r=>['RESULT','DELIVERABLE'].includes(r.role)).flatMap(r=>members(r.value))))].filter(id=>['FILE','DOCUMENT'].includes(nodes.get(id)?.kind));
 const describe=ids=>ids===null?null:ids.map(id=>({id,label:nodes.get(id)?.label??id}));
 const completions=completionSummary(ir,acceptance);
 const explicit_order_edges=ir.expressions.filter(e=>e.operator==='BEFORE').map(e=>({expression_id:e.id,from:e.arguments[0],to:e.arguments[1],source_refs:e.source_refs}));
 const necessary_gates=ir.expressions.filter(e=>e.operator==='TRUE_AT_START').map(e=>({expression_id:e.id,state:e.arguments[0],event:e.arguments[1],relation:'STATE_TRUE_AT_EVENT_START',source_refs:e.source_refs}));
 const point=r=>{const e=nodes.get(r.id);return ['EVENT_START','EVENT_END','STATE_ESTABLISHED'].includes(e?.operator)?e.operator+':'+JSON.stringify(e.arguments[0]):JSON.stringify(r);};
 const cycles=[];const adjacent=new Map();for(const e of explicit_order_edges){const a=point(e.from),b=point(e.to);adjacent.set(a,[...(adjacent.get(a)??[]),{b,id:e.expression_id}]);}
 const visit=(at,path,ids)=>{if(path.includes(at)){cycles.push(ids.slice(path.indexOf(at)));return;}if(path.length>explicit_order_edges.length)return;for(const e of adjacent.get(at)??[])visit(e.b,[...path,at],[...ids,e.id]);};for(const at of adjacent.keys())visit(at,[],[]);
 const patterns=ir.requirements.filter(r=>r.modality==='FORBIDDEN').map(r=>({requirement_id:r.id,subject:r.subject,applicability:r.applicability,event:nodes.get(r.subject?.id),source_refs:r.source_refs}));
 return {input_boundary,input_files:describe(inputs),output_artifacts:describe(outputs),input_count:inputs?.length??null,output_count:outputs.length,intersection:describe(inputs?.filter(id=>outputs.includes(id))??null),union:describe(inputs===null?null:[...new Set([...inputs,...outputs])]),union_count:inputs===null?null:new Set([...inputs,...outputs]).size,completions,dependency:{explicit_order_edges,necessary_gates,cycles,graph_scope:'DECLARED_BEFORE_EXPRESSIONS_ONLY'},forbidden_patterns:patterns,status:'DERIVED_FROM_CANDIDATE_IR',not_semantic_acceptance_proof:true};
}
