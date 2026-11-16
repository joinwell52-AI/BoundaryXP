# 升级、恢复与排障 / Upgrades, recovery and troubleshooting

当前公开发行版：**boundaryxp-mcp 0.4.0-rc.9 · B-335 · Windows x64**。npm 是发行源，GitHub Release 同步编译安装包及摘要。原始 Core 源码不随包交付。

[完整中文安装与升级](npm/INSTALL.zh-CN.md) · [English installation and upgrades](npm/INSTALL.md) · [自动更新 / Automatic updates](npm/AUTO-UPDATE.md)

## rc.8 → rc.9

rc.8 可以直接升级，不需要卸载。旧更新器固定检查 18 个工具，而 rc.9 有 21 个工具，因此需要一次性运行 **rc.9 的安装器**。按完整安装指南将下面的变量设为自己的原安装与数据目录；完成作业并断开使用该目录的全部 MCP 连接后运行：

```powershell
npx.cmd --yes --package boundaryxp-mcp@0.4.0-rc.9 bxp update --home $BxpHome --version 0.4.0-rc.9 --migrate-data $BxpData
```

安装器校验数据副本并保留原目录、任务历史、字典和配置。迁移失败不会把当前安装切换到未通过检查的版本。不要删数据、强制终止正在分析的进程，或用新运行时直接覆盖旧数据目录。

rc.8 can upgrade directly using the rc.9 bootstrap once. The older updater's fixed 18-tool probe rejects the new 21-tool catalog. Use your existing installation and data paths, finish jobs, and disconnect all matching clients first. The installer verifies a copied data directory, retains the original and preserves configuration. See the English installation guide for direct-npx users and managed installations.

## 核对与回滚 / Verify and roll back

安装指南中的 `status` / `doctor` 检查磁盘版本与隔离探测。重新连接后调用 `bx_capabilities` 核对当前连接为 rc.9、21 个工具及 17 个资源；调用 `bx_workbench_open` 获取当前页面地址。无需重新分析旧任务。

The disk selection and a running old connection can differ until all matching clients reconnect. Use `bx_capabilities` to verify the connected release. A browser port is not a version identifier.

回滚按[完整指南](npm/INSTALL.zh-CN.md#升级)操作，恢复上一程序版本与数据映射。新版副本中的新任务和自定义字典保留，不自动合并到旧版。不要删除两个数据目录。

Rollback restores the previous release/data pair. New tasks and custom dictionaries remain in the newer copy; they are not silently merged into older data.

## 自动更新 / Automatic updates

自动更新默认关闭；已配置自动更新的用户仍需完成上述 rc.8 一次性过渡。后续按[自动更新说明](npm/AUTO-UPDATE.md)选择渠道、检查间隔及复制迁移权限。准备好的更新等待所有客户端退出后再生效，不强制中断任务，也不操作独立的 58618。

Automatic updates default to off. Configured rc.8 installations still require the one-time bootstrap transition above. Prepared updates activate after all clients exit; publication alone does not replace a running connection.

## 排障 / Troubleshooting

[中英文内置帮助及排障](npm/guides/TOOLS.md)可通过 MCP 读取，无需让宿主读取本地文件。`DATA_ROOT_IN_USE_RECONNECT_ALL_CLIENTS` 或 `MIGRATION_SOURCE_BUSY_CLOSE_CLIENTS` 表示相关客户端仍连接，关闭浏览器并不等于断开 MCP。若更新后仍显示旧版本，请核对宿主启动路径并正常重连，不要批量结束 Node 进程。

[此前 rc.2 操作记录](rc2/OPERATIONS.md)属于历史内部测试阶段，不代表当前 npm 发行状态。
