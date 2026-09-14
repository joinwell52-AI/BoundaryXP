import {pointLength, pointSlice, pointIndex, pointMatches} from './codepoints.mjs';
// Explicit syntax only: a glossary heading followed by G1: definition lines.
// References opt in to binding. Proximity alone never grants glossary ownership.
export function glossaryEntries(text){
 const entries=[];let active=false;
 for(const line of pointMatches(text, /[^\n]*(?:\n|$)/g)){
  const raw=line[0],value=raw.trim();
  if(/^(?:#{1,6}\s*)?(?:术语定义|术语表|Glossary|Definitions)\s*[:：]?$/i.test(value)){active=true;continue;}
  if(!active)continue;
  if(!value)continue;
  if(/^(?:#{1,6}\s*)?(?:Task|Tasks|Assignment|Assignments|Requirement|Requirements|任务|执行任务|执行要求)\s*[:：]?/i.test(value)){active=false;continue;}
  const m=/^\s*(?:[-*]\s*)?\[?([A-Za-z][A-Za-z0-9_-]{0,31})\]?\s*[:：]\s*(.+?)\s*$/.exec(raw);
  if(!m){active=false;continue;}
  entries.push({id:m[1],text:raw.trimEnd(),start:line.index,end:line.index+pointLength(raw.trimEnd())});
 }
 return entries;
}

export function explicitReferences(text){
 return [...pointMatches(text, /(?:按定义|依据定义|参照定义|using definition|per definition|as defined in)\s*\[?([A-Za-z][A-Za-z0-9_-]{0,31})\]?/gi)]
 .filter(m=>!/(?:不要|不得|禁止|不|无需)\s*$|\b(?:not|without|never)\s*$/i.test(pointSlice(text, 0,m.index)))
 .map(m=>({id:m[1],offset:m.index}));
}

export function resolveGlossary(entries,reference,position){
 const candidates=entries.filter(e=>e.id===reference.id&&e.end<=position);
 return {status:candidates.length===1?'unique':candidates.length===0?'missing':'contested',candidates};
}
