import fs from 'node:fs';import assert from 'node:assert/strict';import {execFileSync} from 'node:child_process';
import {OUT,ROOT,OLD,read,write,digest,walk} from './common.mjs';
assert.ok(!fs.existsSync(ROOT));assert.ok(!fs.existsSync(OUT+'BASELINE.json'));
const git=(...a)=>execFileSync('git',a,{encoding:'utf8',maxBuffer:100e6}).trim();assert.equal(git('branch','--show-current'),'review/7plus1-parser');
write(OUT+'BASELINE.json',{commit:git('rev-parse','HEAD'),tracked:git('ls-files','-z').split('\0').filter(Boolean).map(path=>({path,sha256:fs.existsSync(path)?digest(path):null})),dirty_status:git('status','--porcelain=v1','-uno'),production_entry:read('package.json').scripts['7plus1'],parent_seal_sha256:digest(OLD+'SEAL.md')});
write(OUT+'ADMIN-AUTHORIZATION-READBACK.json',{task:'7P-ADMIN-SHORT-020-LONG',authorization_sha256:digest('docs/tasks/7plus1/7P-ADMIN-SHORT-020-LONG-ADMIN-AUTHORIZATION.md'),method_sha256:digest('docs/BoundX-7plus1-定义原理语义编译与边界计算说明-v0.3.md'),hypothesis:'Source-preserving normalized predicate senses and typed scope/flow/completion/quantity domains remove inconsistent consumer lexical gates without direct slot generation.',primary_gate:'50/50 + old shadow100/100 + all controls, then two consecutive fresh120/120 suites on one frozen candidate',minimum_delta:'All eight old shadow failures close with full provenance; no new false RESOLVED',falsification:'Repeated independently frozen suites expose a recurring unsupported composition after generic redesign',max_failed_blind_repair_cycles:3,stop:'Taskbook terminal outcome, not ordinary parser failure',production_switch:false,LLM:'NOT_USED'});
const gaps=read(OLD+'SHADOW-SUITE-RESULTS.json').rows.filter(r=>r.status!=='PASS'),suite=read(OLD+'SHADOW-SUITE-r02.json');
write(OUT+'KNOWN-GAPS-019.json',{status:'DEVELOPMENT_REGRESSION_FROM_019_SHADOW',parent_commit:'4d358fa5de5f224865fe7592459b06b9c6216204',items:gaps.map(r=>({...r,case:suite.cases.find(c=>c.id===r.id),trace_path:OLD+'shadow-runs/final-r01/'+r.id+'/trace.json',trace_sha256:digest(OLD+'shadow-runs/final-r01/'+r.id+'/trace.json'),review_path:OLD+'shadow-runs/final-r01/'+r.id+'/review.json'})),not_blind_evidence:true});
const controls=[];
function add(mechanism,kind,source,expect){const id=mechanism+'-'+String(controls.filter(c=>c.mechanism===mechanism).length+1).padStart(2,'0');controls.push({id,mechanism,kind,source,source_sha256:shaText(source),expect});}
const shaText=s=>{const tmp=OUT+'source-hash.tmp';write(tmp,s);const h=digest(tmp);fs.unlinkSync(tmp);return h;};
const scopePositive=[
 ['QA 核查 sandbox 环境，生成 orbit.txt。核查范围仅限 sandbox，production 不在本次核查范围内。','sandbox','production'],
 ['OPS 检查 rehearsal 环境，生成 atlas.txt。范围排除 customer-live。','rehearsal','customer-live'],
 ['DEV 查看 target.csv，生成 beacon.txt。范围仅限 devbox，不包含 releasebox。','devbox','releasebox'],
 ['QA 检查 local 环境，生成 comet.txt。external 不在本次范围内。','local','external'],
 ['QA review staging, create delta.txt. Exclude live from this review.','staging','live'],
 ['OPS inspect rehearsal, write echo.txt. This check is limited to rehearsal, not customer-live.','rehearsal','customer-live']
];for(const [s,include,exclude] of scopePositive)add('GA','POSITIVE',s,{include,exclude,no_scope_action:true});
add('GA','CONTRAST','QA 查看 zone.csv，生成 filter.md。报告中写明“生产区不在本次范围内”。',{no_restriction:true});
add('GA','CONTRAST','OPS 检查 staging 和 live，生成 zones.md。',{inputs:['staging','live'],no_restriction:true});
add('GA','CONTRAST','DEV 生成 notice.md，无需排除远端环境。',{no_restriction:true});
add('GA','CONTRAST','QA 检查 sandbox，生成 safety.md。不得修改 sandbox 配置。',{forbid:'修改',no_scope_action:true});
add('GA','AMBIGUITY','QA 读取 alpha.csv 和 beta.csv，生成 scope.md。排除其中一个。',{unresolved:true,no_guessed_exclusion:true});
add('GA','AMBIGUITY','OPS 检查 east 和 west，生成 scope2.md。限制在前述某一环境。',{unresolved:true,no_guessed_exclusion:true});
const flows=[
 'QA 依据 POLICY-73 v4.2 查看 parcel.csv，编写 brief.md。PM 在 QA 发送报告后向 ADMIN 汇报。',
 'OPS 按 GUIDE-28 v2.5 读取 batch.json，创建 summary.txt。QA 复核报告后由 PM 发送给 ADMIN。',
 'DEV 查看 stream.yaml，编写 result.md，随后发送报告给 QA。',
 'QA read cabin.csv and write trail.txt. Send the report to OPS after DEV has reviewed it.',
 'PM inspect cargo.json and create notice.txt. QA reviews the report before PM sends it to ADMIN.',
 'DEV read cycle.csv, create digest.txt and send the report to QA.'
];for(const s of flows)add('GB','POSITIVE',s,{input_output_flow:true});
add('GB','CONTRAST','QA 查看 prior.txt，无需编写 release.md。',{inputs:['prior.txt'],no_output:'release.md'});
add('GB','CONTRAST','OPS 编写 checklist.md，内容引用“发送报告给管理员”。',{output:'checklist.md',opaque:true});
add('GB','CONTRAST','DEV 读取 old.json，不得发送 old.json 给 QA。',{forbid:'发送',no_positive_send:true});
add('GB','CONTRAST','QA read fixed.csv, do not write change.txt.',{inputs:['fixed.csv'],no_output:'change.txt'});
add('GB','AMBIGUITY','DEV 生成 upper.md 和 lower.md，PM 发送该报告给 QA。',{unresolved:true,outputs:['upper.md','lower.md']});
add('GB','AMBIGUITY','OPS 编写 left.md，QA 编写 right.md。PM 复核报告。',{unresolved:true,outputs:['left.md','right.md']});
const completions=[
 'DEV 检查缓存和队列，生成 audit.txt。QA 确认缓存和队列两类核查都完成后，任务结束。',
 'OPS 检查镜像和网络，生成 trace.txt。只有镜像与网络均完成后，任务才完成。',
 'QA 核查权限和日志，生成 journal.txt。两类检查都完成后，任务结束。',
 'DEV check cache and queue, create probe.txt. Only after both cache and queue checks are complete is the task complete.',
 'QA check routes and ports, create port.txt. When both checks have finished, the task is complete.',
 'OPS check storage and network, create state.txt. After QA confirms both categories are complete, the task is complete.'
];for(const s of completions)add('GC','POSITIVE',s,{completion:'AND',members:2});
add('GC','CONTRAST','QA 检查权限或日志任一通过后，任务完成。',{completion:'OR',members:2});
add('GC','CONTRAST','OPS 检查 service，整个任务必须在 12 分钟内完成。',{time:12,no_completion:true});
add('GC','CONTRAST','DEV 生成 guide.md，报告中写“缓存和队列都完成”。',{output:'guide.md',opaque:true,no_completion:true});
add('GC','CONTRAST','QA check cache. The output note.txt must quote "both checks are complete".',{opaque:true,no_completion:true});
add('GC','AMBIGUITY','OPS 检查缓存和队列，DEV 检查端口和路由。两类检查都完成后，任务结束。',{unresolved:true});
add('GC','AMBIGUITY','QA 读取 upper.csv 和 lower.csv。此前检查全部完成后，任务结束。',{unresolved:true});
for(const [s,op,n] of [
 ['OPS 检查服务，至少重试 4 次，生成 retry.txt。','GTE',4],
 ['QA 检查链路，最多重试 7 次，生成 link.txt。','LTE',7],
 ['DEV 检查缓存，恰好重试 2 次，生成 cache.txt。','EQ',2],
 ['OPS check service, retry at least 5 times, create counts.txt.','GTE',5],
 ['QA inspect queue, retry at most 9 times, write retrylog.txt.','LTE',9],
 ['DEV check route, retry exactly 3 times, generate tally.txt.','EQ',3]
])add('GD','POSITIVE',s,{retry:{op,value:n}});
add('GD','CONTRAST','QA 检查服务，至少 3 次成功才完成。',{no_retry_resource:true,completion_count:3});
add('GD','CONTRAST','OPS 读取最近 6 次日志，生成 window.txt。',{no_retry_resource:true});
add('GD','CONTRAST','DEV 检查服务，整个任务最多使用 14 分钟。',{time:14,no_retry_resource:true});
add('GD','CONTRAST','QA 生成 2 份报告。',{no_retry_resource:true});
add('GD','AMBIGUITY','OPS 检查服务和缓存，至少重试 4 次。',{unresolved:true,no_retry_resource:true});
add('GD','AMBIGUITY','DEV check service and queue, retry at least 8 times.',{unresolved:true,no_retry_resource:true});
assert.equal(controls.length,48);
write(OUT+'DEVELOPMENT-CONTROLS.json',{status:'FROZEN_BEFORE_020_CODE',controls});write(OUT+'DEVELOPMENT-CONTROLS-FREEZE.json',{frozen_at:new Date().toISOString(),sha256:digest(OUT+'DEVELOPMENT-CONTROLS.json'),count:48,per_mechanism:{GA:12,GB:12,GC:12,GD:12},no_parser_output_used:true});
console.log('P0_AND_48_CONTROLS_FROZEN');
