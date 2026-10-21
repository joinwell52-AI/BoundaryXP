# 候选IR的确定性观测接口

观测是调用者明确提供的运行记录，不是LLM候选、构造见证或业务授权。`evaluateDirectObservations`与`evaluateDirectEventPolicies`共用表达式解释器，不扫描原文、label或note。

完整观测对象支持`events`、`states`、`state_instances`、`quantities`、`inputs`、`time_unit`、`closed_world`。未提供事实保持UNKNOWN；只有明确确认完整的域才能据缺席判未发生。未违反某条规则不等于获准执行。

事件用`event_id`标识发生，重复实例另用`template_id`与非负整数`instance`确认模板身份。运算引用的实例身份为模板ID和索引，不是传输记录的随机ID。`operation`、`owner_id`、`occurred`、`roles`、`start`、`end`由调用者提供；多名接收者放在RECIPIENT数组，不覆盖为最后一个。

普通状态放在`states[state_id]`。重复实例状态用数组逐个提供，例如：

```json
{
  "state_instances": [
    {"state_id":"attempt_pass", "subject":{"kind":"EVENT","id":"attempt@0"}, "value":false},
    {"state_id":"attempt_pass", "subject":{"kind":"EVENT","id":"attempt@1"}, "value":true, "established_at":6}
  ],
  "time_unit":"min"
}
```

同一状态与实例不能重复提交相互竞争的观测。未标明实例的真状态不能替代所有尝试；前次通过不能替代本次通过。状态成立时点、动作起止点及必要条件检查时点分别核对。

数值观测`quantities[variable_id]`包含`value`、`unit`、`target_id`；单位和目标绑定必须与IR一致。数值加法使用精确十进制累计。静态联合求解的条件区间记录在`problem.guarded_intervals`，最终取值逐条复核，不能拿未激活分支的上限约束当前分支。

`conditional_gaps`保留某动作发生时尚未求明的匹配。构造见证可选择不执行可选动作；这一选择列在`witness_branch_assumptions`，不是新增源文义务。如果动作是独立必需的，不能用“不执行”消除缺口，也不能将有限分支搜索失败直接宣布整个边界无解。

可行见证、实际观测满足、全执行分支覆盖是三种不同结论。接口始终保留`business_decision=null`、`execution_authorization=null`。
