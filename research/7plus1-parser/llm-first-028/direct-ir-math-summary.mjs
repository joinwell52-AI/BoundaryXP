// Summaries computed from typed IR only; no source text, label or note parsing.
export function directMathSummary(ir,acceptance){
 const nodes=new Map(['entities','events','states','expressions','requirements'].flatMap(k=>ir[k].map(x=>[x.id,x]))),status=new Map(acceptance.rows.map(x=>[x.id,x.status]));
 const members=r=>r?.kind==='ENTITY'?(nodes.get(r.id)?.kind==='GROUP'?nodes.get(r.id).members.flatMap(members):[r.id]):[];
 const inputs=[...new Set(ir.events.filter(e=>e.kind==='TASK').flatMap(e=>e.roles.filter(r=>r.role==='INPUT_OBJECT').flatMap(r=>members(r.value))))];
 const outputs=[...new Set(ir.events.filter(e=>e.kind==='ACTION'&&e.use==='CURRENT_TASK'&&e.layer==='MAIN').flatMap(e=>e.roles.filter(r=>['RESULT','DELIVERABLE'].includes(r.role)).flatMap(r=>members(r.value))))].filter(id=>['FILE','DOCUMENT'].includes(nodes.get(id)?.kind));
 const describe=ids=>ids.map(id=>({id,label:nodes.get(id).label}));
 const completions=[];for(const requirement of ir.requirements.filter(r=>r.kind==='COMPLETION')){
  const values=new Set();const visit=r=>{const e=nodes.get(r.id);if(r.kind!=='EXPRESSION'||!e)return;if(e.operator==='STATE_VALUE')values.add(e.arguments[0].id);else e.arguments.forEach(visit);};visit(requirement.body);const vars=[...values];
  if(vars.length>12){completions.push({requirement_id:requirement.id,status:'CAPACITY_NOT_IMPLEMENTED'});continue;}
  const evaluate=(r,assignment)=>{const e=nodes.get(r.id);if(e.operator==='BOOLEAN')return e.literal;if(e.operator==='STATE_VALUE')return assignment[e.arguments[0].id];const a=e.arguments.map(x=>evaluate(x,assignment));if(e.operator==='AND')return a.every(Boolean);if(e.operator==='OR')return a.some(Boolean);if(e.operator==='NOT')return !a[0];if(e.operator==='IMPLIES')return !a[0]||a[1];if(e.operator==='IFF')return a[0]===a[1];throw Error('COMPLETION_SUMMARY_OPERATOR:'+e.operator);};
  try{const table=[];for(let mask=0;mask<2**vars.length;mask++){const assignment=Object.fromEntries(vars.map((id,i)=>[id,!!(mask&(1<<i))]));table.push({assignment,satisfied:evaluate(requirement.body,assignment)});}const body=nodes.get(requirement.body.id),premise=body.operator==='IFF'?body.arguments[1]:null;const premiseVars=premise?[...vars].filter(id=>!nodes.get(body.arguments[0].id)?.arguments?.some(r=>r.id===id)):[];let premise_true=0;if(premise)for(let mask=0;mask<2**premiseVars.length;mask++)if(evaluate(premise,Object.fromEntries(premiseVars.map((id,i)=>[id,!!(mask&(1<<i))]))))premise_true++;
   completions.push({requirement_id:requirement.id,status:status.get(requirement.id),formula:requirement.body,variables:vars,table,satisfied_count:table.filter(r=>r.satisfied).length,violation_count:table.filter(r=>!r.satisfied).length,...(premise?{premise_variables:premiseVars,premise_true_count:premise_true,premise_false_count:2**premiseVars.length-premise_true}:{}),counts_are_formula_assignments_not_complete_model_solutions:true});
  }catch(e){completions.push({requirement_id:requirement.id,status:'NOT_IMPLEMENTED',reason:e.message});}
 }
 return {input_files:describe(inputs),output_artifacts:describe(outputs),input_count:inputs.length,output_count:outputs.length,intersection:describe(inputs.filter(id=>outputs.includes(id))),union:describe([...new Set([...inputs,...outputs])]),union_count:new Set([...inputs,...outputs]).size,completions,status:'DERIVED_FROM_CANDIDATE_IR',not_semantic_acceptance_proof:true};
}
