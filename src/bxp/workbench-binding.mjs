// Typed identity validation only. No source-language matching or model calls.
import {memberIdentityIssues,mixedEventReferenceIssues} from './workbench-member-binding.mjs';
import {knownUnitDimension} from './workbench-lowering.mjs';
import {ancestors} from './workbench-model.mjs';
import {findPrerequisitePath} from './dependency-solver.mjs';
import {symbolIdentityIssues,booleanSymbols} from './workbench-symbol-binding.mjs';
import {calculateComparison} from './workbench-calculators.mjs';
import {calculationPlanRefersTo} from './workbench-math-plan.mjs';

const legacyGap='子约束尚未绑定对应父边界；保留条款，不能以未匹配视为未越界';
const family=t=>['condition','permission','obligation'].includes(t)?'event':t;
export const bindingCompatible=(a,b)=>{
 if(!a||!b)return false;
 // A missing property can be bound to that same parent's property without
 // supplying its missing value or relation. Identity is not a calculation.
 if(a.type==='unknown')return !['conversion','selection','permission'].includes(b.type);
 if(family(a.type)!==family(b.type))return false;
 if(a.type==='quantity'&&b.type==='quantity'){
  const x=knownUnitDimension(a.unit),y=knownUnitDimension(b.unit);
  if(x&&y&&x!==y)return false;
 }
 return true;
};
// A detail of a future required duty does not replace the whole duty or
// declare its completion. Keep the distinct event keys and the parent guard.
export const supplementsParentDuty=(child,parent)=>child?.key!==parent?.key
 && parent?.type==='obligation'&&parent.mode==='REQUIRED'&&(!parent.timing||parent.timing==='EVENTUALLY')
 && (child?.type==='condition'||child?.type==='obligation'&&child.mode==='REQUIRED');
export const isRestriction=c=>!['conversion','selection','unknown','permission'].includes(c.type)
 && !(c.type==='quantity'&&c.lower===null&&c.upper===null)
 && !(c.type==='domain'&&c.mode==='SELECT')
 && !(c.type==='obligation'&&c.mode==='NOT_ASSIGNED');

export function bindingIssues(plan,boundaries,node,c){
 const memberIssues=memberIdentityIssues(plan,boundaries,node,c);if(memberIssues.length)return memberIssues;
 if(!node.parent_id||c.type==='conversion'||c.type==='domain'&&c.mode==='FORBID')return [];
 // These modalities do not cancel another obligation. Only an immediate
 // triggered duty additionally participates in parent prerequisite checking.
 if(c.type==='obligation'&&(c.mode==='NOT_ASSIGNED'||c.mode==='REQUIRED'&&!['ON_TRIGGER','WHILE_GUARD'].includes(c.timing)))return [];
 const chain=ancestors(plan,node.id),parents=chain.flatMap(p=>boundaries[p.id]?.boundary?.formal?.constraints??[]);
 const symbolIssues=[...symbolIdentityIssues(plan,boundaries,node,c),...mixedEventReferenceIssues(plan,boundaries,node,c)];
 // A named proposition consumed by an executable Boolean model is not an
 // object selection needing alignment to every domain on the same UI axis.
 // Require the exact key and clause, not similar words or clause overlap alone.
 if(c.type==='domain'&&c.mode==='SELECT'&&c.values?.length&&plan.nodes.some(n=>
  (boundaries[n.id]?.boundary?.formal?.compiled_math_models?.models??[]).some(m=>m.expression?.kind==='boolean_implication'
   &&m.source_refs?.some(r=>r.node_id===node.id&&c.clause_ids.includes(r.clause_id))
   &&m.source_refs.every(r=>boundaries[r.node_id]?.boundary?.clauses?.some(cl=>cl.id===r.clause_id&&cl.source_valid))
   &&booleanSymbols(m.expression.child).includes(c.key)
   &&['VERIFIED','VIOLATED'].includes(calculateComparison(m.expression).status))))return symbolIssues;
 const supplemental=(boundaries[node.id]?.boundary?.formal?.relations??[]).some(e=>e.type==='SPECIALIZES'&&e.from===c.key
  && e.clause_ids?.length&&e.clause_ids.every(id=>boundaries[node.id].boundary.clauses.some(cl=>cl.id===id&&cl.source_valid))
  && parents.some(p=>p.key===e.to&&supplementsParentDuty(c,p)));
 if(supplemental)return symbolIssues;
 // Explicit source-bound expression references already identify operands.
 // Parent event inventories need not repeat every descendant stage.
 if(calculationPlanRefersTo(plan,boundaries,node,c))return symbolIssues;
 // Quantity-to-total identity does not identify the component event itself.
 // Ask only for missing identities in an explicit parent event decomposition.
 if(c.type==='quantity'&&knownUnitDimension(c.unit)==='TIME'){
  const timeParents=parents.filter(p=>p.type==='quantity'&&isRestriction(p)&&knownUnitDimension(p.unit)==='TIME'&&!c.independent_of?.includes(p.key));
  const candidates=timeParents.filter(p=>parents.some(g=>g.type==='order'&&g.events?.some(e=>e.id===p.instance)&&g.events.length>1));
  const events=parents.filter(g=>g.type==='order').flatMap(g=>g.events??[]);
  if(candidates.length&&!events.some(e=>e.id===c.instance)&&!timeParents.some(p=>p.instance===c.instance))return [{code:'UNBOUND_EVENT_INSTANCE',constraint_id:c.id,clause_ids:c.clause_ids,axes:c.axes,reason:'数量所属事件尚未绑定父时间图中的阶段身份',parent_keys:[...new Set(candidates.map(p=>p.key))]}];
 }

 // A verified typed key is identity; a display-axis disagreement must not
 // erase that identity and force a second match to an unrelated property.
 if(parents.some(p=>isRestriction(p)&&bindingCompatible(c,p)&&p.key===c.key))return symbolIssues;
 // Axes classify display/evidence. A differing axis label must neither prove
 // different identities nor hide a possible parent prerequisite.
 let candidates=parents.filter(p=>(isRestriction(p)||p.type==='quantity'&&parents.some(g=>g.components?.includes(p.key))||c.type==='selection'&&p.type==='selection'||c.type==='unknown'&&p.type==='unknown')&&bindingCompatible(c,p));
 if(c.type==='unknown')candidates=candidates.filter(p=>p.key===c.key||p.axes?.some(a=>c.axes?.includes(a)));
 if(!candidates.length)return symbolIssues;
 if(candidates.some(p=>p.key===c.key))return symbolIssues;
 if(candidates.every(p=>c.independent_of?.includes(p.key)))return [];
 const edges=[node,...chain].flatMap(n=>{
  const b=boundaries[n.id]?.boundary,f=b?.formal;
  return (f?.relations??[]).filter(e=>['SAME_AS','PART_OF','SPECIALIZES'].includes(e.type)&&e.clause_ids?.every(id=>b.clauses.some(cl=>cl.id===id&&cl.source_valid)&&f.coverage.some(cv=>cv.clause_id===id&&cv.kind==='STRUCTURED')))
   .filter(e=>e.type==='SAME_AS'||e.type==='PART_OF'&&(c.type==='quantity'||c.type==='unknown'&&(boundaries[node.id]?.boundary?.formal?.constraints??[]).some(q=>q.type==='quantity'&&q.key===c.key))||e.type==='SPECIALIZES'&&['domain','order'].includes(c.type))
   .flatMap((e,i)=>[{id:n.id+':'+i,kind:'prerequisite',from:e.from,to:e.to},...(e.type==='SAME_AS'?[{id:n.id+':'+i+':reverse',kind:'prerequisite',from:e.to,to:e.from}]:[])]);
 });
 if(candidates.some(p=>findPrerequisitePath(edges,c.key,p.key).reachable))return [];
 // Unknown event identities remain candidates across axes (e.g. a stop
 // condition encoded as a triggered action). Domain properties use the
 // existing dimensional projection only after explicit identity checks.
 if(c.type==='domain')candidates=candidates.filter(p=>p.axes?.some(a=>c.axes?.includes(a)));
 if(!candidates.length||candidates.every(p=>c.independent_of?.includes(p.key)))return symbolIssues;
 return [{code:'UNBOUND_TYPED_IDENTITY',constraint_id:c.id,clause_ids:c.clause_ids,axes:c.axes,
  reason:'子约束尚未绑定对应父边界：'+(c.label??c.key),parent_keys:[...new Set(candidates.map(p=>p.key))]}];
}

export function normalizeBindingCoverage(plan,boundaries){
 const out=structuredClone(boundaries);
 // Closed composition declarations induce source-bound graph edges.
 for(const row of Object.values(out)){const f=row?.boundary?.formal;if(!f)continue;f.relations??=[];
  for(const c of f.constraints??[])if(c.type==='quantity'&&Array.isArray(c.components))for(const key of c.components)if(typeof key==='string'&&key!==c.key&&!f.relations.some(e=>e.type==='PART_OF'&&e.from===key&&e.to===c.key))f.relations.push({type:'PART_OF',from:key,to:c.key,clause_ids:c.clause_ids});
 }

 // Earlier host versions attached a binding error to the entire clause. Move
 // only that identified host diagnostic; genuine source/grammar gaps stay put.
 for(const r of Object.values(out))for(const cv of r?.boundary?.formal?.coverage??[]){
  if(cv.kind==='UNSUPPORTED'&&cv.reason===legacyGap){
   cv.kind='STRUCTURED';cv.reason='已有结构保留；各约束身份分别校验';
  }
 }
 for(const n of plan.nodes){const f=out[n.id]?.boundary?.formal;if(!f)continue;
  const rejected=f.binding_patch_errors??[];
  const redundant=e=>{
   const c=f.constraints?.find(c=>c.id===e.constraint_id),b=e.requested_binding;
   if(e.code!=='LOCAL_BINDING_REJECTED'||b?.relation!=='SPECIALIZES'||c?.type!=='obligation'||c.mode!=='REQUIRED')return false;
   const parent=ancestors(plan,n.id).find(p=>p.id===b.parent_node_id),pf=parent&&out[parent.id]?.boundary?.formal;
   const pc=pf?.constraints?.find(p=>p.key===b.parent_key&&p.type==='obligation'&&p.mode==='REQUIRED'&&(!p.timing||p.timing==='EVENTUALLY'));
   if(!pc||bindingIssues(plan,out,n,c).length)return false;
   // Only an additional relation may be set aside. A separately accepted
   // SAME_AS identity must still identify this duty and reach a real parent.
   return c.binding_provenance?.some(p=>p.relation==='SAME_AS'&&ancestors(plan,n.id).some(a=>a.id===p.parent_node_id&&(out[a.id]?.boundary?.formal?.constraints??[]).some(x=>x.key===p.parent_key&&x.key===c.key&&x.type==='obligation'&&x.mode==='REQUIRED')));
  };
  f.binding_diagnostics=rejected.filter(redundant).map(e=>({...e,code:'REDUNDANT_REQUIRED_DUTY_RELATION',reason:e.reason+'；该义务已有有效同一身份绑定，附加关系不取消父义务，继续按有效约束计算。'}));
  const blocking=rejected.filter(e=>!redundant(e));
  f.binding_issues=[...blocking,...(f.constraints??[]).filter(c=>!blocking.some(e=>e.constraint_id===c.id)).flatMap(c=>bindingIssues(plan,out,n,c))];
 }
 return out;
}
