const pairs=[
 ['Legacy · 已弃用的研究界面 / Deprecated research interface. Not BXP-IR or BXP-CALC.','Legacy · Deprecated research interface. Not BXP-IR or BXP-CALC.'],
 ['返回 BXP / Back to BXP','Back to BXP'],
 ['查看 PM 原始答复与手动输入','View the original PM reply and manual input'],
 ['本地检查，给 ADMIN 建议','Check locally for ADMIN'],['ADMIN 端纯本地规则检查，不调用 AI。无法由规则确认的内容保留为待明确。','ADMIN checks use local rules without AI. Anything not confirmed by rules remains unknown.'],['发送逐任务建议，让 PM 回复并重分配','Send task-specific advice and request a revised PM plan'],
 ['给 ADMIN 的任务建议','Task advice for ADMIN'],['测试 PM 分工与建议','PM planning test and advice'],['结果','Results'],['两个独立入口：给 ADMIN 完善任务的建议，或单独测试 PM 分工。无需按顺序操作。','Two independent tools: improve the ADMIN task or test PM planning. No required sequence.'],['PM 测试任务原文','Task source for the PM test'],['独立输入要交给 PM 的任务，无需先做 ADMIN 分析。','Enter a task for PM independently. ADMIN analysis is not required.'],['复制 ADMIN 任务原文到这里','Copy ADMIN task source here'],['已复制任务原文，尚未启动 PM 测试。','Task source copied. No PM test has started.'],['测试会使用上方 PM 任务原文。','The test uses the PM task source above.'],
 ['等待超时，已停止本次请求，未自动重试。已有结果保留。','Timed out. This request stopped without retrying. Existing results are retained.'],
 ['建议的完整任务文本','Suggested complete task'],
 ['语言','Language'],['用当前任务测试 PM','Test PM with this task'],['已记录测试用任务原文。','Task source recorded for this test.'],['测试时自动记录当前任务原文，无需另行保存。','The task source is recorded automatically when testing. No separate save is needed.'],['点击测试，将使用第一页的任务原文。','Testing will use the task text from the first page.'],
 ['高级选项：直接填写原句映射，不调用模型。普通用户无需操作。','Advanced: map source excerpts directly without a model call. Not needed for normal use.'],
 ['先测试模型连接。任务原文会自动记录，无需保存基线。PM 生成与分析共两次调用；任务未分析时增加一次调用。不实际派单。','Test the model connection first. The task source is recorded automatically. PM generation and analysis use two calls, plus one if the task is not yet mapped. No work is dispatched.'],
 ['让分工之后的任务，仍然回答原来的问题。','Keep delegated work aligned with the original task.'],
 ['模型设置','Model settings'],['连接你自己的模型','Connect your model'],
 ['仅在你点击模型按钮时发送当前文本及必要的基线或历史规划；可能产生 API 费用。密钥只保留在当前页面内存，不保存或导出。','Model actions send the relevant text, baseline or previous plan and may incur API fees. Your key stays in page memory and is never saved or exported.'],
 ['协议','Protocol'],['Responses（如豆包 Ark）','Responses (e.g. Doubao Ark)'],['Chat Completions 兼容接口','Chat Completions compatible'],['完整 API 地址','Full API URL'],['模型名称','Model name'],['API 密钥','API key'],['你的模型 ID','Your model ID'],['仅本次打开有效','For this session only'],
 ['关闭深度思考（仅支持 thinking 参数的 Responses 服务，例如豆包）','Disable thinking (only for Responses providers supporting the thinking parameter, such as Doubao)'],
 ['测试连接','Test connection'],['● 未测试','● Not tested'],['清除密钥','Clear key'],
 ['发送一条短连接请求，可能少量计费，不发送任务正文。绿色仅表示本次配置可用，修改配置后需重新测试。','Send a short probe, which may incur a small charge, without the task text. Green confirms this connection attempt only. Retest after changing settings.'],
 ['不连接模型也能使用手动整理和固定示例。订阅聊天服务不等于具备 API 凭据。','Manual mapping and the fixed example work offline. A chat subscription does not provide API credentials.'],
 ['把任务说清楚，把变化看明白。','Clarify the task. Understand what changed.'],
 ['先确认任务边界，再检查 PM 的规划。界痕提供依据和建议，决定仍由你和负责人作出。','Confirm the task boundary, then review the PM plan. BoundX provides evidence and recommendations; you and the accountable owner decide.'],
 ['使用步骤','Workflow'],['处理中，请稍候…','Working, please wait…'],['取消请求','Cancel request'],['载入巡检示例','Load inspection example'],['任务原文','Original task'],
 ['把你准备交给 PM 或团队的任务粘贴在这里…','Paste the task you want to give PM or the team…'],
 ['这是任务正文。补充要求请写入正文；模型提取只是候选解释，需你核对。','Add requirements to the task text. Model extraction is a candidate interpretation for you to review.'],
 ['手动整理','Map manually'],['记录当前使用者的确认，不验证组织身份，不产生 ADMIN 授权。','Records your confirmation without verifying organizational identity or granting ADMIN authorization.'],
 ['查看 PM 怎样拆分任务','See how PM decomposes the task'],['请先保存任务基线。','Confirm the task baseline first.'],['PM 总规划与各份派单','PM plan and assignments'],
 ['粘贴 PM 的原始答复，包含各子任务、依赖和 PM 保留职责。也可以用上面的按钮生成。','Paste the original PM response, including assignments, dependencies and retained responsibilities, or generate it above.'],
 ['用模型整理规划','Analyze existing plan'],['我已核对候选映射、条件标识和派单；不同措辞不一定代表不同要求。','I reviewed the mappings, condition identifiers and assignments. Different wording may express the same requirement.'],['计算与基线的差异','Compare with baseline'],
 ['这里只比较已映射的内容。没有发现不等于理解正确；回复也不等于问题已解决。','Only mapped content is compared. No findings do not prove correct understanding; a reply does not prove resolution.'],['交给 PM 的提醒','Reminder for PM'],['复制提醒','Copy reminder'],
 ['复核会发送已确认任务、最近规划及上面的提醒，可修改后再发。收到答复后自动整理并重新计算；回复不代表问题已解决。','Review sends the confirmed task, latest plan and editable reminder. The response is analyzed automatically; a reply does not establish resolution.'],
 ['你的任务记录','Your task record'],['保存基线、规划、计算与回应；不包含模型密钥。浏览器临时页面不自动持久保存，请下载后在下次打开。','Download your baseline, plan, calculations and responses without API credentials. Task records are not automatically persisted.'],['保存记录','Save record'],['导出报告','Export report'],['打开记录','Open record'],['版本记录与计算范围','History and calculation scope'],
 ['本页接入七参数、动作、完成条件、依赖图与回应检查。有限布尔分解接口仍可通过 CLI/MCP 使用，本页不声称完成全语义验证。','This page checks seven parameters, actions, completion conditions, dependencies and responses. Finite Boolean decomposition is available through CLI/MCP; this is not full semantic verification.'],
 ['检查对象与输入','Scope and inputs'],['交付结果','Deliverables'],['允许的动作','Permitted actions'],['责任分工','Responsibilities'],['时间与资源','Time and resources'],['版本与证据','Version and evidence'],['完成与停止条件','Completion and stopping'],
 ['粘贴对应原句；未明确可以留空','Paste the source excerpt; leave unknowns blank'],['引用必须出现在上方原文。补充要求请先加入原文，再重新整理。','Quotes must appear in the source. Add new requirements to the source before analyzing again.'],['核对动作与完成条件','Review actions and completion conditions'],['条件名称代表含义。规划与基线含义一致时使用同一名称；仅有原句还不能证明语义一致。','Reuse identifiers for equivalent conditions. Source excerpts alone do not prove semantic equivalence.'],['动作（谁 / 做什么 / 对象 / 原句）','Actions (actor / verb / target / quote)'],['角色','Role'],['动作','Action'],['对象','Target'],['动作原句','Action quote'],['删除','Delete'],['＋ 添加动作','+ Add action'],['完成条件（稳定名称 / 原句）','Completion conditions (stable ID / quote)'],['条件名称','Condition ID'],['完成条件原句','Condition quote'],['＋ 添加完成条件','+ Add completion condition'],
 ['总规划与 PM 保留职责','Overall plan and retained PM responsibilities'],['任务编号','Task ID'],['必须等待的任务编号，逗号分隔；没有则留空','Prerequisite task IDs, comma-separated; leave blank if none'],['该派单原文（须是总规划中的连续片段）','Assignment source (a continuous excerpt of the plan)'],['核对该任务的七参数、动作和完成条件','Review parameters, actions and completion conditions'],['移除这份派单','Remove assignment'],['＋ 添加一份派单','+ Add assignment'],['尚未保存基线。','No baseline confirmed.'],
 ['边界尚未映射','Unmapped boundary'],['动作或完成条件尚未明确','Unmapped actions or completion conditions'],['边界表述发生变化','Changed boundary wording'],['动作与基线存在差异','Action differs from baseline'],['完成条件发生变化','Changed completion condition'],['基线完成条件未对应','Missing baseline completion condition'],['依赖对象未提供','Missing dependency target'],['依赖图出现循环','Dependency cycle'],['基线原句','Baseline quote'],['当前文本','Current text'],['查看数学反例','View mathematical counterexample'],['回应立场','Response position'],['接受建议','Accept recommendation'],['部分接受','Partially accept'],['保留原安排','Retain arrangement'],['申请授权方澄清','Request authorizer clarification'],['填写或粘贴负责人理由。仅“收到”不算完整回应。','Enter the owner’s reasoning. A bare acknowledgement is insufficient.'],['回应理由','Response reasoning'],['依据、修订原句或澄清申请位置','Evidence, revised text or clarification request reference'],['已记录回应；是否解决仍未裁决。','Response recorded; resolution is not adjudicated.'],['尚未记录回应。','No response recorded.'],['记录回应','Record response'],
 ['当前映射范围内未发现这些结构异常。仍需核查语义、证据、权限与未映射部分。','No checked structural anomalies found in the mapping. Review semantics, evidence, authorization and unmapped content.'],
 ['API 密钥已从页面清除。','API key cleared from page memory.'],['请先填写模型设置，或使用手动整理。','Fill in model settings first, or map manually.'],['已有请求正在进行，请等待或取消。','A request is running. Wait or cancel it.'],['请求失败','Request failed'],['已请求取消。本地不会自动重试；已发送的模型请求是否计费由服务商决定。','Cancellation requested. No automatic retry; your provider determines whether a sent request is billed.'],['请求已取消。','Request cancelled.'],['配置已变更，请重新测试。绿色状态不会保存或从记录恢复。','Settings changed. Retest the connection. Connection status is not saved or restored.'],['正在发送短文本测试，不发送任务正文。','Sending a short probe without task text.'],['测试已取消，未自动重试。','Test cancelled; no automatic retry.'],['请先粘贴文本。','Paste text first.'],['请先核对任务并保存为比较基线。','Review and confirm the task baseline first.'],['请填写已有原句。可以保留缺口，不需要补造要求。','Map existing source excerpts. Leave gaps rather than inventing requirements.'],['候选整理完成。请核对原句和解释后保存基线。','Analysis ready. Review the source mappings and confirm the baseline.'],['请先核对并勾选确认。','Review and select the confirmation checkbox first.'],['请整理总规划及各派单，含义相同的条件沿用基线名称。','Map the overall plan and assignments; reuse baseline identifiers for equivalent conditions.'],['规划整理完成；请核对条件名称、PM 根职责与子任务分界。','Plan mapped. Review condition identifiers, PM responsibilities and assignment boundaries.'],['任务原文已变更，请重新整理并确认后测试。','Task text changed. Analyze and confirm it before testing.'],['请先核对并勾选规划映射。','Review and confirm the plan mappings first.'],['各派单须引用总规划中的连续原文。','Each assignment must quote a continuous excerpt of the overall plan.'],['计算已完成。请逐项核查依据；观察不等于越权裁决。','Calculation complete. Review the evidence; observations are not authorization verdicts.'],['提醒已复制。','Reminder copied.'],['请先计算规划差异。','Compare the plan first.'],['记录已下载，包含任务文本与模型答复，不含配置和密钥。','Record downloaded with task text and model responses, without settings or keys.'],['记录超过 5 MB。','Record exceeds 5 MB.'],['不支持的记录格式或记录过大。','Unsupported record format or record too large.'],['记录已打开并重新验证。编辑中的草案需再次核对；密钥需重新填写。','Record opened and recalculated. Review drafts again and enter your API key.'],['载入固定示例会替换当前记录。需要保留请先取消并保存记录。','Loading the example replaces this record. Cancel and save first if needed.'],['已载入固定巡检示例，映射仅供体验。先核对，再保存为基线。','Fixed inspection example loaded for demonstration. Review it before confirming the baseline.'],['已复制；请按实际要求修改占位符，再由 ADMIN 决定是否加入任务。','Copied. Replace placeholders with actual requirements; ADMIN decides whether to add them.'],
 ['请选择 API 协议。','Select an API protocol.'],['请填写 HTTPS API 地址。','Enter an HTTPS API URL.'],['模型地址须为 HTTPS，不含账号、查询参数或片段。','Use an HTTPS model URL without credentials, query parameters or fragments.'],['所选协议与地址末尾不一致，请修改协议或接口地址。','Protocol and endpoint do not match. Check the protocol or URL.'],
];
export const catalog=new Map(pairs);
export function translate(text,lang='zh-CN'){
 if(typeof text!=='string')return text;
 const trimmed=text.trim();let zh=trimmed,en=catalog.get(trimmed);
 // Legacy paired UI copy is registered explicitly, never inferred from user text.
 const pair=paired.get(trimmed);if(pair)[zh,en]=pair;
 if(lang==='zh-CN')return pair?text.replace(trimmed,zh):text;
 if(en)return text.replace(trimmed,en);
 for(const [pattern,replacement] of patterns)if(pattern.test(text))return text.replace(pattern,replacement);
 return text;
}
const paired=new Map();
export function registerPair(zh,en){paired.set(zh+' / '+en,[zh,en]);}
registerPair('复制完整任务文本','Copy complete task');
export function selectCopy(zh,en,lang){return lang==='en'?en:zh;}
const patterns=[
 [/^界痕 · BoundX (.+) · ADMIN 本地计算 · PM 模型试测 · 建议不构成裁决$/,'BoundX $1 · Local ADMIN checks · PM model tests · Advice is not adjudication'],
 [/^(.+) 选择了多段原句（(.+)）；当前引用展示从第一段到最后一段的连续原文，也包含中间未选择的文字，请核对。$/,'$1 selected multiple excerpts ($2). The displayed continuous range includes intervening text; review it.'],
 [/^模型服务返回 HTTP (\d+).*$/,'Model service returned HTTP $1. No automatic retry. Check the endpoint, credentials and model ID.'],
 [/^(.+) · ([IOAPRVC])$/,(s,title,key)=>`${translate(title,'en')} · ${key}`],
 [/^(.+)原句$/,(s,title)=>`${translate(title,'en')} source quote`],
 [/^派出的子任务 · (\d+) 项$/,'Assignments · $1'],
 [/^展开 (\d+) 项映射缺口与补充建议$/,'Review $1 mapping gaps and suggestions'],
 [/^仍有 (\d+) 项未完整回应。$/,'$1 observations still need a complete response.'],
 [/^已保存基线 · (.+)。编辑原文不会自动更改该基线。$/,'Baseline saved · $1. Editing the source does not change this baseline.'],
 [/^当前比较基线：/,'Current baseline: '],
 [/^基线已保存；(\d+) 项映射缺口或提示，未自动补全。可以进入第 2 步。$/,'Baseline saved with $1 observations. Nothing was automatically filled in. Continue to step 2.'],
 [/^相较上一版规划另有 (\d+) 项观察（非新问题计数）$/,'$1 observations against the previous plan (not a count of new issues)'],
 [/^实际返回模型：(.+)；耗时 (\d+) ms。(已补全或规范化接口地址。)?仅表示本次连接可用，不代表任务理解正确。$/,'Returned model: $1; $2 ms. Endpoint checked. This confirms connectivity, not correct task understanding.'],
 [/^界痕 · BoundX (.+) · 本地界面 · 提取由模型辅助，计算不替代业务裁决$/,'BoundX $1 · Local UI · Model-assisted extraction; advisory calculations'],
];
export function createLocale(initial='zh-CN'){
 let language=initial==='en'?'en':'zh-CN';const bindings=new Set();
 return {get language(){return language;},t(text){return translate(text,language);},bind(node,render){const update=()=>{node.textContent=render(language);};bindings.add({node,update});update();},set(next){if(!['zh-CN','en'].includes(next))throw Error('Unsupported language');language=next;for(const b of bindings){if(b.node.isConnected===false){bindings.delete(b);continue;}b.update();}}};
}
