import {operators} from './schema.mjs';
// Explicit implementation inventory: a newly added Schema operator must be registered
// here AND added to the executable conformance suite before resources can be built.
const groups={
 finite_sets:['SET','GROUP_MEMBERS','UNION','INTERSECTION','DIFFERENCE','MEMBER','SUBSET','CARDINALITY'],
 literals_and_domains:['BOOLEAN','NUMBER','REAL_INTERVAL','INTEGER_RANGE'],
 comparison_and_arithmetic:['EQ','LT','LTE','GT','GTE','ADD'],
 logic:['AND','OR','NOT','IMPLIES','IFF'],
 state_and_occurrence:['STATE_VALUE','EVENT_OCCURRED'],
 temporal:['EVENT_START','EVENT_END','STATE_ESTABLISHED','TRUE_AT_START','IMMEDIATE_AFTER','BEFORE'],
 event_identity:['EVENT_INSTANCE','PREVIOUS_INSTANCE'],
 projections:['OBJECT_OF','RECIPIENT_OF','ENVIRONMENT_OF','TASK_EXTERNAL_INPUTS'],
 quantification:['TASK_EVENTS','FORALL','EXISTS']
};
const limits={
 finite_sets:['Finite symbolic domains are bounded; incomplete observed membership is UNKNOWN.'],
 literals_and_domains:['Continuous values are handled as interval constraints; continuous-domain quantifier elimination is not implemented.'],
 comparison_and_arithmetic:['Decimal ADD uses exact decimal accumulation. Unary real comparisons compose through Boolean conditions and guarded intervals; multivariable continuous arithmetic and continuous quantifier elimination remain reported gaps, never finite approximations.'],
 logic:['Three-valued observed logic preserves UNKNOWN; static solving has explicit capacity limits.'],
 state_and_occurrence:['Missing observed facts remain UNKNOWN; indexed states require an explicit matching event identity in state_instances.'],
 temporal:['IMMEDIATE_AFTER is qualitative priority, never a fabricated zero-second deadline.'],
 event_identity:['Indices are nonnegative integers; previous index zero is outside the sequence; no implicit retry limit.'],
 projections:['Scalar projections require one distinct role value; multiple recipients remain plural, not last-value-wins.'],
 quantification:['Finite-domain quantifiers are supported. Static EXISTS over open TASK_EVENTS and continuous quantifiers remain explicit gaps; observed TASK_EVENTS requires completeness to prove universal satisfaction.']
};
export function operatorRegistry(){
 const registered=Object.values(groups).flat();
 if(new Set(registered).size!==registered.length||JSON.stringify([...registered].sort())!==JSON.stringify(Object.keys(operators).sort()))throw Error('IR_OPERATOR_IMPLEMENTATION_INVENTORY_MISMATCH');
 return Object.fromEntries(Object.entries(operators).map(([op,[result_type,min_arguments,max_arguments]])=>{const family=Object.keys(groups).find(k=>groups[k].includes(op));return [op,{result_type,min_arguments,max_arguments,family,consumer_status:'MECHANISM_TESTED_WITH_RECORDED_LIMITS',consumers:['direct-ir-calculate.mjs','direct-ir-observations.mjs'],semantic_definition:'CONTRACT.md',verification:'tests/direct-ir-operator-conformance.test.mjs',limits:limits[family]}];}));
}
