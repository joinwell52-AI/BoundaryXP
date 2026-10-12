// Independent executable transcription of the human oracle, never sent to LLM/runtime.
import fs from 'node:fs';import path from 'node:path';import {pathToFileURL} from 'node:url';
const root=path.resolve('.boundx/products/0.1.0-candidate.031-r1.2-ui.53');
const {canonicalBooleanBoundary}=await import(pathToFileURL(path.join(root,'src/bxp/boolean-solver.mjs')));
const {solveJointBoundary,verifyJointWitness}=await import(pathToFileURL(path.join(root,'src/bxp/joint-boundary-solver.mjs')));
const v=id=>({var:id}),K={all:['D','O','Q','S'].map(v)},iff=[{implies:[v('C'),K]},{implies:[K,v('C')]}];
const variables=['D','O','Q','S','C','H','Z','stop','report','continue','modify_a','modify_e','access_production','test_environment'];
const formulas=[...iff,{implies:[v('H'),v('stop')]},{implies:[v('H'),v('report')]},{implies:[v('stop'),v('Z')]},{implies:[v('Z'),{not:v('continue')}]},{not:v('modify_a')},{not:v('modify_e')},{not:v('access_production')},v('test_environment')];
const problem={variables,constraints:formulas.map((formula,i)=>({id:'manual:'+i,formula})),intervals:[{id:'T',lower:{value:'0',inclusive:true},upper:{value:'30',inclusive:true},empty:false}],orders:[{id:'dev-before-review',from:'dev-submitted',to:'qa-review'},{id:'ops-before-review',from:'ops-submitted',to:'qa-review'},{id:'success-before-summary',from:'qa-pass',to:'summary-generated'},{id:'success-before-delivery',from:'qa-pass',to:'summary-delivered'}]};
// Last two ranks demonstrate this chosen witness; they are not new universal strict-time source rules.
const witness={boolean:{D:true,O:true,Q:true,S:true,C:true,H:false,Z:false,stop:false,report:false,continue:false,modify_a:false,modify_e:false,access_production:false,test_environment:true},intervals:{T:'30'},order_rank:{'dev-submitted':0,'ops-submitted':0,'qa-review':1,'qa-pass':2,'summary-generated':3,'summary-delivered':4}};
const verification=verifyJointWitness(problem,witness),premise=canonicalBooleanBoundary(['D','O','Q','S'],[K]),relation=canonicalBooleanBoundary(['D','O','Q','S','C'],iff);
const result={origin:'HUMAN_MD_ORACLE_TRANSCRIPTION_NOT_PARSER_OUTPUT',source_sha256:'0b9b336d11a39a5e50d3ac361025211a742abe3c9578403098d3e3bcb45fda70',input_set_count:2,output_set_count:3,intersection_count:0,union_count:5,static_negative_pair_count:3,premise_counts:[premise.solution_count,16-premise.solution_count],iff_counts:[relation.solution_count,32-relation.solution_count],witness,verification,abstract_satisfiability:solveJointBoundary(problem).result,business_execution_proven:false,model_calls:0};
if(!verification.valid||premise.solution_count!==1||relation.solution_count!==16)throw Error('MANUAL_ORACLE_CHECK_FAILED');
fs.writeFileSync('docs/reports/7plus1/JOINT-BOUNDARY-CLOSURE-r01/MANUAL-ORACLE-VERIFIED.json',JSON.stringify(result,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({manual_witness_valid:verification.valid,premise_counts:result.premise_counts,iff_counts:result.iff_counts}));
