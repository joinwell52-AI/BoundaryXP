import {pointLength, pointSlice, pointIndex, pointMatches} from './codepoints.mjs';
// Versioned, inspectable slot schemas. Explicit anchors supply candidate
// evidence; absence of a match means unconfirmed, never proven absence.
export const taskSlotSchemas=[
 {id:'report',trigger:/(?:汇总[^。；;\n]{0,30}报表|报表[^。；;\n]{0,12}汇总|\bsummarize\b[^.;\n]{0,60}\breports?\b)/iu,
  slots:[
   ['output','O',/交付物\s*(?:为|是)\s*[^，,]+|\boutput is\s+[^,]+/iu,'汇总产物形式','output format','交付物为【明细表／分类汇总表／文字摘要，由 ADMIN 选择】','Output is [details / grouped table / text summary, selected by ADMIN]'],
   ['period','I',/时间范围\s*(?:为|是)\s*[^，,]*\d[^，,]*|\bdate range is\s+[^,]*\d[^,]*/iu,'报表时间范围','report date range','时间范围为【起始日期】至【结束日期】','Date range is [start date] to [end date]'],
   ['stop','C',/提交后结束|完成汇总并提交后停止|\bstop after submission\b/iu,'完成与停止依据','completion and stopping evidence','完成约定汇总并提交【产物及位置】后结束；未能汇总的资料列明原因','Stop after completing and submitting [deliverable and location]; list records that could not be summarized and why']
  ]},
 {id:'accounts',trigger:/(?:清理[^。；;\n]{0,30}账号|\bclean up\b[^.;\n]{0,60}\baccounts?\b)/iu,
  slots:[
   ['operation','A',/操作\s*(?:为|是)\s*(?:停用|删除|归档|列出候选)|\boperation is\s+(?:disable|delete|archive|list candidates)\b/iu,'清理的具体动作','specific cleanup action','清理操作为【仅列出候选／停用／删除／归档，由 ADMIN 选择】；“清理”本身不确定为删除','Cleanup operation is [list candidates / disable / delete / archive, selected by ADMIN]; cleanup alone does not specify deletion'],
   ['scope','I',/租户\s*(?:为|是)\s*[\w-]+|\btenant is\s+[\w-]+/iu,'账号适用范围','account scope','限定租户或环境为【明确标识】','Limit the tenant or environment to [explicit identifier]'],
   ['filter','I',/筛选条件\s*(?:为|是)\s*[^，,]*(?:等于|超过|早于|晚于)[^，,]+|\bfilter is\s+[^,]*\b(?:equals|exceeds|before|after)\b[^,]+/iu,'“无用”的可核对筛选条件','checkable account filter','筛选条件为【字段、比较关系和值】；例如状态或最后登录时间，取值由 ADMIN 明确','Filter is [field, comparison and value]; consider status or last-login time, with values specified by ADMIN']
  ]},
 {id:'purchase',trigger:/(?:自动下单|自动采购|\bautomatically (?:buy|purchase)\b)/iu,
  slots:[
   ['quantity','R',/数量上限\s*(?:为|是)\s*\d+|\bquantity limit is\s+\d+/iu,'采购数量上限','purchase quantity limit','数量上限为【数量及单位】','Quantity limit is [number and unit]'],
   ['budget','R',/总金额上限\s*(?:为|是)\s*\d+|\btotal budget is\s+\d+/iu,'累计采购金额上限','total purchase budget','总金额上限为【金额及币种】；价格触发阈值不替代总预算','Total budget is [amount and currency]; a price trigger does not define the total budget'],
   ['timeout','R',/超时\s*(?:为|是)\s*\d+\s*(?:秒|分钟)|\btimeout is\s+\d+\s*(?:seconds?|minutes?)\b/iu,'等待或超时上限','waiting or timeout limit','超时为【时长】，最多重试【次数】，重复下单的处理为【由 ADMIN 明确】','Timeout is [duration], with at most [count] retries; specify how duplicate orders are handled'],
   ['failure','C',/失败时\s*[^，,]+|\bon failure\s+[^,]+/iu,'失败处理','failure handling','失败时【停止并报告／其他明确处理，由 ADMIN 选择】','On failure [stop and report / another explicit action selected by ADMIN]'],
   ['otherwise','C',/否则\s*[^，,]+|\botherwise\s+[^,]+/iu,'价格条件不满足时的行为（可选澄清）','behavior when the price condition is false (optional clarification)','条件不满足时【结束本次检查／按限定周期继续／通知，由 ADMIN 选择】；不指定并不必然是错误','When the condition is false [end this check / continue on a bounded schedule / notify, selected by ADMIN]; omission is not inherently an error']
  ]}
];

export function checkTaskSlots(text){
 if(typeof text!=='string'||pointLength(text)>100000)throw Error('Expected task text of at most 100000 characters');
 const checks=[],findings=[];
 for(const m of pointMatches(text, /[^。！？；;\n.!?]+/gu)){
  const quote=m[0].trim();if(!quote)continue;
  const start=m.index+m[0].indexOf(quote);
  if(/不要|不得|禁止|无需|不必|“|”|「|」|"|\b(?:do not|must not|need not|example|says)\b/iu.test(quote))continue;
  for(const schema of taskSlotSchemas){
   if(!schema.trigger.test(quote))continue;
   const slots=schema.slots.map(([id,field,pattern,label,enLabel,suggestion,enSuggestion])=>{
    const match=pattern.exec(quote);
    const supported=match&&!/【|\[|待定|\bTBD\b/iu.test(match[0]);
    return {id,field,label,enLabel,suggestion,enSuggestion,status:supported?'candidate-evidence':'unconfirmed',
     evidence:supported?{quote:match[0],start:start+pointIndex(quote,match.index),end:start+pointIndex(quote,match.index)+pointLength(match[0])}:null};
   });
   checks.push({profile:schema.id,quote,start,end:start+pointLength(quote),slots});
   for(const slot of slots.filter(s=>s.status==='unconfirmed'))findings.push({
    key:`slot:${schema.id}:${slot.id}:${start}`,rule:`slot-${schema.id}-${slot.id}`,fields:[slot.field],status:'unconfirmed-slot',
    quote,source_quote:quote,start,end:start+pointLength(quote),title:`请补充或核对：${slot.label}`,
    why:'本句未匹配到这一项的明确说明；若已在其他段落或附件定义，请给出对应引用。',suggestion:slot.suggestion,
    en:{title:`Specify or confirm: ${slot.enLabel}`,suggestion:`No explicit value matched in this sentence. If defined elsewhere, supply its reference. ${slot.enSuggestion}`},
    draft:{'zh-CN':slot.suggestion,en:slot.enSuggestion}
   });
  }
 }
 return {version:'1.0.0',checks,findings,limitation:'Local sentence slot evidence only; no certified completeness, invented defaults, deletion inference, blocking or authorization.'};
}
