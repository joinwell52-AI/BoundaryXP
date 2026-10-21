import {sha256} from './source.mjs';
const refs=x=>!x||typeof x!=='object'?[]:x.kind&&x.id&&Object.keys(x).length===2?[x.id]:Object.values(x).flatMap(refs);
export function affectedAuditTargets(ir,changed,previous){const set=new Set(changed.map(x=>x.id));let again=true;while(again){again=false;for(const k of ['entities','variables','events','states','expressions','requirements'])for(const n of ir[k])if(!set.has(n.id)&&refs(n).some(id=>set.has(id))){set.add(n.id);again=true;}for(const r of previous.reviews)if(!set.has(r.target.id)&&(r.context_refs??[]).some(x=>set.has(x.id))){set.add(r.target.id);again=true;}}return [...set];}
export function targetedAuditBundle(bundle,targets){const text=bundle.text+'\n本次是局部修订后的独立审阅。只对以下节点及其依赖检查给reviews，使用完整原文和完整候选作为上下文，不重审无变化节点。每个目标须整节点裁定field_path=""；字段裁定只作补充。仍需如实记录此次发现的遗漏/疑点，不因目标限定而隐藏全局问题。AUDIT_TARGETS='+JSON.stringify(targets);return {...bundle,text,sha256:sha256(text)};}
export function mergeIndependentAudit(previous,next,targets){
 const ids=new Set(targets),sources=structuredClone(previous.source_table),mapping=new Map();
 for(const s of next.source_table){let match=sources.find(x=>x.quote===s.quote&&x.occurrence===s.occurrence);if(!match){match={...s,id:'reaudit_'+s.id};if(sources.some(x=>x.id===match.id))throw Error('REAUDIT_SOURCE_COLLISION');sources.push(match);}mapping.set(s.id,match.id);}
 const translate=row=>{const out=structuredClone(row);out.source_refs=row.source_refs.map(id=>{if(!mapping.has(id))throw Error('REAUDIT_SOURCE_REFERENCE');return mapping.get(id);});return out;};
 if(next.reviews.some(r=>!ids.has(r.target.id)))throw Error('REAUDIT_UNEXPECTED_TARGET');
 const combined={...previous,source_table:sources,reviews:[...previous.reviews.filter(r=>!ids.has(r.target.id)),...next.reviews.map(translate)],issues:[...previous.issues.filter(x=>!x.targets.some(t=>ids.has(t.id))),...next.issues.map(translate)],omissions:[...previous.omissions,...next.omissions.map(translate)]};
 return combined;
}
