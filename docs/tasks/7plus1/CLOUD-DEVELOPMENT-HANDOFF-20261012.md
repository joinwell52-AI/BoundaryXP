# 7+1边界计算器：云端开发交接

## 本次ADMIN授权与执行地点

2026-10-12，ADMIN明确要求“把开发任务交给Codex云端；58618我本地同步代码就可以测试了”“云端开发，本地机器可以关机，然后继续开发”。本文件将现有开发任务交给云端执行，不另建解析器或产品原型。

仓库为私有`joinwell52-AI/BoundX`，唯一交付分支`review/7plus1-parser`。开发基线提交`19e239c349ad2bb32d753e4b553e5eae66793085`，后续交接提交仅增加本文件、实际运行证据与便携回放脚本。开始前核对HEAD和分支；本文件是本次云端续作入口，CURRENT-TASK及AGENTS中的历史短文本/NLP/Trace专项停止记录不替代本次最新授权。

云端使用它实际签出的仓库根目录；`D:\boundx`是用户本地的安装和验收位置，不要求在云端伪造D盘。任务文本中的业务动作仅作为Parser输入，不执行。旧封存、Gold、源文及人工标准不覆盖。

这是待云端执行的交接材料，不表示云端任务已启动或修复已完成。

## 唯一产品与方法

沿用`research/7plus1-parser/llm-first-028/`核心、两个Skill、共享candidate IR合同、`src/bxp/`计算模块及现有UI，维持：

```text
原文 → LLM直接候选IR → 独立新会话审阅
     → 程序技术校验 → 同源7+1视图与确定性边界计算
```

LLM解释语义；程序不得扫描原文、label或note补答案，不用旧NLP反推IR，不对标准文本、实体或case ID写补丁。模型自审、Schema合法、正常分支有解均不等于完整语义验收。business_decision和execution_authorization始终null。

完整阅读：

1. `docs/testing/7plus1/MANUAL-TEST-001.md`及同目录TXT。
2. `docs/BoundX-7plus1-定义原理语义编译与边界计算说明-v0.4.md`。
3. 核心中`contracts/candidate-ir-v1/CONTRACT.md`、Schema和两个Skill。
4. `docs/reports/7plus1/DIRECT-IR-REPAIR-ui76/REPORT.md`，其旧封存不改。
5. `docs/reports/7plus1/MANUAL-TEST-001-ui76-FIRST-RUN/REPORT.md`及全部对应证据。

## 已运行的真实基线

本地安装ui76 / `direct-ir-r04.1-test` / `candidate-ir/1.4`。真实首次运行`7671553d-7b8d-4a82-906a-2db224be43ab`，Source SHA-256：

```text
0b9b336d11a39a5e50d3ac361025211a742abe3c9578403098d3e3bcb45fda70
```

实际模型解析一次432.490秒、独立审阅一次178.612秒；整体613.143秒，无返工重试。实际服务端模型未暴露，不能把requested_model冒称已确认的actual_model。

八槽RESOLVED，技术无错误，计算CALCULATED、gaps为空。输入2、报告3、交集空、并集5；区间[0,30]分钟；完成IFF 16满足/16违反、前提1真/15假；正常完成分支构造30分钟见证且142项核验通过。人工MD的16分钟见证与30分钟见证均合法，不能为追人工表的具体时间修改模型。

## 当前需要关闭的问题

### 1. 局部必要条件与动作激活

标准第六节要求生成/交付开始时QA已通过；局部限制是动作激活后检查必要前提，不能由该局部门额外制造无条件QA成功义务。

实际IR的`r_summary_generation_gate` / `r_summary_delivery_gate`以动作为subject，body为TRUE_AT_START，applicability为null；消费者将CONSTRAINT body无条件加入Φ。具体证据：

```text
true ⇒ local_passed_at_generation
local_passed_at_generation ⇒ review_passed
```

隔离局部门及其STATE链接、排除其他独立义务，固定G=false、Q=false，预期`G⇒Q`为真，程序却无解。这是局部公式不等价证据。不能用全任务的G=false/Q=false是否有解证明同一问题，因为任务另有独立生成/交付义务。

对照真实合同确定修复应落在IR表达、消费者或二者闭环；统一主任务全局CONSTRAINT与局部动作CONSTRAINT的消费语义，不机械对全部要求加事件发生保护。补通用正反例，并检查纯BEFORE、TRUE_AT_START、条件义务、全局环境、输入范围、完成公式不被削弱。

### 2. 时序反例求解没有给出确定结果

相同冻结problem加查询假设：

- PM开始生成早于QA通过：MD应违反，求解UNKNOWN / SEARCH_CAPACITY。
- QA开始早于DEV提交完成：MD应违反，求解UNKNOWN / SEARCH_CAPACITY。

先定位通用布尔传播/活动边/矛盾检测瓶颈，不以增加搜索上限、删约束或将UNKNOWN改PASS作为修复。保留原始查询回执，输出可验证的冲突依据。

### 3. 使用依赖及实际观测消费

九条输入/报告DATA_USE身份关系已在IR中。完整标准还要求材料使用点可用、错主体/对象/接收者、同名异物、阶段与时间等反例被正确核查。当前`calculateDirectIR`收到非空observations会报告`DIRECT_IR_OBSERVATION_BINDING_NOT_IMPLEMENTED`；不能把结构存在或构造见证当成已完成所有实际观测校验。

同一核心内补必要消费者能力和标准局部条件变体；按标准分开静态计算、构造见证与观测求值。不将高危触发H强行置false，不补恢复许可，不因停止模式未命中授予权限。无时点的continue布尔量不能证明继续发生在停止期间，避免用不充分探针制造错误结论。

### 4. 清晰展示与交付

原中文有重复“必须：true”，条件分散在后续要求行，全局环境被列于R。修复同源展示，让用户看清对象、主体、条件、用途、依赖、具体运算值及未支持项；不靠隐藏诊断或改评分通过。原UI保持，最终结果包括数学集合、区间、图、逻辑与联合/反例结果。

## 云端开发及验证

Node.js须满足package.json（>=22.18.0），按锁文件安装依赖，默认命令：

```sh
npm ci --ignore-scripts
node scripts/replay-manual-001-cloud-handoff.mjs
node docs/reports/7plus1/MANUAL-TEST-001-ui76-FIRST-RUN/compare.mjs
node --test tests/direct-candidate-ir.test.mjs tests/direct-ir-ui-tabs.test.mjs tests/direct-ir-closure.test.mjs tests/direct-ir-input-closure.test.mjs tests/boolean-solver.test.mjs tests/boolean-boundary-comparison.test.mjs tests/formal-boolean-model.test.mjs
```

回放脚本从仓库证据加载同一真实IR/audit，不调用模型、不依赖`.boundx`安装、D盘路径或本地登录，并将新结果写入独立目录。先重现，再做通用实现与测试，原失败和冻结证据保留。

本次迁移未授权购买额度、换模型或收费通道，也没有把本地Codex凭据传到云端。程序嵌套`codex exec`与云端开发agent的认证是两回事，不假定自动可用。云端优先完成无模型修复/同响应回放；如改Skill/Schema，回放不能算新版模型准确性验证，清楚列出本地需要补的真实验证。代码修复无需因此停在原因报告。

不依赖、不新增、不触发GitHub Actions工作流。依赖下载和GitHub权限按云端环境正常配置，遇到权限/网络拒绝如实记录，不绕过。保持私有，不merge/release/tag，不发布npm/PyPI。

## 云端交付与本地58618测试

全部代码、测试及新报告只提交push到`review/7plus1-parser`。给出提交号、真实回归成绩、未决，以及只用干净GitHub签出即可构建的完整候选入口。现有ui74 builder依赖本地上一版目录，不能冒称干净签出已能直接构建；在同一product封装补齐可复现打包入口，避免传不含完整资源的混版目录。

云端不能停止、重启或安装用户电脑的58618。当前本地ui76保持不动。用户开机后先保护D:\boundx已有未提交改动，以独立干净目录签出云端提交，验证完整包；核对58618实际版本、空闲与备份后，本地受控升级同一58618安装。不能对当前大量改动的D:\boundx直接git pull/reset/clean，也不能仅git pull后宣称安装已更新。

交付的是云端可继续开发的仓库状态及本地可执行安装路径，不迁移历史服务地址、不新建另一套产品。只在已完成授权工作或真实阻断时提交真实结果，停于WAITING_ADMIN_REVIEW。
