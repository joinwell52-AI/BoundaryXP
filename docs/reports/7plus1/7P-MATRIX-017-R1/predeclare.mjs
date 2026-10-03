import fs from 'node:fs';import {out,write,digest,cases} from './common.mjs';
if(fs.existsSync(out+'NON-GOLD-ORCHESTRATION-TESTS.json'))throw Error('Frozen inputs exist');
const basic='第一阶段读取 alpha.dat，生成 beta.dat。第二阶段读取 gamma.dat，生成 delta.dat。';
const tests=[
 {id:'N01',text:basic+'两个阶段可并行。',expected:{parallel:true,sequence:false}},
 {id:'N02',text:basic+'两个阶段同时进行。',expected:{parallel:true,sequence:false}},
 {id:'N03',text:basic+'两个阶段都完成后，汇总阶段开始。',expected:{parallel:false,sequence:false,join:true}},
 {id:'N04',text:'第一阶段读取 raw.dat，生成 checked.dat。第二阶段必须在第一阶段完成后开始。第二阶段读取 checked.dat，生成 delivery.dat。',expected:{parallel:false,sequence:true}},
 {id:'N05',text:'校对阶段读取 red.dat，生成 orange.dat。审查阶段读取 blue.dat，生成 green.dat。这两个阶段可以并行。',expected:{parallel:true,sequence:false}},
 {id:'N06',text:'校对阶段读取 shared.dat，生成 left.dat。审查阶段读取 shared.dat，生成 right.dat。两个阶段都完成后，汇总阶段开始。',expected:{parallel:false,sequence:false,join:true}}
];
write(out+'NON-GOLD-ORCHESTRATION-TESTS.json',{frozen_at:new Date().toISOString(),before_implementation:true,scope:'Syntax/source evidence at orchestration layer; full row NLP evaluated separately',cases:tests});
write(out+'HYPOTHESIS.json',{hypothesis:'Source-bounded stage ownership plus unchanged R2 local compilation can produce matrix cells and evidence-certified orchestration without inferring parallelism from absent order or a join.',primary_gate:'M01-M04 complete local and global semantics; short baseline retained',minimum_expected_delta:'2-WP M01 fully certified before G1; no unsupported edges',falsification:'Local R2 cannot certify a required item or orchestration cannot uniquely certify owner/identity/condition',stop_rule:'Progressive G0-G3; preserve failures and stop before long STANDARD. Do not weaken local semantic contracts to force row coverage.'});
const files=['docs/tasks/7plus1/CURRENT-TASK.md','docs/tasks/7plus1/7P-MATRIX-017-R1.md','docs/tasks/7plus1/7P-MATRIX-017.md','docs/tasks/7plus1/7P-MATRIX-017-M04-ADMIN-ADJUDICATION.md','docs/tasks/7plus1/7P-MATRIX-017-FROZEN-CASES.md','docs/BoundX-7plus1-定义原理语义编译与边界计算说明-v0.3.md'];write(out+'ADMIN-ADJUDICATION-READBACK.json',{files:files.map(path=>({path,sha256:digest(path)})),read_in_full:true,decision:'M04 removes only PARALLEL; no synthetic order or UNORDERED; M03 explicit PARALLEL retained',old_source_and_expected_preserved:true});
for(const c of cases())write(out+'frozen-inputs/'+c.id+'/source.txt',c.source);
console.log('Frozen six non-Gold orchestration probes and four source inputs');
