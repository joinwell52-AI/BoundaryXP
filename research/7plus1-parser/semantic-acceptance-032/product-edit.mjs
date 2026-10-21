import fs from 'node:fs';
function edit(p,changes){let t=fs.readFileSync(p,'utf8');for(const [a,b]of changes){if(t.split(a).length!==2)throw Error('ANCHOR:'+p+':'+a);t=t.replace(a,b);}fs.writeFileSync(p+'.032.tmp',t,{flag:'wx'});fs.renameSync(p+'.032.tmp',p);}
edit('package.json',[[ '"7plus1:ui": "node product/short-compiler/launch-installed.mjs",','"7plus1:ui": "node product/short-compiler/launch-installed.mjs",\n    "7plus1:installed": "node product/short-compiler/cli-installed.mjs",' ]]);
edit('product/short-compiler/cli-installed.mjs',[["'--replay'","'--replay-from'"]]);
edit('product/short-compiler/使用说明.md',[
 ['# BoundaryXP短文本7+1编译器：031-R1候选','# BoundaryXP短文本7+1编译器：032候选'],
 ['--port 58619','--port 58618'],
 ['端口被占用不会停止其他服务。选择空闲端口；原58618恢复有独立策略阻塞，本包不是绕过该阻塞的工具。','用户入口固定58618。端口被占用不会停止其他服务或另选长期端口；未通过本版质量门不得升级现有安装。策略拒绝须单列阻塞，不换工具绕过。'],
 ['最终质量状态见031-R1封存REPORT','最终质量状态见032封存REPORT'],
 ['包不包含凭据、历史、模型权重或无关开发改动。','确定未限定容器、局部域竞争和解析缺口分别显示。竞争备选不同时生效；成员查询最终UNKNOWN，单独备选结果只在该解释下，不签发执行许可。待确认页显示最小问题，请手工补充左侧原文后重新编译；新run关联父摘要，旧历史不覆盖，超300码点不截断。\n\n根工作区npm run 7plus1是开发CLI；npm run 7plus1:installed -- --input task.txt --output new-run-directory使用与固定UI相同的完整安装版本。薄入口核对当前获准版本，不自动安装开发代码。包根npm run 7plus1与该包UI同版。产品验收/公开发布状态由安装Manifest展示，与单次编译及局部主张状态分开。\n\n包不包含凭据、历史、模型权重或无关开发改动。']
]);
edit('product/short-compiler/ACCEPTANCE.md',[
 ['# 031-R1本地产品候选验收说明','# 032本地产品候选验收说明'],
 ['7P-SHORT-COMPILER-PRODUCT-CLOSURE-031-R1-LONG/REPORT.md','7P-SHORT-COMPILER-SEMANTIC-ACCEPTANCE-032-LONG/REPORT.md'],
 ['旧031报告和运行包不覆盖。原58618恢复策略拒绝保持POLICY_BLOCKED；候选功能验收与原入口恢复分开，未经正常许可不停止/重启原58618、不借替换资源绕过。','旧031、031-R1与Q05报告和运行包不覆盖。开发期间固定58618安装不变；G1–G6通过、确认实例空闲并完成备份、正常权限允许后才受控同入口升级。策略拒绝不得绕过，失败回滚完整版本。'],
 ['正式验收必须包括本任务路径B最终53份原文、规定额外重复10次、原N01–N08、完整回归、安装资源隔离、原UI真实调用及升级回滚。','正式验收包括53固定、指定5条各2次额外重复、原N01–N08、D01–D08，共79次同版真实编译；另有部署后D08冒烟。Q05按预声明规程允许正确局部澄清，明确对照不允许过度未决。包括完整回归、资源隔离、原UI及升级回滚。032调用限240、开发≤24且冻结预留≥216；旧账独立。']
]);
