发现 1 处明确义务被弱化：

- **候选内容**：C 将 `SessionRecoveryCall` 的“是否另建、是否公开”均列为未定。
- **原文短引文**：决议1列出“`Failure` / `Recovery` / `SessionRecoveryCall`”，随后要求“把它们实现为**纯内存 dataclass**”。
- **差异**：原文已要求将 `SessionRecoveryCall` 实现为纯内存 dataclass。A2 / R1 列出的 7 个公开 dataclass 未包含它，只留下公开性及数量口径的局部不明确，不能据此把实现义务也降为未定。
- **最小修正**：在 O 补充该实现义务；C 改为：“`SessionRecoveryCall` 须实现为纯内存 dataclass；是否公开、如何与 R1 的 7 个 dataclass 数量口径对应，原文未明确。”

已核对其余 7+1 边界及必要计算，未发现其他明确差异。原文已有的局部不确定性仍应保留；本次审阅不构成数学或业务验收。