# 007 联合完整匹配基线

这是封存 006 的只读派生，尚未执行 007 实现。当前 joint complete match = **0/9**。

各分数是人工条目的局部匹配数量；I_MATCH / O_MATCH / A_MATCH 是该样本该槽的完整语义匹配判断，不能用局部命中代替。基线沿用 006 原判断，没有重新审定 Gold 或改写结果。

| STANDARD | I 条目 | O 条目 | A 条目 | I_MATCH | O_MATCH | A_MATCH | Joint |
|---|---:|---:|---:|---|---|---|---|
| SWAI-001 | 2/3 | 1/3 | 1/5 | false | false | false | false |
| SWAI-002 | 0/4 | 0/9 | 0/6 | false | false | false | false |
| SWAI-003 | 0/6 | 0/8 | 0/6 | false | false | false | false |
| SWAI-004 | 0/5 | 0/5 | 0/7 | false | false | false | false |
| SWAI-006 | 0/2 | 0/4 | 0/6 | false | false | false | false |
| SWAI-007 | 0/7 | 0/1 | 1/5 | false | false | false | false |
| SWAI-008 | 6/10 | 1/5 | 1/5 | false | false | false | false |
| SWAI-009 | 0/6 | 2/6 | 2/8 | false | false | false | false |
| SWAI-010 | 0/6 | 2/8 | 2/8 | false | false | false | false |

007 完成必须至少出现一个同一样本的 I_MATCH && O_MATCH && A_MATCH，并提供共同任务节点、工件身份、scope/binding 和原文来源证据链。joint 仍为 0/9 时不得声明完成。单槽增长、专项和全量回归通过均不能替代此门槛。

当前本地及远端 CURRENT-TASK 仍指向 006，未找到 007 任务书。本文件仅准备验收基线，不变更任务指针或自行确定实现方法。
