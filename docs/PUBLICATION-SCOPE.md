# 仓库范围 / Repository scope

## 2026-11-11补充：MCP内部测试交付 / Internal MCP delivery

按用户新要求，本仓库增加[MCP双语使用说明](mcp/README.md)，并在私有Release草稿中准备0.4.0-rc.2编译安装包、摘要、依赖清单和脱敏验收记录。Core原实现源码不进入安装包；适配器、界面、必要资源及提示模板随运行包交付并可读取。Git树仍不承载私有工程源码。仓库保持私有，npm与对外发布均未执行；草稿仅供有权限维护者使用。外部分发许可尚须确认，见[说明](mcp/NOTICES.md)。

MCP internal test assets are an explicit addition to the earlier research-only scope. The private draft Release distributes the compiled Core with readable adapter/UI/runtime resources; it does not distribute the original Core source. Repository visibility and existing paper assets are unchanged. The historical review below retains its original scope and does not certify the new MCP package; see its separate [release evidence](mcp/RELEASE.md).

## 2026-11-09研究资料范围 / Historical research scope

本仓库保留论文、BXP协议、研究案例与已保存报告、截图，以及独立数学或统计核验脚本。**工作台实现保持私有**：不分发工作台前后端、Core实现、内部提示词、运行依赖、构建安装脚本或旧工程源码快照。

This repository distributes research and protocol material, saved examples and reports, screenshots, and independent verification scripts. **The workbench implementation remains private.** Workbench frontend/backend source, Core, production prompts, runtime dependencies and engineering build/install assets are excluded.

## 本轮复查 / Current review

2026-11-09已复查主分支、研究压缩包、PDF文字和图像元数据、论文Release资产、main历史与论文标签。移除8份依赖已撤下私有Core的旧工程测试／构建脚本及两张无引用的旧演示截图，修正失效命令、链接和旧版本配置。独立研究与协议核验脚本按用途保留，不按文件后缀误删。

The 2026-11-09 review covers the main tree, research archives, PDF text and image metadata, paper release assets, main history and the paper tag. Eight obsolete engineering scripts and two unreferenced demo images were removed. Independent research/protocol verifiers are retained.

论文正文、原研究附件、案例、标注、结果、协议固定基线与7份论文Release资产保持原字节。本次不重制论文包，不改材料许可证，不部署在线演示，不修改或重启本地58618。当前私有工作台仍为B335。

## 隐私检查 / Privacy checks

所检范围未发现已确认的账号令牌、API密钥、私钥、登录配置或个人身份证号码。通用密钥规则命中的保存结果标识已逐项分类；手机号候选均为计时或几何坐标小数。唯一邮箱为论文声明的公开作者联系方式。

论文原证据中的环境路径使用默认系统用户名，未发现非默认个人用户目录；这些历史来源引用仍保留，不能声称已删除全部机器路径。扫描与人工分类只说明已执行范围，不把模式扫描无命中等同于所有形式的隐私风险均已排除。

No actual credential or personal identity-number match was confirmed in the reviewed material. Generic-key findings were saved-result identifiers; phone-like matches were timing or geometry fractions. The email belongs to the declared public author contact. Historical evidence retains generic system-user paths; those paths have not been erased. Findings describe the performed checks rather than an unconditional privacy guarantee.

## 仍待GitHub处理 / Remaining GitHub-side blocker

main已建立净历史，旧产品分支、标签、Release及Actions记录已清理。论文标签与发布内容不变。**GitHub仍保留11个只读PR引用，复查确认旧工作台源码仍可通过历史引用读取。**

用户已提交支持工单，当前等待GitHub处理。已提交不等于已解除引用、清除缓存或完成不可达对象回收；本次不重复提交工单。平台处理后必须重新验证旧源码不可取得，完成最终隐私复核，再由用户决定公开。当前保持私有，不把旧克隆或私有备份推回本仓库。

**Publication remains blocked by 11 read-only PR refs through which old workbench source is still retrievable.** A support request has been submitted and remains pending. GitHub-side dereferencing, cache/object cleanup and a fresh verification are required before the owner changes visibility. Do not restore old private history.

[核查范围与结果 / Review details](PREPUBLICATION-CHECK.md) · [GitHub历史数据清理说明 / GitHub guidance](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)

原[MIT许可证](../LICENSE)保留，论文、案例和第三方材料继续按[资料访问说明](paper/materials/MATERIAL-ACCESS.md)及各材料条款使用。
