# 58618 ui131 源码同步

本提交把本地已运行的 ui131 同步到 review/7plus1-parser，保留远端 ui106 的测试历史。主项目版本仍为 1.3.0-preview.0，工作台候选版本为 0.1.0-candidate.031-r1.2-ui.131；不是公开发布。

## 包含内容

- 单任务及显式父子任务树、逐节点生成与独立审阅、比较和证据入口。
- 运行模型、字典和事件记录；扫描及本地计算计时。
- LLM 数学分析按公式、结果、理由展示，并与程序结果分开。
- ui131 保留有内容的数学结果，隐藏空栏目，移除通用未复算占位卡；历史与账本折叠，停止按钮仅运行中显示。

## 构建与启动

```sh
npm run 7plus1:build-candidate
node .boundx/products/0.1.0-candidate.031-r1.2-ui.131/product/short-compiler/verify.mjs
```

构建只读取仓库源码，校验并重建已安装 ui131 的全部365个文件及原始 PRODUCT-MANIFEST.json，不读取本地安装或模型账户。打包专用 package.json、锁文件和包内启动器位于 product/short-compiler/ui131-package；仓库根启动器仍使用 npm run 7plus1:ui，并接受 ui131。安装/升级继续使用候选包的 deploy.mjs；升级前确认目标实例空闲，保留数据备份。

原始安装清单中的 source_revision、build_entry、source_runtime_clean 是当时本地候选的历史元数据，不代表这次Git提交，也不代表所有模型语义已通过验收。保留原清单字节是为了可以核对本地运行包。新增构建入口从本提交的源码重建同一身份。

## 验证边界

本次执行源码/安装包逐文件散列比较、无模型显示检查及 JavaScript 语法检查。没有新增模型调用、不启动测试监听端口、不触发 GitHub Actions。未上传运行目录、模型回执、凭据、依赖缓存或新增客户数据。已有真实样例仅使用仓库中同版本原文字节。
