import fs from'node:fs';import path from'node:path';import{createHash}from'node:crypto';
import{fingerprint}from'../../../../research/7plus1-parser/v0.3-p3-frozen-evaluation/attempt-20261001-r01/support.mjs';
const root='D:/boundx',base=path.join(root,'docs/reports/7plus1/7P-STANDARD-001'),read=p=>JSON.parse(fs.readFileSync(p)),hash=b=>createHash('sha256').update(b).digest('hex'),put=(n,x)=>fs.writeFileSync(path.join(base,n),typeof x==='string'?x:JSON.stringify(x,null,2)+'\n',{flag:'wx'}),sources=read(path.join(base,'SOURCES.json')),runs=read(path.join(base,'RUNS.json')),baseline=read(path.join(base,'BASELINE.json'));
if(runs.length!==10)throw Error('BATCH_NOT_COMPLETE');
const fp=await fingerprint();if(fp.status!=='PASS')throw Error('FROZEN_BASE_CHANGED');
for(const[n,h]of Object.entries(baseline.golden_unchanged_files))if(hash(fs.readFileSync(path.join(root,n)))!==h)throw Error('REF_001_CHANGED');
const hist=read(path.join(root,'docs/reports/7plus1/7P-BOOTSTRAP-001/REAL-GOLD-60-COPY-MANIFEST.json'));for(const[n,h]of Object.entries(hist.files))if(hash(fs.readFileSync(path.join(root,hist.destination,n)))!==h||hash(fs.readFileSync(path.join(hist.source,n)))!==h)throw Error('HISTORY_CHANGED');
const rows=[];for(const s of sources){const dir=path.join(root,s.candidate_directory),bytes=fs.readFileSync(path.join(dir,'source.md'));if(hash(bytes)!==s.source_sha256)throw Error('SOURCE_CHANGED');if(fs.readdirSync(dir).some(n=>/^expected/u.test(n)))throw Error('EXPECTED_FORBIDDEN');const summary=read(path.join(dir,'parser-run-summary.json')),full=path.join(base,'EVIDENCE',s.candidate_id,'trace.json');let payload={status:'NOT_AVAILABLE',reason:'Parser exception; no synthetic expressions or Canonical.'};
 if(fs.existsSync(full)){const trace=read(full),c=trace.compiler_v03;payload={status:'ACTUAL_STRUCTURES_ONLY',case_namespace:s.candidate_id,run_id:c.metadata.run_id,source_spans:trace.source_spans,relations:c.relations,semantic_nodes:c.semantic_nodes,set_expr_nodes:c.boundary_ir.set_expr_nodes,condition_expr_nodes:c.boundary_ir.condition_expr_nodes,quantity_expr_nodes:c.boundary_ir.quantity_expr_nodes,boundary_facts:c.boundary_ir.facts};}
 fs.writeFileSync(path.join(dir,'parser-expression-summary.json'),JSON.stringify(payload,null,2)+'\n',{flag:'wx'});rows.push({candidate_id:s.candidate_id,original_real_gold_id:s.original_real_gold_id,active_revision:s.active_revision,source_sha256:s.source_sha256,run_status:summary.run_status,parser_status:summary.parser_status??'NOT_AVAILABLE',source_hash_matches:summary.source_hash_matches??null,actual_7plus1_path:s.candidate_directory+'/parser-actual-7plus1.json',run_summary_path:s.candidate_directory+'/parser-run-summary.json',engine_commit:summary.engine_commit,run_id:summary.run_id,semantic_assessment:'NOT_PERFORMED'});
}
const result={task:'7P-STANDARD-001',source_acquired:'10/10',attempted:10,complete:runs.filter(r=>r.run_status==='COMPLETE').length,exceptions:runs.filter(r=>r.run_status==='EXCEPTION').length,source_bytes_preserved:true,parser_modified:false,gold_modified:false,bxp_modified:false,ref001_modified:false,historical_gold_used_as_answer:false,expected_created:false,semantic_assessment:'NOT_PERFORMED_ADMIN_REVIEW_PENDING',production_ready:false,rows};
put('RESULTS.json',result);put('FAILURES.json',{runtime_exceptions:runs.filter(r=>r.run_status==='EXCEPTION'),semantics:'NOT_ASSESSED',no_repair:true});put('POST-BASELINE.json',{status:fp.status,checked_files:fp.checked_files,actual_import_graph:fp.actual_import_graph,import_graph_sha256:fp.import_graph_sha256,ref001_unchanged:true,all_historical_files_unchanged:true});
put('REPORT.md',`# 7P-STANDARD-001：第一批人工标准样本审定输入

STATUS=WAITING_ADMIN_ADJUDICATION
SOURCE_ACQUIRED=10/10
PARSER_MODIFIED=false
GOLD_MODIFIED=false
BXP_MODIFIED=false
REF_001_MODIFIED=false
EXPECTED_7PLUS1_CREATED=false
PRODUCTION_READY=false

Base: ${baseline.base_commit}
Branch: review/7plus1-parser

## 来源与实际输出

仅根据历史 ACTIVE-REVISIONS.json 与该 revision MANIFEST.json 确定源文件，源字节/摘要与指定Base一致；原始source目录及历史审定目录均不改。原始TASK前置元数据、正文、代码段和格式全部保留，未摘要、改写或执行其业务指令。历史Gold只记录路径，不读取其内容生成标准答案。

| 候选 | 历史 Case | ACTIVE | Source SHA-256 | 运行状态 | Parser状态 | actual 7+1 |
|---|---|---|---|---|---|---|
${rows.map(r=>`| ${r.candidate_id} | ${r.original_real_gold_id} | ${r.active_revision} | ${r.source_sha256} | ${r.run_status} | ${r.parser_status} | [JSON](../../../../${r.actual_7plus1_path}) |`).join('\n')}

## 本轮运行

10条全部实际尝试，${result.complete}条完整返回、${result.exceptions}条异常。这里是程序运行状态，不是语义正确率；本轮没有评判“对/错”，未将任何候选自动审定为标准答案。若异常，actual JSON为null并在summary保留原错误，不能以伪造空槽充数。

真实生产者：${baseline.engine}，摘要 ${baseline.engine_sha256}；实现提交 ${baseline.base_commit}。工作区HEAD ${baseline.working_head} 与实现镜像提交分别记录，以源码指纹确定真实运行版本。解析仅收到source.md原文字节，未收到历史Gold/答案或SWAI ID。

正常调用 HanLP/spaCy及原冻结语义模型路径，串行复用模型进程。每条summary记录实际slot状态、unresolved、scope/condition/quantity结构、事实/节点、模型调用及诊断、run ID/时间/engine/commit；parser-expression-summary补充引用链的精确span/关系，不改变任何语义。COMPLETE或合同Gate状态不用于评价答案。Semantic信号未返回时原诊断照存。

## 文件与人工审定边界

每份候选在 fixtures/7plus1/standard-candidates/SWAI-001…SWAI-010。source.md原字节；source-meta.json为来源说明；parser-actual-7plus1.json为真实Canonical；parser-run-summary.json为运行事实；parser-expression-summary.json为实际引用链；historical-reference.json仅REAL-GOLD ID、active revision、source SHA及历史Gold路径。

没有生成expected-7plus1.json或其他expected答案。候选状态为STANDARD_CANDIDATE_AWAITING_HUMAN_ADJUDICATION，等待ADMIN/ChatGPT按原始自然语言和冻结7+1定义独立审定。Parser实际答案不能反向成为标准。

REF-001字节及GOLDEN_CONFIRMED状态不变，继续作为当前STANDARD_PARSED_SAMPLE；不按行业删除或降级。运行前后2825冻结/既有封存文件与REF-001、1841历史文件逐一核验一致。新写的仅候选数据与本任务采集/校验脚本、报告。本轮无Parser修复，因此不另跑大范围语义调优或测试答案补丁。

完整首次Trace保留本地 docs/reports/7plus1/7P-STANDARD-001/EVIDENCE/SWAI-xxx/trace.json，摘要在summary；Git提交原文、实际Canonical及可独立阅读的结构/诊断摘要，避免重复10份全量Trace。无异常日志删除、覆盖或为通过改措辞重试。

发布到私有仓库固定review分支，Git父提交严格指定Base；使用独立index保留当前工作分支/未提交成果。无main合并、发布或GitHub Actions。本任务完成后停止，等待独立人工7+1审定，不自动进入修复。
`);
console.log(JSON.stringify({sources:10,complete:result.complete,exceptions:result.exceptions}));
