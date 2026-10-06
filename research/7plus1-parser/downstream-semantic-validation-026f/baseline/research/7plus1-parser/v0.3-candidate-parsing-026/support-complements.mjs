import {SUPPORT_VERBS as FROZEN_SUPPORT_VERBS} from '../v0.3-7p-composition-014/grammar.mjs';
const SUPPORT_VERBS=[...FROZEN_SUPPORT_VERBS,'organize','organise'];
import {PREDICATE_WORDS} from './migration/lexical.mjs';
import {VERBS} from './frontend.mjs';
import {predicateLayer,srlPredicate} from './predicate-ownership.mjs';
const nominal=t=>/^(NN|NR|NOUN|PROPN)/u.test(t.pos??'');
export function compoundFor(cl){
 const known=t=>Object.values({...VERBS,...PREDICATE_WORDS}).some(ws=>ws.includes((t.lemma??t.text).toLowerCase())||ws.includes(t.text.toLowerCase()));
 for(const head of cl.tokens.filter(t=>/^(VV|VERB)$/u.test(t.pos??'')&&t.dep==='root'&&!known(t))){const children=cl.tokens.filter(t=>t.head===cl.tokens.indexOf(head)&&t.dep==='compound:vc'&&['report','notify','send'].some(s=>(VERBS[s]??[]).includes(t.text)));if(children.length===1)return {support:head,chain:[head],complement:children[0],owner:head,ambiguous:false,composition:'MANNER_COMPOUND_PREDICATE'};}
 for(const support of cl.tokens.filter(t=>SUPPORT_VERBS.includes(t.text)&&predicateLayer(cl,t).kind==='MAIN')){
  let current=support,chain=[support],seen=new Set();
  while(!seen.has(current)){
   seen.add(current);const index=cl.tokens.indexOf(current);
   // A coordinated predicate is a sibling action, not an argument of the
   // support verb. Only dependency-labelled complements belong to this chain.
   const candidates=cl.tokens.filter(t=>t.start>=current.end&&t.head===index&&/^(ccomp|xcomp|dobj|obj)$/u.test(t.dep??'')&&predicateLayer(cl,t).kind==='MAIN'&&!cl.tokens.some(q=>q.head===cl.tokens.indexOf(t)&&q.dep==='case')&&(SUPPORT_VERBS.includes(t.text)||known(t)&&(/^(VV|VERB)/u.test(t.pos??'')||nominal(t))||srlPredicate(cl,t)&&/^(VV|VERB)/u.test(t.pos??'')));
   if(candidates.length>1)return {support,chain,ambiguous:true,candidate_token_ids:candidates.map(t=>t.id)};
   if(!candidates.length){
    // Some HanLP parses attach a mode-qualified nominal predicate to the
    // directive rather than its support verb. Explicit SRL object + local
    // nominal mode ownership still provides a bounded complement domain.
    const frame=(cl.srl??[]).find(fr=>fr.some(r=>r[1]==='PRED'&&r[2]===index)),object=frame?.find(r=>r[1]==='ARG1');
    const modeQualified=object?cl.tokens.filter(t=>known(t)&&nominal(t)&&t.start>=cl.tokens[object[3]-1]?.end&&cl.tokens.some(read=>read.head===cl.tokens.indexOf(t)&&/^(读|只读|read-only)$/iu.test(read.text)&&/compound|acl|amod/u.test(read.dep??'')&&(read.text!=='读'||cl.tokens.some(only=>only.head===cl.tokens.indexOf(read)&&only.text==='只'&&only.end===read.start)))):[];
    if(modeQualified.length===1)return {support,chain,complement:modeQualified[0],owner:current,ambiguous:false,composition:'SRL_ARGUMENT_MODE_QUALIFIED_NOMINAL_COMPLEMENT'};
    if(modeQualified.length>1)return {support,chain,ambiguous:true,candidate_token_ids:modeQualified.map(t=>t.id)};
    break;
   }
   const child=candidates[0];if(SUPPORT_VERBS.includes(child.text)){chain.push(child);current=child;continue;}
   return {support,chain,complement:child,owner:current,ambiguous:false};
  }
 }
 return null;
}
