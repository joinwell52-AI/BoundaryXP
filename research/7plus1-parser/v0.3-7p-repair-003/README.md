# 7P-REPAIR-002

在 7P-REPAIR-001 冻结语义链上增加结构化恢复层：文件输入/交付角色、依据关系、表格行命题、验收组合和输出内容归属。只在真实结构及谓词证据成立时产生关系。未知表头、非唯一归属和未覆盖构式保留未决。

CLI / UI server 共用本目录 `engine.mjs` 的 `parse7Plus1()`；`projection.mjs` 与上一版原字节一致。旧 58618 不自动切换。

```sh
node research/7plus1-parser/v0.3-7p-repair-002/server.mjs
```

若 58618 已占用，先结束原服务进程，再用上面的命令启动。本轮不宣称生产可用，不把合同检查等同于语义正确。
