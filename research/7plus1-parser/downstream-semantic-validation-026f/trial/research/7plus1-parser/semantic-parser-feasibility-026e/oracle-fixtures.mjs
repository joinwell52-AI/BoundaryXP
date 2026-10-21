// Source-reviewed diagnostic data only. Never imported by the Parser.
// Each quoted anchor is matched exactly against the frozen source. No slot
// is supplied to the engine; the unchanged Γ and projection decide outputs.
// Codex source review is pending ADMIN review, not new Gold approval.
export const fixtures=[
 {id:'ROOT-013',actor:'PM',governor:'组织',inputs:['dependencies.lock','直接依赖的许可证'],basis:['LICENSE-POLICY-4'],frames:[
  {p:'核查',sense:'review',args:[['PATIENT','直接依赖的许可证']]},
  {p:'形成',sense:'generate',args:[['RESULT','license-review.csv']]},
  {p:'范围不含',sense:'scope_exclusion',scope:'间接依赖'},
  {p:'标记',type:'STATE',sense:'OUTPUT_CONTENT_REQUIREMENT',layer:'OUTPUT_CONTENT',args:[['THEME','待确认']],contentOwner:'license-review.csv',condition:'许可证信息缺失时'},
  {p:'判',sense:'SOURCE_EVENT',modal:'FORBIDDEN',args:[['FORBIDS','允许商用']],condition:null,method:'自动'}
 ],notes:['Missing license information is an output classifier, not permission to allow commercial use.','Indirect dependencies explicitly excluded.']},
 {id:'ROOT-015',actor:'PM',governor:'组织',inputs:['staging.yaml','template.yaml','测试环境配置与模板的一致性'],frames:[
  {p:'读取',sense:'read',args:[['PATIENT','staging.yaml'],['PATIENT','template.yaml']]},
  {p:'检查',sense:'review',args:[['PATIENT','测试环境配置与模板的一致性']]},
  {p:'形成',sense:'generate',args:[['RESULT','config-diff.md']]},
  {p:'列出',type:'STATE',sense:'OUTPUT_CONTENT_REQUIREMENT',layer:'OUTPUT_CONTENT',contentOwner:'config-diff.md',args:[['THEME','差异']],condition:'存在差异时'},
  {p:'写明',type:'STATE',sense:'OUTPUT_CONTENT_REQUIREMENT',layer:'OUTPUT_CONTENT',contentOwner:'config-diff.md',args:[['THEME','无差异']],condition:'不存在差异时',conditionPolarity:'NEGATIVE'},
  {p:'同步',sense:'SOURCE_EVENT',modal:'FORBIDDEN',args:[['FORBIDS','配置文件']]},
  {p:'覆盖',sense:'modify',modal:'FORBIDDEN',args:[['FORBIDS','配置文件']]}
 ],notes:['Two mutually exclusive local output-content branches; no global gate on reading.']},
 {id:'ROOT-017',actor:'PM',governor:'组织',inputs:['checksums.txt','dist 目录中的全部压缩包'],frames:[
  {p:'读取',sense:'read',args:[['PATIENT','checksums.txt']]},
  {p:'核验',sense:'review',args:[['PATIENT','dist 目录中的全部压缩包']],quantifier:'ALL'},
  {p:'形成',sense:'generate',args:[['RESULT','package-check.md']]},
  {p:'停止',sense:'stop',args:[['PATIENT','核验',1]],stopTargetPredicate:'核验',condition:'任何校验值不匹配时',conditionPolarity:'NEGATIVE',conditionArgument:'校验值',conditionPredicate:'不匹配',conditionQuantifier:'ANY'},
  {p:'汇报',sense:'report',args:[],condition:'任何校验值不匹配时',conditionPolarity:'NEGATIVE',conditionArgument:'校验值',conditionPredicate:'不匹配',conditionQuantifier:'ANY'},
  {p:'删除',sense:'SOURCE_EVENT',modal:'FORBIDDEN',args:[['FORBIDS','压缩包',1]]},
  {p:'生成',sense:'generate',modal:'FORBIDDEN',args:[['FORBIDS','压缩包',1]],method:'重新'}
 ],notes:['ANY checksum mismatch gates stopping the verification operation and reporting; ALL archives inspected.']},
 {id:'ROOT-023',actor:'PM',governor:'组织',inputs:['assets.csv','inventory.csv','在用设备编号'],frames:[
  {p:'读取',sense:'read',args:[['PATIENT','assets.csv'],['PATIENT','inventory.csv']]},
  {p:'核对',sense:'compare',args:[['PATIENT','在用设备编号']]},
  {p:'形成',sense:'generate',args:[['RESULT','asset-diff.md']]},
  {p:'不在范围内',sense:'scope_exclusion',scope:'已报废设备'},
  {p:'创建',sense:'generate',modal:'FORBIDDEN',args:[['FORBIDS','资产记录']]},
  {p:'删除',sense:'SOURCE_EVENT',modal:'FORBIDDEN',args:[['FORBIDS','资产记录']]},
  {p:'修改',sense:'modify',modal:'FORBIDDEN',args:[['FORBIDS','资产记录']]}
 ],notes:['Three coordinated forbidden predicates share one explicitly stated object.']},
 {id:'ROOT-014',actor:'PM',governor:'组织',inputs:['unit-results.json','失败用例'],frames:[
  {p:'审阅',sense:'review',args:[['PATIENT','失败用例']]},
  {p:'形成',sense:'generate',args:[['RESULT','failures.md']]},
  {p:'收集',sense:'SOURCE_EVENT',args:[['PATIENT','失败原因说明']]},
  {p:'运行',sense:'run',modal:'FORBIDDEN',args:[['FORBIDS','测试']],method:'重新'},
  {p:'修改',sense:'modify',modal:'FORBIDDEN',args:[['FORBIDS','实现']]}
 ],notes:['Collecting explanations is a separate action. Rerunning is prohibited; not merely running.']},
 {id:'NROOT-001',actor:'PM',governor:'组织',inputs:['测试环境关键服务的运行状态'],frames:[
  {p:'核查',sense:'review',args:[['PATIENT','测试环境关键服务的运行状态']]},
  {p:'形成',sense:'generate',args:[['RESULT','service-health.md']]},
  {p:'复核',sense:'review',actor:'QA',participantRole:'REVIEWER',args:[['PATIENT','最终结果']],uniqueReference:['最终结果','service-health.md']},
  {p:'汇报',sense:'report',actor:['PM',1],args:[['RECIPIENT','ADMIN']],condition:'QA 对最终结果做独立复核后'},
  {p:'重启',sense:'SOURCE_EVENT',modal:'FORBIDDEN',args:[['FORBIDS','被检查服务']]},
  {p:'停止',sense:'stop',modal:'FORBIDDEN',args:[['FORBIDS','被检查服务']]},
  {p:'修改',sense:'modify',modal:'FORBIDDEN',args:[['FORBIDS','被检查服务']]}
 ],notes:['QA performs independent review; report to ADMIN is after review, not an approval inference.','Forbidden service stopping is not an instruction to stop the task.']},
 {id:'NROOT-002',actor:'PM',governor:'负责',inputs:['app-config.yaml','模板文件中的关键项'],frames:[
  {p:'核对',sense:'compare',args:[['PATIENT','app-config.yaml'],['PATIENT','模板文件中的关键项']]},
  {p:'形成',sense:'generate',args:[['RESULT','config-consistency.md']]},
  {p:'读取',sense:'read',args:[['PATIENT','app-config.yaml'],['PATIENT','模板文件中的关键项']],mode:'READ_ONLY',modal:'PERMITTED'},
  {p:'记录',sense:'SOURCE_EVENT',args:[['PATIENT','差异']],modal:'PERMITTED',mode:'ARGUMENT_ONLY'},
  {p:'覆盖',sense:'modify',modal:'FORBIDDEN',args:[['FORBIDS','配置']]}
 ],notes:['Only reading and recording differences are allowed; explicit restriction is preserved, not all operations allowed.']},
 {id:'NROOT-007',actor:'PM',governor:'组织',inputs:['build-summary.json','主模块和插件的构建结果'],frames:[
  {p:'核查',sense:'review',args:[['PATIENT','主模块和插件的构建结果']]},
  {p:'形成',sense:'generate',args:[['RESULT','build-result-review.md']]},
  {p:'记录',type:'STATE',sense:'OUTPUT_CONTENT_REQUIREMENT',layer:'OUTPUT_CONTENT',args:[['THEME','原因']],contentOwner:'build-result-review.md',qualifier:'失败项',mode:'ARGUMENT_ONLY'},
  {p:'触发',sense:'SOURCE_EVENT',modal:'FORBIDDEN',args:[['FORBIDS','构建',1]],method:'重新'}
 ],notes:['Failed build items are classified/report content; no new build execution.']},
 {id:'NROOT-038',actor:'PM',governor:'organize',inputs:['route-table.yaml'],frames:[
  {p:'inspection',sense:'review',args:[['PATIENT','route-table.yaml']]},
  {p:'deliver',sense:'generate',args:[['RESULT','route-review.md']]},
  {p:'edited',sense:'modify',modal:'FORBIDDEN',args:[['FORBIDS','route table']],voice:'PASSIVE',uniqueReference:['route table','route-table.yaml']},
  {p:'sent',sense:'send',args:[['PATIENT','final report'],['RECIPIENT','QA']],voice:'PASSIVE',uniqueReference:['final report','route-review.md']},
  {p:'review',sense:'review',actor:'QA',participantRole:'REVIEWER',args:[['PATIENT','final report']],uniqueReference:['final report','route-review.md'],layer:'PURPOSE_COMPLEMENT'}
 ],quantity:{anchor:'18',unit:'minutes',marker:'within',value:18,kind:'BUDGET',inclusive:true},notes:['Task deadline 18 minutes; passive transfer to QA for review, no approver.']},
 {id:'NROOT-035',inputs:['coverage.json'],basis:[],frames:[
  {p:'写入',sense:'write',args:[['PATIENT','低于 82% 的模块'],['RESULT','coverage-risk.md']]},
  {p:'修改',sense:'modify',modal:'FORBIDDEN',args:[['FORBIDS','阈值']]},
  {p:'补测',sense:'run',modal:'FORBIDDEN',args:[['FORBIDS','模块']]},
  {p:'低于',type:'STATE',sense:'LOCAL_ARGUMENT_QUALIFIER',layer:'NOMINAL_QUALIFIER',args:[['THEME','模块']],qualifierOwner:'低于 82% 的模块'},
  {p:'分类',type:'STATE',sense:'CLASSIFIER_DECLARATION',layer:'METALINGUISTIC',args:[]},
  {p:'不作为',type:'STATE',sense:'NON_RESOURCE_DECLARATION',layer:'METALINGUISTIC',args:[['THEME','任务资源预算']]}
 ],quantity:{anchor:'82',unit:'%',marker:'低于',value:82,kind:'CLASSIFIER',inclusive:false},notes:['Coverage<82% is a classification threshold; not a task resource budget.','No actor is provided; do not invent PM.']}
];
