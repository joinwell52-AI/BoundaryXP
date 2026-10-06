import {SUPPORT_VERBS,explicitModal} from './grammar.mjs';
export const isNominal=t=>/^(NN|NR|NT|PN|NOUN|PROPN|PRON)/u.test(t.pos??'');
export function modifierPhrase(cl,t){
 const i=cl.tokens.indexOf(t);let a=t.start;
 const reaches=(q)=>{let at=cl.tokens.indexOf(q),seen=new Set();while(at!==i&&!seen.has(at)){seen.add(at);const n=cl.tokens[at];if(!n||!/compound|amod|nmod|det|appos|nummod|mark:clf/u.test(n.dep??''))return false;at=n.head;}return at===i;};
 for(let j=i-1;j>=0;j--){const q=cl.tokens[j];if(reaches(q)&&/^(NN|NR|NT|JJ|DT|CD|M|NOUN|PROPN|ADJ|DET|NUM)/u.test(q.pos??''))a=q.start;else break;}
 const barrier=cl.tokens.filter(q=>q.end<=t.start&&(/^(VV|VERB|PU|CC|CCONJ)/u.test(q.pos??'')||q.dep==='case')).at(-1)?.end??cl.span.start;
 const determiner=cl.tokens.find(q=>q.start>=barrier&&q.start<t.start&&/^(上述|前述|前|这|both|these|those)$/iu.test(q.text));if(determiner)a=Math.min(a,determiner.start);
 return [a,t.end];
}
export function compoundFor(cl){
 const supports=cl.tokens.filter(t=>SUPPORT_VERBS.includes(t.text));
 for(const outer of supports){
  if(isNominal(outer)&&/^compound/u.test(outer.dep??'')){
   let i=cl.tokens.indexOf(outer),seen=new Set();
   while(!seen.has(i)){seen.add(i);const q=cl.tokens[i];if(q.head===i){if(q!==outer&&isNominal(q)&&q.start>=outer.end)return {support:outer,chain:[outer],complement:q,owner:outer,ambiguous:false};break;}if(!isNominal(q)||!/^compound/u.test(q.dep??''))break;i=q.head;}
  }
  let current=outer,chain=[outer],seen=new Set(),ambiguous=false;
  while(!seen.has(current)){seen.add(current);const index=cl.tokens.indexOf(current);
   const children=cl.tokens.filter(t=>t.start>=current.end&&(t.head===index&&/ccomp|xcomp|dobj|obj|conj/u.test(t.dep??'')||current.head===cl.tokens.indexOf(t)&&t.dep==='root')&&(isNominal(t)||/^(VV|VERB)/u.test(t.pos??''))&&!/^(允许|需要|必须|应该|可以|应|需)$/u.test(t.text)&&!/\.[a-z0-9]{1,8}$/iu.test(t.text));
   if(children.length!==1){ambiguous=children.length>1;break;}
   const child=children[0];if(SUPPORT_VERBS.includes(child.text)){chain.push(child);current=child;continue;}
   return {support:outer,chain,complement:child,owner:current,ambiguous:false};
  }
  if(ambiguous)return {support:outer,chain,ambiguous:true};
 }
 return null;
}
export function modalityFor(cl,t,start){
 const marker=explicitModal(cl,t.start,t),prefix=[...cl.span.quote].slice(0,start-cl.span.start).join('');
 if(marker)return marker;
 if(/must\s+not|shall\s+not|do\s+not|never/iu.test(prefix))return {modality:'FORBIDDEN'};
 if(/need\s+not|not\s+required/iu.test(prefix))return {modality:'NOT_REQUIRED'};
 if(/\bmay\b|\bcan\b/iu.test(prefix))return {modality:'PERMITTED'};
 if(/\bmust\b|\bshall\b/iu.test(prefix))return {modality:'REQUIRED'};
 const responsible=cl.tokens.find(q=>q.text==='负责'&&(q.start<start||q===t));
 if(responsible)return {modality:'REQUIRED',start:responsible.start,end:responsible.end,token_ids:[responsible.id],assignment:true};
 return null;
}
export function completionHeader(cl){
 const ts=cl.tokens,colon=ts.find(t=>/^[:：]$/u.test(t.text)),complete=ts.find(t=>t.text==='完成'),condition=ts.find(t=>t.text==='条件'),govern=ts.find(t=>['满足','需要','必须'].includes(t.text));
 return colon&&complete&&condition&&govern&&complete.start<govern.start&&condition.end<=colon.start?{colon,complete,condition,govern}:null;
}
