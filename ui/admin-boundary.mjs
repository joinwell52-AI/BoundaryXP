import {localTaskProjection,prohibitedActions} from './local-task.mjs';
import {checkAdminText} from './admin-check.mjs';
export const boundaryFields={
 I:['输入与范围','Input and scope'],O:['交付结果','Output'],A:['允许动作','Actions'],P:['责任分工','Responsibility'],
 R:['资源约束','Resources'],V:['版本与依据','Version and evidence'],C:['完成与停止','Completion and stop'],B:['已知禁止边界','Known prohibitions']
};
const labels={I:'输入|对象|对象范围|范围|input|scope|target set',O:'交付|产物|输出|output|deliverable',A:'允许动作|允许|actions|allowed actions',P:'负责人|责任|owner|responsibility',R:'资源|资源上限|resources|resource limits',V:'依据|基线|来源|baseline|evidence',C:'完成条件|停止条件|completion|stop condition',B:'禁止|禁止事项|禁止对象|prohibitions|forbidden actions|forbidden targets'};
export function originalBoundary(text){
 const projection=localTaskProjection(text),checks=checkAdminText(text),bans=prohibitedActions(text);
 const sections=[...text.matchAll(/[^。；;\n]+/gu)];
 const fields=Object.entries(boundaryFields).map(([id,[label,en]])=>{
  const quotes=[];let labelled=false;
  for(const s of sections){const pattern=new RegExp(`^\\s*(?:${id}|${labels[id]})\\s*[:：]\\s*(.+)$`,'iu'),match=pattern.exec(s[0]);
   if(match&&!/【|\[|待定|未定|\bTBD\b|\bunknown\b/iu.test(match[1])){quotes.push(s[0]);labelled=true;}}
  if(!quotes.length){if(id==='B')quotes.push(...bans.quotes);else if(projection.parameters[id])quotes.push(projection.parameters[id]);}
  const evidence=[...new Set(quotes)].map(quote=>({quote,start:text.indexOf(quote),end:text.indexOf(quote)+quote.length,method:labelled?'explicit_label':'local_candidate'}));
  const related=checks.findings.filter(f=>f.fields.includes(id));
  return {id,label,en,evidence,status:!evidence.length?'unmapped':related.length?'review':'candidate',related:related.map(f=>f.key),confirmed:false};
 });
 return {schema:'boundx-admin-original/v1',text,fields,summary:{mapped:fields.filter(f=>f.evidence.length).map(f=>f.id),unmapped:fields.filter(f=>!f.evidence.length).map(f=>f.id)},confirmation:null,businessDecision:null,
  limitation:'Eight source-mapping dimensions, not a completeness score. Explicit labels and rule matches still require confirmation.'};
}
export function withEngineAdvice(draft,engines,sourceText,language='zh-CN'){
 if(!engines||engines.text!==sourceText)return draft;
 const suggestions=engines.engines.flatMap(e=>e.findings.map(f=>f.suggestion[language]));
 if(!suggestions.length)return draft;
 return draft+'\n\n'+(language==='en'?'Additional library-check suggestions (ADMIN to confirm):':'三类计算补充建议（请由 ADMIN 核对后修改要求）：')+'\n'+suggestions.map((s,i)=>`${i+1}. ${s}`).join('\n');
}
