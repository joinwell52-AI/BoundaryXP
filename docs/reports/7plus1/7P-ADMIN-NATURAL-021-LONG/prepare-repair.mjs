import fs from 'node:fs';import assert from 'node:assert/strict';import {OUT,ROOT,OLD,read,write,digest,sha} from './common.mjs';
assert.ok(fs.existsSync(OUT+'FIRST-BLIND-SEAL.md'));assert.ok(!fs.existsSync(ROOT));
for(const line of fs.readFileSync(OUT+'FIRST-BLIND-SHA256SUMS.txt','utf8').trim().split('\n')){const hash=line.slice(0,64),p=line.slice(66);assert.equal(digest(p),hash);}
const controls=[
 ['NORM-P1','ACTOR_PREFIX','POSITIVE','请 TEAM811 读取 copper.csv，生成 copper-note.md。',{inputs:['copper.csv'],outputs:['copper-note.md'],actor:'TEAM811'}],
 ['NORM-P2','ACTOR_PREFIX','POSITIVE','请检验员沈卓查看 violet.json，并生成 violet-check.md。',{inputs:['violet.json'],outputs:['violet-check.md'],actor:'检验员沈卓'}],
 ['NORM-P3','ACTOR_PREFIX','POSITIVE','Please TEAM812 read cyan.txt and create cyan-review.md.',{inputs:['cyan.txt'],outputs:['cyan-review.md'],actor:'TEAM812'}],
 ['NORM-N1','ACTOR_PREFIX','NEGATIVE','读取 maple.csv，生成 maple.md。',{inputs:['maple.csv'],outputs:['maple.md'],no_actor:true}],
 ['NORM-N2','ACTOR_PREFIX','NEGATIVE','文档中说明“请 TEAM813 删除 pine.csv”。',{no_execution:true}],
 ['NORM-U1','ACTOR_PREFIX','AMBIGUITY','TEAM814 与 TEAM815 各自生成报告，然后将该报告交给 TEAM816。',{unresolved:true,no_guessed_transfer:true}],
 ['LEX-P1','LEXICAL_FRAME','POSITIVE','TEAM817 比较 amber-a.json 与 amber-b.json，并生成 amber-diff.md。',{inputs:['amber-a.json','amber-b.json'],outputs:['amber-diff.md'],actor:'TEAM817',action:'compare'}],
 ['LEX-P2','LEXICAL_FRAME','POSITIVE','Iris reads bronze.csv and creates bronze-review.md.',{inputs:['bronze.csv'],outputs:['bronze-review.md'],actor:'Iris'}],
 ['LEX-P3','LEXICAL_FRAME','POSITIVE','TEAM818 检查 moss.json，输出 moss-review.md。',{inputs:['moss.json'],outputs:['moss-review.md'],actor:'TEAM818'}],
 ['LEX-N1','LEXICAL_FRAME','NEGATIVE','TEAM819 查看 metadata.csv 中的生成时间，生成 meta-note.md。',{outputs:['meta-note.md'],no_output:'时间',actor:'TEAM819'}],
 ['LEX-N2','LEXICAL_FRAME','NEGATIVE','TEAM820 检查 inspect-label.json，并生成 label-note.md。',{inputs:['inspect-label.json'],outputs:['label-note.md'],no_literal_predicate:true}],
 ['LEX-U1','LEXICAL_FRAME','AMBIGUITY','TEAM821 生成 south.md 和 north.md，随后复核该报告。',{unresolved:true,no_guessed_review:true}],
 ['COORD-P1','COORDINATION','POSITIVE','不得修复或重写训练数据。',{forbid_senses:['repair','rewrite'],shared_object:'训练数据'}],
 ['COORD-P2','COORDINATION','POSITIVE','不得清空队列或重启代理。',{forbid_senses:['clear','restart'],forbid_objects:['队列','代理']}],
 ['COORD-P3','COORDINATION','POSITIVE','Do not restart or stop the worker.',{forbid_senses:['restart','stop'],shared_object:'the worker',no_stop_completion:true}],
 ['COORD-N1','COORDINATION','NEGATIVE','TEAM822 检查更新记录和生成时间，生成 timing-review.md。',{outputs:['timing-review.md'],no_output:'时间',actor:'TEAM822'}],
 ['COORD-N2','COORDINATION','NEGATIVE','文档必须写明“不得修复或重写源数据”。',{no_execution:true}],
 ['COORD-U1','COORDINATION','AMBIGUITY','读取 oak.csv 与 birch.csv，随后修复或重写其中一个。',{unresolved:true,no_guessed_object:true}]
].map(([id,mechanism,kind,source,expect])=>({id,mechanism,kind,source,expect}));
write(OUT+'development/r01/CONTROLS.json',{controls,source_authoring:'New independent lexical/syntactic contrasts, authored before candidate creation; no case IDs or answers imported into runtime.'});
write(OUT+'development/r01/CONTROL-FREEZE.json',{frozen_at:new Date().toISOString(),sha256:digest(OUT+'development/r01/CONTROLS.json'),total:18,per_mechanism:{ACTOR_PREFIX:{positive:3,negative:2,ambiguity:1},LEXICAL_FRAME:{positive:3,negative:2,ambiguity:1},COORDINATION:{positive:3,negative:2,ambiguity:1}}});
write(OUT+'development/r01/HYPOTHESIS.json',{hypothesis:'Source-preserving lemma candidates, polite-prefix separation, typed nominal-vs-predicate filtering and coordinated complement sharing close naturally phrased root frames without entity-specific repair.',primary_semantic_gate:'Full same-case source-supported natural Canonical 7+1 closure',baseline:16,minimum_expected_delta:5,falsification:'Fewer than five newly fully closed cases, or new unsupported/wrong resolved facts in controls/retention.',stop_rule:'Two consecutive rounds without substantive primary improvement require stopping this repair line under normative v0.3 section 54.',changes_allowed:['local finite predicate sense candidates','evidence-licensed actor prefix','same-layer coordinated predicate arguments'],not_allowed:['projection changes','pack/model/threshold changes','case ID/hash/offset/identity literals']});
fs.mkdirSync(ROOT,{recursive:true});for(const f of read(OLD+'candidate-freezes/2.json').own_runtime_files){const name=f.path.split('/').at(-1);const dest=ROOT+name;assert.equal(digest(f.path),f.sha256);fs.copyFileSync(f.path,dest);}
write(OUT+'development/r01/COPY-PROVENANCE.json',{source_candidate:read(OLD+'candidate-freezes/2.json').candidate_hash,files:fs.readdirSync(ROOT).map(name=>({path:ROOT+name,sha256:digest(ROOT+name)})),first_blind_sealed_before_copy:true});console.log('CONTROLS_FROZEN_THEN_CANDIDATE_COPIED');
