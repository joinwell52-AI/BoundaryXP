# 云端候选 ui77：构建、观测与本地受控升级

候选版本 `0.1.0-candidate.031-r1.2-ui.77`，消费者 `direct-ir-r05-test`，共享模型合同 `candidate-ir/1.4`。仍是原有核心、两个 Skill 和 UI；Schema形状和版本不变，两个 Skill 及合同补充了局部激活与独立义务的通用规则。旧资源模型响应的回放不是修订后 Skill 的真实模型成绩。状态 `WAITING_ADMIN_REVIEW`，不属于正式发布。

从私有仓库的干净 `review/7plus1-parser` 签出执行：

```sh
npm ci --ignore-scripts
npm run 7plus1:build-candidate
cd .boundx/products/0.1.0-candidate.031-r1.2-ui.77
npm ci --omit=dev --ignore-scripts
node product/short-compiler/verify.mjs
node product/short-compiler/verify-candidate.mjs ../../../docs/reports/7plus1/MANUAL-TEST-001-ui76-FIRST-RUN ../../../.boundx/verify-ui77
```

最后一项使用同一冻结真实 IR 与审阅，验证包内 CLI、UI 资源和观测 API；只绑定随机空闲端口，不调用模型，不连接用户电脑的 58618。输出目录与候选目录都不可覆盖。包包含完整资源清单及摘要，可单独复制到没有上一版目录和仓库依赖的目录后安装验证。源码修订及构建时间取最后修改运行资源的提交；仅添加交付证据的提交不改变同源包摘要。

原资源默认回放门仍拒绝资源不匹配。验证器明确设置 `allowPriorModelResources=true`，仅允许旧 Skill/说明文本的冻结响应进入当前消费者；记录原/新摘要和旧模型资源适用范围，不绕过来源、Schema或算子合同门。手动 CLI 回放须显式附加 `--allow-prior-model-resources`；该标志不能把旧响应认证为新 Skill 验证。

## 观测接口

UI 可填写实际状态、身份、角色、时点和材料使用；通过已有 `/api/runs/{run_id}/observations` 会话保护接口保存独立观测结果。原始 Source、候选、审阅、Trace 和静态见证不覆盖。实际业务文件不读取，业务裁决和执行授权始终为空。

观测顶层字段为 `events`、`states`、`quantities`、`inputs`、`time_unit`、`closed_world`，未知字段不填。`closed_world.events=true` 是调用方明确确认已列全本次操作，不能由程序默认；缺事件、输入身份或量化域观测不当作空域。`inputs` 是额外明确的外部输入记录，不能用它覆盖或藏掉事件中已有的外部消费。

事件记录包括 `event_id`、`occurred`、`owner_id`、`operation`、`roles`、`start/end`、`external_inputs` 和 `uses`。同名而不同轮次的对象必须用不同 typed identity，不能只改显示名称。未列出的后续事件也可核查任务全局环境与禁止模式；重复实例表达式、有限量词等尚未支持的观测组合明确报告缺口。

```json
{
  "time_unit": "分钟",
  "closed_world": {"events": false, "inputs": false},
  "states": {"state-id": {"value": true, "established_at": 11}},
  "events": [{
    "event_id": "actual-event-id", "owner_id": "ROOT", "occurred": true,
    "operation": "DELIVER", "start": 12, "end": 14,
    "roles": {
      "PERFORMER": {"kind": "ENTITY", "id": "actor-id"},
      "OBJECT": {"kind": "ENTITY", "id": "artifact-id"},
      "RECIPIENT": {"kind": "ENTITY", "id": "recipient-id"},
      "ENVIRONMENT": {"kind": "ENTITY", "id": "environment-id"}
    },
    "external_inputs": [],
    "uses": [{
      "object": {"kind": "ENTITY", "id": "artifact-id"},
      "producer": {"kind": "EVENT", "id": "producer-event-id"},
      "origin": "INTERNAL", "availability": "AT_USE",
      "use_at": 13, "available_at": 10, "available": true
    }]
  }]
}
```

`states` 的键必须引用该候选的状态；上例 ID 是接口占位符，不能直接作为 MANUAL-TEST-001 实测数据。状态的终值和开始时前提分别求值；后来成立不能追认之前动作。停止状态需提供覆盖被检查时点的 `periods=[{start,end,value}]`，区间为 `[start,end)`；无时点或未覆盖阶段保持 UNKNOWN，不推断恢复许可。`quantities` 为 `{variable_id:{value,unit,target_id}}`，单位或目标不匹配为 UNKNOWN。整体期限另核对完整执行记录的起止差，不能把完成公式满足替代按时满足。

## 本地安装升级

先保护 `D:\boundx` 的 202 项历史未提交改动，不在该目录 pull/reset/clean。用独立干净目录取得 ADMIN 审阅的提交：

```bat
git clone --single-branch --branch review/7plus1-parser https://github.com/joinwell52-AI/BoundX.git D:\boundx-cloud-ui77
cd /d D:\boundx-cloud-ui77
git branch --show-current
git rev-parse HEAD
git merge-base --is-ancestor e25ad6a1 HEAD
npm ci --ignore-scripts
npm run 7plus1:build-candidate
cd .boundx\products\0.1.0-candidate.031-r1.2-ui.77
npm ci --omit=dev --ignore-scripts
node product/short-compiler/verify.mjs
node product/short-compiler/verify-candidate.mjs ../../../docs/reports/7plus1/MANUAL-TEST-001-ui76-FIRST-RUN ../../../.boundx/verify-ui77
```

核对分支为 `review/7plus1-parser`、HEAD 等于 ADMIN 审阅的交付提交后才继续。若远端已有更新，先复核新提交，不在已有目录 reset/clean。若已有同名目录，用新的空目录，不覆盖。模型登录仍在用户本地单独核实；上述验证不使用登录、不购买额度、不换收费通道。

升级前核对当前安装 `current.json`、完整清单与 58618 的 `/api/session` 版本/编译器/摘要，确认请求已结束，保存当前配置和数据。只停止已核对的那个本地 58618 进程。云端未执行这些操作。确认空闲后，在候选根目录执行：

```bat
node product/short-compiler/deploy.mjs upgrade --home D:/boundx/.boundx/short-compiler-031-r1 --confirmed-idle
node D:/boundx-cloud-ui77/product/short-compiler/launch-installed.mjs --home D:/boundx/.boundx/short-compiler-031-r1
```

升级器保留旧版本，备份 current/config 及历史数据，依赖和摘要验证成功后才切换指针；保留原配置的同一 58618。启动器核对版本、合同及完整清单，端口存在未知实例时拒绝启动，不停止未知进程或改用其他端口。旧 `D:\boundx` 工作区中的启动文件没有因云端 push 自动升级，因此使用上述新签出启动入口。

全新安装到一个尚不存在的 installation home 时，将 upgrade 换为 `install --home ABSOLUTE_HOME --port 58618`；已有 ui76 应使用升级流程。

回滚须再次核对目标和空闲，在候选根目录执行：

```bat
node product/short-compiler/deploy.mjs rollback --home D:/boundx/.boundx/short-compiler-031-r1 --confirmed-idle
node D:/boundx-cloud-ui77/product/short-compiler/launch-installed.mjs --home D:/boundx/.boundx/short-compiler-031-r1
```

本地须补真实首次解析、新会话审阅与重复验证，特别核对冻结候选中必要条件和独立动作义务是否各自完整表达。单次真实候选的 SUPPORT、技术接受、正常见证及本次机械回归均不等于完整产品语义验收。
