import fs from 'node:fs';import {out,write,digest} from './common.mjs';
if(fs.existsSync(out+'NON-GOLD-FROZEN-INPUTS.json'))throw Error('Frozen inputs exist');
const inputs=[
 {id:'I01',group:'identity',text:'编辑李梅负责这项工作。李梅读取 ledger.csv，生成 digest.md。',expect:{identity:'编辑李梅',alias:'李梅',merge:true}},
 {id:'I02',group:'identity',text:'复核人周安负责这项检查。周安检查 sample.yaml。',expect:{identity:'复核人周安',alias:'周安',merge:true}},
 {id:'I03',group:'identity',text:'Editor Maya Patel is responsible for this task. Maya Patel reads journal.csv and generates memo.md.',expect:{identity:'Editor Maya Patel',alias:'Maya Patel',merge:true}},
 {id:'I04',group:'identity',text:'编辑李梅负责读取 east.csv。编辑李兰负责读取 west.csv。李梅生成 east.md。李兰生成 west.md。',expect:{distinct:['编辑李梅','编辑李兰'],merge:false}},
 {id:'S01',group:'subject',text:'编辑林禾负责这项工作。读取 source.csv，再生成 result.md。',expect:{predicate:'读取',actor:'编辑林禾'}},
 {id:'S02',group:'subject',text:'编辑林禾负责这项工作。报告的格式必须符合 DOC-STYLE-8。',expect:{predicate:'符合',no_actor:true}},
 {id:'S03',group:'subject',text:'输入文件不得修改。编辑林禾负责这项工作。读取 input.csv。',expect:{predicate:'修改',no_actor:true}},
 {id:'S04',group:'subject',text:'编辑林禾负责这项工作。生成 result.md。result.md 已生成后，本任务完成。',expect:{completion_no_actor:true}},
 {id:'S05',group:'subject',text:'编辑林禾负责这项工作。赵明读取 source.csv。',expect:{predicate:'读取',actor:'赵明',forbidden_actor:'编辑林禾'}},
 {id:'C01',group:'completion',text:'只有赵明确认报告没有遗漏数据，并且所有待检查的条目都已正确记录，本任务才算完成。',expect:{op:'AND',operands:2,necessary:true,all:true,confirmation:true}},
 {id:'C02',group:'completion',text:'只有复核通过，并且所有问题都已记录，本任务才算完成。',expect:{op:'AND',operands:2,necessary:true,all:true}},
 {id:'C03',group:'completion',text:'Only when Alex confirms the report has no omissions and all unresolved items are marked is the task complete.',expect:{op:'AND',operands:2,necessary:true,all:true,confirmation:true}},
 {id:'C04',group:'completion',text:'Only when the review has passed and every issue is recorded is the task complete.',expect:{op:'AND',operands:2,necessary:true,all:true}},
 {id:'L01',group:'coverage',text:'读取 raw.csv，生成 summary.md。不得上传上述材料。',expect:{typed_unknown_role:'FORBID_OBJECT',affected:['B'],unaffected:['I','O','A']}},
 {id:'L02',group:'coverage',text:'将 report.md 提交给待确认的接收人。总用时不得超过 12 分钟。依据 QA-12。',expect:{typed_unknown_role:'RECIPIENT',affected:['A','P'],unaffected:['R','V']}},
 {id:'L03',group:'coverage',text:'生成尚未确定身份的报告。该报告生成后完成。依据 GUIDE-9。',expect:{typed_unknown_role:'RESULT',affected:['O','A','C'],unaffected:['V']}}
];
write(out+'NON-GOLD-FROZEN-INPUTS.json',{frozen_at:new Date().toISOString(),policy:'Immutable before implementation and REF evaluation. I/S/C use real NLP end-to-end mechanism assertions. L uses explicit typed unresolved graph fixtures over the indicated source to isolate dependency propagation; not claimed as end-to-end extraction success.',inputs});
write(out+'HYPOTHESIS.json',{hypothesis:'Typed qualified-name identity and local execution subject evidence, sentence-bound completion composition, and unresolved use-site coverage can close REF without changing Q, models, Gold or D cases.',primary_gate:'D01-D08 8/8 plus REF 43/43 and no genuine Canonical mismatch',minimum_delta:'Remove duplicate performer, restore both necessary completion operands, prevent actor leakage and unrelated coverage pollution',falsification:'Any non-Gold class gate fail or retained case regression; REF semantic residual forbids validated outcome',stop_rule:'No WP/Matrix expansion; report actual terminal and stop for ADMIN',non_Gold_sha256:digest(out+'NON-GOLD-FROZEN-INPUTS.json')});
write(out+'ADMIN-ADJUDICATION-READBACK.json',{task:'7P-SHORT-016-R2',authorities:['docs/tasks/7plus1/CURRENT-TASK.md','docs/tasks/7plus1/7P-SHORT-016-R2.md','docs/tasks/7plus1/7P-SHORT-016-R2-REF001-ADMIN-ADJUDICATION.md','docs/BoundX-7plus1-定义原理语义编译与边界计算说明-v0.3.md'].map(path=>({path,sha256:digest(path)})),scope:['role-qualified identity','bounded execution subject','necessary AND completion','typed coverage locality','explicit equivalence audit'],frozen_Q:true,source_Gold_unchanged:true,production_switch:false});
console.log('Non-Gold inputs and falsifiable hypothesis frozen');
