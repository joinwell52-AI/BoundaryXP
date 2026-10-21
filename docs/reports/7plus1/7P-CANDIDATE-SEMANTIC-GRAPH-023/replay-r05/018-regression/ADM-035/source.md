QA 读取 before.json 和 after.json，对比失败用例及耗时变化，生成 regression-diff.md。必须分别列出新增失败和已消失失败。不得修改 Parser、模型或阈值，PM 将结果提交给 ADMIN。

**审阅重点：** 差异方向保持；三个禁止对象；耗时观测不等于任务时限。