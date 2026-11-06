# 仓库范围 / Repository scope

本仓库保留论文、BXP协议、研究案例与已保存报告、截图，以及独立数学或统计核验脚本。**工作台实现保持私有**：不分发工作台前后端、Core实现、内部提示词、运行依赖、构建安装脚本或旧工程源码快照。

This repository retains the paper, BXP specifications, research examples and saved reports, screenshots, and independent mathematical or statistical verification scripts. **The workbench implementation remains private.** Frontend/backend engineering sources, Core implementation, production prompts, runtime dependencies, build/install scripts and engineering snapshots are not distributed here.

## 论文与演示

当前论文为英文v1.2／中文r23，研究附件标识为`RESEARCH_ONLY_1`。本次清理完整保留GitHub现有`docs/paper/`目录、研究概览和发布链接，不制作、替换或修改论文包。研究核验脚本不是工作台工程实现，不应因文件后缀而被误删。

在线演示、截图与中英报告用于阅读已保存案例，不代表分发可安装工作台或提供实时模型评估。本次只清理GitHub工程副本，不改动已部署页面或本地58618。

## 历史与发布状态

已将main替换为不含旧工程历史的净历史提交，删除12个旧源码分支、旧产品标签及其Release；61次旧Actions记录和日志也已从GitHub移除，私有备份保留。论文标签、论文Release及研究资料保持原样。

**仍有公开阻塞：GitHub保留11个只读PR引用，其中已确认仍可访问旧工作台源码。** 普通Git推送不能删除这些平台引用；需要GitHub侧解除引用、清除缓存并验证。在该问题解决及隐私审核完成前，仓库不得公开。不要把旧克隆或私有备份合并、推送回本仓库。

Main now starts from a clean root. Twelve old implementation branches, the old product tag and release, and 61 old Actions runs have been removed; private backups are retained. The paper tag, release and research materials are unchanged.

**Publication remains blocked by 11 read-only pull-request refs retained by GitHub. Old workbench source is still retrievable through at least one of them.** GitHub-side dereferencing and cache removal are required, followed by verification. The repository must remain private until this and the privacy review are resolved. Do not merge or push old clones or private backups back into it. See [GitHub's removal guidance](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository).

原MIT许可证保留，论文、案例数据和第三方材料的使用条件继续按[资料访问说明](paper/materials/MATERIAL-ACCESS.md)及各组件原有条款分别维护。

## 隐私复核 / Privacy review

两份旧协议工程来源Manifest因含本机用户目录信息，已移出拟公开树，原件保留私有档案；没有修改现行draft.2规范或固定基线。凭据与身份模式扫描尚未确认真实账号令牌、私钥、手机号或身份证号码；手机号候选已核对为计时、几何坐标小数。唯一邮箱是论文声明的公开作者联系方式。

论文材料仍有默认系统用户目录等环境路径，继续列为公开前人工复核项。本次不改论文包，也不把“未命中凭据模式”扩大成全部材料无隐私风险的结论。GitHub旧PR源码引用与隐私审核未解决前，仓库保持私有。

Two legacy engineering-provenance manifests containing local user-directory information are withheld; originals remain in the private archive. No current draft.2 baseline or paper bytes were changed. No actual account token, private key, phone number or national-ID match was confirmed by the performed checks; numeric candidates were timing or geometry fractions, and the email is the declared public author contact. Environment paths retained in the paper material still require publication review. This is not an unconditional privacy clearance.
