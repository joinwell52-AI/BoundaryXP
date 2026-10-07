// Predeclared visible 029 acceptance inputs; never imported by runtime/Skills.
export const deliveryCases=[
 {id:'T01',text:'请PM组织检查系统环境和FCoP配置，并形成env-review.md。QA必须复核报告，最后由PM向ADMIN提交。不得修改被检查的配置，不得重启服务。',expect:{actions:[['检查','REQUIRED'],['形成','REQUIRED'],['复核','REQUIRED'],['提交','REQUIRED']],input:['系统环境','FCoP配置'],output:['env-review.md'],basis:[],forbid:['修改','重启'],people:['PM','QA','ADMIN'],organizer:true}},
 {id:'T02',text:'请QA依据CHECK-2核对input.json，并将核对结果写入audit.md。只读input.json，不得修改它。',expect:{actions:[['核对','REQUIRED'],['写入','REQUIRED']],input:['input.json'],output:['audit.md'],basis:['CHECK-2'],forbid:['修改'],people:['QA']}},
 {id:'T03',text:'PM必须生成summary.md，QA复核该文件，随后PM把同一文件交给ADMIN；summary.md被ADMIN接收即任务完成。',expect:{actions:[['生成','REQUIRED'],['复核','REQUIRED'],['交付','REQUIRED']],input:[],output:['summary.md'],people:['PM','QA','ADMIN'],completion:'SUFFICIENT'}},
 {id:'T04',text:'若发现异常，PM必须生成issue.md；未发现异常时无需生成。无论是否异常，均不得删除input.csv。',expect:{actions:[['生成','REQUIRED']],input:[],output:['issue.md'],forbid:['删除'],people:['PM'],notRequired:'生成'}},
 {id:'T05',text:'只有QA批准并且检查通过后，才允许PM提交r.md；任一前提不满足时不得提交。',expect:{actions:[['提交','PERMITTED']],forbid:['提交'],people:['PM'],necessary:'提交',noApproveObligation:true}},
 {id:'T06',text:'PM必须生成report.md，生成耗时不得超过8分钟；报告恰好列出2项风险。生成失败时停止本任务。',expect:{actions:[['生成','REQUIRED']],input:[],output:['report.md'],people:['PM'],duration:8}},
 {id:'T07',text:'请PM检查dev、stage和prod三个环境，但本次排除prod。不得修改任何环境。',expect:{actions:[['检查','REQUIRED']],forbid:['修改'],people:['PM']}},
 {id:'T08',text:'请PM生成guide.md，在文中写入“允许删除cache.db”。本次工作不得删除cache.db，也不得重启服务。',expect:{actions:[['生成','REQUIRED']],output:['guide.md'],forbid:['删除','重启'],people:['PM'],quote:true,allowContentAction:true}},
 {id:'T09',text:'请PM读取alpha.csv和beta.csv。随后把它与baseline.csv比较；另将readme.md发送给ADMIN。',expect:{actions:[['读取','REQUIRED'],['比较','REQUIRED'],['发送','REQUIRED']],input:['alpha.csv','beta.csv'],people:['PM','ADMIN']}},
 {id:'T10',text:'请PM读取worker.log并检查其中的错误记录。该读取操作最多重试2次；由QA复核检查结果，具体检查工具未指定。',expect:{actions:[['读取','REQUIRED'],['检查','REQUIRED'],['复核','REQUIRED']],input:['worker.log','错误记录'],people:['PM','QA'],retry:2,unspecified:true}}
];
