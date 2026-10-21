// Registered after candidate freeze, before any model response. Evaluation only.
export const newTexts=[
 {id:'N01',text:'请OPS核查map.csv；还可以生成extra.md，但不要求交付extra.md。',facts:['OPS必须核查map.csv，I为map.csv','追加生成承接OPS且PERMITTED，O为可选extra.md','extra.md交付NOT_REQUIRED，不新增交付许可、禁止或必交']},
 {id:'N02',text:'请DEV检查settings.yaml。随后由QA生成review.md，并交给ADMIN；DEV不得修改settings.yaml。',facts:['DEV检查settings.yaml，I为该文件','QA生成review.md且承接交付，ADMIN接收，RESULT/DELIVERABLE同实体O','禁止DEV修改settings.yaml，不把QA生成默认给DEV']},
 {id:'N03',text:'PM只组织核验cfg.json，具体核验执行者另定。由QA生成audit.md并提交给ADMIN。',facts:['PM只有组织职责，不默认核验执行者；核验cfg.json的受检范围保留','核验执行者UNSPECIFIED开放细节，不是真指代歧义','QA生成并提交audit.md给ADMIN，生成与交付用途同一实体']},
 {id:'N04',text:'仅在这份报告经QA复核通过后，允许DEV向ADMIN交付checklist.md。',facts:['DEV获准交付checklist.md，ADMIN接收，O是PERMITTED交付而非生成义务','这份报告与checklist.md是同一实体，QA复核通过是NECESSARY前提并AFTER','QA为条件复核者，不新增复核义务；不新增I；状态UNKNOWN']},
 {id:'N05',text:'在QA复核alpha.md完成后，PM必须提交beta.md给ADMIN。不得修改alpha.md。',facts:['QA复核alpha.md是时间参照，不额外创造独立当前复核义务','PM必须向ADMIN提交beta.md，O交付beta.md，不生成/不自动外部I','alpha.md与beta.md不同，提交AFTER复核完成纯时序','明确禁止修改alpha.md']},
 {id:'N06',text:'请DEV在6分钟内交付bundle.md；该文件必须列出3项变更。不得修改cfg.json。',facts:['DEV必须交付bundle.md，O为交付结果，不新增生成义务或外部I','执行期限<=6分钟绑定交付EXECUTION_LIMIT进入R','输出内容恰好3项变更绑定bundle.md，OUTPUT_CONTENT挂O不进R','禁止修改cfg.json，不由禁止对象增加I']},
 {id:'N07',text:'请QA读取one.csv和two.csv，然后把它交给PM。另由OPS生成independent.md。',facts:['QA读取两文件，I明确','它的交付目标有两文件竞争，应局部UNRESOLVED且保留PM接收关系','OPS独立生成independent.md应保持明确O/A/P，不被歧义污染','不选择最近two.csv，不新增PM复核义务']},
 {id:'N08',text:'QA必须生成guide.md，正文引用“可以删除store.db”；本任务禁止删除store.db，无需交付guide.md。',facts:['QA必须生成guide.md，O为生成结果，引用在正文内容层','引文中的删除许可不是当前许可，当前删除store.db FORBIDDEN进入B','guide.md交付NOT_REQUIRED保留完整文件目标，不自动禁止/许可交付','不新增读取store.db的输入或实际删除授权']}
];
