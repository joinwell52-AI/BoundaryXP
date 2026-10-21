import fs from 'node:fs';import {execFileSync} from 'node:child_process';
import {OUT,ROOT,sha,digest,write,groups,source,caseId} from './common.mjs';
if(fs.existsSync(OUT+'BASELINE.json'))throw Error('Already prepared');
const git=(...args)=>execFileSync('git',args,{encoding:'utf8',maxBuffer:64e6}).trim();
if(git('branch','--show-current')!=='review/7plus1-parser')throw Error('WRONG_BRANCH');
const tracked=git('ls-files','-z').split('\0').filter(Boolean).map(path=>({path,sha256:fs.existsSync(path)?digest(path):null}));
write(OUT+'BASELINE.json',{task:'7P-ADMIN-SHORT-018',created_at:new Date().toISOString(),commit:git('rev-parse','HEAD'),requested_baseline_commit:'5219eb5f28cb1e3bdb2b47f29784cc0428bfe8ce',incoming_commit_changes:'Only taskbook and CURRENT-TASK.md',tracked,tracked_dirty_status:git('status','--porcelain=v1','-uno'),production_parser_entry:JSON.parse(fs.readFileSync('package.json')).scripts['7plus1'],baseline_engine:'research/7plus1-parser/v0.3-7p-short-direct-016-r2/engine.mjs',baseline_engine_sha256:digest('research/7plus1-parser/v0.3-7p-short-direct-016-r2/engine.mjs'),sources:Array.from({length:50},(_,i)=>({case_id:caseId(i+1),sha256:sha(source(i+1))}))});
write(OUT+'METHOD-CONTRACT.json',{method:'docs/BoundaryXP-7plus1-定义原理语义编译与边界计算说明-v0.3.md',method_sha256:digest('docs/BoundaryXP-7plus1-定义原理语义编译与边界计算说明-v0.3.md'),hypothesis:'Explicit local actor/predicate licensing, exact literal argument domains and root-role constraints can repair G0 without altering QI–QB, inventing WP or importing expected values.',primary_gate:'5/5 FULL_ROOT_7PLUS1_CLOSED on G0 plus independent controls',minimum_delta:'Missing explicit file arguments and roles recovered with no new unsupported RESOLVED facts; full closure rather than component counts decides continuation.',falsification:'Any unsupported binding, unresolved clear source fact or missing explicit gate semantics prevents G0 closure.',stop_rule:'G1–G3 and holdout remain blocked unless preceding gate has source-by-source full closure; if bounded class-level repair leaves genuine method gaps, seal ADMIN_SHORT_CORE_METHOD_GAP rather than launch another phrase patch.',class:'ADMIN_ROOT_SINGLE_AUTHORITY_SCOPE',WP_decomposition:false,model_changes:false,hybrid:false,production_switch:false,expected_runtime_reads:false,groups});
// Independent authoring is completed before candidate implementation or G0 replay.
const controls=[
 {id:'A1',class:'A',gate:'G0',source:'ENG 必须读取 hosts.tsv，并生成 host-audit.txt。不得修改 hosts.tsv。',expect:{I:['hosts.tsv'],O:['host-audit.txt'],B:['modify|hosts.tsv']}},
 {id:'A2',class:'A',gate:'G0',source:'AUD 读取 east.json 和 west.json，生成 comparison.txt。不得删除 archive.zip。',expect:{I:['east.json','west.json'],O:['comparison.txt'],absent_input:['archive.zip']}},
 {id:'A3',class:'A',gate:'G0',source:'Rita must read registry.tsv and generate registry-note.txt. Send the report to COORD. Do not modify registry.tsv.',expect:{I:['registry.tsv'],O:['registry-note.txt'],absent_input:['COORD']}},
 {id:'B1',class:'B',gate:'G0',source:'ENG 读取 manifest.txt，生成 finding.txt，并交给 AUD 复核。',expect:{P:{ENG:['PERFORMER'],AUD:['REVIEWER']},O:['finding.txt']}},
 {id:'B2',class:'B',gate:'G0',source:'COORD 安排 ENG 读取 table.tsv，生成 overview.txt。',expect:{P:{COORD:['COLLABORATOR'],ENG:['PERFORMER']},I:['table.tsv'],O:['overview.txt']}},
 {id:'B3',class:'B',gate:'G0',source:'ENG 可以检查 dossier.txt，必须生成 optional-note.txt。',expect:{A:['PERMITTED|review|dossier.txt','REQUIRED|generate|optional-note.txt']}},
 {id:'C1',class:'C',gate:'G0',source:'ENG 读取 limits.tsv，生成 budget-note.txt。整个任务须在 17 分钟内完成。',expect:{R:{metric:'TIME',value:17,unit:'分钟',target:'TASK'},absent_completion:true}},
 {id:'C2',class:'C',gate:'G0',source:'Please inspect queue.tsv and generate queue-note.txt. The entire task must finish within 23 minutes.',expect:{R:{metric:'TIME',value:23,unit:'minutes',target:'TASK'},absent_completion:true}},
 {id:'C3',class:'C',gate:'G0',source:'ENG 读取 timing.tsv，生成 timing-note.txt。整个检查不得超过 11 分钟。',expect:{R:{metric:'TIME',value:11,unit:'分钟',target:'TASK'},absent_completion:true}},
 {id:'D1',class:'D',gate:'G0',source:'ENG 读取 record.tsv，生成 summary.txt。只有全部记录都检查完且报告已生成，任务才完成。',expect:{C:{op:'AND',objects:['record.tsv','summary.txt'],quantifier:'ALL'}}},
 {id:'D2',class:'D',gate:'G0',source:'ENG 读取 sample.tsv，生成 quality.txt。AUD 确认报告覆盖清单中的每一项后，COORD 向 DIRECTOR 提交报告。',expect:{conditioned_transfer:true,reviewer:'AUD',owner:'quality.txt',quantifier:'ALL'}},
 {id:'D3',class:'D',gate:'G0',source:'ENG 读取 interfaces.tsv，生成 compatibility.txt。AUD 确认每个删除或改名的接口都已记录后，COORD 将报告交给 DIRECTOR。',expect:{conditioned_transfer:true,reviewer:'AUD',owner:'compatibility.txt',quantifier:'ALL',not_actions:['删除','改名']}},
 {id:'E1',class:'E',gate:'G3',source:'请生成 handbook.txt，文档须列出新增和移除的字段。不得移除字段。',expect:{owned_content:true,not_actions:['移除']}},
 {id:'E2',class:'E',gate:'G3',source:'请编写 tutorial.txt，在文档中写入“停止服务”。不得停止服务。',expect:{owned_content:true,not_actions:['停止']}},
 {id:'E3',class:'E',gate:'G3',source:'请生成 checklist.txt，文档必须包含准备和验收两个章节。',expect:{owned_content:true,sections:2}},
 {id:'F1',class:'F',gate:'G0',source:'ENG 必须读取 catalog.tsv。不得修改 catalog.tsv，也不得连接生产网络。',expect:{B:['modify|catalog.tsv','connect|生产网络'],absent_input:['生产网络']}},
 {id:'F2',class:'F',gate:'G0',source:'Please read report.tsv. Do not delete report.tsv or change settings.ini.',expect:{B:['delete|report.tsv','modify|settings.ini'],absent_input:['settings.ini']}},
 {id:'F3',class:'F',gate:'G0',source:'ENG 读取 model-index.tsv，生成 check.txt。不得加载模型或发起推理。',expect:{B:['load|模型','run|推理'],absent_input:['模型','推理']}}
];
write(OUT+'NON-GOLD-CONTROLS.json',{status:'FROZEN_BEFORE_IMPLEMENTATION',created_at:new Date().toISOString(),official_gold:false,controls:controls.map(c=>({...c,source_sha256:sha(c.source)})),artifact_sha256:sha(JSON.stringify(controls)),coverage:'3 independently authored controls per semantic class; E reserved for G3. They are tests, never parser inputs beyond raw source.'});
console.log('PREPARED '+tracked.length+' protected paths; '+controls.length+' frozen controls; candidate exists='+fs.existsSync(ROOT));
