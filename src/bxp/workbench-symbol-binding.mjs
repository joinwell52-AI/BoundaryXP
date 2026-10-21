import {calculateComparison} from './workbench-calculators.mjs';
// Identity adapter only. Boolean evaluation remains in the existing calculator.
import {ancestors} from './workbench-model.mjs';
export const booleanSymbols=e=>typeof e==='boolean'?[]:e?.var?[e.var]:e?.not?booleanSymbols(e.not):Object.values(e??{}).flatMap(v=>Array.isArray(v)?v.flatMap(booleanSymbols):[]);
const vars=c=>[...new Set([...booleanSymbols(c.expression),...booleanSymbols(c.guard)])];
const event=c=>['condition','permission','obligation'].includes(c.type);
function soundBindings(plan,boundaries,node,c){
 const rows=c.symbol_bindings??[];if(!Array.isArray(rows))return false;
 for(const b of rows){const p=ancestors(plan,node.id).find(p=>p.id===b.parent_node_id),names=p?(boundaries[p.id]?.boundary?.formal?.constraints??[]).filter(x=>event(x)&&x.key===b.parent_key).flatMap(vars):[];
  if(!vars(c).includes(b.from)||b.parent_key!==c.key||!names.includes(b.to)||!['SAME_AS','DISTINCT'].includes(b.relation)||typeof b.reason!=='string'||!b.reason.trim()||b.relation==='SAME_AS'&&names.includes(b.from)&&b.from!==b.to||b.relation==='DISTINCT'&&b.from===b.to)return false;
  const peers=rows.filter(x=>x.from===b.from&&x.parent_node_id===b.parent_node_id&&x.parent_key===b.parent_key),aliases=[...new Set(peers.filter(x=>x.relation==='SAME_AS').map(x=>x.to))];
  if(aliases.length>1||peers.some(x=>x.relation==='DISTINCT'&&aliases.includes(x.to)))return false;
 }return true;
}
export function symbolIdentityIssues(plan,boundaries,node,c){
 if(!event(c)||!vars(c).length)return [];
 const issues=[];
 const invalid=reason=>({code:'INVALID_BOOLEAN_IDENTITY',constraint_id:c.id,clause_ids:c.clause_ids,axes:c.axes,reason});
 if(!soundBindings(plan,boundaries,node,c))return [invalid('条件变量身份绑定格式、端点或一致性无效')];
 for(const b of c.symbol_bindings??[]){
  const parent=ancestors(plan,node.id).find(p=>p.id===b.parent_node_id);
  const names=parent?[...new Set((boundaries[parent.id]?.boundary?.formal?.constraints??[]).filter(x=>event(x)&&x.key===b.parent_key).flatMap(vars))]:[];
  if(!vars(c).includes(b.from)||b.parent_key!==c.key||!names.includes(b.to)||!['SAME_AS','DISTINCT'].includes(b.relation)||typeof b.reason!=='string'||!b.reason.trim()||b.relation==='SAME_AS'&&names.includes(b.from)&&b.from!==b.to||b.relation==='DISTINCT'&&b.from===b.to)issues.push(invalid('条件变量绑定端点、祖先范围或身份依据无效'));
 }
 for(const p of ancestors(plan,node.id)){
  const ps=(boundaries[p.id]?.boundary?.formal?.constraints??[]).filter(x=>event(x)&&x.key===c.key);
  // REQUIRED adds a duty; it does not replace the parent's duty or its guard.
  // That comparison does not consume an equivalence between the two guards.
  // Preconditions, cancellations and malformed explicit mappings still need
  // their original identity checks.
  if(!issues.length&&c.type==='obligation'&&c.mode==='REQUIRED'&&ps.length&&ps.every(x=>x.type==='obligation'&&x.mode==='REQUIRED'))continue;
  const names=[...new Set(ps.flatMap(vars))];if(!names.length)continue;
  // A universal implication over all Boolean valuations is preserved under
  // every later aliasing or dependency of the still-unbound child symbols.
  // A counterexample over independent names is NOT such a proof and still
  // requires identity binding. Never use this to waive invalid bindings.
  if(!issues.length&&ps.every(x=>x.type==='condition')&&(['condition','permission'].includes(c.type)||c.type==='obligation'&&c.mode==='REQUIRED'&&['ON_TRIGGER','WHILE_GUARD'].includes(c.timing))){
   const siblings=(boundaries[node.id]?.boundary?.formal?.constraints??[]).filter(x=>x.type==='condition'&&x.key===c.key);
   const terms=siblings.filter(x=>soundBindings(plan,boundaries,node,x)).map(x=>mapBooleanExpression(x.expression,x,p.id,c.key));
   if(c.type!=='condition')terms.push(mapBooleanExpression(c.type==='obligation'?(c.guard??true):c.expression,c,p.id,c.key));
   const parent={all:ps.map(x=>x.expression)},child={all:terms};
   const result=calculateComparison({kind:'boolean_implication',parent,child,variables:[...new Set([...booleanSymbols(parent),...booleanSymbols(child)])].sort()});
   if(result.status==='VERIFIED')continue;
  }
  for(const from of vars(c)){
   if(names.includes(from))continue;
   const bindings=(c.symbol_bindings??[]).filter(b=>b.parent_node_id===p.id&&b.parent_key===c.key&&b.from===from);
   const aliases=[...new Set(bindings.filter(b=>b.relation==='SAME_AS'&&names.includes(b.to)).map(b=>b.to))];
   const distinct=new Set(bindings.filter(b=>b.relation==='DISTINCT').map(b=>b.to));
   if(aliases.length===1&&!distinct.has(aliases[0])||!aliases.length&&names.every(v=>distinct.has(v)))continue;
   issues.push({code:'UNBOUND_BOOLEAN_IDENTITY',constraint_id:c.id,clause_ids:c.clause_ids,axes:c.axes,
    reason:'条件变量身份尚未对齐：'+from+'；父条件变量为 '+names.join('、'),parent_node_id:p.id,parent_key:c.key,variable:from,parent_variables:names});
  }
 }
 return issues;
}
export function applySymbolBindings(plan,result,node,c,pc,parent,bindings){
 if(!Array.isArray(bindings))throw Error('条件变量绑定必须为数组');
 const fromNames=vars(c),parentNames=[...new Set(result[parent.id].boundary.formal.constraints.filter(x=>event(x)&&x.key===pc.key).flatMap(vars))];
 const normalized=[];
 for(const b of bindings){
  if(!fromNames.includes(b.from)||!parentNames.includes(b.to)||!['SAME_AS','DISTINCT'].includes(b.relation)||typeof b.reason!=='string'||!b.reason.trim())throw Error('条件变量绑定来源、目标或身份依据无效');
  if(b.from===b.to&&b.relation==='DISTINCT')throw Error('同一变量不能声明身份不同');
  if(b.relation==='SAME_AS'&&parentNames.includes(b.from)&&b.from!==b.to)throw Error('局部绑定不能合并父任务已有的不同变量');
  normalized.push({...b,parent_node_id:parent.id,parent_key:pc.key,clause_ids:[...c.clause_ids]});
 }
 const all=[...(c.symbol_bindings??[]),...normalized];
 for(const from of fromNames){
  const rows=all.filter(b=>b.from===from&&b.parent_node_id===parent.id&&b.parent_key===pc.key);
  const aliases=[...new Set(rows.filter(b=>b.relation==='SAME_AS').map(b=>b.to))];
  if(aliases.length>1||rows.some(b=>b.relation==='DISTINCT'&&aliases.includes(b.to)))throw Error('条件变量身份绑定互相矛盾');
 }
 c.symbol_bindings=all;
}
export function mapBooleanExpression(expression,constraint,parentId,parentKey){
 const mappings=new Map((constraint.symbol_bindings??[]).filter(b=>b.parent_node_id===parentId&&b.parent_key===parentKey&&b.relation==='SAME_AS').map(b=>[b.from,b.to]));
 const visit=e=>typeof e==='boolean'?e:e?.var?{var:mappings.get(e.var)??e.var}:e?.not?{not:visit(e.not)}:Object.fromEntries(Object.entries(e??{}).map(([k,v])=>[k,Array.isArray(v)?v.map(visit):v]));
 return visit(expression);
}
