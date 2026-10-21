// Host planning: request an expression independently of identity repair.
import {ancestors} from '../../../src/bxp/workbench-model.mjs';
import {isInstantQuantity,instantConstraintValue} from '../../../src/bxp/workbench-time-coordinate.mjs';

export function mathematicalTargets(plan,boundaries,parent){
 const boundary=boundaries[parent.id]?.boundary,formal=boundary?.formal;
 if(!formal)return [];
 const descendants=plan.nodes.filter(n=>ancestors(plan,n.id).some(p=>p.id===parent.id)),targets=[];
 for(const quantity of formal.constraints??[]){
  if(quantity.type!=='quantity'||quantity.role!=='LIMIT'||!quantity.lower&&!quantity.upper)continue;
  const instant=isInstantQuantity(quantity);
  if(formal.calculation_plans?.some(p=>p.target_constraint_id===quantity.id&&p.expression))continue;
  const graphs=[parent,...descendants].flatMap(node=>(boundaries[node.id]?.boundary?.formal?.constraints??[]).filter(c=>c.type==='order').map(c=>({node_id:node.id,constraint:c,clauses:boundaries[node.id].boundary.clauses.filter(cl=>c.clause_ids.includes(cl.id))})));
  const operands=[];
  for(const node of [parent,...descendants])for(const c of boundaries[node.id]?.boundary?.formal?.constraints??[]){
   const timePoint=instant&&instantConstraintValue(c);
   if(!timePoint&&(c.type!=='quantity'||c.role!=='VALUE'))continue;
   operands.push({node_id:node.id,constraint:c,clauses:boundaries[node.id].boundary.clauses.filter(cl=>c.clause_ids.includes(cl.id))});
  }
  if(operands.length<(instant?1:2)||!operands.some(row=>row.node_id!==parent.id)||instant&&!operands.some(row=>instantConstraintValue(row.constraint)))continue;
  targets.push({target_constraint_id:quantity.id,quantity,measure:instant?'INSTANT':'QUANTITY',normalization:instant?'选择共同时间单位，以父截止日期午夜为坐标原点；引用已有完整时刻，经INSTANT转换后与持续时长组合':'已有数量引用；相容的时间单位由Core按统一目标单位转换',graphs,operands,clauses:boundary.clauses});
 }
 return targets;
}

export function requireMathematicalPlans(input,boundaries){
 for(const node of input.nodes)for(const target of node.mathematical_targets??[]){
  const formal=boundaries[node.node_id].boundary.formal;formal.calculation_plans??=[];
  if(!formal.calculation_plans.some(p=>p.target_constraint_id===target.target_constraint_id))formal.calculation_plans.push({target_constraint_id:target.target_constraint_id,unresolved:[{reason:'数学解析尚未交付可执行运算表达式；身份绑定不能替代数学解析'}]});
 }
 return boundaries;
}
