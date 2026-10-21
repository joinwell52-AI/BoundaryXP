# 五组真实重复测试

每组包含首次及两次额外运行，全部原始输出保留。不能以ID/JSON字面一致代替语义一致。

| Case | 首次 | 额外1 | 额外2 | 完整正确/3 | 判定 |
|---|---|---|---|---|---|
| Q07 | PASS | PASS | PASS | 3/3 | CONSISTENT_AND_CORRECT |
| Q20 | PASS | PASS | PASS | 3/3 | CONSISTENT_AND_CORRECT |
| Q25 | PASS | FAIL | PASS | 2/3 | SEE_PER_RUN_DIFFERENCES; do not equate stable errors with correctness |
| Q29 | PASS | PASS | PASS | 3/3 | CONSISTENT_AND_CORRECT |
| Q30 | PASS | PASS | PASS | 3/3 | CONSISTENT_AND_CORRECT |

## Q07

first/Q07：首尾候选相同。中文及I组织范围、P组织者/汇总者和UNSPECIFIED均保真；检查未变PM/QA独立义务。类型元数据未决与真正指代歧义分开。 [Trace](runs/first/Q07/run/trace.json)

repeat-1/Q07：额外第一次实际调用重新审阅；与首轮相比多拆组织/检查事件及内部检查结果，语义等价。检查无默认执行者，真实来源义务完整保留。 [Trace](runs/repeat-1/Q07/run/trace.json)

repeat-2/Q07：第三次实测与首轮同样以内容检查结构保留范围；第二次拆成任务检查结构，两种都未指定检查执行者。三次完整保留PM组织、QA汇总/生成与未来执行者确定。 [Trace](runs/repeat-2/Q07/run/trace.json)

## Q20

first/Q20：首尾候选及JSON/中文完整保留条件局部性与无条件产物；本案后续两次真实重复仍须独立审阅。 [Trace](runs/first/Q20/run/trace.json)

repeat-1/Q20：第二次实测与首次语义一致。条件中的发现者额外标UNSPECIFIED是原文开放细节，不污染明确OPS通知/生成。 [Trace](runs/repeat-1/Q20/run/trace.json)

repeat-2/Q20：第三次实测仍保持条件通知与无条件产物、明确OPS/PM关系；发现者未单列issue但没有填造角色，开放细节保留。 [Trace](runs/repeat-2/Q20/run/trace.json)

## Q25

first/Q25：首轮数量算子、单位、目标、count_scope和投影视图均符合原文；后续两次重复仍单独审。 [Trace](runs/first/Q25/run/trace.json)

repeat-1/Q25：第二次真实运行不是首轮成功的重复证明：来源含义仍可读，但数量目标编码违反冻结合同，原模型审阅未拦截，技术拒绝并连带阻断O/A/P。实际失败完整保留，不重跑到正确。 [Trace](runs/repeat-1/Q25/run/trace.json)

repeat-2/Q25：第三次运行正确，不覆盖第二次失败：数量目标恢复报告，原技术检查接受，O/A/P完整；该组最终2/3，存在真实重复波动。 [Trace](runs/repeat-2/Q25/run/trace.json)

## Q29

first/Q29：真实来源歧义保留也是整案PASS；歧义对象的技术UNRESOLVED不是额外语义缺陷，全部明确动作/关系未污染。 [Trace](runs/first/Q29/run/trace.json)

repeat-1/Q29：第二次实测再次保持对象歧义局部性；type局部未明没有污染身份/明确用途。原始JSON与中文含同样明确事实和未决对象。 [Trace](runs/repeat-1/Q29/run/trace.json)

repeat-2/Q29：第三次再次准确保留它的局部竞争。相较前两次时序状态参数显式带PM，仍指同一读取事件；不造成额外动作或歧义。 [Trace](runs/repeat-2/Q29/run/trace.json)

## Q30

first/Q30：Q29/Q30区别由实际解析保留：竞争它与明确前一个分开。JSON及中文包含same east交付和独立port，没有变成两份交付。 [Trace](runs/first/Q30/run/trace.json)

repeat-1/Q30：第二次实测与首次明确指代一致，接收对象只east；保留独立读取两份以及OPS产物。 [Trace](runs/repeat-1/Q30/run/trace.json)

repeat-2/Q30：第三次明确指代正确，与前两次等价；角色类别疑点没有感染用途。最终Q30三次均完整正确。 [Trace](runs/repeat-2/Q30/run/trace.json)
