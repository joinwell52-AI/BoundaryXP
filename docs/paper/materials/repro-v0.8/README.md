# v0.8 数学复现包

本包复现论文v0.8的有限数学实例和表示不变量，保留v0.7的既有数学问题，并增加来源对应和辅助定义两组检查。旧稿及旧包原字节独立保留。它不解析任意自然语言，不实现产品Core，不调用模型、网络或第三方求解器。协议文件为原字节研究快照。

## 运行

需要 Python 3.10 或更新版本，仅使用标准库。在解压后的本目录执行：

```sh
python verify.py
```

程序核对 MANIFEST.json 中的全部文件摘要，重新运行原有16项数学算例，并读取显式有限模型，逐项比较 expected.json 和 actual.json。核验失败返回非零退出码；默认只读，不覆盖已有结果。首次生成本版实际结果时使用了 `python verify.py --record actual.json`；该选项拒绝覆盖任何已存在文件。

## 材料顺序

1. `sources/parent.md`：仓库 ADM-001 环境核查原文的逐字节副本，原位置与摘要见 `source-origin.json`。这是保存于开发材料的完整任务；本包未将其声明为 Gold 或独立抽样的真实客户任务。
2. `sources/good.md`、`bad.md`、`ambiguous.md`、`inconsistent.md`：本次为方法说明构造的候选分解，具有显式作者来源，不冒称既有运行记录。
3. `case-definition.json`、`source-ledger.json`、`candidate-source-ledger.json`：人工声明的命题、对象身份、语义层级及父／候选精确来源。偏移是 UTF-8 解码后 Unicode 码点的左闭右开位置，不是字节偏移；原文件字节另用 SHA-256 标识。
4. `ir.json`：论文研究记法的7+1视图、共享对象及覆盖记录。它不是 `boundx-task/v1` 的新增 wire 格式。`verify.py` 重建 Project/Recover 并逐项比较节点、参数次序、引用和覆盖。
5. `models.json`：父模型、四种候选模型、显式映射及有限赋值域。程序在这些已给定操作数上穷举。由人工声明的原文解释到模型的对应仍需语义审查；复算不自动证明抽取正确。
6. `expected.json`、`actual.json`：事先写定的数学预期与本次实际结果。完整见证包含候选赋值及其父空间像。
7. `legacy/verification-v0.3.py`、同名 JSON、`legacy/inputs.json`：原16项脚本和结果保持原字节；输入清单另列。历史脚本中的 v0.3 标识和旧命题编号按原样保留，不表示当前章节号。
8. `contracts/`、`contract-origin.json`、`MANIFEST.json`：协议、Profile、Schema、状态规则及语义合同的原字节快照、版本和摘要。论文有限算子合同为 `PAPER-FINITE-08.1`，不是已注册的BXP Profile。

## 判定含义

`PRESERVED`、`VIOLATED`、`INCONSISTENT`、`UNDERDETERMINED` 是本包对明示数学问题的标签。BXP 的边界 State 与候选符合性分别保存在 `bxp-abstract-summary.json` 中；该文件只是抽象结果对应示例，不是协议认证结果。语义解释范围明确限定为人工列出的研究解释，发布准入未作出，业务裁决与执行授权均为 null。

补充材料共16组。既有14组的输入及判定含义沿用v0.7；`interface-inputs.json` 另给出两组独立操作数：

- 来源对应：原任务要求p，分别比较无依据加入q、遗漏p，以及加入p蕴含的冗余条件。完整性与健全性分别计算，并保存区分赋值。
- 辅助定义：在明确的有限样本域核对max定义的唯一扩展、错误否定／异或的伪反例，以及共同定义背景下的正确查询。另用max(t,0)≤1核对非平凡反例的投影。原语义直接用数学max运算解释，与辅助定义式分别计算。

两组检查检验所列实例，不证明一般自然语言来源对应或自动生成转换τ。辅助定义在任意支持域上的一般性质由正文的定义扩展条件及证明承担。`exact_domain_example` 仅核对给定有限域的DΣ对应。

本包可以离开仓库独立运行；未包含私钥、依赖、模型、其他项目或历史完整运行包。本次仅在私有工作区制作，未公开发布。
