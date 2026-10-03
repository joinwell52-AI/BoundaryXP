import fs from 'node:fs';import crypto from 'node:crypto';import {execFileSync} from 'node:child_process';
import {RELATION_CONTRACT} from '../../../../research/7plus1-parser/v0.3-7p-composition-014/relations.mjs';
const out='docs/reports/7plus1/7P-ADMIN-SHORT-018-R1/';
const sha=b=>crypto.createHash('sha256').update(b).digest('hex'),digest=p=>sha(fs.readFileSync(p)),git=(...args)=>execFileSync('git',args,{encoding:'utf8',maxBuffer:100e6}).trim();
if(fs.existsSync(out+'BASELINE.json'))throw Error('BASELINE_EXISTS');
if(git('branch','--show-current')!=='review/7plus1-parser')throw Error('WRONG_BRANCH');
const write=(name,data)=>fs.writeFileSync(out+name,JSON.stringify(data,null,2)+'\n');
write('BASELINE.json',{task:'7P-ADMIN-SHORT-018-R1',created_at:new Date().toISOString(),commit:git('rev-parse','HEAD'),tracked_dirty_status:git('status','--porcelain=v1','-uno'),tracked:git('ls-files','-z').split('\0').filter(Boolean).map(path=>({path,sha256:fs.existsSync(path)?digest(path):null})),production_parser_entry:JSON.parse(fs.readFileSync('package.json')).scripts['7plus1']});
const method='docs/BoundX-7plus1-定义原理语义编译与边界计算说明-v0.3.md',text=fs.readFileSync(method,'utf8');
const normative=text.match(/AGENT\s+PATIENT\s+THEME\s+RESULT\s+RECIPIENT\s+LOCATION[\s\S]*?PART_OF/u)?.[0].trim().split(/\s+/u);if(!normative||normative.length!==20)throw Error('METHOD_LIST_NOT_EXACT');
write('METHOD-RUNTIME-CONTRACT-DIFF.json',{created_before_candidate_code:true,method,method_sha256:digest(method),normative,implementation:'research/7plus1-parser/v0.3-7p-composition-014/relations.mjs',runtime_sha256:digest('research/7plus1-parser/v0.3-7p-composition-014/relations.mjs'),runtime:Object.keys(RELATION_CONTRACT),missing:normative.filter(t=>!RELATION_CONTRACT[t]),PART_OF:{normative:true,runtime:false,authorized_candidate_only:true},extra_missing_types_authorized:false,classification:'IMPLEMENTATION_CONTRACT_GAP',projection_change:false});
write('ADMIN-ADJUDICATION-READBACK.json',{task:'7P-ADMIN-SHORT-018-R1',adjudication:'docs/tasks/7plus1/7P-ADMIN-SHORT-018-R1-ADMIN-ADJUDICATION.md',sha256:digest('docs/tasks/7plus1/7P-ADMIN-SHORT-018-R1-ADMIN-ADJUDICATION.md'),parent_seal_preserved:true,parent_method_gap_verdict_superseded_for_PART_OF:true,scope:['PART_OF','QualifiedDomain','review-owned compound qualifiers','unique typed source identity'],G1_G2_G3_holdout:'NOT_AUTHORIZED',stop_even_if_G0_passes:true});
const controls=[
 {id:'A1',gate:'A',source:'ENG 读取 catalog.tsv，检查其中所有条目的评分。',expect:{member:'条目',property:'评分',base:'catalog.tsv',quantifier:'ALL'}},
 {id:'A2',gate:'A',source:'ENG 读取 north.tsv 和 south.tsv，检查其中所有条目的评分。',expect:{ambiguous_domain:true}},
 {id:'A3',gate:'A',source:'请生成 guide.txt，文档必须包含准备章节。',expect:{section:'准备',output:'guide.txt'}},
 {id:'A4',gate:'A',source:'ENG 读取 catalog.tsv，检查路由状态。',expect:{part_of:0}},
 {id:'A5',gate:'A',source:'ENG must read manifest.tsv and check all entries in the manifest.',expect:{member:'entries',base:'manifest.tsv',quantifier:'ALL'}},
 {id:'B1',gate:'B',source:'COORD 安排 ENG 读取 ledger.tsv，检查其中所有样本的评估结果，生成 evidence.txt。AUD 确认报告覆盖清单中的每一项后，COORD 向 DIRECTOR 提交报告。',expect:{member:'样本',property:'评估结果',base:'ledger.tsv',quantifier:'ALL',review_domain:true,output:'evidence.txt'}},
 {id:'B2',gate:'B',source:'ENG 读取 records.tsv，检查其中全部记录的状态，生成 status.txt。AUD 确认报告覆盖清单中的每一项后，COORD 向 DIRECTOR 提交报告。',expect:{member:'记录',property:'状态',base:'records.tsv',quantifier:'ALL',review_domain:true,output:'status.txt'}},
 {id:'C1',gate:'C',source:'ENG 读取 definitions.tsv，生成 delta.txt。AUD 确认每个删除或改名的字段都已记录后，COORD 将报告交给 DIRECTOR。',expect:{qualifier:'OR',states:['DELETED','RENAMED'],member:'字段',output:'delta.txt'}},
 {id:'C2',gate:'C',source:'ENG 读取 manifest.tsv，生成 diff.txt。AUD 确认每个新增或移除的条目都已记录后，COORD 将报告交给 DIRECTOR。',expect:{qualifier:'OR',states:['ADDED','REMOVED'],member:'条目',output:'diff.txt'}},
 {id:'C3',gate:'C',source:'ENG 读取 definitions.tsv，生成 state.txt。AUD 确认每个删除且改名的字段都已记录后，COORD 将报告交给 DIRECTOR。',expect:{qualifier:'AND',states:['DELETED','RENAMED'],member:'字段',output:'state.txt'}},
 {id:'C4',gate:'C',source:'请生成 note.txt，文档须写入“deleted”。',expect:{no_qualifier:true,no_delete_action:true}},
 {id:'C5',gate:'C',source:'ENG 必须删除 scratch.txt。',expect:{delete_action:'scratch.txt'}},
 {id:'D1',gate:'D',source:'ENG 读取 payments.tsv，生成 quality.txt。不得更改原始数据。',expect:{identity:'payments.tsv',alias:'原始数据'}},
 {id:'D2',gate:'D',source:'ENG 读取 first.tsv 和 second.tsv。不得更改原始数据。',expect:{identity_ambiguous:true,alias:'原始数据'}},
 {id:'D3',gate:'D',source:'ENG 读取 definition.yaml。不得修改原始文件。',expect:{identity:'definition.yaml',alias:'原始文件'}},
 {id:'D4',gate:'D',source:'Rita must read readings.tsv. Do not modify source data.',expect:{identity:'readings.tsv',alias:'source data'}},
 {id:'D5',gate:'D',source:'ENG 读取 raw.tsv，生成 derived.txt。不得删除原始数据。',expect:{identity:'raw.tsv',alias:'原始数据',not_identity:'derived.txt'}},
 {id:'D6',gate:'D',source:'# 背景\n历史原始数据已经归档。\n# 当前任务\nENG 读取 current.tsv，生成 summary.txt。',expect:{identity_count:0}}
];
write('NON-GOLD-CONTROLS.json',{status:'FROZEN_BEFORE_IMPLEMENTATION',created_at:new Date().toISOString(),official_gold:false,controls:controls.map(c=>({...c,source_sha256:sha(c.source)})),sha256:sha(JSON.stringify(controls))});
console.log(JSON.stringify({audit_written:true,missing:normative.filter(t=>!RELATION_CONTRACT[t]),controls:controls.length}));
