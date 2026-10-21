# 58618 ui220 源码同步与合并

本次按用户授权，将本机58618运行的`0.1.0-candidate.031-r1.2-ui.220`纳入`review/7plus1-parser`并合并到`main`。主产品版本保持`1.3.0-preview.0`；仓库保持私有，不创建发布标签或公开产品包。

## 运行包身份

- 运行清单404个文件，逐文件SHA-256与本机ui220一致。
- 原始清单SHA-256：`00661d15f2b0d6cdb94564124dcd97f2a0507d6da5eba61f68f0c1f8c744ad81`。
- 包专用版本文件位于`product/short-compiler/ui220-package/`，原始清单保留字节。
- 清单中的`source_revision`、`build_entry`及历史修复字段来自原安装，不表示本次Git提交。原ui131包记录保留，其历史构建应检出对应提交。

## 包含的更新

LLM先生成7+1，再解析为数学表达，最终由共享Core计算。此次同步包含当前运行的生成与解析Skill、数学表达和组合计算接口、补丁合并后的身份引用、已保存解析复算、公式与结果展示及原文划词弹窗。

L2为软件与AI行业`0.2.0`。L3为新版企业A名册`0.2.0`，使用花名、岗位别称、任职事实、交付与责任语义，资源摘要为`68a545a3893bce0f9adb587779d241a1afbcc704def3d9701b0ee3a294827b8e`。

ui220保留已明确的关系计算；不需要具体数值即可比较的关系不因缺少该数值而未决。已被数学计算覆盖的附属说明保留为诊断。真正缺失的必要操作数、未知关系、无效来源及不可执行表达仍保留未决；已算出的越界不会被附属诊断覆盖。

## 构建与使用

在仓库根目录执行：

```sh
npm ci --ignore-scripts
npm run 7plus1:build-candidate
node .boundx/products/0.1.0-candidate.031-r1.2-ui.220/product/short-compiler/verify.mjs
```

构建输出必须为新目录；已有输出不会覆盖。构建仅读取仓库文件，不读取模型账户、本地安装或工作台运行数据。

已有默认安装使用`npm run 7plus1:ui`。新环境先构建，再使用构建包内`product/short-compiler/deploy.mjs install --home <新安装目录> --port 58618`和`start --home <同一目录>`。已有运行实例继续使用原安装目录及数据，不因Git合并重新安装。

## 本地回归范围

```sh
node --test tests/ui220-sync.test.mjs tests/ui220-explicit-relations.test.mjs
npm run test:workbench
```

第一组验证404文件重建、数学展示及10例已保存解析的确定性复算，并包含真实未知、缺数值、无效来源等反例。测试夹具是用户要求设计的虚拟企业A任务，保留原文和数学结构，不包含账户、调用目录或客户数据。它们是开发回归材料，不属于Gold，不代表重新测试LLM生成准确率。

| 用例 | 复算结论 |
|---|---|
| EA001 | 越界 |
| EA002 | 相容 |
| EA003 | 越界 |
| EA004 | 越界 |
| EA005 | 未决：白鹭存在两个身份候选 |
| EA006 | 越界 |
| EA007 | 相容 |
| EA008 | 越界 |
| EA009 | 相容 |
| EA010 | 越界 |

本次合并验证不新增LLM调用。保留main品牌、方法文档及GitHub Actions移除状态，全部检查在本地执行。冻结Gold原文、旧Trace及历史回执保持原字节；未宣称BXP 0.4完整符合性。

## 本次实际结果

- 在本仓库内的隔离合并副本执行`npm ci --ignore-scripts --offline --no-audit --no-fund`，安装锁定依赖。
- `test:workbench`：255通过、0失败、0跳过，包括共享Core、IR接口、字典、UI与10例已有数学结构复算。
- ui220专项目录：23通过；字典接口：9通过，已计入上述255项。
- 运行包构建及包内核验通过；Git暂存对象的404个文件哈希也逐项匹配本机安装。
- 43个新增或修改JavaScript文件语法检查通过；新增夹具不含运行目录、账户令牌或本机来源路径。
- 58618实际返回HTTP 200、ui220版本及相同清单哈希。

全历史研究测试另行尝试，未通过，不计入上述255项：远端缺少P001校验脚本与部分历史研究模块；旧NLP入口在当前环境中阻塞，已停止本次测试进程。旧`short-compiler-domain-clarification`测试引用现有模块未导出的`evaluateScope`，`audit-issue-context`仍有一项断言失败；其相关测试和实现文件与合并前review分支一致，本次不改写旧研究结果。根`npm test`仍引用缺失的P001脚本，不能宣称全仓测试通过。ui220当前工作台回归入口明确为`npm run test:workbench`。
