# ui98边界提取效率修订

2026-10-14。用户已明确验收口径：**300字符任务，解析LLM首次生成完整边界的耗时少于60秒**。独立审阅、局部修订、程序处理与总耗时分别记录，不纳入该60秒指标。速度与完整准确性分别核验；快速输出但遗漏边界仍不通过。不把超时截断或后台未完成当作生成完成。

用户选择“暂不追加，我在58618测试”。原开发定向4个保守请求已用完，账本保持原样；本次新增模型请求0，不重新运行002，不改变模型或推理强度。

## 第一轮优化实际内容

候选传输升级为boundx-boundary/2，共用candidate-ir/2.0和唯一Core。表达式的literal/unit/bound_variable全部为空时传parameters:null，否则保留三个原值。展开只恢复固定字段与引用，不扫描原文、label或note补语义。false、精确0、单位、binder、身份与来源均保持；旧v1响应可读。审阅摘要绑定完整展开IR，按对象键排序消除字段排版差异；数组顺序和值仍参与摘要，改值必不匹配。

审阅正文不重复携带整份解析Schema；程序仍执行同版Schema检查，审阅自己的输出Schema仍由CLI交付。算子表仅移除求解器support标签，保留全部算子、类型签名、参数数量及binder规则。两份Skill要求短ID、同来源同作用域内复用相同表达式，避免执行见证及逐节点长篇解释；独立审阅仍核对完整原文。

## 无模型测量

使用ui95真实002保存IR机械转换，不重新生成、不修饰首次失败。

| 测量项（字符） | ui97资源 | ui98资源 | 变化 |
|---|---:|---:|---:|
| 解析正文资源 | 14880 | 13444 | 减少9.65% |
| 审阅正文资源 | 22973 | 13192 | 减少42.58% |
| 同一候选紧凑JSON | 33628 | 31416 | 减少6.58% |
| 解析通道Schema | 8257 | 8386 | 增加1.56% |

上述正文不含原文、候选、通道Schema和封装，不是总请求token量，更不是实测耗时降幅。转换后IR全字段深度相等，旧问题原样保留。只压空字段不足以证明60秒目标；新模型的实际短ID、表达式复用、正确性与时间均待真实测试。

无模型验收138/138通过，覆盖Core、回执/修订、同源投影、UI及新传输正反例。首次回归137项中1项仍期待旧资源版本名，已按实际r02资源身份更新断言后完整复测；没有修改数学或语义通过条件。新测试确认false/0/单位/binder无损、未知与冲突参数拒绝、审阅摘要防篡改、旧格式保留、全部算子语义字段不变。

## 实际安装与同步

- 58618已实际运行 `0.1.0-candidate.031-r1.2-ui.98`；Core入口标识`declarative-boundary-r02-test`，资源`IR_DECLARATIVE_BOUNDARY_R02`。
- 源码提交`fb0f8c80b09a6fcaf1e32fadd8c8afd54a3692d9`；完整249文件运行包位于`.boundx/ir-kernel-implementation-v1/products/verified/0.1.0-candidate.031-r1.2-ui.98`。
- Manifest SHA256：`9061ccdb076c72242e1ec3f32c210d3f219c2dc1af203071d654027506254611`。
- 确认ui97 PID31180及无在途请求，备份后正常升级，原npm入口启动ui98 PID35740。100条历史、2602份既有文件及配置摘要不变；六种导出HTTP200，保存的IR/审阅/校验/7+1/计算结果不变。
- 最新用户ui97运行`372332c3-99c5-4c3b-99bb-231ebdf02d14`于本地15:18:58结束，保持原样；它不是ui98的真实模型验证。
- 启动：D:\boundx下`npm run 7plus1:ui`。地址http://127.0.0.1:58618/。
- 回滚：确认目标空闲并停止目标后，执行已安装ui98的`product/short-compiler/deploy.mjs rollback --home D:/boundx/.boundx/short-compiler-031-r1 --confirmed-idle`，再运行同一npm入口；previous为ui97。
- 备份`.boundx/short-compiler-031-r1/backups/ui98-prestop-1791962386116`；本地证据`.boundx/ir-kernel-implementation-v1/evidence/declarative-ui98/`内BEFORE.json、AFTER.json、MEASURE.json及验证脚本。

状态：待用户实测，速度与完整产品语义验收均未宣布通过；WAITING_ADMIN_REVIEW。仅推送review/7plus1-parser，不merge/release/tag。
