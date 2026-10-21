// Independent source-led review notes by the executing Codex; not ADMIN Gold.
// These records assess saved outputs only. They are never supplied to Provider.
export const reviews={
 'first/Q01':{
  facts:[
   ['evt_stat cl_stat_performer cl_stat_input cl_stat_result','PM统计该日志错误总数；结果值仍未知。'],
   ['evt_generate cl_generate_performer cl_generate_result','PM生成count.md，共享明确命令主体。'],
   ['cl_stat_input cl_stat_result','I为audit.log，错误统计对象在统计RESULT与note保留。'],
   ['cl_generate_result','count.md在O且REQUIRED。'],
   ['evt_clear cl_clear_object','禁止清空同一日志，未变读取禁止。'],
   ['evt_stat evt_generate evt_clear','未增加观测数值或已完成事实；R/V/C空有原文依据。']
  ],
  inventory:{entities:'PM身份明确、类别未指定；audit.log/count.md为字面文件，错误总数是计算结果而非观测值。',events:{evt_stat:'REQUIRED/PM/日志输入/错误总数RESULT有统计语义依据；该额外O是所要求计算结果。',evt_generate:'REQUIRED/PM/count.md RESULT；没有额外发送。',evt_clear:'FORBIDDEN/PM/audit.log对象；同一根任务仅一明确主体，继承禁止约束未创造允许。'},claims:{},expressions:{}},
  notes:'首候选与最终候选相同。身份类型的不确定没有污染职责；中文保留统计对象、报告和禁止。',findings:[]
 },
 'first/Q02':{
  facts:[
   ['evt_check cl_check_performer cl_check_object','PM核对accounts.csv字段名，而非记录内容。'],
   ['evt_generate cl_generate_performer cl_generate_result','PM生成fields.md。'],
   ['cl_check_input cl_check_scope expr_fields','I文件身份与仅字段名局部ITEM范围并存。'],
   ['cl_generate_result','fields.md REQUIRED O。'],
   ['evt_read cl_read_object','FORBIDDEN读取accounts.csv记录内容；未禁止文件所有用途。'],
   ['evt_check evt_generate evt_read','只检查不是独立新事件；未增加核对记录或权限。']
  ],
  inventory:{entities:'源文件、字段名限定、结果文件、记录内容均来自原文；PM类型未决不等于身份不明。',events:{evt_check:'REQUIRED/PM/INPUT accounts.csv+OBJECT字段名；SCOPE只字段名。',evt_generate:'REQUIRED/PM/fields.md RESULT，并列主体有依据。',evt_read:'FORBIDDEN/PM/记录内容，沿用当前受检文件；OBJECT不投输入。'},claims:{cl_check_scope:'绑定evt_check而非所有动作的字段名限制。'},expressions:{expr_fields:'ITEM字段名，只限定核对。'}},
  notes:'首候选与最终候选相同；JSON和中文都保留SCOPE及局部禁止。',findings:[]
 },
 'first/Q03':{
  facts:[
   ['evt_check cl_check_performer cl_check_input','PM检查worker服务运行状态。'],
   ['evt_generate cl_generate_performer cl_generate_result','PM生成service-note.md。'],
   ['cl_check_input cl_status_scope expr_status_of','受检运行状态属于worker；未断言其正常。'],
   ['cl_generate_result','报告在O。'],
   ['evt_stop cl_stop_object','B禁止停止worker服务，未变根任务停止C。'],
   ['evt_check evt_generate evt_stop','无重启动作、无运行观测值；禁止执行者未指定不污染明确职责。']
  ],
  inventory:{entities:'worker系统、其运行状态及文件均有明确来源；PM仅类别未指定。',events:{evt_check:'REQUIRED/PM/worker运行状态受检。',evt_generate:'REQUIRED/PM/报告RESULT。',evt_stop:'FORBIDDEN/worker对象；执行者开放，禁令仍明确。'},claims:{cl_status_scope:'状态与所属服务的静态关系，限定检查对象；不是状态通过条件。'},expressions:{expr_status_of:'源文所属关系STATE，不是观测正常/失败。'}},
  notes:'首尾候选相同；中文包含运行状态所属服务及独立禁令。',findings:[]
 },
 'first/Q04':{
  facts:[
   ['evt_check cl_check_pm cl_check_input cl_check_scope','PM检查指定文件中的MCP工具清单。'],
   ['evt_generate cl_generate_pm cl_generate_result','PM生成mcp-check.md。'],
   ['evt_review cl_review_qa cl_review_object','QA承担复核，REVIEWER足以表达该明确复核职责。'],
   ['cl_generate_result cl_review_object ent_report','生成与复核用同一实体；内部报告复核OBJECT不变外部输入。'],
   ['cl_check_input cl_check_scope expr_list','I文件身份与清单局部范围齐全。'],
   ['cl_generate_result','O报告明确。'],
   ['evt_check evt_generate evt_review','无工具安装/调用/权限或凭MCP产生依据。']
  ],
  inventory:{entities:'PM/QA仅身份类型未知；文件和清单来自原文。',events:{evt_check:'REQUIRED/PM/tool-list输入，清单SCOPE。',evt_generate:'REQUIRED/PM/mcp-check RESULT。',evt_review:'REQUIRED/QA REVIEWER/同一内部报告OBJECT；未额外发明流程。'},claims:{cl_check_scope:'仅该检查的工具清单范围。'},expressions:{expr_list:'ITEM工具清单，无执行工具的含义。'}},
  notes:'首尾候选相同；中文角色、对象及清单范围完整。',findings:[]
 },
 'first/Q05':{
  facts:[
   ['e1 c1 c2 c3','PM列出settings.json中的配置项。'],
   ['e2 c4 c5','PM生成settings-list.md。'],
   ['c2 c3','源文件及局部配置项内容同时保留。'],
   ['c5','明确O报告。'],
   ['e3 c7 c8 x1','任何配置项字面全称范围保留于禁止对象和SCOPE；没有缩为单个配置项。'],
   ['e1 e2 e3','无更改许可，列出不是修改。']
  ],
  inventory:{entities:'PM明确身份、文件与配置项来源明确；任何配置项是量化禁令对象而非额外输入。',events:{e1:'REQUIRED/PM/settings.json与其中配置项INPUT，文件+内容不是两项不同业务。',e2:'REQUIRED/PM/settings-list.md RESULT。',e3:'FORBIDDEN/PM/任何配置项OBJECT，全称没有实例化。'},claims:{c8:'更改动作限定任何配置项；没有遗漏全称或新增例外。'},expressions:{x1:'ITEM任何配置项，与禁令同目标。'}},
  notes:'首尾候选相同；JSON和中文全称范围均保留。',findings:[]
 },
 'first/Q06':{
  facts:[
   ['ev_read cl_read_performer cl_read_input','DEV-01读取queue.csv。'],
   ['ev_generate cl_generate_performer cl_generate_result','DEV-01生成queue-note.md。'],
   ['ev_check cl_check_performer cl_check_report cl_check_count','OPS-01核对该内部报告中的队列数量，不读取新外部文件。'],
   ['ent_report cl_generate_result cl_check_report','同一报告实体唯一回指。'],
   ['cl_read_input cl_check_report','I仅queue.csv，内部报告内容用OBJECT。'],
   ['cl_generate_result','O为queue-note.md。'],
   ['ev_check cl_check_count','队列数量无观测值、执行阈值或WP；R空。']
  ],
  inventory:{entities:'DEV/OPS身份、两文件及报告内队列数量都有原文依据；OTHER不引申岗位/权限。',events:{ev_read:'REQUIRED/DEV-01/queue.csv INPUT。',ev_generate:'REQUIRED/DEV-01/queue-note.md RESULT，共享并列主体。',ev_check:'REQUIRED/OPS-01/同一报告和其中队列数量OBJECT，未添加检查总数限制。'},claims:{},expressions:{}},
  notes:'首尾候选相同；中文将该报告绑定到queue-note.md且保留核对内容。',findings:[]
 },
 'first/Q07':{
  facts:[
   ['ev_organize cl_organizer cl_organization_content','PM仅组织；ORGANIZER不是检查PERFORMER。'],
   ['ev_summarize cl_summarize_performer cl_summarize_object','QA汇总内部检查结果。'],
   ['ev_generate cl_generate_performer cl_generate_result','QA生成capacity.md。'],
   ['cl_organizer cl_pm_scope ex_pm_scope','仅组织职责限制保留；无PM/QA执行检查角色。'],
   ['ev_check cl_deferred_assignment ex_deferred_assignment','检查CONTENT/MentionOnly，无执行者；UNSPECIFIED由后续计划确定，不是竞争指代。'],
   ['cl_organization_content ex_check_content cl_check_object','被组织检查明确磁盘空间范围；I以组织SCOPE可达该检查，内容对象仍保留。'],
   ['cl_generate_result','capacity.md在O REQUIRED。'],
   ['ev_organize ev_check ev_summarize ev_generate','未生成制定计划/指定执行者的当前动作。']
  ],
  inventory:{entities:'PM/QA身份确定；磁盘空间、检查结果、capacity及后续计划字面身份有据；计划DOCUMENT类别被审阅保留未决，未变计划交付义务。',events:{ev_organize:'REQUIRED/PM ORGANIZER；两个SCOPE保留内容与仅组织职责。',ev_check:'CONTENT/MENTION_ONLY/UNSTATED，磁盘空间INPUT与内部RESULT关联；不提升当前执行动作。',ev_summarize:'REQUIRED/QA/内部检查结果OBJECT。',ev_generate:'REQUIRED/QA/capacity.md RESULT。'},claims:{cl_organization_content:'组织内容只指被组织检查。',cl_pm_scope:'PM仅组织责任，非禁止检查。',cl_deferred_assignment:'检查人由后续计划确定，保持当前未指定。'},expressions:{ex_check_content:'STATE组织内容为检查，child明确磁盘空间。',ex_pm_scope:'STATE职责仅限组织，目标PM与被组织检查。',ex_deferred_assignment:'STATE未来计划确定执行者，不捏造计划编制动作。'}},
  notes:'首尾候选相同。中文及I组织范围、P组织者/汇总者和UNSPECIFIED均保真；检查未变PM/QA独立义务。类型元数据未决与真正指代歧义分开。',findings:[]
 },
 'first/Q08':{
  facts:[
   ['evt_check cl_check_performer cl_check_input','OPS-01检查备份目录可读性。'],
   ['evt_generate cl_generate_performer cl_generate_result','OPS-01生成access.md。'],
   ['evt_deliver cl_deliver_performer cl_deliver_object','OPS-01交付同一access.md。'],
   ['cl_deliver_recipient','QA仅作交付接收者。'],
   ['cl_check_input evt_check','目录身份及可读性检查谓词齐全。'],
   ['cl_generate_result','access.md在O REQUIRED。'],
   ['evt_review cl_review_reviewer cl_review_object','候选与JSON以NOT_REQUIRED/QA/access.md保留免除复核义务；中文却只写“无需 复核”，丢QA和目标文件，无法从该免除项确定适用者及对象。',{delivered:'ERROR'}],
   ['ent_access cl_generate_result cl_deliver_object','生成、交付、免除复核用途为同一access.md。']
  ],
  inventory:{entities:'OPS/QA字面身份明确，类型局部未决；备份目录与access文件有来源。',events:{evt_check:'REQUIRED/OPS/目录INPUT，可读性谓词明确。',evt_generate:'REQUIRED/OPS/access RESULT。',evt_deliver:'REQUIRED/OPS/access OBJECT/QA RECIPIENT。',evt_review:'NOT_REQUIRED/QA REVIEWER/access OBJECT，仅免除指定复核义务，不变禁止或许可。'},claims:{},expressions:{}},
  notes:'首尾候选正确，Canonical.retained_nonprojected也保留免除的QA及access对象；但中文NOT_REQUIRED行省略角色与对象。未修改编译器。',
  findings:[{id:'Q08-RENDER-01',category:'来源/渲染错误',first_layer:'RENDERING',verdict:'ERROR',affects:['delivered'],fact_ids:['Q08-F07'],item_ids:['evt_review','cl_review_reviewer','cl_review_object'],source:'本任务不要求QA复核',actual:'无需 复核（不等于禁止）',reason:'免除义务的执行角色和目标已在候选与JSON明确，中文没有渲染；只保留谓词不是该指定免除事实的完整中文表达。'}]
 },
 'first/Q09':{
  facts:[
   ['e1 c1 c3','DEV-01核对index.csv。'],
   ['e2 c4 c5','DEV-01生成format-check.md。'],
   ['c2','FORMAT-9明确为e1依据，V而非I。'],
   ['e3 c6 c7 c9 x1','QA仅接收同一内部报告，有明确RECIPIENT。'],
   ['e4 c8','JSON以QA/NOT_REQUIRED执行核对撤回该职责；中文独立写“无需 执行核对”却无QA限定，与DEV明确核对义务的区别没有在免除条目显示。',{delivered:'ERROR'}],
   ['c3','I为index.csv，依据不变对象。'],
   ['c5','O format-check.md。'],
   ['e1 e2 e3 e4','没有发送动作或未述发送者；没有QA核对/批准义务。']
  ],
  inventory:{entities:'DEV/QA身份与两文件有原文依据，FORMAT-9为明示依据身份；角色类型未指定不影响身份。',events:{e1:'REQUIRED/DEV-01/FORMAT-9 BASIS/index.csv INPUT。',e2:'REQUIRED/DEV-01/format-check RESULT。',e3:'REQUIRED接收职责/QA RECIPIENT/同一报告OBJECT，未增加发送者。',e4:'NOT_REQUIRED执行核对，QA PERFORMER仅标被撤回职责的主体，非禁止。'},claims:{c9:'QA职责仅接收报告，未拓展为批准/复核。'},expressions:{x1:'STATE职责仅限接收，QA和报告身份明确。'}},
  notes:'首尾候选正确，JSON免除有QA主体；中文NOT_REQUIRED行丢指定主体，程序渲染保真失败。',
  findings:[{id:'Q09-RENDER-01',category:'来源/渲染错误',first_layer:'RENDERING',verdict:'ERROR',affects:['delivered'],fact_ids:['Q09-F05'],item_ids:['e4','c8'],source:'QA仅负责接收该报告，不负责执行核对',actual:'无需 执行核对（不等于禁止）',reason:'只免除QA的核对职责，中文省略QA，不能完整区分QA职责免除与DEV仍须核对。'}]
 },
 'first/Q10':{
  facts:[
   ['EV_GENERATE C_GENERATE_PM C_GENERATE_RESULT','PM生成report-a.md。'],
   ['EV_REVIEW C_REVIEW_QA C_REVIEW_OBJECT','QA复核生成的同一报告。'],
   ['EV_UPDATE C_UPDATE_QA C_UPDATE_OBJECT C_UPDATE_RESULT','QA更新，RESULT是同一报告的新状态而非第二个无关联文件。'],
   ['EV_SUBMIT C_SUBMIT_PM C_SUBMIT_OBJECT','PM提交QA更新后的同一报告。'],
   ['C_SUBMIT_RECIPIENT','接收者ADMIN。'],
   ['E_REPORT C_GENERATE_RESULT C_REVIEW_OBJECT C_UPDATE_OBJECT C_UPDATE_RESULT C_SUBMIT_OBJECT','同一E_REPORT，内部更新和后续用途不变外部输入。'],
   ['C_SUBMIT_ORDER X_REVIEW_DONE X_UPDATE_DONE X_QA_DONE','JSON AFTER/AND分别指EV_REVIEW、EV_UPDATE完成；生成和内部用途具有同一产物数据依赖。但中文两个状态都只显示“已完成(QA,report-a.md)”，省略两个不同event_id，未说明分别完成复核与更新。',{delivered:'ERROR'}],
   ['C_GENERATE_RESULT C_UPDATE_RESULT','O同一report-a生成/更新两种用途，I空。'],
   ['EV_GENERATE EV_REVIEW EV_UPDATE EV_SUBMIT','无版本依据或外部输入增造。']
  ],
  inventory:{entities:'PM/QA/ADMIN来源身份明确；一个report-a实体同时持这份报告与更新后的同一报告引文。',events:{EV_GENERATE:'REQUIRED/PM/同报告RESULT。',EV_REVIEW:'REQUIRED/QA REVIEWER/同报告OBJECT。',EV_UPDATE:'REQUIRED/QA/同报告OBJECT和更新状态RESULT。',EV_SUBMIT:'REQUIRED/PM/同报告OBJECT/ADMIN RECIPIENT，约束为复核及更新后。'},claims:{C_SUBMIT_ORDER:'ORDER/AFTER，AND两个不同动作完成状态；未新增复核通过条件。'},expressions:{X_REVIEW_DONE:'已完成的事件为EV_REVIEW，未知运行值。',X_UPDATE_DONE:'已完成的事件为EV_UPDATE，未知运行值。',X_QA_DONE:'AND复核完成与更新完成，未合并事件身份。'}},
  notes:'首尾候选及JSON关系正确；中文STATE表达省略event_id，两个不同动作前提显示成完全相同文本。',
  findings:[{id:'Q10-RENDER-01',category:'来源/渲染错误',first_layer:'RENDERING',verdict:'ERROR',affects:['delivered'],fact_ids:['Q10-F07'],item_ids:['X_REVIEW_DONE','X_UPDATE_DONE','C_SUBMIT_ORDER'],source:'请QA复核并更新这份报告，PM再将更新后的同一报告提交给ADMIN',actual:'时间先后 之后 AND(已完成(QA,report-a.md) [POSITIVE;运行值UNKNOWN],已完成(QA,report-a.md) [POSITIVE;运行值UNKNOWN])',reason:'STATE.event_id在JSON分别指复核和更新，中文formatExpression未显示所指事件；无法从两个同名状态分辨先后所要求的两个动作。'}]
 },
 'first/Q11':{
  facts:[
   ['evt_check cl_check_performer cl_check_input','QA检查schema.yaml。'],
   ['evt_generate cl_generate_performer cl_generate_result','QA生成conformance.md。'],
   ['cl_check_basis','RULE-17为按照指定的检查依据。'],
   ['cl_check_input','schema.yaml唯一受检对象，RULE-17不进入I。'],
   ['cl_generate_result','O conformance.md。']
  ],
  inventory:{entities:'QA身份、RULE-17依据身份及两个文件有原文来源；未从QA推权限。',events:{evt_check:'REQUIRED/QA/schema.yaml INPUT/RULE-17 BASIS。',evt_generate:'REQUIRED/QA/conformance.md RESULT，共享主体。'},claims:{},expressions:{}},
  notes:'首尾候选相同；JSON/中文区分依据和受检对象，没有额外行为。',findings:[]
 },
 'first/Q12':{
  facts:[
   ['evt_check cl_check_performer cl_check_rule cl_check_schema','QA检查两个并列对象：RULE-17内容和schema.yaml。'],
   ['evt_generate cl_generate_performer cl_generate_result','QA生成conformance.md。'],
   ['cl_check_rule cl_check_schema','两者都在I，是并列受检对象而非两个角色误并。'],
   ['cl_generate_result','O conformance.md。'],
   ['cl_check_rule evt_check','无BASIS及V，不凭RULE编号认作依据。']
  ],
  inventory:{entities:'RULE-17的内容、schema及报告来自源文；QA类型未指定不影响职责。',events:{evt_check:'REQUIRED/QA/两个INPUT_OBJECT，RULE内容不是依据。',evt_generate:'REQUIRED/QA/conformance RESULT。'},claims:{},expressions:{}},
  notes:'首尾候选相同；与Q11区分正确，中文也把RULE内容放I而非V。',findings:[]
 },
 'first/Q13':{
  facts:[
   ['ev_compare cl_compare_performer cl_compare_input','PM比较当前配置。'],
   ['ev_generate cl_generate_performer cl_generate_result','PM生成diff.md。'],
   ['cl_compare_basis ent_baseline','commit 7ac921e仅作明确比较基线，进入V。'],
   ['cl_compare_input','当前配置是I。'],
   ['cl_generate_result','O diff.md。'],
   ['ev_switch cl_switch_object','禁止切换当前工作区commit，并未缩成只禁止切到7ac921e。'],
   ['ev_compare ev_generate ev_switch','无当前commit观测值、业务仓库读取操作或切换义务；技术requires(ev_compare)只保留生成差异的证据依赖。']
  ],
  inventory:{entities:'PM、当前配置、比较基线commit、报告及当前工作区commit均有源文身份；两commit用途区分。',events:{ev_compare:'REQUIRED/PM/配置INPUT/基线BASIS。',ev_generate:'REQUIRED/PM/diff RESULT，requires依赖比较主张，不伪造已比较结果。',ev_switch:'FORBIDDEN/PM/当前工作区commit OBJECT，不变切换至特定提交禁止。'},claims:{},expressions:{}},
  notes:'首尾候选相同；版本基线、对象及禁止在JSON和中文均分开，未断言当前提交值。',findings:[]
 },
 'first/Q14':{
  facts:[
   ['evt_read cl_read_performer cl_read_input','PM读取ticket-516.txt。'],
   ['evt_generate cl_generate_performer cl_generate_result','PM生成brief-516.md。'],
   ['cl_read_input','ticket文件为明确I待读材料。'],
   ['cl_generate_result','brief文件为O。'],
   ['cl_basis_exclusion expr_not_basis','根任务SCOPE以NEGATIVE状态明确排除该文件依据用途；V空，无禁止动作。'],
   ['evt_read evt_generate ent_ticket ent_brief','516仅文件名组成；没有QUANTITY或R。']
  ],
  inventory:{entities:'PM及两个文件均有来源；516未拆为数字限制。',events:{evt_read:'REQUIRED/PM/ticket INPUT。',evt_generate:'REQUIRED/PM/brief RESULT。'},claims:{cl_basis_exclusion:'源文明确不是根任务依据，作为负向用途说明保留；非动作禁令。'},expressions:{expr_not_basis:'作为任务依据(ticket,ROOT) NEGATIVE，保留用途排除，不增加BASIS。'}},
  notes:'首尾候选相同，JSON/中文保留非依据说明，文件不变V/R。',findings:[]
 },
 'first/Q15':{
  facts:[
   ['A1 C1 C2','PM核对users.csv。'],
   ['A2 C3','生成许可和optional对象正确，但省略同一任务主体PM；原文“可以另外生成”延续唯一明确主体PM，不应改成执行者未指定。',{first:'ERROR',final:'ERROR',canonical:'ERROR',delivered:'ERROR'}],
   ['C2','I users.csv。'],
   ['A2 C3','optional在O标PERMITTED，未变必交。'],
   ['A3 C4','JSON NOT_REQUIRED交付明确绑定optional；中文却仅“无需 交付”，省略文件身份。',{delivered:'ERROR'}],
   ['A1 A2 A3','无生成/交付义务，也没有交付许可/禁止；主体遗漏另记F02。']
  ],
  inventory:{entities:'PM与两个文件字面身份正确，类别元数据未指定。',events:{A1:'REQUIRED/PM/users INPUT正确。',A2:{verdict:'ERROR',reason:'PERMITTED/optional RESULT正确，但未保留唯一延续主体PM；U1把本地省略主体误判未指定，漏掉生成许可的角色绑定。'},A3:'NOT_REQUIRED/optional OBJECT正确；未变禁止/许可。'},claims:{},expressions:{}},
  notes:'首尾候选都把允许生成的主体写成UNSPECIFIED。模型审阅未纠正，技术层接受A2；最终P缺生成主体。另有无需交付中文对象遗漏。',
  findings:[
   {id:'Q15-ROLE-01',category:'遗漏明确角色',first_layer:'LLM_PARSE',verdict:'ERROR',affects:['first','final_candidate','canonical_json','delivered'],fact_ids:['Q15-F02'],item_ids:['A2','U1'],source:'请PM核对users.csv；可以另外生成optional.md',actual:'A2=PERMITTED生成，仅C3 RESULT；U1=生成动作未另行明确执行者',reason:'同一短任务只有PM，另外生成延续该主体；冻结预期已要求PM生成许可。审阅器没有纠正该遗漏。'},
   {id:'Q15-RENDER-01',category:'来源/渲染错误',first_layer:'RENDERING',verdict:'ERROR',affects:['delivered'],fact_ids:['Q15-F05'],item_ids:['A3','C4'],source:'本任务不要求交付optional.md',actual:'无需 交付（不等于禁止）',reason:'NOT_REQUIRED的文件目标在候选/JSON存在，中文没有渲染目标，免除项不完整。'}
  ]
 },
 'first/Q16':{
  facts:[
   ['evt_check cl_check_performer cl_check_input','PM核对users.csv。'],
   ['cl_check_input','I users.csv。'],
   ['evt_generate cl_generate_performer cl_generate_result','FORBIDDEN生成optional.md，主体延续PM，产物只是禁止对象。'],
   ['evt_generate cl_generate_result','O空、A只有核对；禁止生成不会产生正向O。']
  ],
  inventory:{entities:'PM/users/optional身份来源明确。',events:{evt_check:'REQUIRED/PM/users INPUT。',evt_generate:'FORBIDDEN/PM/optional RESULT，不投正向O/A。'},claims:{},expressions:{}},
  notes:'首尾候选与JSON/中文正确；与Q15/Q17模态区别成立。',findings:[]
 },
 'first/Q17':{
  facts:[
   ['evt_check cl_check_performer cl_check_input','PM核对users.csv。'],
   ['cl_check_input','I users.csv。'],
   ['evt_generate cl_generate_result','JSON retained保留NOT_REQUIRED生成optional.md；但中文只“无需 生成”，全文不含optional.md，丢免除的产物目标。',{delivered:'ERROR'}],
   ['evt_generate cl_generate_result','O空，NOT_REQUIRED没有生成义务。'],
   ['evt_generate','没有PERMITTED/FORBIDDEN/REQUIRED转换；无需的执行者细节不产生正向职责或真实指代竞争。']
  ],
  inventory:{entities:'PM、users及optional文件字面身份有据。',events:{evt_check:'REQUIRED/PM/users INPUT。',evt_generate:'NOT_REQUIRED/optional RESULT；生成免责在根任务，未创建当前执行者职责。不要求该动作的额外执行者类型不作为完整模态事实的阻断。'},claims:{},expressions:{}},
  notes:'首尾候选正确保留不要求生成的目标文件；最终中文完全丢optional.md，最终交付不完整。NOT_REQUIRED开放执行者没有污染核对职责。',
  findings:[{id:'Q17-RENDER-01',category:'来源/渲染错误',first_layer:'RENDERING',verdict:'ERROR',affects:['delivered'],fact_ids:['Q17-F03'],item_ids:['evt_generate','cl_generate_result'],source:'无需生成optional.md',actual:'无需 生成（不等于禁止）',reason:'该文件只在非投影NOT_REQUIRED用途存在；中文不显示目标，全文无optional.md。'}]
 },
 'first/Q18':{
  facts:[
   ['A1 C1 C2 C3 C4 X1','PM逐一核对a.ini和b.ini，两个INPUT加逐一SCOPE。'],
   ['C2 C3 C4','I有两个文件，分配式逐一语义保留，不要求两个事件ID。'],
   ['A2 C5 C6','B仅修改b.ini，主体PM；未扩大到a.ini。'],
   ['A1 A2','没有a.ini修改许可或禁止，没有执行次数R。']
  ],
  inventory:{entities:'PM与a/b文件身份正确。',events:{A1:'REQUIRED/PM/两文件INPUT，STATE逐一约束。',A2:'FORBIDDEN/PM/仅b.ini OBJECT。'},claims:{C4:'逐一作用于核对而非修改，未解释为数量限制。'},expressions:{X1:'STATE逐一核对(a,b)，保留分配式范围。'}},
  notes:'首尾候选与JSON/中文一致，局部禁止范围未扩展或反推出许可。',findings:[]
 },
 'first/Q19':{
  facts:[
   ['ev_submit cl_submit_performer cl_submit_object cl_submit_result','PM获准提交check.md；交付RESULT为许可，不新增生成义务。'],
   ['cl_submit_recipient','ADMIN接收。'],
   ['cl_submit_condition expr_review_pass cl_review_object cl_submit_object','NECESSARY方向正确、状态未知，但前提对象ent_report与提交对象ent_file分离且无身份链接；不能证明是check.md通过QA复核。',{first:'ERROR',final:'ERROR',canonical:'ERROR',delivered:'ERROR'}],
   ['ent_report ent_file cl_review_object cl_submit_object','唯一报告指称未与check.md关联，原文“本次报告”与该提交文件的同一身份丢失。',{first:'ERROR',final:'ERROR',canonical:'ERROR',delivered:'ERROR'}],
   ['ev_review_pass ev_submit cl_reviewer','QA仅条件复核引用，没有独立复核义务，必要方向未变充分。']
  ],
  inventory:{entities:'各个字面身份有原文依据；缺陷是ent_report与ent_file之间丢同一关系，不能把其他PM/QA/ADMIN实体也算错。',events:{ev_review_pass:{verdict:'ERROR',reason:'CONDITION/MENTION_ONLY状态本身正确，却绑定无身份关联的ent_report，而非提交的check.md。'},ev_submit:'PERMITTED/PM/ADMIN/check.md OBJECT+RESULT；生成义务未补造。'},roles:{cl_reviewer:'QA为条件中的复核者，角色本身正确，不因报告身份关联遗漏而算错。',cl_review_object:{verdict:'ERROR',reason:'前提OBJECT=ent_report未与将提交的check.md关联。'}},claims:{cl_submit_condition:{verdict:'ERROR',reason:'NECESSARY正确，但expr_review_pass所指报告身份没有绑定到交付对象，接受了不完整的条件对象关联。'}},expressions:{expr_review_pass:{verdict:'ERROR',reason:'复核通过(ent_report,QA)，ent_report与ent_file无same-entity关系，条件未落实到check.md。'}}},
  notes:'首候选已明确写“未将其与本次报告合并”；审阅全SUPPORT且无遗漏；最终O/A/P均RESOLVED。程序保真传递了错误的身份分离，不是技术校验替代语义修复。',
  findings:[{id:'Q19-IDENTITY-01',category:'错误对象/角色绑定',first_layer:'LLM_PARSE',verdict:'ERROR',affects:['first','final_candidate','canonical_json','delivered'],fact_ids:['Q19-F03','Q19-F04'],item_ids:['ent_report','ent_file','cl_review_object','cl_submit_object','expr_review_pass','cl_submit_condition'],source:'仅当本次报告通过QA复核时，允许PM向ADMIN提交check.md。',actual:'条件state.args=[ent_report,ent_qa]；提交OBJECT/RESULT=ent_file；ent_report与ent_file分别独立且无链接；全SUPPORT/RESOLVED',reason:'源文只有这一个报告，必要前提必须约束将提交的同一check.md。分离身份使机器条件无法与该交付物一致绑定。'}]
 },
 'first/Q20':{
  facts:[
   ['evt_notify cl_notify_performer cl_notify_recipient','OPS-01必须通知PM，受异常充分触发。'],
   ['evt_generate cl_generate_performer cl_generate_result','OPS-01必须生成health.md。'],
   ['cl_notify_recipient','PM是通知接收者，不是发现/检查执行者。'],
   ['cl_notify_condition expr_discovered','发现服务异常SUFFICIENT只触发通知。'],
   ['evt_generate cl_generate_result','生成约束为空，异常/非异常均要求；没有继承通知条件。'],
   ['cl_generate_result','health.md O REQUIRED。'],
   ['evt_discovered cl_discovered_object expr_discovered','STATE/CONDITION/MentionOnly保持未知状态，无新增监测/检查义务或已发现事实。']
  ],
  inventory:{entities:'OPS/PM、服务及health来源有据；服务仅条件涉及对象。',events:{evt_discovered:'CONDITION/MENTION_ONLY/UNSTATED状态，服务OBJECT不变外部I。',evt_notify:'REQUIRED/OPS PERFORMER/PM RECIPIENT，充分异常条件。',evt_generate:'REQUIRED/OPS/health RESULT，无条件限制。'},claims:{cl_notify_condition:'SUFFICIENT针对通知，不是必要或对整个任务。'},expressions:{expr_discovered:'STATE发现服务异常，未知运行值。'}},
  notes:'首尾候选及JSON/中文完整保留条件局部性与无条件产物；本案后续两次真实重复仍须独立审阅。',findings:[]
 },
 'first/Q21':{
  facts:[
   ['ev_publish_permitted cl_publish_performer cl_publish_object','PM被允许发布本次report.md，没有发布义务或生成义务。'],
   ['cl_permission_condition ex_both_approved ex_qa_approved ex_ops_approved','NECESSARY+AFTER，AND要求QA和OPS两项批准均取得，状态未知。'],
   ['ev_publish_forbidden cl_forbidden_object cl_forbidden_performer cl_prohibition_condition ex_any_missing ex_qa_missing ex_ops_missing','同一报告/PM禁止发布；OR任一未批准SUFFICIENT触发，未误缩成两个都未批准。'],
   ['ev_qa_approval ev_ops_approval cl_qa_approver cl_ops_approver','批准引用MENTION_ONLY/UNSTATED，无独立批准义务；没有OR许可或无条件发布。']
  ],
  inventory:{entities:'PM/QA/OPS及同一report.md有来源，两批准共享同报告身份。',events:{ev_publish_permitted:'PERMITTED/PM/report OBJECT，AND必要且AFTER。',ev_qa_approval:'条件中QA批准动作引用，无当前义务。',ev_ops_approval:'条件中OPS批准动作引用，无当前义务。',ev_publish_forbidden:'FORBIDDEN/同PM/同报告，任一缺批准充分触发。'},claims:{cl_permission_condition:'NECESSARY/AFTER，目标许可发布。',cl_prohibition_condition:'SUFFICIENT，目标禁止发布。'},expressions:{ex_qa_approved:'QA/report批准已取得 POSITIVE，值未知。',ex_ops_approved:'OPS/report批准已取得 POSITIVE，值未知。',ex_both_approved:'AND两项取得。',ex_qa_missing:'同QA/report批准状态 NEGATIVE。',ex_ops_missing:'同OPS/report批准状态 NEGATIVE。',ex_any_missing:'OR任一批准未取得；与AND批准逻辑互补。'}},
  notes:'首尾候选与JSON/中文均保留AND许可、OR禁止、同一对象及先后；发布现有报告的OBJECT用途没有凭空生成文件。',findings:[]
 },
 'first/Q22':{
  facts:[
   ['e1 c1 c2','PM必须提交handover.md，OBJECT身份正确。'],
   ['c6 x1 e2 c4','根任务COMPLETION为NECESSARY，ADMIN确认已收到同一handover；没有改充分。'],
   ['e2 c3 c4','ADMIN仅条件中确认主体，无独立确认义务。'],
   ['e1 e2 e3 c5 c6','源文未直接指定提交收件方或完成标记者，保留开放细节；没有确认动作义务。']
  ],
  inventory:{entities:'PM、ADMIN及唯一handover文件来源明确。',events:{e1:'REQUIRED/PM/handover OBJECT，明确提交；是否还须建RESULT供O待合同复核，不认为是生成文件。',e2:'CONDITION/MENTION_ONLY/UNSTATED，ADMIN确认已收到同一文件，不断言实际发生。',e3:'PERMITTED标记完成，有NECESSARY前提；源文才可标记明确该受限用途，未指定标记者。'},claims:{c5:'NECESSARY约束标记完成动作。',c6:'根COMPLETION/NECESSARY，未变充分。'},expressions:{x1:'ADMIN已确认收到handover状态，与提交文件同一实体，未知运行值。'}},
  notes:'冻结账本中提交及完成事实全部表达。O却ABSENT：源文明确交付现有文件，v0.4表O写产生、同文示例又把提交列为OBJECT；预先账本未单列O，不能看结果后增补并直接判错，留独立合同/视图待审。',
  findings:[{id:'Q22-O-REVIEW',category:'交付视图合同待审',first_layer:'SKILL_SCHEMA_CONTRACT',verdict:'REVIEW_REQUIRED',affects:['canonical_json','delivered'],fact_ids:['Q22-F01'],item_ids:['e1','c2'],source:'PM必须提交handover.md',actual:'e1.required/c2.OBJECT=handover；O=ABSENT',reason:'交付动作与对象保留，是否现有文件提交也必须作为O结果：v0.4产生定义与提交OBJECT例子存在解释空间；冻结预期未明确该槽位要求，须ADMIN裁定，不擅自修改预期。'}]
 },
 'first/Q23':{
  facts:[
   ['e1 c1 c2','PM必须提交handover.md；首次c2错误增加INPUT_OBJECT用途，产品修订改为普通OBJECT。动作、主体、文件身份本身齐全。'],
   ['c5 x1 e2 c4','COMPLETION/SUFFICIENT/ROOT，确认已收到同一文件即触发完成，未变必要/唯一条件。'],
   ['e2 c3 c4','ADMIN为确认收到主体，CONDITION/MentionOnly，无当前确认义务；最终C内仍含ADMIN角色语境。']
  ],
  inventory:{entities:'PM、ADMIN及handover唯一身份有来源。',events:{e1:'REQUIRED/PM/handover OBJECT；是否需另有交付O待合同复核。',e2:'CONDITION/MENTION_ONLY/UNSTATED确认收到，不增加义务。'},claims:{c5:'根COMPLETION/SUFFICIENT，不是必要或IFF。'},expressions:{x1:'确认收到(ADMIN,handover)，与提交对象同一身份，运行值未知。'}},
  first_inventory:{entities:'PM、ADMIN及文件身份有来源。',events:{e1:'REQUIRED/PM提交handover，动作本身正确。',e2:'条件确认语义正确，无独立义务。'},roles:{c2:{verdict:'ERROR',reason:'明确提交对象未明确外部输入/受检用途；候选INPUT_OBJECT额外引入I用途，不能凭未生成文件反推外部输入。'}},claims:{c5:'根COMPLETION/SUFFICIENT正确。'},expressions:{x1:'确认收到ADMIN/handover，同一文件正确。'}},
  notes:'第一个发生产品内显式修订的案例，4次调用。首次审阅质疑c2的INPUT_OBJECT用途，第二次解析改OBJECT，仍保留SUFFICIENT完成。最终O缺失问题与Q22相同，不能用预期事后增补直接判错。',
  findings:[
   {id:'Q23-I-01',category:'错误槽用途',first_layer:'LLM_PARSE',verdict:'ERROR',affects:['first'],fact_ids:['Q23-F01'],item_ids:['c2'],source:'PM必须提交handover.md',actual:'首候选c2.role=INPUT_OBJECT；首次审阅CONTRADICT；修订后OBJECT',reason:'只指定提交对象，没有外部输入或受检用途。原审阅阻断并有界修订，首次候选不能算正确；首次用户交付用修订后结果。'},
   {id:'Q23-O-REVIEW',category:'交付视图合同待审',first_layer:'SKILL_SCHEMA_CONTRACT',verdict:'REVIEW_REQUIRED',affects:['canonical_json','delivered'],fact_ids:['Q23-F01'],item_ids:['e1','c2'],source:'PM必须提交handover.md',actual:'最终OBJECT=handover；O=ABSENT',reason:'同Q22：预先账本只规定提交及完成语义，是否现有文件必须另外作为O交付结果存在方法解释空间，留ADMIN裁定，不改预期。'}
  ]
 },
 'first/Q24':{
  facts:[
   ['evt_verify cl_verify_performer cl_verify_input','QA必须核验配置。'],
   ['cl_verify_input','配置受检范围进入I。'],
   ['cl_time','LTE 6分钟/EXECUTION_LIMIT，target与scope均为核验事件；不绑定停止或完成。'],
   ['evt_error evt_stop cl_stop_condition cl_root_stop expr_error','权限错误STATE未知，SUFFICIENT触发停止；根STOP保留，QA由唯一当前执行主体继承。'],
   ['cl_time cl_root_stop','期限只在R；C仅权限错误停止，无成功完成条件或已发生错误。']
  ],
  inventory:{entities:'QA与配置身份有来源；QA类别未明不改变身份。',events:{evt_verify:'REQUIRED配置核验/QA/配置INPUT，6分钟仅约束该事件。',evt_error:'CONDITION/MENTION_ONLY/UNSTATED权限错误状态，不新增发现或实际出错事实。',evt_stop:'REQUIRED条件停止，QA局部唯一主体继承，SUFFICIENT权限错误。'},claims:{cl_time:'LTE6分钟核验用时，EXECUTION_LIMIT，无量纲或目标混淆。',cl_stop_condition:'SUFFICIENT权限错误约束停止。',cl_root_stop:'ROOT STOP/SUFFICIENT，不是完成。'},expressions:{expr_error:'出现权限错误，ROOT状态未知。'}},
  notes:'核验耗时、充分停止与根作用域在首尾候选、JSON和中文一致；不以时限代替成功完成。',findings:[]
 },
 'first/Q25':{
  facts:[
   ['evt_read cl_read_performer cl_read_input','PM必须读取feed.json。'],
   ['evt_generate cl_generate_performer cl_generate_result','同一当前任务PM继承为报告生成者，必须生成feed-note.md。'],
   ['cl_read_input','feed.json外部读取用途进入I。'],
   ['cl_generate_result','feed-note.md RESULT/O，带内容数量。'],
   ['cl_retry_limit','LTE4次/读取重试次数/EXECUTION_LIMIT，仅evt_read；重试概念不包含最初执行。'],
   ['cl_output_count','EQ2条/OUTPUT_CONTENT，target和count_scope=报告，scope=生成；挂O不进入R。'],
   ['cl_output_count cl_retry_limit','两个独立数量没有互换、没有断言现实已发现两条异常。']
  ],
  inventory:{entities:'PM、feed.json及feed-note.md身份有据，报告唯一。',events:{evt_read:'REQUIRED/PM/feed输入，重试限制只约束读取。',evt_generate:'REQUIRED/PM/报告RESULT，输出内容数量而非执行次数。'},claims:{cl_retry_limit:'读取重试次数LTE4次，执行限制，明确不含初次。',cl_output_count:'报告异常记录EQ2条/OUTPUT_CONTENT，报告目标、生成作用域；不是观测数。'},expressions:{}},
  notes:'首轮数量算子、单位、目标、count_scope和投影视图均符合原文；后续两次重复仍单独审。',findings:[]
 },
 'first/Q26':{
  facts:[
   ['e_check c_performer c_input_a c_input_c','PM检查的有效对象是A/C，输入论元没有B/D。'],
   ['c_check_scope x_check_scope x_listed x_excluded','EXCEPT(UNION(A,B,C,D),UNION(B,D))保留原集合与排除。'],
   ['e_restart c_restart_object c_restart_scope x_all','FORBIDDEN重启任何测试机；禁止范围没有缩至A/C。'],
   ['x_listed c_check_scope','四台仅列举集合，没有QUANTITY或R次数。']
  ],
  inventory:{entities:'PM、四台测试机及任何测试机全称集合身份均来源明确；PM类型疑点局部保留。',events:{e_check:'REQUIRED/PM，只有A/C INPUT；范围排除独立保存。',e_restart:'FORBIDDEN/任何测试机OBJECT，没有重启义务或许可。'},claims:{c_check_scope:'检查的差集范围，拥有者e_check正确。',c_restart_scope:'任何测试机范围，独立e_restart，不继承检查排除。'},expressions:{x_a:'ITEM测试机A。',x_b:'ITEM测试机B，两处来源。',x_c:'ITEM测试机C。',x_d:'ITEM测试机D，两处来源。',x_listed:'UNION四台，未误建资源限制。',x_excluded:'UNION(B,D)。',x_check_scope:'EXCEPT列举减排除。',x_all:'ITEM任何测试机，全称文字未缩小。'}},
  notes:'检查差集与全称禁止分别作用于两个事件；未知禁止执行者不影响明确禁止，未补造对A的修改许可。',findings:[]
 },
 'first/Q27':{
  facts:[
   ['ev_generate cl_generate_performer cl_generate_result','PM必须生成howto.md。'],
   ['ev_write cl_write_performer cl_write_object cl_write_content','PM必须在同一内部产物howto中写入引文；文件没有误作为外部I对象。'],
   ['cl_generate_result','howto.md明确O。'],
   ['cl_write_scope expr_content ev_quoted_disable cl_quoted_object','内容范围保留；引文事件QUOTED/MENTION_ONLY，owner=写入。'],
   ['ev_forbidden_disable cl_forbidden_object cl_forbidden_scope expr_task','本次FORBIDDEN停用worker，独立根任务范围。'],
   ['ev_quoted_disable ev_forbidden_disable','PERMITTED只在引文内部，未进入当前A许可；当前禁止完整。']
  ],
  inventory:{entities:'PM、howto、引文内容与worker同一服务身份均来源明确。',events:{ev_generate:'REQUIRED/PM/howto RESULT。',ev_write:'REQUIRED/PM/howto OBJECT/引文CONTENT，来源文中局部写入。',ev_quoted_disable:'QUOTED/MENTION_ONLY/PERMITTED/owner写入，只是内容，不执行。',ev_forbidden_disable:'MAIN/CURRENT_TASK/FORBIDDEN，worker对象，禁止主体未另指定不改变根禁止。'},claims:{cl_write_scope:'ITEM引文内容约束写入，I为输入与作用域视图，未声明外部文件输入。',cl_forbidden_scope:'属于本次任务，目标当前停用禁止。'},expressions:{expr_content:'ITEM明确引文文本，只约束写入。',expr_task:'本次根任务范围，非许可条件。'}},
  notes:'候选、JSON及中文区分内容层许可与当前层禁止，没有把引文转换成执行授权。',findings:[]
 },
 'first/Q28':{
  facts:[
   ['ev_check cl_check_performer cl_check_input','PM必须检查已归档日志完整性。'],
   ['ev_generate cl_generate_performer cl_generate_result','并列生成沿用PM，archive-check结果明确。'],
   ['cl_check_input ev_archived cl_archived_object','已归档作为受检日志定语，MODIFIER/MENTION_ONLY，不升格归档命令。'],
   ['cl_generate_result','archive-check.md O。'],
   ['ev_archive_new cl_archive_performer cl_archive_object','FORBIDDEN归档新日志，未禁止检查已归档日志。'],
   ['ev_archived ev_archive_new','只有当前禁止归档；定语状态UNSTATED，没有生成新的归档义务或事实断言。']
  ],
  inventory:{entities:'PM、已归档日志、新日志及报告是不同明确用途实体，未互换。',events:{ev_check:'REQUIRED/PM/已归档日志INPUT，完整性在谓词保留。',ev_generate:'REQUIRED/PM/报告RESULT，并列继承明确。',ev_archive_new:'FORBIDDEN归档新日志，任务主体PM继承，不形成正向义务。',ev_archived:'STATE/MODIFIER/MENTION_ONLY/UNSTATED，owner检查，是日志限定。'},claims:{},expressions:{}},
  notes:'首尾候选和最终结果保留对象定语及独立禁止；PM类别待细化只影响type，不影响明确主体。',findings:[]
 },
 'first/Q29':{
  facts:[
   ['evt_read cl_read_pm cl_read_east cl_read_west','PM必须读取两份文件，各独立INPUT绑定明确。'],
   ['evt_handoff cl_handoff_pm cl_handoff_object cl_order','读取之后PM必须交给，交付对象保留它，ORDER/AFTER未变充分条件。'],
   ['evt_generate cl_generate_ops cl_generate_port','独立OPS-01必须生成port.md。'],
   ['cl_handoff_qa','QA仅接收，无复核义务。'],
   ['cl_read_east cl_read_west','两个明确读取在I RESOLVED。'],
   ['cl_generate_port','port O RESOLVED，不受前句指代污染。'],
   ['ent_it cl_handoff_object','east/west备选，真实歧义局部保留；A中该交付UNRESOLVED没有按邻近挑west。'],
   ['cl_read_pm cl_handoff_pm cl_handoff_qa cl_generate_ops','P的明确关系仍接受，独立读取和生成仍接受，没有额外WP/QA核查。']
  ],
  inventory:{entities:'PM、QA、OPS及三份命名文件身份明确；REFERENT它带east/west竞争是正确保留而非推断身份。',events:{evt_read:'REQUIRED/PM/two INPUT，独立正确。',evt_handoff:'REQUIRED/PM/它OBJECT/QA RECIPIENT，AFTER读取；技术聚合UNRESOLVED仅因对象。',evt_generate:'REQUIRED/OPS/port RESULT，独立正确。'},claims:{cl_order:'ORDER/AFTER读取完成，不是充分触发或任务完成。'},expressions:{expr_read_done:'两份文件读取完成的时序参照，未知运行值。'}},
  notes:'真实来源歧义保留也是整案PASS；歧义对象的技术UNRESOLVED不是额外语义缺陷，全部明确动作/关系未污染。',findings:[]
 },
 'first/Q30':{
  facts:[
   ['A1 C1 C2 C3','PM必须读取east/west两个文件。'],
   ['A2 C4 C5 C7','PM读取后交给east，前一个文件按明确顺序闭合，ORDER/AFTER。'],
   ['A3 C8 C9','独立OPS必须生成port报告。'],
   ['C6','QA只接收east，不补复核义务。'],
   ['C2 C3','I两个明确读取，未缩至交付对象。'],
   ['C9','port明确O，独立动作不受影响。'],
   ['C5 E2','前一个唯一关联east同实体，交付无错误未决，不交两份。'],
   ['A2 C5','没有选择west或沿用它的歧义，没有反推许可。']
  ],
  inventory:{entities:'PM、QA、OPS及east/west/port身份来源明确，east的前一个提及绑定同一实体。',events:{A1:'REQUIRED/PM/两个INPUT。',A2:'REQUIRED/PM/east OBJECT/QA RECIPIENT，AFTER读取。',A3:'REQUIRED/OPS/port RESULT。'},claims:{C7:'ORDER/AFTER读取两个文件完成，仅先后不新增完成条件。'},expressions:{X1:'读取完成(east,west)的未知时序参照。'}},
  notes:'Q29/Q30区别由实际解析保留：竞争它与明确前一个分开。JSON及中文包含same east交付和独立port，没有变成两份交付。',findings:[]
 },
 'repeat-1/Q07':{
  facts:[
   ['e_organize c_organize_performer e_check c_check_organizer','PM必须组织检查；组织动作PERFORMER与受组织检查ORGANIZER分开。'],
   ['e_summarize c_summarize_performer c_summarize_object','QA必须汇总同一检查结果。'],
   ['e_generate c_generate_performer c_generate_result','QA必须生成capacity。'],
   ['c_pm_scope x_pm_scope c_check_organizer','PM职责仅限组织，检查没有PM或QA PERFORMER；QA独立汇总/生成。'],
   ['c_executor_pending x_executor_pending','后续计划确定执行者，UNSPECIFIED保留，非竞争歧义。'],
   ['c_check_input','明确磁盘空间范围进入I。'],
   ['c_generate_result','capacity O；内部检查结果是汇总对象，不是额外外部文件交付。'],
   ['e_check c_executor_pending','检查任务执行者未指定；没有制定计划事件或默认检查人。']
  ],
  inventory:{entities:'PM/QA/磁盘空间/检查结果/capacity身份有据；后续计划类型DOCUMENT被审阅局部未决，身份和计划用途不推造。',events:{e_organize:'REQUIRED/PM组织动作；未绑定为亲自检查。',e_check:'被要求组织的检查任务，REQUIRED可表达其任务用途；PM仅ORGANIZER，无PERFORMER。INPUT磁盘、RESULT为后句承接的内部检查结果，不额外文件。',e_summarize:'REQUIRED/QA/内部检查结果OBJECT。',e_generate:'REQUIRED/QA/capacity RESULT。'},claims:{c_pm_scope:'仅组织职责，scope PM；不转换为禁止PM执行的独立命令。',c_executor_pending:'检查执行者将由计划确定，不指定人，不增加编制计划义务。'},expressions:{x_pm_scope:'职责仅限组织(PM,检查)，源文显式范围。',x_executor_pending:'执行者由后续计划确定，检查事件所属。'}},
  notes:'额外第一次实际调用重新审阅；与首轮相比多拆组织/检查事件及内部检查结果，语义等价。检查无默认执行者，真实来源义务完整保留。',findings:[]
 },
 'repeat-1/Q20':{
  facts:[
   ['event_notify claim_notify_performer claim_notify_recipient','OPS必须通知PM，异常充分触发。'],
   ['event_generate claim_generate_performer claim_generate_result','OPS无条件必须生成health。'],
   ['claim_notify_recipient','PM仅通知接收者。'],
   ['claim_notify_condition expression_discovered','SUFFICIENT服务异常只约束通知。'],
   ['event_generate','constraint_ids为空，是否异常均生成。'],
   ['claim_generate_result','health O REQUIRED。'],
   ['event_discover claim_discover_object','条件事件MENTION_ONLY/UNSTATED，发现者未指定，无新增检查或事实断言。']
  ],
  inventory:{entities:'OPS/PM/服务/health身份均来源明确。',events:{event_discover:'ACTION/CONDITION/MENTION_ONLY发现事件，未指执行者，不进入当前A。',event_notify:'REQUIRED/OPS/PM接收，SUFFICIENT条件。',event_generate:'REQUIRED/OPS/health RESULT，无条件限制。'},claims:{claim_notify_condition:'异常发现充分触发通知，不约束生成。'},expressions:{expression_discovered:'服务异常发现状态，未知运行值。'}},
  notes:'第二次实测与首次语义一致。条件中的发现者额外标UNSPECIFIED是原文开放细节，不污染明确OPS通知/生成。',findings:[]
 },
 'repeat-1/Q25':{
  facts:[
   ['evt_read cl_read_performer cl_read_input','PM读取义务保留。'],
   ['evt_generate cl_generate_performer cl_generate_result','PM生成明确，但不合法输出数量依赖连带使交付事件REJECTED。',{canonical:'ERROR',delivered:'ERROR'}],
   ['cl_read_input','feed输入接受且独立。'],
   ['cl_generate_result','报告RESULT在候选明确，最终O却REJECTED，无法完整接受源文明确交付。',{canonical:'ERROR',delivered:'ERROR'}],
   ['cl_retry_limit','LTE4次/EXECUTION_LIMIT/target与count_scope读取，初次执行排除正确。'],
   ['cl_record_count cl_report_content','EQ2/OUTPUT_CONTENT意图保留，但target_id=异常记录实体，违反合同必须指报告RESULT；计数范围报告尚正确，技术拒绝CONTENT_QUANTITY_RESULT_TARGET，最终未挂O。',{first:'ERROR',final:'ERROR',canonical:'ERROR',delivered:'ERROR'}],
   ['cl_record_count cl_retry_limit','没有把内容数量转资源或实际观测，但该内容要求无法正常编译；R仅读取重试。']
  ],
  inventory:{entities:'PM/feed/报告及异常记录身份有来源，PM类型疑点局部保留。',events:{evt_read:'REQUIRED/PM/feed输入，重试限制正确。',evt_generate:'REQUIRED/PM/报告RESULT/异常记录CONTENT，语义动作本身正确；输出数量合同错导致下游连带REJECTED。'},claims:{cl_retry_limit:'LTE4仅读取重试，EXECUTION_LIMIT。',cl_record_count:{verdict:'ERROR',reason:'OUTPUT_CONTENT target必须指产物，候选却指异常记录ent_records；count_scope指报告不足以替代合同target。原审阅全SUPPORT该数量，技术检查正确拒绝，不是机器语义修复。'}},expressions:{}},
  notes:'第二次真实运行不是首轮成功的重复证明：来源含义仍可读，但数量目标编码违反冻结合同，原模型审阅未拦截，技术拒绝并连带阻断O/A/P。实际失败完整保留，不重跑到正确。',
  findings:[{id:'Q25-R1-CONTRACT-01',category:'数量合同表达错误',first_layer:'SKILL_SCHEMA_CONTRACT',verdict:'ERROR',affects:['first','final_candidate','canonical_json','delivered'],fact_ids:['Q25-F02','Q25-F04','Q25-F06'],item_ids:['cl_record_count','evt_generate','cl_generate_result'],source:'生成feed-note.md，报告恰好列出2条异常记录',actual:'cl_record_count.quantity.target_id=ent_records，count_scope=ent_report；技术CONTENT_QUANTITY_RESULT_TARGET拒绝；O/A生成REJECTED，中文没有2条约束',reason:'共享合同要求OUTPUT_CONTENT.target_id为报告RESULT。模型候选和审阅未遵守该字段合同；技术拒绝有效但最终任务要求未完整交付。不是修改编译器或降低状态就通过。'}]
 },
 'repeat-1/Q29':{
  facts:[
   ['ev_read cl_read_performer cl_read_east cl_read_west','PM读取east/west均明确。'],
   ['ev_handover cl_handover_performer cl_handover_object cl_order','PM读取后交给，只有对象身份未决，AFTER/ORDER。'],
   ['ev_generate cl_generate_performer cl_generate_result','OPS独立生成port。'],
   ['cl_handover_recipient','QA接收，没有复核义务。'],
   ['cl_read_east cl_read_west','I两文件RESOLVED不污染。'],
   ['cl_generate_result','port O RESOLVED不污染。'],
   ['ent_it cl_handover_object','两个指代备选，局部UNRESOLVED，不按距离挑west。'],
   ['cl_read_performer cl_handover_performer cl_handover_recipient cl_generate_performer','明确参与关系与独立动作接受，只有依赖指代的交付对象及事件整体未决。']
  ],
  inventory:{entities:'PM/QA/OPS类别局部未明，身份明确；east/west/port明确；它保留真实两候选。',events:{ev_read:'REQUIRED/PM/两个INPUT。',ev_handover:'REQUIRED/PM/未决它OBJECT/QA接收，时序明确，不错误强选。',ev_generate:'REQUIRED/OPS/port RESULT，无关联歧义。'},claims:{cl_order:'ORDER/AFTER读取完成，未变充分或完成任务。'},expressions:{expr_read_done:'east/west读取完成的时序参照，未知运行值。'}},
  notes:'第二次实测再次保持对象歧义局部性；type局部未明没有污染身份/明确用途。原始JSON与中文含同样明确事实和未决对象。',findings:[]
 },
 'repeat-1/Q30':{
  facts:[
   ['evt_read cl_read_pm cl_read_east cl_read_west','PM读取两份文件。'],
   ['evt_handoff cl_handoff_pm cl_handoff_east cl_order','PM读取后交给明确east，ORDER/AFTER。'],
   ['evt_generate cl_generate_ops cl_generate_port','OPS独立生成port。'],
   ['cl_handoff_qa','QA接收east，不执行核查。'],
   ['cl_read_east cl_read_west','I两份文件完整。'],
   ['cl_generate_port','port O。'],
   ['cl_handoff_east ent_east','前一个绑定同一east实体，交付明确接受，不是west/两份/它。'],
   ['evt_handoff cl_handoff_east','无错误歧义，没有额外义务或权限。']
  ],
  inventory:{entities:'PM/QA/OPS和east/west/port均明确，前一个文件同east。',events:{evt_read:'REQUIRED/PM/two INPUT。',evt_handoff:'REQUIRED/PM/east OBJECT/QA接收，读取后。',evt_generate:'REQUIRED/OPS/port RESULT。'},claims:{cl_order:'ORDER/AFTER读取完成，保持顺序。'},expressions:{expr_read_done:'读取east/west完成的未知参照。'}},
  notes:'第二次实测与首次明确指代一致，接收对象只east；保留独立读取两份以及OPS产物。',findings:[]
 },
 'repeat-2/Q07':{
  facts:[
   ['evt_organize cl_organizer','PM组织磁盘空间检查，CURRENT_TASK/REQUIRED。'],
   ['evt_summarize cl_summarize_performer cl_summarize_object','QA汇总检查结果义务。'],
   ['evt_generate cl_generate_performer cl_generate_result','QA生成capacity义务。'],
   ['cl_pm_scope expr_pm_scope','仅组织职责；PM不是具体检查PERFORMER，QA没有检查角色。'],
   ['cl_executor_assignment expr_executor_assignment','执行者由后续计划确定，UNSPECIFIED无候选竞争。'],
   ['evt_check cl_check_object','磁盘空间范围在被组织检查内容保持，有显式owner组织事件；没有新增外部结果I。'],
   ['cl_generate_result','capacity O。'],
   ['evt_check cl_executor_assignment','MENTION_ONLY检查，不默认执行者，不新增制定计划或禁止检查。']
  ],
  inventory:{entities:'PM/QA/磁盘空间/内部结果/capacity/后续计划身份有据，类别没有硬推。',events:{evt_organize:'REQUIRED/PM ORGANIZER，范围仅组织。',evt_check:'CONTENT/MENTION_ONLY/UNSTATED，被组织的磁盘检查INPUT，owner正确，执行者留未来。',evt_summarize:'REQUIRED/QA/检查结果OBJECT，内部结果不外部输入。',evt_generate:'REQUIRED/QA/capacity RESULT。'},claims:{cl_pm_scope:'PM仅组织职责范围，未改禁止执行命令。',cl_executor_assignment:'具体检查执行者未来计划确定，未自动建立编制计划义务。'},expressions:{expr_pm_scope:'仅组织范围(PM,检查)，显式。',expr_executor_assignment:'后续计划确定检查执行者。'}},
  notes:'第三次实测与首轮同样以内容检查结构保留范围；第二次拆成任务检查结构，两种都未指定检查执行者。三次完整保留PM组织、QA汇总/生成与未来执行者确定。',findings:[]
 },
 'repeat-2/Q20':{
  facts:[
   ['evt_notify cl_notify_performer cl_notify_recipient','OPS必须条件通知PM。'],
   ['evt_generate cl_generate_performer cl_generate_result','OPS必须无条件生成health。'],
   ['cl_notify_recipient','PM为通知接收者。'],
   ['cl_notify_condition expr_discovered','已发现服务异常SUFFICIENT触发通知，状态UNKNOWN。'],
   ['evt_generate','无异常限制，constraint_ids空。'],
   ['cl_generate_result','health O REQUIRED。'],
   ['evt_discover cl_discover_object','CONDITION/MENTION_ONLY，发现者没绑定，未新增检查或发现事实。']
  ],
  inventory:{entities:'OPS/PM/health/服务异常身份有据，异常实体只参与条件。',events:{evt_discover:'发现异常CONDITION/MENTION_ONLY/UNSTATED/owner通知；无PERFORMER，不默认OPS为发现者。',evt_notify:'REQUIRED/OPS/PM RECIPIENT/充分发现异常。',evt_generate:'REQUIRED/OPS/health RESULT，无条件限制。'},claims:{cl_notify_condition:'SUFFICIENT只约束通知，未变必要。'},expressions:{expr_discovered:'已发现异常(服务异常)，未知值，未断言发生。'}},
  notes:'第三次实测仍保持条件通知与无条件产物、明确OPS/PM关系；发现者未单列issue但没有填造角色，开放细节保留。',findings:[]
 },
 'repeat-2/Q25':{
  facts:[
   ['evt_read cl_read_performer cl_read_input','PM必须读取feed。'],
   ['evt_generate cl_generate_performer cl_generate_result','PM沿用生成报告，义务明确。'],
   ['cl_read_input','feed I。'],
   ['cl_generate_result','feed-note O接受，内容数量正确挂载。'],
   ['cl_retry_limit','LTE4次重试，target/count_scope=读取，不包括首次。'],
   ['cl_output_count cl_report_content','EQ2条 OUTPUT_CONTENT，target/count_scope=报告，scope=生成；异常记录CONTENT有据，数量不进R。'],
   ['cl_output_count cl_retry_limit','不把2条当观测值或执行次数，重试无实际执行声明。']
  ],
  inventory:{entities:'PM/feed/报告/异常记录身份有据，报告同一实体。',events:{evt_read:'REQUIRED/PM/feedINPUT，读取重试独立。',evt_generate:'REQUIRED/PM/feed-note RESULT/异常记录CONTENT，内容数量绑定报告。'},claims:{cl_retry_limit:'EXECUTION_LIMIT/LTE4/仅读取重试。',cl_output_count:'OUTPUT_CONTENT/EQ2条/target报告/count_scope报告，scope生成；符合冻结合同。'},expressions:{}},
  notes:'第三次运行正确，不覆盖第二次失败：数量目标恢复报告，原技术检查接受，O/A/P完整；该组最终2/3，存在真实重复波动。',findings:[]
 },
 'repeat-2/Q29':{
  facts:[
   ['e1 c1 c2 c3','PM必须读取两个文件。'],
   ['e2 c4 c5 c9','PM读取后交给它，局部身份未决；ORDER/AFTER。'],
   ['e3 c7 c8','OPS独立必须生成port。'],
   ['c6','QA明确接收者，不增加复核。'],
   ['c2 c3','I两文件独立接受。'],
   ['c8','port O接受。'],
   ['n4 c5','east/west竞争保留，未选择west，交付对象及事件聚合未决。'],
   ['c1 c4 c6 c7','明确PM/QA/OPS关系接受，读取和生成无污染。']
  ],
  inventory:{entities:'PM/QA/OPS及命名文件明确，它有真实备选，局部未知。',events:{e1:'REQUIRED/PM/two INPUT。',e2:'REQUIRED/PM/它OBJECT/QA接收，AFTER读取，聚合未决正确。',e3:'REQUIRED/OPS/port RESULT。'},claims:{c9:'ORDER/AFTER引用原读取事件，不增加条件触发。'},expressions:{x1:'读取完成(PM,east,west)，参数增加明确执行者而未改变条件；未知运行值。'}},
  notes:'第三次再次准确保留它的局部竞争。相较前两次时序状态参数显式带PM，仍指同一读取事件；不造成额外动作或歧义。',findings:[]
 },
 'repeat-2/Q30':{
  facts:[
   ['evt_read cl_read_pm cl_read_east cl_read_west','PM读取east/west义务明确。'],
   ['evt_handover cl_handover_pm cl_handover_east cl_order','读取后PM交给east，明确顺序指代。'],
   ['evt_generate cl_generate_ops cl_generate_port','OPS独立生成port。'],
   ['cl_handover_qa','QA只接收east。'],
   ['cl_read_east cl_read_west','两个文件I保留。'],
   ['cl_generate_port','port O保留。'],
   ['cl_handover_east ent_east','前一个与east同一实体，交给用途完整接受。'],
   ['evt_handover cl_handover_east','没有west/两份交付或虚构歧义，没有新增复核。']
  ],
  inventory:{entities:'三个主体类别局部未明不影响身份；east/west/port实体明确，前一个同east。',events:{evt_read:'REQUIRED/PM/two INPUT。',evt_handover:'REQUIRED/PM/east OBJECT/QA接收，AFTER读取。',evt_generate:'REQUIRED/OPS/port RESULT。'},claims:{cl_order:'ORDER/AFTER读取两份文件，非触发/任务完成。'},expressions:{expr_read_done:'读取完成(east,west)未知参照，同原读取事件。'}},
  notes:'第三次明确指代正确，与前两次等价；角色类别疑点没有感染用途。最终Q30三次均完整正确。',findings:[]
 }
};
