// Deterministic source checks. A rule match is not semantic understanding or authorization.
const rules={
 I:/检查|核查|核验|巡检|审查|\binspect\b|\baudit\b|\breview\b/i,
 O:/报告|汇报|交付|产出|提交|\breport\b|\bdeliver(?:able)?\b|\bsubmit\b/i,
 A:/允许|只读|仅限|检查|核查|\binspect\b|\baudit\b|\bpermitted\b|\bread.only\b|\bonly\b/i,
 P:/负责人|负责|分工|分配任务|组织团队|团队协作|\bPM\b|\bowner\b|\bresponsib|\bassign/i,
 R:/(?:预算|时间上限|费用上限|调用上限|限额|截止|\bbudget\b|\bdeadline\b|\b(?:time|cost|call|token) limit\b)|(?:耗时|用时|限时|最多投入|不超过)\s*\d+\s*(?:小时|分钟|天)|\b(?:spend|within|at most)\s+\d+\s*(?:hours?|minutes?|days?)\b/i,
 V:/版本|提交号|基线|实例|证据来源|时间范围|\bversion\b|\bcommit\b|\bbaseline\b|\binstance\b|\bevidence source\b/i,
 C:/即.*完成|即可交付|算完成|完成条件|停止条件|停止|无需.*修复|最后.*汇报|最终.*提交|\bfinally.*report\b|\bcomplete when\b|\bdone when\b|\bstop\b/i,
};
export function localTaskProjection(text){
 if(typeof text!=='string'||!text.trim()||text.length>100000)throw Error('请提供 1 至 100000 字符的文本。');
 const clauses=text.match(/[^。！？；;\n.!?]+[。！？；;\n.!?]*/g)??[text];
 const parameters={};for(const [key,rule] of Object.entries(rules)){const quote=clauses.find(s=>rule.test(s)&&!/未定|待定|待明确|尚未明确|未指定|\bunknown\b|\btbd\b|to be decided/i.test(s)&&(key!=='A'||prohibitedActions(s).status!=='stated'||/^\s*(?:本次|本任务)?\s*(?:允许|只读|仅限)|^\s*(?:permitted|read.only|only)\b/i.test(s)));if(quote)parameters[key]=quote;}
 return {text,parameters,actions:[],completion:[]};
}
export function prohibitedActions(text=''){
 const clauses=text.match(/[^。！？；;\n.!?]+[。！？；;\n.!?]*/g)??[];
 const marker=/严禁|禁止|不得|不允许|不能|只读|\bdo not\b|\bmust not\b|\bnever\b|\bnot permitted\b|\bprohibited\b|\bforbidden\b|\bread.only\b/i;
 const negated=/不禁止|并非禁止|没有禁止|并未禁止|未禁止|\bnot (?:prohibited|forbidden)\b|\bno prohibition\b/i;
 const vague=/待定|未定|待明确|不能(?:确定|确认|判断|保证|理解|做什么)|禁止(?:什么|哪些)|【|\[(?:specific|ADMIN)|\btbd\b|\bunknown\b/i;
 const none=/无额外禁止事项|\bno additional prohibited actions\b/i;
 const noneQuotes=clauses.filter(s=>none.test(s));
 const candidates=clauses.filter(s=>marker.test(s)&&!negated.test(s)&&!none.test(s));
 const quotes=candidates.filter(s=>!vague.test(s));
 return {status:quotes.length?'stated':candidates.length?'unclear':noneQuotes.length?'none_declared':'unmapped',quotes:quotes.length?quotes:noneQuotes};
}
