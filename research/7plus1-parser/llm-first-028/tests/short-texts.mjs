// Visible development/acceptance expectations. Never loaded by provider or Skills.
export const cases=[
 {id:'S00',text:'请PM依据SPEC-42读取routes.csv并生成report.md，QA必须复核该报告。仅在本次QA复核通过后，允许PM向ADMIN提交该报告。该读取操作最多重试3次；提交成功即任务完成；不得修改routes.csv。',expect:{actions:[['读取','REQUIRED'],['生成','REQUIRED'],['复核','REQUIRED'],['提交','PERMITTED']],input:['routes.csv'],output:['report.md'],basis:['SPEC-42'],forbid:['修改'],people:['PM','QA','ADMIN'],necessary:'提交',completion:'SUFFICIENT',retry:3}},
 {id:'S01',text:'请PM读取data.csv并生成brief.md。不得修改data.csv。',expect:{actions:[['读取','REQUIRED'],['生成','REQUIRED']],input:['data.csv'],output:['brief.md'],forbid:['修改'],people:['PM']}},
 {id:'S02',text:'请PM生成brief.md，随后由QA复核brief.md，再由PM把同一文件提交给ADMIN。',expect:{actions:[['生成','REQUIRED'],['复核','REQUIRED'],['提交','REQUIRED']],input:[],output:['brief.md'],people:['PM','QA','ADMIN'],temporal:2}},
 {id:'S03',text:'请PM依据RULE-7检查a.csv。',expect:{actions:[['检查','REQUIRED']],input:['a.csv'],basis:['RULE-7'],people:['PM']}},
 {id:'S04',text:'请PM检查RULE-7和a.csv。',expect:{actions:[['检查','REQUIRED']],input:['RULE-7','a.csv'],basis:[],people:['PM']}},
 {id:'S05',text:'请PM检查a.csv；无需重启服务，不得删除a.csv。',expect:{actions:[['检查','REQUIRED']],input:['a.csv'],forbid:['删除'],notRequired:'重启',people:['PM']}},
 {id:'S06',text:'请PM检查a.csv；不得重启服务，可以读取b.csv。',expect:{actions:[['检查','REQUIRED'],['读取','PERMITTED']],input:['a.csv','b.csv'],forbid:['重启'],people:['PM']}},
 {id:'S07',text:'允许PM在QA批准后提交r.md；批准前不得提交。',expect:{actions:[['提交','PERMITTED']],forbid:['提交'],people:['PM'],necessary:'提交',beforeForbid:true,noApproveObligation:true}},
 {id:'S08',text:'PM必须提交r.md；提交成功即任务完成。',expect:{actions:[['提交','REQUIRED']],people:['PM'],completion:'SUFFICIENT'}},
 {id:'S09',text:'请PM在10分钟内生成top.md，报告只列3个问题。',expect:{actions:[['生成','REQUIRED']],output:['top.md'],people:['PM'],duration:10,content:3}},
 {id:'S10',text:'请PM生成note.md，在文中引用“删除cache.db”。本任务不得删除任何文件。',expect:{actions:[['生成','REQUIRED']],output:['note.md'],forbid:['删除'],people:['PM'],quote:true,allowContentAction:true}},
 {id:'S11',text:'请PM读取a.csv和b.csv。将该文件与c.csv比较。',expect:{actions:[['读取','REQUIRED'],['比较','REQUIRED']],input:['a.csv','b.csv'],people:['PM'],ambiguous:true}},
 {id:'S12',text:'请PM组织检查被监测的服务，并形成status.md；具体检查执行者未指定。',expect:{actions:[['检查','REQUIRED'],['形成','REQUIRED']],input:['服务'],output:['status.md'],people:['PM'],organizer:true,unspecified:true}}
];
