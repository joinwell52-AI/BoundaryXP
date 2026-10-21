// Offline reviewer corrections. No runtime import, no Gold mutation.
import {obligations as original} from './natural-source-obligations.mjs';
export const corrections=[
 {case:58,removeA:['读取'],remove:['guard:读取'],add:['guardForbid:读取'],reason:'未经负责人批准不得读取 is a conditional prohibition, not a positive requirement to read. The positive read-only check remains independently required.'},
 {case:3,removeA:['记录'],add:['content:缺项'],reason:'缺项应记录 is an output completeness obligation.'},
 {case:7,removeA:['记录'],add:['content:失败'],reason:'Failure reasons are report contents, not a separate root business event.'},
 {case:13,removeA:['列出'],reason:'Separate listing is an output content constraint.'},
 {case:20,removeA:['标记'],add:['content:证书'],reason:'Certificate marking is the classified report content.'},
 {case:36,removeB:['列出'],add:['contentRestriction:20'],reason:'Only list twenty issues scopes report content, not current task prohibition.'},
 {case:63,removeA:['确保'],add:['requiredState:每项主机记录都有检查结果'],reason:'Ensure governs a quantified state obligation, not a business predicate named ensure.'},
 {case:70,removeA:['标记'],remove:['guard:标记'],add:['content:待确认','contentCondition:范围不清楚'],reason:'Pending marking is a conditional output classification.'},
 {case:72,removeA:['交付'],add:['deliveryOnly:文档'],reason:'Only deliver documents constrains the already declared deliverable envelope.'},
 {case:73,removeB:['列出'],add:['contentRestriction:10'],reason:'Only list ten is content-local cardinality.'},
 {case:81,removeA:['verify'],add:['requiredState:every active user has an owner'],reason:'Verify that introduces a proposition complement; retaining that verification state is mandatory.'},
 {case:83,removeB:['treated'],reason:'Must not be treated as approver is a negative participant role declaration, already separately asserted.'},
 {case:94,removeA:['编写'],add:['deliveryOnly:文档'],reason:'Only write documents constrains the existing generated document rather than adding a second guessed execution.'}
];
export const obligations=original.map(x=>{const c=corrections.find(c=>c.case===Number(x.case_id.slice(-3)));if(!c)return structuredClone(x);return {...structuredClone(x),A:x.A.filter(t=>!c.removeA?.includes(t)),B:x.B.filter(t=>!c.removeB?.includes(t)),distinctions:[...x.distinctions.filter(t=>!c.remove?.includes(t)),...c.add??[]],review_correction:c};});
