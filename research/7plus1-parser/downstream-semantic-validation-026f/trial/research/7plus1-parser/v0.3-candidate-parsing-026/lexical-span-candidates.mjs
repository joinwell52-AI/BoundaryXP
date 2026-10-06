import {VERBS} from './frontend.mjs';
import {PREDICATE_WORDS} from './migration/lexical.mjs';
// A finite predicate vocabulary is a proposal source, not a semantic pack or
// final normalization. Exact spans, tokenizer alternatives and anchors persist.
const sourceActions=['定位','收集','统计','记录','标记','删除','更换','安装','重启','改动','更改','修改','合并','下载','训练','加载','执行','调用','同步','覆盖','连接','读取','新增','判为','隐藏','发布','写入','保留','重建'];
const lexical=new Map([...Object.entries(VERBS),...Object.entries(PREDICATE_WORDS)].flatMap(([sense,words])=>words.map(w=>[w,sense])));
for(const word of sourceActions)if(!lexical.has(word))lexical.set(word,'SOURCE_EVENT');
const length=s=>[...s].length;
export function lexicalSpanCandidates(f){
 f.proposals.provider='FINITE_VERBAL_SPAN_ALTERNATIVES';
 f.semantic_decoding.lexical_span_candidates=[];
 for(const a of f.analyses){const ts=a.cl.tokens,raw=a.cl.span.quote;
  for(const [word,sense] of lexical){if(length(word)<2)continue;
   const han=/\p{Script=Han}/u.test(word),pattern=han?word:'\\b'+word+'\\b';
   for(const m of raw.matchAll(new RegExp(pattern,'giu'))){const start=a.cl.span.start+length(raw.slice(0,m.index)),end=start+length(word),parts=ts.filter(t=>t.start<end&&t.end>start);
    if(!parts.length||f.nlp_signals.literals.some(l=>l.span.start<=start&&l.span.end>=end))continue;
    const prefix=raw.slice(0,m.index),anchor=parts.find(t=>/^(VV|VERB)$/u.test(t.pos??'')),atHead=start===a.cl.span.start||/^(?:并|且|同时|分别|再|请)\s*$/u.test(prefix),operator=/(?:不得|禁止|严禁|必须|须|应|不要求|无需)\s*(?:重新|自动|实际|自行)?\s*$/u.test(prefix),coordinated=ts.some(t=>t.end<=start&&t.start>=a.cl.span.start&&/^(并|或|和|、)$/u.test(t.text)&&/^(CC|PU|AD)$/u.test(t.pos??''))&&a.events.some(e=>e.metadata.modality==='FORBIDDEN');
    const englishModal=!han&&/\b(?:must(?:\s+not)?|shall(?:\s+not)?|may|can|do\s+not|need\s+not)\s*$/iu.test(prefix);
    if(!atHead&&!operator&&!coordinated&&!englishModal)continue;
    if(!anchor&&!/^(NN|NOUN)$/u.test(parts[0].pos??''))continue;
    const after=ts.filter(t=>t.start>=end),nextPredicate=after.find(t=>/^(VV|VERB)$/u.test(t.pos??'')&&(t.dep==='conj'||lexical.has(t.text)&&after.some(m=>m.end<=t.start&&/^(并|且|同时|and|or)$/iu.test(m.text)))),argumentEnd=nextPredicate?after.findLast(t=>t.end<=nextPredicate.start&&/^(并|且|同时|and|or)$/iu.test(t.text))?.start??nextPredicate.start:a.cl.span.end;
    const nominal=after.filter(t=>t.end<=argumentEnd&&(/^(NN|NR|NT|NOUN|PROPN)$/u.test(t.pos??'')||atHead&&!anchor&&/^(VV|VA)$/u.test(t.pos??'')&&!lexical.has(t.text)||/^(VA|ADJ)$/u.test(t.pos??'')&&t.end===argumentEnd||word==='判为'&&operator&&/^(VV|VA|VERB|ADJ)$/u.test(t.pos??'')));if(!nominal.length&&!a.events.some(e=>e.metadata.token_id===anchor?.id))continue;
    const modality=/不要求|无需|\bneed\s+not\b/iu.test(prefix)?'NOT_REQUIRED':/不得|禁止|严禁|\b(?:must|shall|do)\s+not\b/iu.test(prefix)||coordinated?'FORBIDDEN':englishModal&&/\b(?:may|can)\s*$/iu.test(prefix)?'PERMITTED':atHead||operator||englishModal?'REQUIRED':'UNSTATED';
    const event=f.tools.node(a.cl,'EVENT',start,end,{sense,owner:a.cl.id,token_id:(anchor??parts[0]).id,syntax_token_ids:parts.map(t=>t.id),syntactic_layer:'MAIN',modality,modality_rule:'SOURCE_IMPERATIVE_OR_COORDINATED_LEXICAL_SPAN',local_modal_license:{modality,rule:'SOURCE_IMPERATIVE_OR_COORDINATED_LEXICAL_SPAN',token_ids:parts.map(t=>t.id),source_span_ids:[a.sid]},source_predicate_license:{rule:'FINITE_VERBAL_SOURCE_SPAN_WITH_SYNTAX_ANCHOR',predicate_span:{start,end},original_token_ids:parts.map(t=>t.id),token_ids:parts.map(t=>t.id),source_span_ids:[a.sid]},attachment_path:[a.parent_structure_id,a.cl.id,...parts.map(t=>t.id)]});a.events.push(event);
    if(nominal.length){let from=Math.min(...after.filter(t=>t.end<=argumentEnd&&!/^(PU|CC)$/u.test(t.pos??'')).map(t=>t.start)),to=argumentEnd;while(from<to&&/\s/u.test([...f.source.raw_text][from]))from++;while(to>from&&/\s/u.test([...f.source.raw_text][to-1]))to--;if(to>from){const n=f.tools.node(a.cl,'ENTITY',from,to,{sense:'SOURCE_LOCAL_NOMINAL_ARGUMENT',owner:event.node_id,syntax_token_ids:after.filter(t=>t.start>=from&&t.end<=to).map(t=>t.id),argument_role:'PATIENT'}),r=f.tools.relation(a.cl,modality==='FORBIDDEN'?'FORBIDS':sense==='generate'?'RESULT':'PATIENT',event,n,[a.sid]);r.generic_evidence??=[];r.generic_evidence.push({rule:'FINITE_LEXICAL_HEAD_LOCAL_NOMINAL_ARGUMENT',source_span_ids:[a.sid,...n.source_span_ids],token_ids:parts.map(t=>t.id),attachment_path:[a.cl.id,event.node_id,n.node_id]});}}
    f.semantic_decoding.lexical_span_candidates.push({node_id:event.node_id,span:{start,end},original_token_ids:parts.map(t=>t.id),source_span_ids:event.source_span_ids,candidate_only:true});
   }
  }
 }
 return f;
}
