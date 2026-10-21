// Test-only controlled mutations. Never imported by the product or model.
import fs from 'node:fs';import path from 'node:path';import {createHash} from 'node:crypto';
const root=path.resolve('docs/testing/7plus1/MANUAL-TEST-001-local-conditions-r01');
const original=fs.readFileSync('docs/testing/7plus1/MANUAL-TEST-001.txt','utf8');
const completion='两份报告均提交QA、QA复核通过且summary.md交付ADMIN时，任务完成';
const quantity='全部工作须在30分钟内完成';
const stop='发现高危问题时，PM立即停止本任务并向ADMIN汇报';
const definitions=[
 {id:'V00',from:null,to:null,change:'UNCHANGED',field:null,value:null,expected:'Original sufficient completion, four conjunctive states, aggregate LTE30.'},
 {id:'V01',from:completion,to:'只有两份报告均提交QA、QA复核通过且summary.md交付ADMIN时，任务才完成',change:'COMPLETION_NECESSARY',field:'claims.c_completion.direction',value:'NECESSARY',expected:'Completion implies all four states; states alone do not prove completion. False criterion / observed complete violates this necessary condition.'},
 {id:'V02',from:completion,to:'当且仅当两份报告均提交QA、QA复核通过且summary.md交付ADMIN时，任务完成',change:'COMPLETION_IFF',field:'claims.c_completion.direction',value:'IFF',expected:'Both directions, retaining all four states.'},
 {id:'V03',from:completion,to:'任一条件成立（DEV报告提交QA、OPS报告提交QA、QA复核通过或summary.md交付ADMIN）时，任务完成',change:'COMPLETION_OR',field:'expressions.x_complete',value:{op:'OR',operands:['x_dev_submitted','x_ops_submitted','x_review_pass','x_summary_delivered']},expected:'One true alternative suffices for this completion criterion; the independent requirement to submit both reports before review remains unchanged.'},
 {id:'V04',from:quantity,to:'全部工作必须少于30分钟',change:'STRICT_QUANTITY',field:'claims.c_time.quantity.comparator',value:'LT',expected:'Elapsed30 fails; elapsed29 passes. Completion is unchanged.'},
 {id:'V05',from:quantity,to:'全部工作须在20分钟内完成',change:'QUANTITY_BOUND',field:'claims.c_time.quantity.value',value:20,expected:'Elapsed20 passes; elapsed21 fails. Completion is unchanged.'},
 {id:'V06',from:stop,to:'未发现高危问题时，PM立即停止本任务并向ADMIN汇报',change:'LOCAL_NEGATION',field:'expressions.x_high_found.state.polarity',value:'NEGATIVE',expected:'The negated finding triggers stop and report. No positive finding is inferred; other states remain unchanged.'}
];
if(fs.existsSync(root))throw Error('FROZEN_VARIANTS_EXIST');fs.mkdirSync(root,{recursive:true});
for(const d of definitions){let text=original;if(d.from){if(original.split(d.from).length!==2)throw Error('NOT_A_SINGLE_LOCAL_MUTATION');text=original.replace(d.from,d.to);}const dir=path.join(root,d.id);fs.mkdirSync(dir);fs.writeFileSync(path.join(dir,'source.txt'),text,{flag:'wx'});
 d.source_sha256=createHash('sha256').update(text).digest('hex');d.origin='PREDECLARED_CONTROLLED_TEST_INPUT_NOT_GOLD';d.expected_must_not_enter_model_context=true;fs.writeFileSync(path.join(dir,'expected.json'),JSON.stringify(d,null,2)+'\n',{flag:'wx'});
}
fs.writeFileSync(path.join(root,'INDEX.json'),JSON.stringify({source:'MANUAL-TEST-001.txt',definitions,model_tests:['V01'],program_fixture_tests:definitions.map(x=>x.id),fixture_generation_is_not_llm_parsing:true},null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({root,texts:definitions.length,planned_real_model_texts:1,maximum_new_conservative_requests:2,old_ledgers_unchanged:true}));
