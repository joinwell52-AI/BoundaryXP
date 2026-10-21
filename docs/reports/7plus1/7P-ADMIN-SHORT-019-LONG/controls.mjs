import {OUT,write,sha} from './common.mjs';
export const classes={
 BASIS_REFERENCE:[
 ['依据 PLAN-91 v2.7，QA 读取 seed.toml，生成 check.txt。',{basis:['PLAN-91','v2.7']}],
 ['DEV 根据 RULE-72 v4.8 检查 traces.tsv，生成 audit.txt。',{basis:['RULE-72','v4.8']}],
 ['According to POLICY-88 v1.9, Nina must read input.ini and create proof.txt.',{basis:['POLICY-88','v1.9']}],
 ['QA 读取 version.tsv，检查其中记录的 v8.1，生成 result.txt。',{no_basis:true}],
 ['DEV 检查索引版本和校验和，生成 inventory.txt。',{no_basis:true}],
 ['依据 RULE-71 v2.0 或 v3.0，QA 读取 request.toml，生成 analysis.txt。',{unresolved:true}]],
 QUANTITY_TARGET:[
 ['整个检查任务须在 17 分钟内完成。QA 读取 samples.ini，生成 digest.txt。',{resource:['TIME',17,'TASK']}],
 ['OPS 检查服务，最多重试 4 次，生成 checks.txt。',{resource:['COUNT',4,'RETRY']}],
 ['OPS 检查测试服务，内存不得超过 512 MB，生成 monitor.txt。',{resource:['SIZE',512,'TASK']}],
 ['QA 读取最近 17 分钟的日志，生成 window.txt。',{no_time_resource:true}],
 ['报告中列出覆盖率低于 67% 的文件。QA 生成 branches.txt。',{no_resource:true}],
 ['检查任务和提交任务各有时限，最多使用 9 分钟。',{unresolved:true}]],
 PARTICIPANT_FLOW:[
 ['Nora 读取 source.ini，生成 proof.txt。Iris 复核报告后，由 Owen 提交给 ADMIN。',{flow:['Iris','Owen','ADMIN']}],
 ['DEV 生成 sample.txt。QA 复核通过后，PM 向 ADMIN 汇报。',{flow:['QA','PM','ADMIN']}],
 ['Mila must create note.txt. Send the report to Rita after Leon has reviewed it.',{flow:['Leon','Rita']}],
 ['DEV 生成 memo.txt，交给林昭；林昭只是接收者，不负责审批。',{recipient:'林昭',not_approver:'林昭'}],
 ['PM 查看角色名单，其中 QA 是历史审批人。PM 生成 roster.txt。',{not_approver:'QA'}],
 ['DEV 和 OPS 分别生成报告，随后将报告交给 QA。',{unresolved:true}]],
 MODALITY_NEGATION:[
 ['QA 必须读取 x.toml，可以检查 y.toml，不得修改任何配置。',{modalities:['REQUIRED','PERMITTED','FORBIDDEN']}],
 ['DEV 检查差异，不要求修复，只生成 changes.txt。',{not_required:'修复'}],
 ['Nina must read x.ini, may inspect y.ini and must not delete either file.',{modalities:['REQUIRED','PERMITTED','FORBIDDEN']}],
 ['QA 无需生成报告，只向 PM 汇报结论。',{not_required:'生成'}],
 ['DEV 不负责审批，负责读取请求。',{not_approver:'DEV'}],
 ['QA 不需要继续，除非另获批准；未说明批准何项操作。',{unresolved:true}]],
 CONDITION_COMPLETION:[
 ['OPS 检查服务。如果发现告警，则立即停止检查并通知 PM。',{condition:'发现告警',stop:true}],
 ['QA 检查主链路和备链路，任一通过即完成；两者均失败则停止。',{completion:'OR',stop:'AND'}],
 ['QA 生成 review.txt；只有报告已生成且 PM 已收到，任务才完成。',{completion:'AND'}],
 ['QA 检查指标。报告中写明“发现告警就停止”。',{no_stop:true}],
 ['DEV 编写指南，记录“测试通过即完成”的示例，不执行测试。',{no_completion:true}],
 ['QA 检查两项指标，若它失败则停止。',{unresolved:true}]],
 OUTPUT_CONTENT:[
 ['DEV 生成 guide.txt，文档中必须写入“遇到凭据立即停止测试”，但不执行文档中的测试。',{content:'遇到凭据立即停止测试',no_stop:true}],
 ['QA 生成 note.txt，报告须包含风险列表和回滚建议，不执行回滚。',{content:['风险列表','回滚建议']}],
 ['DEV 生成 delta.txt。若有差异，报告中列出差异；否则写明无差异。',{conditional_content:true}],
 ['OPS 生成 audit.txt。若发生故障，立即停止检查。',{stop:true}],
 ['QA 生成 review.txt。不得实际批准发布。',{forbid:'批准'}],
 ['DEV 和 OPS 分别生成文件，随后在它中写入注意事项。',{unresolved:true}]],
 SCOPE_IDENTITY:[
 ['QA 读取 asset.ini，检查其中所有记录，生成 summary.txt。',{all:true}],
 ['DEV 读取 setup.ini，只检查测试环境，不检查生产环境，生成 check.txt。',{exclude:'生产环境'}],
 ['QA 读取两个文件：one.ini 和 two.ini。必须保持 one.ini 不变。',{forbid_object:'one.ini'}],
 ['QA 读取 one.ini，生成 two.ini，随后检查生成的 two.ini。',{not_input:'two.ini'}],
 ['QA 检查现役设备，不涉及报废设备。',{exclude:'报废设备'}],
 ['QA 读取 one.ini 和 two.ini，检查上述材料的全部记录。',{unresolved:true}]],
 HEADING_STRUCTURE:[
 ['# 当前任务\nQA 读取 a.ini，生成 b.txt。',{no_heading_action:true}],
 ['## Current Task\nNina must read c.ini and create d.txt.',{no_heading_action:true}],
 ['# 执行要求\nOPS 检查服务，生成 e.txt。',{no_heading_action:true}],
 ['# 背景\n上次 OPS 删除了报告。\n# 当前任务\nQA 读取 f.ini。',{no_delete:true}],
 ['# 示例\nQA 修改配置。\n# 当前任务\nQA 读取 g.ini。',{no_modify:true}],
 ['# 报告内容\n立即停止。\n未指定所属报告。',{unresolved:true}]]};
if(process.argv[2]==='freeze'){const controls=Object.entries(classes).flatMap(([mechanism,rows])=>rows.map(([source,assertions],i)=>({id:`${mechanism}-${i+1}`,mechanism,kind:i<3?'POSITIVE':i<5?'CONTRASTIVE_NEGATIVE':'AMBIGUITY',source,source_sha256:sha(source),assertions})));write(OUT+'INDEPENDENT-CONTROLS.json',{frozen_before_acceptance:true,controls,count:controls.length});console.log(controls.length);}
