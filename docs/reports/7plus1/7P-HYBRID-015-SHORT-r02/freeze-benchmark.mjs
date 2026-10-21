import assert from 'node:assert/strict';import fs from 'node:fs';import {out,oldOut,runtime,write,read,hash,digest,walk} from './common.mjs';
if(fs.existsSync(out+'SHORT-SINGLE-WP-BENCHMARK.json'))throw Error('INPUTS_ALREADY_FROZEN');
const definitions=[
 ['S01','zh','账单字段','林乔','顾辰','billing.tsv','bill-schema.json','billing-review.md','BILLING-STYLE-2','v2.3.0',45],
 ['S02','zh','文档链接','周怡','程安','link-index.csv','user-guide.md','link-review.md','LINK-STYLE-5','v1.4.0',35],
 ['S03','zh','数据字典','许澄','方宁','column-index.tsv','dictionary.json','dictionary-review.md','DATA-STYLE-6','v3.1.0',40],
 ['S04','zh','配置差异','陈叶','宋禾','settings.toml','release-notes.txt','config-review.md','CONFIG-STYLE-8','v2.1.0',50],
 ['S05','zh','归档索引','吴桐','丁睿','archive-index.csv','archive-manifest.json','archive-review.md','ARCHIVE-STYLE-3','v1.5.0',30],
 ['S06','zh','模型卡字段','何晏','袁书','model-card.md','metric-sheet.json','model-card-review.md','MODEL-STYLE-7','v4.2.0',55],
 ['S07','zh','安装说明','高悦','冯霖','install-guide.txt','dependency-lock.json','install-review.md','INSTALL-STYLE-9','v3.3.0',45],
 ['S08','zh','权限清单','郑杉','任舒','account-list.csv','policy-list.csv','access-review.md','ACCESS-STYLE-2','v1.6.0',35],
 ['S09','en','experiment worksheet','Mira','Owen','experiment-sheet.csv','experiment-schema.json','experiment-review.md','EXPERIMENT-STYLE-4','v2.6.0',45],
 ['S10','en','accessibility checklist','Nora','Evan','page-snapshot.html','accessibility-list.csv','accessibility-review.md','ACCESSIBILITY-STYLE-3','v1.9.0',40],
 ['S11','en','API annotation','Lena','Jules','api-index.json','annotation-guide.md','api-annotation-review.md','ANNOTATION-STYLE-6','v3.5.0',50],
 ['S12','en','dependency license','Ada','Noel','dependency-list.csv','license-policy.toml','license-review.md','LICENSE-STYLE-8','v2.8.0',35]
];
function source(d){const [id,lang,goal,actor,reviewer,f1,f2,report,basis,version,time]=d;return lang==='zh'?`# ${goal}核对任务

## 背景说明
这份材料用于一次内部质量复核。原始资料来自已经结束的记录收集，当前讨论的是资料之间能否对应，而不是现场业务是否应该调整。资料中出现的系统、功能和历史处理方式仅说明记录的来历。不同栏目可能采用不同的命名方式，同一对象在不同文件中也可能使用不同标题。标题差异只是背景，不能代替逐条证据。材料曾经怎样形成不属于本轮交付，既有处理记录的时间也不是本次工作的截止时间。
两份资料的格式不同，一份便于查看逐项记录，另一份用于说明记录字段或列出核对参照。某个字段的拼写相同不代表含义相同，某个标题不相同也不代表内容必定冲突。背景没有给出额外的执行人，也没有授权自动修正已有数据。此次交付帮助接收者看清核对依据，不代替接收者作业务决定。输入中原有的示例只说明字段使用方式，不是本轮要求执行的脚本。

## 本次要求
审阅员${actor}负责核对${goal}，复核人${reviewer}接收并确认这次核对记录。
输入包括 ${f1} 和 ${f2}。这两份文件均为已经提供的原始资料，本任务使用它们的现有内容。
${actor}必须读取 ${f1} 和 ${f2}，依据 ${basis} 的 ${version} 版本核对${goal}。核对范围覆盖两份输入中与${goal}有关的全部记录。上述文件指的就是本段明确列出的这两份输入，不包括背景中提到的历史资料。
必须生成 ${report}，把这次核对结果写入 ${report}。该记录是独立交付物，源文件与交付物的文件名不能互换。

## 记录内容
${report} 必须包含覆盖记录总数与差异证据两项内容。差异证据描述来源文件、对应条目以及核对结果；覆盖记录总数反映本次实际核对的范围。没有差异也保留该栏目，并如实记录核对结果。栏目名称是报告内部结构，不是额外文件，也不是新的独立任务。报告中的示例片段仅作为证据展示。

## 边界与验收
不得修改 ${f1} 和 ${f2}。本次核对的总用时不得超过 ${time} 分钟。
${actor}完成核对后，必须将 ${report} 提交给复核人${reviewer}。只有${reviewer}确认记录覆盖两份输入的全部相关条目，且交付记录已经生成，本次任务才算完成。确认针对本次核对记录；输入资料原来的处理状态不是本次完成证据。
`:`# ${goal} review

## Background
This material supports one internal quality review. The input records were collected earlier; the present task concerns correspondence between those records and their documented reference. Historical systems and operations mentioned in the records explain where the data came from. They are not additional current operations. Different titles may refer to the same documented subject. Identical field spelling alone is not evidence that two fields have identical meaning. The collection history and its timestamps are background, not a deadline for this review. Embedded examples describe formats and are not executable instructions for this task.
One input presents the observed records; the other provides the documented comparison material. These formats differ for readability. The review record gives its recipient traceable evidence, rather than a business approval. An example in the input remains an example, and a report heading remains a heading. Neither creates another output artifact. No additional actor or separate project is introduced by this background. The workflow described below has one goal and one final review record.

## Current requirements
Reviewer ${actor} is responsible for reviewing the ${goal}. Checker ${reviewer} receives and confirms this review record.
The inputs are ${f1} and ${f2}. Both files have already been supplied; their existing contents are the task inputs.
${actor} must read ${f1} and ${f2}, and check the ${goal} against ${basis} version ${version}. The check covers every relevant record in those two inputs. In this paragraph, those files means exactly the two named inputs, rather than historical material discussed in the background.
${actor} must generate ${report} and write the review findings into ${report}. This is a separate deliverable; the input paths and output path are distinct roles.

## Required report contents
${report} must contain the covered-record count and discrepancy evidence. The evidence identifies the source file, its corresponding record and the finding. The count describes the actual coverage of this review. A no-discrepancy finding is still recorded in that section. These two sections belong inside the report and do not constitute new files or independent tasks. Any example fragments displayed there are evidence, not instructions for the recipient to execute.

## Boundary and completion
${actor} must not modify ${f1} or ${f2}. The total review time must not exceed ${time} minutes.
${actor} must submit ${report} to checker ${reviewer}. The task is complete only when ${reviewer} confirms that the record covers every relevant item in both inputs and the report has been generated. Historical input processing status is not completion evidence for the current review.
`;}
function contract(d){const [id,lang,goal,actor,reviewer,f1,f2,report,basis,version,time]=d,entry=(kind,detail)=>({kind,modality:'REQUIRED',state:'RESOLVED',owner:'CURRENT_TASK',...detail});return {contract_version:'report-only-short-semantic-contract/v1',expected_canonical_7plus1:Object.fromEntries('IOAP RVCB'.replaceAll(' ','').split('').map(k=>[k,{slot:k,status:'RESOLVED',entries:[]} ])),owned_output_content:[{owner:report,kind:'RECORD_COUNT'},{owner:report,kind:'DISCREPANCY_EVIDENCE',components:['source_file','record','finding']}],expected_unresolved:[],complete_set_semantics:true,...{requirements:{I:[entry('INPUT',{object:f1}),entry('INPUT',{object:f2})],O:[entry('GENERATED_OUTPUT',{object:report})],A:[entry('READ',{objects:[f1,f2],agent:actor}),entry('CHECK',{object:goal,basis,version,agent:actor}),entry('GENERATE',{object:report,agent:actor}),entry('WRITE_FINDINGS',{object:report,agent:actor}),entry('SUBMIT',{object:report,agent:actor,recipient:reviewer})],P:[entry('PARTICIPANT',{identity:actor,roles:['PERFORMER']}),entry('PARTICIPANT',{identity:reviewer,roles:['RECIPIENT','REVIEWER']})],R:[entry('TIME_BUDGET',{quantity:time,unit:'minute',operator:'LTE',target:'CURRENT_TASK'})],V:[entry('BASIS',{object:basis,version})],C:[entry('COMPLETION',{operator:'AND',members:[{kind:'REVIEW_CONFIRMED',reviewer,object:report,coverage:[f1,f2]},{kind:'OUTPUT_EXISTS',object:report}]})],B:[entry('FORBID_MODIFY',{objects:[f1,f2],modality:'FORBIDDEN'})]}}};}
const cases=[];for(const d of definitions){const text=source(d),expected=contract(d);for(const k of Object.keys(expected.requirements))expected.expected_canonical_7plus1[k].entries=expected.requirements[k];const cp=[...text].length;if(d[1]==='zh')assert(cp>=700&&cp<=1800,'SHORT_SOURCE_LENGTH '+d[0]);else assert(cp>=1800&&cp<=4200);cases.push({id:d[0],language:d[1],group:'PRIMARY',source:text,source_sha256:hash(Buffer.from(text,'utf8')),codepoints:cp,complexity:{primary_goal:1,primary_workflow:1,participants:2,primary_outputs:1,conditional_outputs:0,conditional_branches:0,explicit_global_constraints:2,WP_decomposition:false},expected});}
for(const [id,base,transform]of [['M01','S01',t=>t.replace('输入包括 billing.tsv 和 bill-schema.json。','输入包括 bill-schema.json 和 billing.tsv。')],['M02','S02',t=>t.replace('必须生成 link-review.md','link-review.md 必须由周怡生成')],['M03','S09',t=>t.replace('The inputs are experiment-sheet.csv and experiment-schema.json.','The inputs are experiment-schema.json and experiment-sheet.csv.')],['M04','S10',t=>t.replace('Nora must submit accessibility-review.md to checker Evan.','The review record accessibility-review.md must be submitted by Nora to checker Evan.')]]){const c=cases.find(c=>c.id===base),text=transform(c.source);assert.notEqual(text,c.source);cases.push({...structuredClone(c),id,group:'SEMANTICS_PRESERVING_MUTATION',base_case:base,source:text,source_sha256:hash(Buffer.from(text,'utf8')),codepoints:[...text].length});}
const anchor='fixtures/7plus1/golden/REF-001/',a=read(anchor+'manifest.json');assert.equal(digest(anchor+'source.txt'),a.source_sha256);
const r={task:'7P-HYBRID-015',revision:'SHORT-r02',authority_dispatch:read(out+'BASELINE.json').current_dispatch,no_WP_decomposition:true,primary_cases:12,english_primary_cases:4,controlled_mutations:4,authored_before_any_short_hybrid_run:true,not_derived_from_long_hybrid_outputs:true,scope:'Independent one-flow input review scenarios; same finite entry contract shape across distinct source artifacts. No source edits after runtime output.',REF_001:{source_path:anchor+'source.txt',source_sha256:a.source_sha256,expected_canonical_path:anchor+'expected-7plus1.json',expected_canonical_sha256:digest(anchor+'expected-7plus1.json'),expected_IR_path:anchor+'expected-boundary-ir.json',expected_IR_sha256:digest(anchor+'expected-boundary-ir.json'),source_ambiguity:'上述材料 retained; accepted B UNRESOLVED',status_not_changed:'GOLDEN_CONFIRMED'},cases};
write(out+'SHORT-SINGLE-WP-BENCHMARK.json',r);write(out+'BENCHMARK-FREEZE.json',{before_hybrid:true,sha256:digest(out+'SHORT-SINGLE-WP-BENCHMARK.json'),cases:cases.map(c=>({id:c.id,source_sha256:c.source_sha256,expected_sha256:hash(JSON.stringify(c.expected))})),runtime_files:read(oldOut+'IMPLEMENTATION-FREEZE.json').files});write(out+'MODEL-MANIFESTS.json',read(oldOut+'MODEL-MANIFESTS.json'));write(out+'PACK-MANIFESTS.json',read(oldOut+'PACK-MANIFESTS.json'));write(out+'PROPOSAL-SCHEMA.json',read(oldOut+'PROPOSAL-SCHEMA.json'));write(out+'NORMATIVE-READING.json',{complete_current_task_read:true,method_sections_1_to_50_read:true,method_sha256:digest('docs/BoundaryXP-7plus1-定义原理语义编译与边界计算说明-v0.3.md'),task_sha256:digest('docs/tasks/7plus1/7P-HYBRID-015.md'),old_experiment_unchanged:true,LONG_MULTI_WP_DIAGNOSTIC_ONLY:oldOut,latest_short_contract_governs_acceptance:true});console.log(JSON.stringify({cases:cases.map(c=>({id:c.id,codepoints:c.codepoints})),sha256:digest(out+'SHORT-SINGLE-WP-BENCHMARK.json')}));
