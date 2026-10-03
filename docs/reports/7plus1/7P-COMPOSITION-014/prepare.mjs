import fs from 'node:fs';import crypto from 'node:crypto';import {execFileSync} from 'node:child_process';
const out='docs/reports/7plus1/7P-COMPOSITION-014/',prev='docs/reports/7plus1/7P-COMPOSITION-013/',runtime='research/7plus1-parser/v0.3-7p-composition-014/',original='research/7plus1-parser/v0.3-7p-composition-013/';
const sha=b=>crypto.createHash('sha256').update(b).digest('hex'),digest=p=>sha(fs.readFileSync(p)),read=p=>JSON.parse(fs.readFileSync(p)),walk=p=>fs.readdirSync(p,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(p+e.name+'/'):[p+e.name]),git=(...a)=>execFileSync('git',a,{encoding:'utf8',maxBuffer:180e6}).trim(),write=(p,v)=>{fs.mkdirSync(p.slice(0,p.lastIndexOf('/')),{recursive:true});fs.writeFileSync(p,typeof v==='string'?v:JSON.stringify(v,null,2)+'\n','utf8');};
if(fs.existsSync(out+'BASELINE.json')||fs.existsSync(runtime))throw Error('EXISTING_CANDIDATE');
const paths=git('ls-files','-z').split('\0').filter(Boolean).sort();write(out+'BASELINE.json',{task:'7P-COMPOSITION-014',actual_dispatch_head:git('rev-parse','HEAD'),branch:git('branch','--show-current'),captured_at:new Date().toISOString(),protected_files:paths.map(p=>fs.existsSync(p)?{path:p,sha256:digest(p)}:{path:p,missing_at_start:true}),preexisting_tracked_status_sha256:sha(git('status','--porcelain=v1','--untracked-files=no')),previous_diagnostic:read(prev+'FINAL-OUTCOME.json'),production_entry:read('package.json').scripts['7plus1:ui']});
const reading=['docs/tasks/7plus1/CURRENT-TASK.md','docs/tasks/7plus1/7P-COMPOSITION-014.md','docs/tasks/7plus1/7P-COMPOSITION-013.md','docs/BoundX-7plus1-定义原理语义编译与边界计算说明-v0.3.md','docs/reports/7plus1/7P-CONTRACT-010/SCOPE-AWARE-COMPARISON-CONTRACT.md',...['REPORT.md','FINAL-OUTCOME.json','R1-GATE.json','R2-IDENTITY-ROLE-AUDIT.json','R3-RECIPIENT-AUDIT.json','R4-COMPOSITION-CERTIFICATION-AUDIT.json','FIRST-DIVERGENCE.json','NON-GOLD-FROZEN-INPUTS.json'].map(p=>prev+p),...walk(prev+'replay-r4-final/'),...walk(original)];
write(out+'READING-INVENTORY.json',reading.map(path=>{const b=fs.readFileSync(path);if(path.endsWith('.json'))JSON.parse(b);return {path,bytes:b.length,sha256:sha(b),complete_ingestion:true};}));
const traces=read(prev+'replay-r4-final/INDEX.json').map(x=>{const t=read(x.trace_path),c=t.compiler_v03;return {case_id:x.case_id,sha256:digest(x.trace_path),nodes:c.semantic_nodes.length,relations:c.relations.length,facts:c.boundary_ir.facts.length,unresolved:c.unresolved.length,exact_spans:t.source_spans.every(s=>[...c.source.raw_text].slice(s.start,s.end).join('')===s.text),whole_frames:c.nlp_signals.semantic_decoding.whole_composition.frames};});
write(out+'PREVIOUS-AUDIT-READBACK.json',{R2:read(prev+'R2-IDENTITY-ROLE-AUDIT.json'),R3:read(prev+'R3-RECIPIENT-AUDIT.json'),R4:read(prev+'R4-COMPOSITION-CERTIFICATION-AUDIT.json'),traces});
fs.cpSync(original,runtime,{recursive:true,errorOnExist:true,force:false});
for(const name of ['common.mjs','run-tests.mjs','replay.mjs','controlled-performance.mjs','no-gold-access.mjs','non-gold-checks.mjs','acceptance-checks.mjs','verify-repeat.mjs','review-deltas.mjs','compare-replay.mjs','stage-checks.mjs','run-non-gold.mjs','seal.mjs','publish.mjs','audit.mjs','new-actual-review.mjs','certification-audit.mjs']){write(out+name,fs.readFileSync(prev+name,'utf8').replaceAll('7P-COMPOSITION-013','7P-COMPOSITION-014').replaceAll('v0.3-7p-composition-013','v0.3-7p-composition-014'));}
// Compatibility is rerun against this candidate, retaining the old assertions.
const ret=[...walk(prev+'retained-tests/'),...git('ls-files','tests/parser-7p-composition-013*').split('\n').filter(Boolean)];
for(const p of ret){const target=out+'retained-tests/'+p.split('/').at(-1);write(target,fs.readFileSync(p,'utf8').replaceAll('v0.3-7p-composition-013','v0.3-7p-composition-014').replaceAll('7P-COMPOSITION-013','7P-COMPOSITION-014'));}
const cases=[
 ['D01','three-file EACH + one per file','在 probe/a.py、probe/b.py、probe/c.py 中各加一个测试点。','CERTIFIED',3,1],
 ['D02','four-module EACH + two per module','请对 alpha、beta、gamma、delta 四个模块分别生成两个报告。','CERTIFIED',4,2],
 ['D03','English EACH','Add one check to each of probe/a.py, probe/b.py and probe/c.py.','CERTIFIED',3,1],
 ['D04','reversed order','请各生成一个记录到 probe/a.py、probe/b.py、probe/c.py 中。','CERTIFIED',3,1],
 ['D05','ALL aggregate is not EACH','请检查全部 probe/a.py、probe/b.py、probe/c.py。','NOT_DISTRIBUTIVE'],
 ['D06','ambiguous deictic set','输入包括 probe/a.py 和 probe/b.py。输入包括 probe/c.py 和 probe/d.py。请对这些文件各加一个测试点。','UNRESOLVED'],
 ['D07','missing quantity','请在 probe/a.py、probe/b.py 中各添加测试点。','UNRESOLVED',2,null],
 ['D08','output owned','编写操作规范 brief.md。\n## 正文\n请在 probe/a.py、probe/b.py、probe/c.py 中各加一个测试点。','OUTPUT_OWNED',3,1],
 ['D09','nested subtask owner','# 子任务甲\n请在 probe/a.py、probe/b.py 中各加一个测试点。\n# 子任务乙\n请检查 probe/c.py。','CERTIFIED',2,1],
 ['D10','background/example control','# 示例\n在 probe/a.py、probe/b.py 中各加一个测试点。','INERT'],
 ['D11','explicit exclusion','请在 probe/a.py、probe/b.py、probe/c.py 中除 probe/b.py 外各加一个测试点。','CERTIFIED',2,1],
 ['D12','conflicting quantities','请在 probe/a.py、probe/b.py 中各加一个或两个测试点。','UNRESOLVED'],
 ['D13','same file names different owner','# 子任务甲\n请在 probe/a.py、probe/b.py 中各加一个测试点。\n# 子任务乙\n请在 probe/a.py、probe/c.py 中各加一个测试点。','ISOLATED',2,1],
 ['D14','explicit imperative insertion','请在 probe/a.py、probe/b.py、probe/c.py 中各加一个测试点。','CERTIFIED',3,1],
 ['D15','non-imperative description','这些文件 probe/a.py、probe/b.py 曾各增加一个测试点。','INERT']
].map(([id,mechanism,text,status,members,quantity])=>({id,stage:'R4',family:'DISTRIBUTION',mechanism,text,expected_mechanism_contract:status,members,quantity,source_sha256:sha(text),new_in_014:true}));
const all=[...read(prev+'NON-GOLD-FROZEN-INPUTS.json').cases,...cases];write(out+'NON-GOLD-FROZEN-INPUTS.json',{task:'7P-COMPOSITION-014',frozen_at:new Date().toISOString(),before_runtime_implementation:true,before_STANDARD_replay:true,cases:all,mechanism_contracts_not_Gold_answers:true});
write(out+'NON-GOLD-FREEZE.json',{inputs_sha256:digest(out+'NON-GOLD-FROZEN-INPUTS.json'),cases:all.length,new_R4_cases:cases.length,freeze_before_implementation:true});
fs.mkdirSync(out+'non-gold-signals',{recursive:true});for(const x of all.filter(x=>!x.new_in_014))fs.copyFileSync(prev+'non-gold-signals/'+x.id+'.json',out+'non-gold-signals/'+x.id+'.json');
console.log(JSON.stringify({prepared:true,protected_files:paths.length,new_cases:cases.length,retained_files:ret.length,prior_trace_nodes:traces.reduce((n,x)=>n+x.nodes,0)}));
