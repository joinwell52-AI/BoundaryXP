import {evaluateBooleanAssignment} from '../../../src/bxp/boolean-solver.mjs';

// Formula assignments only. EVENT_OCCURRED remains occurrence, never completion.
export function completionSummary(ir, acceptance) {
 const expressions = new Map(ir.expressions.map(x => [x.id,x]));
 const status = new Map(acceptance.rows.map(x => [x.id,x.status]));
 return ir.requirements.filter(r => r.kind === 'COMPLETION').map(r => {
  try {
   const atoms = new Map();
   function ast(ref, path = new Set()) {
    if (ref?.kind !== 'EXPRESSION' || path.has(ref.id)) throw Error('COMPLETION_EXPRESSION_MISSING_OR_CYCLIC');
    const e = expressions.get(ref.id);
    if (!e) throw Error('COMPLETION_EXPRESSION_MISSING');
    const next = new Set([...path, ref.id]);
    if (e.operator === 'BOOLEAN') return e.literal;
    if (['STATE_VALUE','EVENT_OCCURRED'].includes(e.operator)) {
     const operand = e.arguments[0];
     if ((e.operator === 'STATE_VALUE' && operand?.kind !== 'STATE') || (e.operator === 'EVENT_OCCURRED' && operand?.kind !== 'EVENT')) throw Error('COMPLETION_ATOM_BINDING_NOT_IMPLEMENTED');
     const id = e.operator === 'STATE_VALUE' ? operand.id : 'EVENT_OCCURRED:' + operand.id;
     atoms.set(id,{id,operator:e.operator,operand,source_refs:e.source_refs});
     return {var:id};
    }
    if (!['AND','OR','NOT','IMPLIES','IFF'].includes(e.operator)) throw Error('COMPLETION_SUMMARY_OPERATOR:' + e.operator);
    const args = e.arguments.map(a => ast(a,next));
    if (e.operator === 'AND') return {all:args};
    if (e.operator === 'OR') return {any:args};
    if (e.operator === 'NOT') return {not:args[0]};
    if (e.operator === 'IMPLIES') return {implies:args};
    return {all:[{implies:args},{implies:[args[1],args[0]]}]};
   }
   const formula = ast(r.body), variables = [...atoms.keys()];
   if (variables.length > 12) throw Error('COMPLETION_SUMMARY_CAPACITY');
   const table = Array.from({length:2 ** variables.length},(_,mask) => {
    const assignment = Object.fromEntries(variables.map((id,i) => [id,!!(mask & (1<<i))]));
    return {assignment,satisfied:evaluateBooleanAssignment(variables,formula,assignment)};
   });
   const body = expressions.get(r.body.id), premise = body.operator === 'IFF' ? body.arguments[1] : null;
   let premiseResult = {};
   if (premise) {
    atoms.clear(); const premiseFormula = ast(premise), ids = [...atoms.keys()]; let count = 0;
    for (let mask=0; mask<2 ** ids.length; mask++) if (evaluateBooleanAssignment(ids,premiseFormula,Object.fromEntries(ids.map((id,i)=>[id,!!(mask & (1<<i))])))) count++;
    premiseResult = {premise_variables:ids,premise_true_count:count,premise_false_count:2 ** ids.length-count};
   }
   // Rebuild metadata after the separate premise enumeration.
   atoms.clear(); ast(r.body);
   return {requirement_id:r.id,status:status.get(r.id),formula:r.body,variables,atoms:[...atoms.values()],table,
    satisfied_count:table.filter(t=>t.satisfied).length,violation_count:table.filter(t=>!t.satisfied).length,...premiseResult,
    counts_are_formula_assignments_not_complete_model_solutions:true};
  } catch(error) { return {requirement_id:r.id,status:'NOT_IMPLEMENTED',reason:error.message}; }
 });
}
