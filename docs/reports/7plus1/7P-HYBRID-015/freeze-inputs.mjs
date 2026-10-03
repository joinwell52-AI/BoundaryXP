import fs from 'node:fs';import {out,runtime,control,write,digest,read} from './common.mjs';
if(read(out+'MODEL-PREFLIGHT.json').status!=='PASS')throw Error('MODEL_PROPOSER_UNAVAILABLE');
const rows=[
 ['中文读取','必须读取 roster.csv。','PATIENT'],
 ['English read','The operator must read inventory.json.','PATIENT'],
 ['中文交付','必须生成 snapshot.md。','RESULT'],
 ['English output','You must generate findings.json.','RESULT'],
 ['禁止访问','不得访问核心数据库。','FORBIDS'],
 ['English prohibition','Do not modify secrets.yaml.','FORBIDS'],
 ['背景','## 背景\n旧脚本读取 legacy.log。\n## 当前任务\n必须读取 current.log。','PATIENT'],
 ['example','## Example\nThe old agent generates pretend.md.\n## Current task\nYou must generate actual.md.','RESULT'],
 ['输出内容','必须编写 guide.md。\n## guide.md 内容要求\n在 guide.md 中要求机器人读取 future.csv。','PATIENT'],
 ['owned English','Create manual.md.\n## Contents of manual.md\nThe future operator must read remote.log.','PATIENT'],
 ['验收','必须生成 check.md。\n## 验收\n仅当全部检查通过才算完成。','RESULT'],
 ['acceptance','You must create status.md.\n## Acceptance\nOnly when both reviews pass is the task complete.','RESULT'],
 ['代码域','必须创建 helper.py。\n```python\n# must delete archive.csv\nremove("archive.csv")\n```','RESULT'],
 ['表格','## 当前任务\n| 对象 | 操作 |\n| --- | --- |\n| intake.csv | 必须读取 |','PATIENT'],
 ['跨章节依据','## 依据\n按照 POLICY-712 执行。\n## 当前任务\n必须读取 sample.csv。','BASIS'],
 ['plain reference','请生成 review.md。\n背景提及 ISSUE-804，但它不是当前依据。','RESULT'],
 ['文件集合','必须读取 alpha.csv、beta.csv 和 gamma.csv。','PATIENT'],
 ['wildcard','必须检查 source/*.json；不得修改这些文件。','FORBIDS'],
 ['版本依据','依据规范 v6.2.0 执行核验。','BASIS'],
 ['recipient','You must send dispatch.md to the review officer.','RECIPIENT'],
 ['接收者','必须向复核负责人发送 assessment.md。','RECIPIENT'],
 ['条件','如果 manifest.json 缺失，则必须生成 alert.md。','RESULT'],
 ['conditional ban','If approval is missing, do not deploy the release.','FORBIDS'],
 ['唯一指代','输入为 left.csv 和 right.csv。必须读取上述文件。','PATIENT'],
 ['歧义指代','输入为 red.csv 和 blue.csv。另有 green.csv 和 black.csv。不得删除这些文件。','FORBIDS'],
 ['each 中文','在 a.py、b.py 和 c.py 中各加一个测试点。','PATIENT'],
 ['each English','Add one check to each of fileA.py, fileB.py and fileC.py.','PATIENT'],
 ['嵌套长任务','## 子任务 校验\n必须读取 manifest.yaml。\n### 交付\n必须生成 report-a.md。\n## 子任务 汇总\n必须读取 bundle.json。必须生成 report-b.md。\n## 背景\n旧流程向管理员发送 legacy.md。','RESULT'],
 ['owner conflict','Create draft-a.md and draft-b.md.\n## Contents\nIn one of those documents the future agent must delete temp.csv.','FORBIDS'],
 ['义务撤回','无需生成 optional.md。必须读取 main.csv。','PATIENT']
];
const cases=rows.map(([family,text,role],i)=>({id:'H'+String(i+1).padStart(2,'0'),family,text,source_sha256:null,expected:{probe_role:role,recall_measurement:'Report whether a model-ranked proposal covers this relation kind; no universal semantic-completeness claim.',mechanism_contract:['SOURCE_EXACT','RELATION_SIGNATURE','NO_MODEL_TO_IR','NO_UNSUPPORTED_RESOLVED','OWNER_SCOPE_PRESERVED','AMBIGUITY_RETAINED'],safety_mutations:['FALSE_SOURCE_SPAN','FORGED_OWNER','INVERTED_ROLE','BORROWED_SCOPE','REFERENCE_AS_INPUT','COMPETING_ENDPOINT']}}));
write(out+'NON-GOLD-FROZEN-INPUTS.json',{task:'7P-HYBRID-015',cases});write(out+'NON-GOLD-FREEZE.json',{task:'7P-HYBRID-015',inputs_sha256:digest(out+'NON-GOLD-FROZEN-INPUTS.json'),case_count:cases.length,created_before_STANDARD:true,expected_contracts_frozen:true,LLM:'NOT_USED',blind_inputs:'NOT_USED'});
let engine=fs.readFileSync(control+'engine.mjs','utf8').replaceAll("from './","from '../v0.3-7p-composition-014/");
engine=engine.replace('const f=closeEdges(candidateGraph(doc,signals));','const pre=candidateGraph(doc,signals); if(options.admission)options.admission(pre); const f=closeEdges(pre);').replaceAll('v0.3-7p-composition-014\'',"v0.3-7p-hybrid-015'").replace("compiler_version:'0.3-7p-composition-014'","compiler_version:'0.3-7p-hybrid-015'");
write(runtime+'engine.mjs',engine);console.log(JSON.stringify({cases:cases.length,freeze_sha256:digest(out+'NON-GOLD-FROZEN-INPUTS.json')}));
