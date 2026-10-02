import {MODALS} from './grammar.mjs';
export const COARSE_SLOTS=Object.freeze({TASK_ASSIGNMENT_CANDIDATE:['I','A','P'],SCOPE_DECLARATION_CANDIDATE:['I'],DELIVERABLE_CANDIDATE:['O','A'],RESOURCE_LIMIT_CANDIDATE:['R'],BASELINE_CANDIDATE:['V'],COMPLETION_CANDIDATE:['C'],RESTRICTION_CANDIDATE:['B'],PARTICIPANT_CANDIDATE:['P'],UNKNOWN_BOUNDARY_BEARING:['I','O','A','P','R','V','C','B'],NON_BOUNDARY:[]});
// Coarse recognition determines coverage impact only; no semantic node, relation,
// fact or canonical entry can be created by this module.
export function coarseImpact(cl){
 const q=cl?.span?.quote??'',classes=[];
 if(!q.trim()||/^[\s#*|:\-]+$/u.test(q))classes.push('NON_BOUNDARY');
 else {
  if(/(范围|对象|输入|scope|inputs?)\s*(包括|包含|为|:|：|include|is)/iu.test(q))classes.push('SCOPE_DECLARATION_CANDIDATE');
  if(/^(由|by\b)/iu.test(q)||/负责(?:对|检查|开展|进行|实施)/u.test(q))classes.push('TASK_ASSIGNMENT_CANDIDATE');
  if(/^(依据|按照|根据|以|based on|according to)/iu.test(q)&&/(基线|规程|规范|依据|baseline|rule|according)/iu.test(q))classes.push('BASELINE_CANDIDATE');
  if(/完成|only when|completed/iu.test(q))classes.push('COMPLETION_CANDIDATE');
  if(/(最多|至多|至少|不得超过|不得少于|不超过|不少于)/u.test(q)&&/(次|轮|分钟|小时|秒)/u.test(q))classes.push('RESOURCE_LIMIT_CANDIDATE');
  if(MODALS.some(([m,v])=>v==='FORBIDDEN'&&q.includes(m)))classes.push('RESTRICTION_CANDIDATE');
  else if(/生成|输出|交付|产出|generate|deliver/iu.test(q))classes.push('DELIVERABLE_CANDIDATE');
  if(/^(执行者|参与者|责任主体|participant)\s*(为|是|:|：)/iu.test(q))classes.push('PARTICIPANT_CANDIDATE');
 }
 if(!classes.length)classes.push('UNKNOWN_BOUNDARY_BEARING');
 return {classes,slots:[...new Set(classes.flatMap(k=>COARSE_SLOTS[k]))],source_span:cl?.span??null,rule:'SOURCE_GRAMMAR_COARSE_IMPACT_ONLY'};
}
