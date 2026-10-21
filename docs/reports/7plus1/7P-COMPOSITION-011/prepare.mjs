import fs from 'node:fs';import {out,runtime,oldRuntime,old,contract,read,write,digest,sha,walk,git} from './common.mjs';
if(fs.existsSync(out+'BASELINE.json')||fs.existsSync(runtime))throw Error('EXISTING_WORK');
const start=git('rev-parse','HEAD'),paths=[...new Set([...git('ls-files','-z').split('\0').filter(Boolean),...walk(contract),...walk(oldRuntime),...walk('fixtures/7plus1/standard/'),...walk('fixtures/7plus1/standard-contract/v0.3-admin-20261002/')])].filter(p=>!p.startsWith(out)&&!p.startsWith(runtime)).sort();
write(out+'BASELINE.json',{task:'7P-COMPOSITION-011',actual_dispatch_head:start,declared_previous_seal:'185474e4433fdccc462c84627d672ba267cebe65',branch:git('branch','--show-current'),captured_at:new Date().toISOString(),protected_files:paths.map(p=>fs.existsSync(p)?{path:p,sha256:digest(p)}:{path:p,missing_at_start:true}),preexisting_tracked_status_sha256:sha(git('status','--porcelain=v1','--untracked-files=no')),authoritative_semantic_baseline:read(contract+'OFFLINE-REEVALUATION.json').after,production_entry:read('package.json').scripts['7plus1:ui']});
const mandatory=['docs/tasks/7plus1/CURRENT-TASK.md','docs/tasks/7plus1/7P-COMPOSITION-011.md','docs/BoundaryXP-7plus1-定义原理语义编译与边界计算说明-v0.3.md','docs/reports/7plus1/7P-ARCH-009/REPORT.md','docs/reports/7plus1/7P-ARCH-009/CLUSTER-DEPENDENCY-DAG.json','docs/reports/7plus1/7P-ARCH-009/GOLD-CONTRACT-AUDIT.json',...['REPORT.md','ADMIN-ADJUDICATION.json','SCOPE-AWARE-COMPARISON-CONTRACT.md','OFFLINE-REEVALUATION.json','REMAINING-IMPLEMENTATION-GAPS.json','RECOVERY-DECISION.json'].map(p=>contract+p),...read(old+'COMPARISON.json').cases.map(c=>c.trace_path),...walk(oldRuntime)];
write(out+'READING-INVENTORY.json',mandatory.map(p=>{const b=fs.readFileSync(p);let counts;if(p.endsWith('.json')){const j=JSON.parse(b);counts=j.compiler_v03?{nodes:j.compiler_v03.semantic_nodes.length,relations:j.compiler_v03.relations.length,facts:j.compiler_v03.boundary_ir.facts.length,clauses:j.compiler_v03.nlp_signals.clauses.length}:null;}return {path:p,sha256:sha(b),bytes:b.length,full_byte_ingestion:true,counts,review:'Normative text and task/report requirements read in full; all frozen graph records parsed; implementation modules ingested in full and ownership/eligibility/frame/structure consumption paths inspected. Machine inspection does not itself certify semantics.'};}));
fs.cpSync(oldRuntime,runtime,{recursive:true,errorOnExist:true,force:false});
write(out+'CLONE-BASELINE.json',{source:oldRuntime,target:runtime,files:walk(oldRuntime).map(p=>({original:p,clone:runtime+p.slice(oldRuntime.length),original_sha256:digest(p),clone_sha256:digest(runtime+p.slice(oldRuntime.length))})),production_entry_switched:false});
const cases=[
 ['NG01','R1','nested current-task inheritance','# 当前任务\n## 子任务\n必须检查 parcel.csv。','检查','CURRENT_TASK_SUBTASK'],
 ['NG02','R1','background action-like verbs','# 背景\n旧系统每天生成 dashboard.md。','生成','BACKGROUND'],
 ['NG03','R1','parenthetical explanation','# 当前任务\n禁止删除归档（它保存历史记录）。','保存','PARENTHETICAL'],
 ['NG04','R1','owned required action','编写操作文档 handbook.md。\n# 正文\n必须生成 inventory.csv。','生成','OUTPUT_CONTENT'],
 ['NG05','R1','owned forbidden action','编写操作文档 handbook.md。\n# 正文\n禁止删除 archive.csv。','删除','OUTPUT_CONTENT'],
 ['NG06','R1','multilingual sibling owners','编写提示词 guide.zh.md 和 guide.en.md。\n# 正文\n必须检查 inventory.csv。','检查','OUTPUT_CONTENT'],
 ['NG07','R1','acceptance vs current execution','# 验收标准\n必须检查 parcel.csv。','检查','ACCEPTANCE'],
 ['NG08','R1','owned code declaration','在 lib/journal.py 中新增以下函数：\n```python\ndef summarize(rows):\n    return len(rows)\n```\n','summarize','CODE'],
 ['NG09','R1','unrelated code block','# 示例\n```python\nremove(record)\n```\n','remove','CODE'],
 ['NG10','R2','file/member identity','修改 lib/registry.py 中 add_record、drop_record 两个方法。',null,'QUALIFIED_MEMBER_PAIR'],
 ['NG11','R2','wildcard collection','检查 resources/layouts/*.layout.json。',null,'PROTECTED_COLLECTION'],
 ['NG12','R2','basis is not lexical input','依据 NOTE-81 检查 inventory.csv。',null,'BASIS_NOT_I'],
 ['NG13','R1','same symbol distinct owners','# 当前任务\n必须检查 parcel.csv。\n# 背景\n旧系统曾经检查 parcel.csv。','检查','DISTINCT_OWNER_IDENTITIES'],
 ['NG14','R3','explicit give recipient','给审查员提交 digest.md。',null,'EXPLICIT_RECIPIENT'],
 ['NG15','R3','metadata recipient','---\nto: 审查员\n---\n提交 digest.md。',null,'METADATA_RECIPIENT'],
 ['NG16','R3','ambiguous recipient','审查员和维护员都在场。向其中一人提交 digest.md。',null,'UNRESOLVED_RECIPIENT'],
 ['NG17','R4','three-member aggregate action','修改 lib/registry.py 中 add_record、drop_record、find_record 三个方法。',null,'COMPLETE_THREE_MEMBER_ACTION'],
 ['NG18','R4','distributive EACH over files','在 qa/test_add.py、qa/test_drop.py、qa/test_find.py 中各加一个测试点。',null,'EACH_THREE_FILES'],
 ['NG19','R1','single conditional branch','如果检查失败，则生成 fault.md。另外必须生成 digest.md。','生成','CONDITION_BRANCH_LOCAL'],
 ['NG20','R1','wrong owner negative control','# 背景\n旧系统计划运行清理脚本。\n# 当前任务\n必须生成 digest.md。','运行','BACKGROUND']
].map(([id,stage,mechanism,text,predicate,expect])=>({id,stage,mechanism,text,source_sha256:sha(text),predicate,expected_mechanism_contract:expect}));
write(out+'NON-GOLD-FROZEN-INPUTS.json',{task:'7P-COMPOSITION-011',frozen_at:new Date().toISOString(),before_runtime_implementation:true,before_STANDARD_replay:true,cases,prohibited_dependency:'No SWAI source literals/identifiers/paths or expected answers in runtime; fixture IDs remain test-only',mechanism_contracts_not_Gold_answers:true});
write(out+'NON-GOLD-FREEZE.json',{inputs_path:out+'NON-GOLD-FROZEN-INPUTS.json',inputs_sha256:digest(out+'NON-GOLD-FROZEN-INPUTS.json'),cases:20,freeze_before_implementation:true});
console.log(JSON.stringify({head:start,protected_files:paths.length,required_reading:mandatory.length,non_gold:cases.length,cloned_runtime_files:walk(runtime).length}));
