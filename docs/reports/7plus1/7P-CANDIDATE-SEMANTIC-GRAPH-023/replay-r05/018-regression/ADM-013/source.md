DEV 读取 dependencies.lock，按 LICENSE-POLICY-4 核查直接依赖的许可证，生成 license-review.csv。范围不含间接依赖。发现缺少许可证信息时，必须在报告中标记为待确认，不得自动判为允许商用。

**审阅重点：** 直接依赖范围排除；待确认不强判；政策为依据不是输入动作。