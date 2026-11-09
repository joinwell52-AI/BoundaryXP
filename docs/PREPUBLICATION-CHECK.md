# 公开前核查 / Pre-publication review

日期：2026-11-09。核对基础提交：`cea38643a484870378c3a18347f00d2026a12fa7`。**当前结论：主分支可自行处理的遗留已清理，仓库仍有GitHub侧历史源码残留，暂不能公开。**

Reviewed on 2026-11-09, starting from the commit above. **The editable main-tree remnants have been cleaned; publication remains blocked by GitHub-retained historical source.**

## 范围与结果 / Scope and findings

| 范围 / Surface | 本轮结果 / Result |
|---|---|
| 当前主分支 / Main tree | 核对2231个文件的远端Git对象摘要；清理旧工程脚本、截图及过时说明 |
| 压缩包与结构化材料 / Archives and text | 检查4308个文件／压缩成员，包含2077个压缩成员；未执行仓库内工程脚本 |
| PDF与图片 / PDFs and images | 提取363页PDF文字并检查图像元数据；目视复核18种不同图片的缩略图，未冒称对长截图逐字OCR |
| 凭据候选 / Credential candidates | 6044条通用密钥候选均为保存结果标识；96条手机号候选均为浮点计时或几何值；无未决的这些模式候选 |
| 论文发布 / Paper release | 7份Release资产SHA256均核对一致；论文包、PDF及冻结研究材料未修改 |
| main历史与论文标签 / Main history and paper tag | 检查基础main的3个提交、论文标签文件树及本轮清理差异；没有工作台实现根目录 |
| 分支与自动化 / Branches and Actions | 仅main及论文标签；Actions运行、制品和缓存均为0 |
| 旧PR引用 / Legacy PR refs | 仍有11个，旧私有源码可读取；需GitHub处理后再次验证 |

本次删除的是8份依赖已撤下私有Core的工程测试／构建脚本，不是论文中的独立数学或统计核验脚本。另删除两张没有仓库引用的旧演示截图。208条历史协议向量及其冻结预期保留原字节，文档不再提供失效的安装或运行命令。

Eight removed engineering scripts depended on a withdrawn private Core; they were not independent paper verifiers. Two unreferenced demo images were also removed. The 208 historical protocol vectors and frozen expectations remain unchanged.

默认系统用户路径仍属于部分原始研究证据；唯一邮箱为公开作者联系方式。没有把这些历史信息改写成空值，也没有将一般扫描结果解释为所有形式的隐私风险均不存在。原始扫描明细及工程日志保留在私有审计目录，不随本仓库发布。

## 尚未完成的事项 / Outstanding work

支持工单已提交，GitHub尚未完成旧PR引用、缓存及对象处理。本次复查不重复提交，也不擅自公开仓库。收到处理结果后，需重新检查旧引用、已知旧源码入口和残留视图，再由用户决定是否切换公开。

A support request is already pending. Once GitHub completes the cleanup, old refs, known source-access paths and retained views must be rechecked before the owner changes visibility.

本轮没有模型调用、Core重计算、产品构建、安装、升级、重启或演示部署；本地58618不变。

[公开范围](PUBLICATION-SCOPE.md) · [升级日志](../CHANGELOG.zh-CN.md) · [文档导航](README.md)
