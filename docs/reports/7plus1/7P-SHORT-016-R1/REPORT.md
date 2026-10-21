# 7P-SHORT-016-R1

**G4_REF001_REGRESSION; STATUS=WAITING_ADMIN_REVIEW; PRODUCTION_READY=false.**

按当前指针与 ADMIN D07 裁定恢复 G3。冻结实现以真实 HanLP/spaCy 重放全部八案，完整 Canonical 7+1 与同案 I/O/A 都为 **8/8**。G0/G1/G2 保持 PASS，G3 PASS；八案 wrong_binding=0、unsupported_RESOLVED_extra=0、duplicate_semantic_identity=0。

|Case|I|O|A|P|R|V|C|B|Full|Joint IOA|
|---|---|---|---|---|---|---|---|---|---|---|
|D01|MATCH|MATCH|MATCH|MATCH|MATCH|MATCH|MATCH|MATCH|true|true|
|D02|MATCH|MATCH|MATCH|MATCH|MATCH|MATCH|MATCH|MATCH|true|true|
|D03|MATCH|MATCH|MATCH|MATCH|MATCH|MATCH|MATCH|MATCH|true|true|
|D04|MATCH|MATCH|MATCH|MATCH|MATCH|MATCH|MATCH|MATCH|true|true|
|D05|MATCH|MATCH|MATCH|MATCH|MATCH|MATCH|MATCH|MATCH|true|true|
|D06|MATCH|MATCH|MATCH|MATCH|MATCH|MATCH|MATCH|MATCH|true|true|
|D07|MATCH|MATCH|MATCH|MATCH|MATCH|MATCH|MATCH|MATCH|true|true|
|D08|MATCH|MATCH|MATCH|MATCH|MATCH|MATCH|MATCH|MATCH|true|true|

通用机制保留显式责任补语中的宏目标，通过同 owner、唯一主体、完整读取—生成流程及产物内容证明细化；宏目标留在内部图及 AUXILIARY，不重复投影 I/A。唯一生成文件的包含语句归入 OUTPUT_CONTENT，独立保存成员来源与归属证明。章节存在状态按产物与成员身份区分，不能因共用来源谓词而合并；C 为 AND(产物存在, 每个要求章节存在)。英文依同一类型/语法合同独立闭合。没有修改固定 Q、Schema、模型、Pack、阈值或生产入口。

六条非 Gold 验证最终 6/6；初次 N01/N02 失败记录保留，定位为后续文件提及丢失 FILEPATH 标签。已通过唯一已有产物身份及本地语法恢复，而非样例名特判。数量不一致、多个可兼容产物、OR 连接和不完整宏目标工作流均不强行认证。最初探测的非法 relation 字段被合同拒绝，后续使用现有 rule_refs 记录细化/组成语义，未改 Schema；probe-r01 原始错误仍保存。

**G4 FAIL。** REF-001 legacy 断言 41/43，失败项为 performer_identity_one、completion_AND。完整 Canonical 对比仅 O/R/V MATCH，I/A/P/C/B 尚未闭合。相同 fresh NLP 同时经过封存 016 control 与 R1，完整类型化语义签名一致；问题已经存在于 016，不能说本轮新增回归，也不能因未新增回归把 G4 改为 PASS。新增 P“沈悦”与已有“编辑沈悦”重复；C 的 AND 条件未保持。没有越界补会议短语或改变 REF Gold。

“上述材料”仍为 UNKNOWN_REFERENT/UNRESOLVED，B 的对应上传禁止事实保持 UNRESOLVED。首次只读审计错误把无投影 ENTITY 候选也计入歧义检查，AUDIT-CORRECTION.json 明确纠正为 true；原始首跑 Trace 和审计均不覆盖。

专项 19/19（0 fail）；014 保留断言重定向至 R1 为 26/26（0 fail）；原 Parser 回归 4307/4307（0 fail，0 skipped，状态 PASS）；全仓库 npm test 状态 PASS，6219/6236（0 fail，17 skipped）。完整真实日志与命令见对应 REGRESSION.txt/json；失败未改为 PASS，原仓库入口测试不能替代候选 semantic Gate。

八案加 REF-001 均 fresh NLP 重复，节点/关系/Eligibility/IR/Canonical/Proof/未决/coverage 全部 EXACT；没有忽略失败语义。运行成功不等于 REF 完整语义成功。旧封存和 10408 个已跟踪文件原字节/既有缺失状态核验 PASS。

仅在 review/7plus1-parser 追加隔离候选、测试与报告；没有 merge/release/tag/生产切换。封存后停止等待 ADMIN Review，不启动 Hybrid、WP、Matrix 或新的语义补丁。
