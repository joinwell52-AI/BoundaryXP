# 029 本地短文本编译器交付

```ini
SHORT_COMPILER_029=PASS
LOCAL_SHORT_COMPILER_READY=true
BUSINESS_EXECUTION_ENABLED=false
PRODUCTION_READY=false
WAITING_ADMIN_REVIEW=true
```

这是任务书规定的23条可见短文本及本地使用能力的验收结果，不是盲测准确率或任意自然语言正确性证明。编译技术接受也不是业务授权。

## 可直接使用的入口

交付地址：**http://127.0.0.1:58618/**。完成受控重启后服务实际存活，Windows隐藏进程PID为27880，仅监听127.0.0.1。页面已重新打开本轮S00历史，八槽位和B独立显示，点击B可核对原文精确证据。当前没有在途模型请求。

```text
cd D:\boundx
npm run 7plus1:ui
```

当前服务已启动，无需重复启动；端口占用会明确报错，不抢占其他进程。重启电脑后运行上述命令。粘贴或上传UTF-8 txt/md，非空且最多300 Unicode码点，点击“开始编译”。正常解析和独立审阅需要实际等待，可查询进度、取消、导出和打开历史。完整使用、CLI及结果目录见[USAGE.md](USAGE.md)。

CLI：`npm run 7plus1 -- --input <短任务文件> --output <新结果目录>`。UI与CLI共用`research/7plus1-parser/llm-first-028/engine.mjs`的parse7Plus1/replay7Plus1，没有第二套语义计算器。`npm run ui`的其他BXP入口保持不变。

## 任务与版本

原有未提交改动先保全，再快进同步到87503006fa3e7a3099e082e683ca3bdb43c6d2eb；远端已提供029完整任务及CURRENT指针，因此未自行编写另一版任务。

- 当前任务Git blob：7c8e329ffff5437ef262caf318f594a979f2577f。
- v0.4/r02手册Git blob：58db3ddab5327173fd15cfe5d8bd1e6c3f2825ff；手册字节和7+1定义未改。
- 合同/Skill版本：028-r02.3；消费者：029-c4；技术策略：028-r02-technical-v2。
- Codex CLI实测0.160.1，二进制SHA-256：3b8f6e33caa75f232558a3cf76ff9b87bb5ef6dbcf4996372f24e55c78b1b916。
- 请求模型gpt-6.1-sol / medium；实际服务模型身份未披露，记录null。未换模型、申请API key或修改账号。
- 两个Skill及共享合同/Schema真实进入请求，模式INLINE_BUNDLE；原生Skill加载NOT_VERIFIED。解析与审阅会话相互独立，实际工具事件为空。

冻结核心运行资源见[METHOD-FROZEN-FULL.json](METHOD-FROZEN-FULL.json)。早期SEMANTIC-METHOD-FROZEN只涵盖当时部分资源，不作为完整代码冻结证明。最终MANIFEST/SHA256SUMS/SEAL同时覆盖规范、两个Skill、合同、核心、Provider、原UI和必要验收证据。

## 实际改动与根因

复用原来的`v0.3-p2.1-generalization/server.mjs`及web页面布局/CSS，服务入口改为薄适配，语义继续由028核心产生。增加异步run、真实阶段、同源会话、request_id去重、取消/超时、本地历史、旧格式只读、完整导出和UTF-8/长度校验；没有新站点、云后端或旧NLP回退。

语义与消费者修复详见[METHOD-REVISION.md](METHOD-REVISION.md)：

1. 审阅器的精确`collection[id]`整节点路径与空路径等价；属性支持仍局部消费，任意属性不会冒充整节点支持。
2. 唯一具名实体的PERSON/GROUP/OTHER类别不确定，与身份/职责不确定分开。保留type未决，只在来源有效、无竞争身份、名称或身份支持、所有相关疑点仅指type时接受身份用途。真实身份、label/mentions质疑、整节点反对、显式requires仍阻断；不解析reason文本猜影响范围。
3. “只读”等方式限制不凭空创造独立REQUIRED动作，由两个Skill和共享合同表达，程序不根据动作词表删改候选。
4. 有限逻辑计算仅对显式相同STATE参数及相反极性识别互补，保留未知观测；不同对象、事件不合并。必要条件不变成充分许可。
5. 最终JSON保留同IR实体与表达式索引，中文可追溯名称，Proof包含scope与quantity目标/计数范围引用。没有改投影规则或新增业务执行权限。

类级正反单测覆盖属性路径、竞争身份、显式依赖、整节点反对、独立事实、数量/条件/来源与ID重排。实现不包含测试Case ID、实体名或文件名特判。

## 语义验收与保留的首次结果

机器可读逐案入口：[CASE-RESULTS.json](CASE-RESULTS.json)，逐项断言：[delivery-final/RESULTS.json](delivery-final/RESULTS.json)。每条链接原文、真实候选/审阅、技术检查、Boundary IR、最终JSON、中文和完整Trace。

| 验证 | 实际结果 | 性质 |
|---|---:|---|
| S00—S12 | 13/13 | 新合同真实调用后，最终消费者严格同摘要重编译 |
| T01—T10 | 10/10 | 固定可见新短文本，同上 |
| S00/T05/T09各3次 | 9/9 | 各首次加两次额外真实运行，全部计分 |
| 核心/接口/安全/前端相关自检 | 26 PASS / 0 FAIL | 无模型工程回归 |
| 未涉及产品入口回归 | 3 PASS / 0 FAIL | 原CLI/MCP与静态模块路由 |
| CLI与服务同冻结响应 | 一致 | canonical/中文相同，5类导出，0新模型调用 |
| CLI其他工作目录启动 | PASS | 绝对入口、正确资源、严格冻结响应回放 |

首次旧合同S00真实贯通；首次T批次原评分为6/10，失败原文/候选/审阅/结果未覆盖。新r02.3合同改变后全部23条真实重跑，`final/`保留当时消费者失败；随后只修技术消费者，用完全相同、摘要匹配的真实候选和审阅生成`delivery-final/`。没有重取最好模型答案、修改响应或关闭replay摘要检查。

T04原比较器只接受没有CONDITION的全状态禁令，过于严格，澄清为也接受显式互补STATE的充分恒真条件；同时修复有限逻辑求值。T07原结构的dev/stage/prod排除关系正确，只更正dev与dev环境等标签的等价比较。两项保留初始评分，比较器变化不包装成模型提升。

S11/T09真实指代竞争保持未决；明确读取、独立发送/接收等事实仍保留。工具未指定与角色类别疑问可局部显示，不污染独立事实；未知业务观测仍UNKNOWN。无业务文件读取、动作执行或ADMIN代答。

最终重复结果见[REPEATABILITY.json](REPEATABILITY.json)，所有9次均保留；不按JSON节点数、ID一致或全RESOLVED计分。旧13例同旧摘要回放用于前期接线自检，不计为新合同模型验证；旧245/105/350和长文本未运行。

## 真实调用、耗时与异常

[CALL-PERFORMANCE-AUDIT.json](CALL-PERFORMANCE-AUDIT.json)逐请求记录文件、会话、资源摘要、Schema、工具、用量与耗时：81次启动，80次成功返回，1次用户界面操作错误后主动取消；共40个完成的真实解析/审阅运行。取消的是误录非规定文本，不进入语义分母，回执保留于actual-cancel。没有漏算这次调用。

完成运行的两阶段模型累计时间：最短55.057秒，中位113.211秒，最长202.409秒。页面计时还包含本地准备等开销；不是生产P95/P99保证。额度/成本未披露，成本记录未知。取消只证明本请求本机子进程退出，云端是否停止计算或计费未知。

正常每次两次真实调用；最终批次无语义修订。登录/额度错误不自动循环重试；传输/格式重试有界。测试Provider只用于工程异常路径，明确标识，不计入上述真实语义结果。

## 使用、安全及重启验收

实际浏览器完成输入、上传、提交、阶段查询、刷新同run、来源高亮、JSON下载、未决查看、评价保存和历史恢复；没有浏览器error/warn。浏览器下载JSON与对应最终文件一致。截图：[UI-RESTART-S00.png](UI-RESTART-S00.png)、[UI-T09-UNRESOLVED.png](UI-T09-UNRESOLVED.png)。

受控重启前核对旧进程身份且无在途请求，随后只停止目标本地服务，隐藏启动PID27880。重启后HTTP200、历史列表共41条保持一致（本轮16条服务记录＋旧历史25条原格式只读），自动新增调用0；独立CLI/批量运行的全部测试另存本轮报告目录，不冒称都在UI历史中。证据：[RESTART-BEFORE.json](RESTART-BEFORE.json)、[RESTART-AFTER.json](RESTART-AFTER.json)。初次检查脚本把JS的undefined属性与JSON省略属性直接比较，已按序列化数据比较；服务/运行结果未为此修改。

取消实际Codex子进程有退出回执；取消/超时、无关子进程存活、晚到响应不能变完成、重复/忙碌、INTERRUPTED不自动重跑等另有无模型测试。空白、300/301码点、BOM/CRLF/非BMP字符、无效UTF-8、不截断、跨源/无会话、路径穿越、任意输出路径、输入脚本转义、错误信息脱敏均通过相关测试。未实测云端计费停止或原生Skill加载，未写成PASS。

运行和导出使用宿主固定目录，不读取输入提及文件；模型请求没有预期/Gold、历史答案、评测目录或业务工具。未来用户任务和评价仅存本地`.boundx/7plus1-short/`，不随本次Git提交。

## 保全、封存与停止

[LOCAL-PRESERVATION.json](LOCAL-PRESERVATION.json)确认本轮开始的160项已有tracked修改/删除字节与存在状态均保持不变；原UI修改前字节另在本地备份。仅显式暂存029核心、原UI必要文件、启动脚本和本轮受测证据，不吞入无关改动，不删除本地中间结果。

两份原有未跟踪产品入口测试只在本地运行，未修改、未纳入提交；运行日志和来源摘要保留。源码/Skill/前端逻辑的diff whitespace检查通过；原始失败输出、Node测试stdout和未改的原CSS有6处空白/结尾空行提示，保留原字节，不为消除提示改写证据。

MANIFEST说明提交证据的选择范围；初始失败、最终候选/审阅、最终完整Trace和重复性均可复核，重复中间编译文件仍留本地。SHA256SUMS校验payload，SEAL固定清单与摘要文件本身；提交身份以Git commit为准，不制造自引用摘要。

完成后只推送review/7plus1-parser，不merge/release/tag，不部署。停在WAITING_ADMIN_REVIEW。本轮没有待完成交付功能；下一步是ADMIN检查受测短文本语义与使用体验，不自动扩大范围。
