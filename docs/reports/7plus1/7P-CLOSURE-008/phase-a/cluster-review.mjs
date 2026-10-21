// Diagnostic hypotheses, not runtime switches or automatic semantic acceptance.
export const clusters={
 C01:{name:'DECLARED_BEHAVIOR_SEMANTICS',stage:'FRAME_CERTIFICATION',buckets:['DECLARED_BEHAVIOR_SEMANTICS','FORMAL_ACTUAL_ARGUMENT_BINDING','ACTION_COMPOSITION'],basis:['14.1','16','17','18.1'],reason:'已认证身份与调用不能证明声明行为；需在 owned CODE 内提取有限语法证据，再把形参与实参唯一绑定。不得从函数名猜测。'},
 C02:{name:'OWNED_TEST_CONTRACT',stage:'FRAME_CERTIFICATION',buckets:['FRAME_CERTIFICATION','ACTION_COMPOSITION','OUTPUT_CONTENT_OWNERSHIP'],basis:['14.1','16.2','17','18.1'],reason:'测试文件分配与 code ownership 已有证据，但断言内容、命名义务及每个成员测试的行为语义未组合。'},
 C03:{name:'PROTECTED_TECHNICAL_SPAN',stage:'NLP_SIGNALS_SPAN_LATTICE',buckets:['SPAN_OR_TYPED_LITERAL','QUANTITY_OR_SCOPE_EXPRESSION'],basis:['14','15','16'],reason:'完整路径、命令、通配符/占位符或引用定位必须保留为可竞争 protected span；片段路径不等于完整源对象。'},
 C04:{name:'DECLARATIVE_INSTRUCTION_FRAME',stage:'CANDIDATE_RECALL',buckets:['CANDIDATE_RECALL','FRAME_CERTIFICATION','ARTIFACT_ROLE','INPUT_OUTPUT_BINDING','ACTION_COMPOSITION'],basis:['13','16.1','17','18.1'],reason:'任务书通过当前决议、交付、实现策略表达的义务未产生完整 governing event/object/result 结构；不能用名词出现替代动作。'},
 C05:{name:'STRUCTURALLY_OWNED_CONTEXT',stage:'DISCOURSE',buckets:['STRUCTURE_OR_DISCOURSE','CROSS_INSTRUCTION_IDENTITY','RELATION_OR_EDGE_CLOSURE','INPUT_OUTPUT_BINDING'],basis:['14.1','14.2','16.2','18.1'],reason:'层级标题、嵌套列表、表格、调查问句与文档正文需局部拥有者限定；域错会使后续正确候选被排除或错误升格。'},
 C06:{name:'QUALIFIED_MEMBER_SCOPE',stage:'GRAPH_CLOSURE',buckets:['RELATION_OR_EDGE_CLOSURE','ARTIFACT_ROLE','INPUT_OUTPUT_BINDING','QUANTITY_OR_SCOPE_EXPRESSION'],basis:['10','16.1','17','18.1'],reason:'复合对象/文件—章节/成员集合的限定关系不完整；裸父对象、局部成员或目录参数不能等同于完整集合。'},
 C07:{name:'GOVERNED_CONDITION_AND_RESTRICTION',stage:'EDGE_CLOSURE',buckets:['CONDITION_OR_MODALITY','RELATION_OR_EDGE_CLOSURE','QUANTITY_OR_SCOPE_EXPRESSION'],basis:['8','10','11','14.1','18.1'],reason:'局部禁止、条件后件、限制范围或方案分支必须保留唯一治理对象；无条件的短片段不是原边界。'},
 C08:{name:'OUTPUT_CONTENT_GRAPH',stage:'GRAPH_CLOSURE',buckets:['OUTPUT_CONTENT_OWNERSHIP','ACTION_COMPOSITION','INPUT_OUTPUT_BINDING'],basis:['14.1','16.2','17','18.1'],reason:'章节存在及双语 owner 不证明章节内所有动作/条件/禁止/参与关系均已形成 typed content graph。'},
 C09:{name:'QUALIFIED_BASIS_AND_TEMPORAL_REFERENCE',stage:'STRUCTURED_RECOVERY',buckets:['REFERENCE_OR_BASIS','RELATION_OR_EDGE_CLOSURE','PROJECTION_OR_NORMALIZATION'],basis:['1','14.1','16.1','17','18.1'],reason:'依据的引用对象、源码位置、规范版本与 supersedes 区别必须结构化；identifier 或单一文件名不足以代替。'},
 C10:{name:'RECIPIENT_IDENTITY',stage:'EDGE_CLOSURE',buckets:['PARTICIPANT','RELATION_OR_EDGE_CLOSURE'],basis:['9','14.1','18.1'],reason:'存在报告接收者或明确给 ADMIN 的内容，但尚未形成唯一接收关系；不能把任务 sender 自动当 recipient。'},
 C11:{name:'COMPLETION_AND_WORKFLOW_COMPOSITION',stage:'STRUCTURED_RECOVERY',buckets:['CONDITION_OR_MODALITY','ACTION_COMPOSITION','QUANTITY_OR_SCOPE_EXPRESSION'],basis:['11','12','14.1','17','18.1'],reason:'完成项、工作轮次与测试通过才 commit 的条件需要组合；验收标题的 AND 不代表所有额外条件都已解释。'},
 C12:{name:'SLOT_LOCAL_ACCOUNTABILITY',stage:'COVERAGE',buckets:['ELIGIBILITY','PROJECTION_OR_NORMALIZATION'],basis:['4.3','4.4','7','13','14.1'],reason:'未解释源区域的槽位影响要有证据；消除未知标记不构成覆盖。当前所有槽的状态不闭合，需要先解决真实上游缺口。'},
 C13:{name:'STANDARD_METHOD_COMPATIBILITY',stage:'METHOD_REVIEW',buckets:['METHOD_LIMITATION_CANDIDATE','EXPECTED_TYPED_UNRESOLVED'],basis:['1','4.2','14.1','16.1','16.2'],reason:'人工标准的对象角色/内容域必须与当前规范分别核查。仅引用或仅禁止的对象不能自动产生 I，输出内容不得自动成为当前 A/P/B。此簇不是自动修改 Gold 或方法的授权。'}
};
export const assignments={
 'SWAI-001':{I1:'C01',O1:'C01',O2:'C02',A1:'C01',A2:'C01',A3:'C01',A4:'C02',V2:'C09',B0:'C03'},
 'SWAI-002':{I0:'C03',I1:'C06',I2:'C05',I3:'C06',O0:'C04',O1:'C04',O2:'C04',O3:'C06',O4:'C06',O5:'C04',O6:'C04',O7:'C04',O8:'C05',A0:'C04',A1:'C04',A2:'C04',A3:'C04',A4:'C04',A5:'C11',V1:'C09',C1:'C11',B0:'C07',B1:'C05',B2:'C07',B3:'C07',B4:'C07'},
 'SWAI-003':{I0:'C06',I1:'C06',I2:'C06',I3:'C06',I4:'C06',I5:'C06',O0:'C04',O1:'C06',O2:'C05',O3:'C04',O4:'C04',O5:'C04',O6:'C04',O7:'C05',A0:'C04',A1:'C05',A2:'C04',A3:'C04',A4:'C09',A5:'C05',C1:'C11',B0:'C07',B1:'C07',B2:'C05',B3:'C07',B4:'C05',B5:'C05',B6:'C05'},
 'SWAI-004':{I0:'C06',I1:'C06',I2:'C04',I3:'C07',I4:'C06',O0:'C04',O1:'C07',O2:'C04',O3:'C04',O4:'C05',A0:'C04',A1:'C07',A2:'C07',A3:'C07',A4:'C07',A5:'C04',A6:'C07',B0:'C07',B1:'C07',B2:'C07',B3:'C07',B4:'C07'},
 'SWAI-006':{I0:'C06',I1:'C06',O0:'C06',O1:'C06',O2:'C05',O3:'C11',A0:'C08',A1:'C08',A2:'C08',A3:'C09',A4:'C07',A5:'C05',P1:'C10',V0:'C09',V1:'C09',V2:'C09',V3:'C09',B0:'C07',B1:'C07',B2:'C07'},
 'SWAI-007':{I0:'C06',I1:'C05',I2:'C05',I3:'C05',I4:'C06',I5:'C05',I6:'C09',O0:'C04',A0:'C05',A1:'C07',A2:'C08',A4:'C07',P1:'C10',V0:'C09',V1:'C09',V2:'C09',V3:'C09',C0:'C11',B0:'C07',B1:'C07',B2:'C07',B3:'C07'},
 'SWAI-008':{I5:'C05',I6:'C05',I7:'C03',I9:'C05',O1:'C08',O2:'C08',O3:'C08',O4:'C08',A0:'C05',A1:'C05',A3:'C05',A4:'C08',P1:'C10',V0:'C09',V1:'C09',V2:'C09',C2:'C11',B1:'C07',B2:'C07'},
 'SWAI-009':{I0:'C06',I1:'C13',I2:'C05',I3:'C06',I4:'C05',I5:'C05',O2:'C05',O3:'C07',O4:'C05',O5:'C05',A2:'C05',A3:'C05',A4:'C05',A5:'C05',A6:'C05',A7:'C07',V0:'C08',V1:'C08',V2:'C09'},
 'SWAI-010':{I0:'C13',I1:'C06',I2:'C05',I3:'C06',I4:'C05',I5:'C05',O2:'C08',O3:'C08',O4:'C05',O5:'C07',O6:'C05',O7:'C05',A2:'C05',A3:'C05',A4:'C05',A5:'C05',A6:'C05',A7:'C07',V0:'C09',V1:'C08',V2:'C08',B0:'C13'}
};
