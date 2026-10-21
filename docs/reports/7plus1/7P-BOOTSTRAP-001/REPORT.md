# 7P-BOOTSTRAP-001：Parser 开发与 GitHub 审阅通道

PRODUCTION_READY=false
PARSER_MODIFIED=false
BXP_PROTOCOL_MODIFIED=false
MAIN_MERGED=false
RELEASED=false
STATUS=WAITING_ADMIN_REVIEW

## 1. 共性问题与本轮边界

当前目标固定为自然语言→结构化语义→Boundary IR→Canonical 7+1；不开发 Formal Boundary Model、Boundary Result、Admission、Host Enforcement。本轮建立代码审阅通道，不修 P3 语义错误，不修改 Gold/协议定义。

## 2. first divergence 与根因

本任务是交付组织任务，无新增语义 first divergence。P3 首次评测原封存不变：49完成、T40断言异常；初步42项错误确定、75项明确遗漏等仍存在。共性机制为话语/否定层、对象角色与数量目标、边界覆盖/条件组合；没有用Golden通过或回归数声称已改善陌生文本。旧P3归档留在本地，不在每个任务重复提交50份Trace。

## 3. 真实调用链及迁移决定

实际入口 scope-consistency-repair/engine.mjs，实际58618由P3 adapter调用同一冻结server。完整模块及摘要见 CODE-MAP.md/RUNTIME-MAP.json。源路径迁移本轮延期：URL-relative模块委托、Python ROOT父目录深度、硬编码资源根和冻结历史/导出链均需要独立路径迁移验证。src/producer/7plus1/建立固定命名空间与说明，没有复制第二套独立Parser，也没有伪造新引擎。根npm脚本仍指向旧P2，真实新版本运行命令为 node research/7plus1-parser/v0.3-p2.2-scope-consistency-repair/server.mjs（离线资源需已安装）。

model-signals→product包工具含已有静态 BXP 导入。review镜像按实际依赖保留已有源码/Schema，不因此新增或运行形式化/Admission开发。它们在diff中是本地先前成果的镜像，不是本轮对协议的修改。模型权重/虚拟环境不提交。旧工作目录branch/index与既有未提交工作保持。

## 4. 本轮通用组织机制

建立 docs/tasks/7plus1/、docs/reports/7plus1/、src/__tests__/7plus1/、fixtures/7plus1/golden/；发布使用单独Git index形成review/7plus1-parser快照，不将整个脏工作区 git add。目录归位后的新测试采用数据驱动输入和摘要比较，Parser不读取测试ID或答案。镜像保留原字节，.gitattributes给冻结源码/证据指定-text，避免CRLF变换造成假摘要变化；该变化不涉及语义。

## 5. Golden 与完整真实运行

REF-001 按本次ADMIN显式授权建立 GOLDEN_CONFIRMED，原文及 expected-semantic/BoundaryIR/7+1/unresolved/evidence来自已审定的scope修复封存；不是用本轮结果反向改答案。“上述材料”多个可兼容材料域继续保持 UNKNOWN/HUMAN_REPAIR_REQUIRED。

真实 parse7Plus1 完整原文重放使用 HanLP/spaCy、BGE-M3/E5/NLI，43语义断言/15范围检查均通过，保存的完整结构与参考相同。首次test-one.js式内存对象深比较返回exit1，仅semantic_nodes项false；保留首次RESULTS，JSON离线审阅证明全部已保存字段完全一致。JavaScript临时undefined属性与JSON表示不相同，不删除任何业务字段、不改Parser、不重新解析改答案。见 GOLDEN-VALIDATION-ADJUDICATION.json；不把首次exit1伪称exit0。

## 6. 改善与仍失败样本

没有语义机制变化，没有新样本改善主张。EXP01原50条的位置/摘要已收集，全部仅 GOLDEN_CANDIDATE，尚未迁成 REF-002… 或独立审定。P3 已知错误保持；REF-001仅一个会议参考，不代表通用准确率。

## 7. 回归

本轮实际重新运行：新位置44 pass/0 fail（3项Golden完整性+41个保存NLP信号native回放）；当前scope/meeting/P22回归521 pass/0 fail；全量现有2659 tests，2642 pass/0 fail/17 skip。三组有重叠，不合加为独立样本数量。完整模型Golden重放1个Case的43语义断言另列。没有训练/阈值/Pack变化。运行前后2825冻结/旧封存文件核验一致。

## 8. 历史 Real Gold 60 追加交付

REAL_GOLD_60_UPLOADED = 60/60
REAL_GOLD_60_PATH = review-assets/7plus1/real-gold-60/adjudications-r02/

1,841文件，7400116字节；原目录、rev层级、ACTIVE-REVISIONS及所有TASK/Gold/Evidence/Review/公式和状态原字节保留。本次仅作为待按当前方法重审的历史候选，不将它们升级GOLDEN_CONFIRMED。omitted=[]。源/副本摘要见 REAL-GOLD-60-COPY-MANIFEST.json，提交对象摘要再次验证后才push。

## 9. 审阅镜像与可复现范围

仓库joinwell52-AI/BoundaryXP已核实为private；固定分支review/7plus1-parser；BASE_COMMIT=dba4cc8cf09112f5b885dbcec828ee71e904e8ea。仅推送该分支，不开PR、不merge、不tag、不release、不触发Actions（现有workflow仅main push/PR）。发布SHA及远端核验在PUSH-RECEIPT.json；commit不能把自己的SHA写回自身报告。

Git镜像纳入实际源码/合同/受依赖Schema、模型调用脚本、冻结L1/L2定义、专属测试与41条紧凑NLP回归fixture、一个Golden及历史60资产。旧测试源码仍在原tests/位置，因引用本地大量旧研究Trace，其全部旧资产不在此次重复提交；可移植44项回归使用新fixture。完整2659项回归是当前D:/boundx本地执行，不冒称新clone无需历史资产即可执行。模型本地venv和权重必须独立准备；没有把下载等同实际调用。

每个任务提供compact RESULTS/FAILURES/三层diff和所需证据，不上传几十份重复Trace。本轮完整单会议Trace仅本地保存，Git保留Golden与完整重放结果/摘要以供审阅；没有失败案例被删除或封存覆盖。所有已存在trace不改。

## 10. 当前Parser状态与停止

PRODUCTION_READY=false。Parser仍有限覆盖且P3语义缺陷未修。Bootstrap完成后停止等待ADMIN下一任务；不开始canonicalization、语义补丁或协议后续阶段。
