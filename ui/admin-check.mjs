import {pointLength, pointSlice, pointIndex, pointMatches} from './codepoints.mjs';
import {adminRulePack} from './admin-rules.mjs';
import {glossaryEntries,explicitReferences,resolveGlossary} from './admin-glossary.mjs';
import {checkOperatorText} from './admin-operators.mjs';
import {checkTaskSlots} from './admin-slots.mjs';

const clauses=text=>[...pointMatches(text, /[^。！？；;\n.!?]+[。！？；;\n.!?]*/g)].map(m=>({text:m[0],start:m.index,end:m.index+pointLength(m[0])}));
const pending=/【[^】]*】|\[[^\]]*\]|待定|未定|待明确|\b(?:TBD|unknown)\b/i;
const negativePrefix=/(?:无需|不要求|不做|不进行|不是|并非|禁止|不得|不允许)\s*$|\b(?:no need (?:for|to)|do not|must not|not required to)\s*$/i;
const negativeSuffix=/^\s*(?:不是要求|不作要求|\bis not required\b)/i;

// An anchor must explicitly define a value. A mention alone is not a definition.
function definitionEvidence(rule,segments){
 return segments.filter(segment=>!pending.test(segment.text)&&rule.anchors.some(anchor=>{
  const match=new RegExp(`(?:${anchor})\\s*(?:定义为|为|是|指|[:：=]|means?\\b|is\\b|are\\b)\\s*(.+)`,'i').exec(segment.text);
  if(!match||!/[^\s。；;.!]/.test(match[1]))return false;
  if(/^(?:无|未|不明确|待|none\b|unknown\b)/i.test(match[1]))return false;
  return !rule.numeric||/\d/.test(match[1]);
 }));
}

export function checkAdminText(text,pack=adminRulePack){
 if(typeof text!=='string'||pointLength(text)>100000)throw Error('Expected task text of at most 100000 characters');
 const segments=clauses(text),findings=[],checks=[],glossary=glossaryEntries(text);
 for(const rule of pack.rules){
  const matches=[...pointMatches(text, new RegExp(rule.pattern,'giu'))].filter(m=>!glossary.some(e=>e.start<=m.index&&m.index<e.end));
  for(const [matchIndex,match] of matches.entries()){
   const start=match.index,end=start+pointLength(match[0]);
   const index=segments.findIndex(s=>s.start<=start&&s.end>=end),segment=segments[index];
   if(!segment)continue;
   const before=pointSlice(text, segment.start,start),after=pointSlice(text, end,segment.end);
   if(negativePrefix.test(before)||negativeSuffix.test(after)){
    checks.push({rule:rule.id,status:'not-required',start,end});continue;
   }
   const next=segments[index+1];
   const context=[segment];
   const nextHasOwnWork=next&&pack.rules.some(other=>new RegExp(other.pattern,'iu').test(next.text));
   if(next&&!nextHasOwnWork&&!/\n\s*\n/.test(pointSlice(text, segment.start,next.start)))context.push(next);
   const nextMatch=matches[matchIndex+1],previousMatch=matches[matchIndex-1];
   const windowEnd=Math.min(context.at(-1).end,nextMatch?.index??pointLength(text));
   const windowStart=previousMatch&&previousMatch.index>=segment.start?start:segment.start;
   const local=context.map(s=>({start:Math.max(s.start,windowStart),end:Math.min(s.end,windowEnd)})).filter(s=>s.end>s.start).map(s=>({...s,text:pointSlice(text, s.start,s.end)}));
   const refs=explicitReferences(pointSlice(text, windowStart,windowEnd));
   let definitions=[],binding='local';
   if(refs.length){
    const uniqueIds=[...new Set(refs.map(r=>r.id))];
    const resolved=uniqueIds.length===1?resolveGlossary(glossary,refs[0],start):{status:'contested',candidates:[]};
    binding='glossary-'+resolved.status;
    if(resolved.status==='unique'){
     definitions=definitionEvidence(rule,resolved.candidates);
     if(!definitions.length)binding='glossary-inapplicable';
    }
   }else definitions=definitionEvidence(rule,local);
   const supported=definitions.length===1;
   if(definitions.length>1)binding='local-contested';
   checks.push({rule:rule.id,status:supported?'definition-found':'clarify',binding,start,end,references:refs.map(r=>r.id),definitions:definitions.map(d=>({quote:d.text,start:d.start,end:d.end}))});
   if(supported)continue;
   findings.push({key:`context:${rule.id}:${start}`,rule:rule.id,fields:rule.fields,status:'possible-ambiguity',quote:match[0],source_quote:segment.text,start,end,
    title:rule.title[0],why:rule.why[0],suggestion:rule.suggestion[0],en:{title:rule.title[1],suggestion:rule.why[1]+' '+rule.suggestion[1]}});
  }
 }
 const structure=checkOperatorText(text);
 const slots=checkTaskSlots(text);
 return {ruleVersion:pack.version,languages:pack.languages,findings:[...findings,...structure.findings,...slots.findings],checks,glossary,structure,slots,
  limitation:'Rule-covered clarification candidates only; definitions are detected, not semantically certified. No authorization or compliance decision.'};
}
