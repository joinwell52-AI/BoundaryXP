// Align an existing lexical predicate with a tokenizer boundary only when a
// real verbal/SRL anchor supports it. The original model output is immutable.
export function alignPredicateLattice(cl,lexicon,literals=[]){
 const words=[...new Set(Object.values(lexicon).flat())].filter(w=>/\p{Script=Han}/u.test(w)&&[...w].length>1).sort((a,b)=>b.length-a.length),tokens=structuredClone(cl.tokens),repairs=[];
 for(let i=0;i<tokens.length;i++){
  const t=tokens[i];if(!/^(VV|VERB)$/u.test(t.pos??''))continue;
  const word=words.find(w=>w.startsWith(t.text)&&w!==t.text&&[...cl.span.quote].slice(t.start-cl.span.start,t.start-cl.span.start+[...w].length).join('')===w);
  if(!word)continue;const end=t.start+[...word].length,next=tokens[i+1];
  if(!next||next.start!==t.end||next.end<end||!/^NN/u.test(next.pos??'')||!/(compound|dobj|obj)/u.test(next.dep??''))continue;
  const predicateHint=(cl.srl??[]).some(fr=>fr.some(r=>r[1]==='PRED'&&r[2]<=i&&r[3]>i));if(!predicateHint)continue;
  const original=[structuredClone(t),structuredClone(next)],points=[...cl.span.quote];
  t.text=word;t.end=end;t.span={...t.span,end,quote:word};t.provider='SOURCE_LEXICAL_SPAN_LATTICE';t.original_model_tokens=original;
  next.text=points.slice(end-cl.span.start,next.end-cl.span.start).join('');next.start=end;next.span={...next.span,start:end,quote:next.text};next.provider='SOURCE_LEXICAL_SPAN_LATTICE';next.original_model_tokens=original;
  repairs.push({predicate_span:{start:t.start,end,text:word},argument_remainder_span:{start:next.start,end:next.end,text:next.text},original_model_tokens:original,rule:'SRL_ANCHORED_LEXICAL_BOUNDARY_ALIGNMENT'});
 }
 // A merged verbal token can hide an explicit modal boundary and a protected
 // artifact. Split only an exact known antecedent predicate + modal + known
 // consequent + typed literal. Original NLP remains untouched and cited.
 const expanded=[],anchors=new Map();
 for(const [originalIndex,t] of tokens.entries()){
  const modalMatch=/^(批准|确认|审核)(不得|禁止|必须|须)(.+)$/u.exec(t.text),predicate=modalMatch?words.find(w=>modalMatch[3].startsWith(w)):null;
  const literal=predicate&&literals.find(l=>['FILE','PATH','IDENTIFIER'].includes(l.type)&&l.span.end===t.end&&l.span.start===t.start+[...modalMatch[1]+modalMatch[2]+predicate].length&&l.span.quote===modalMatch[3].slice(predicate.length));
  if(!modalMatch||!literal||!/^VV|^VERB/u.test(t.pos??'')||(cl.srl??[]).length){anchors.set(originalIndex,expanded.length);expanded.push({...t,original_index:originalIndex});continue;}
  const base=expanded.length,parts=[modalMatch[1],modalMatch[2],predicate,literal.span.quote];let start=t.start;
  parts.forEach((text,j)=>{const end=start+[...text].length;expanded.push({...t,id:t.id+':segment:'+j,text,start,end,pos:j===3?'NN':j===1?'AD':'VV',dep:j===0?'advcl':j===1?/不得|禁止/u.test(text)?'neg':'aux:modal':j===2?t.dep:'dobj',head:base+2,span:{...t.span,start,end,quote:text},provider:'SOURCE_MODAL_TYPED_LITERAL_SEGMENTATION',original_index:originalIndex,original_model_tokens:[structuredClone(t)],derived_head:true});start=end;});
  anchors.set(originalIndex,base+2);repairs.push({rule:'VERBAL_ANCHOR_MODAL_AND_TYPED_LITERAL_SEGMENTATION',original_model_tokens:[structuredClone(t)],predicate_span:{start:expanded[base+2].start,end:expanded[base+2].end,text:predicate},typed_literal_id:literal.id,source_segments:expanded.slice(base).map(x=>({token_id:x.id,start:x.start,end:x.end,text:x.text}))});
 }
 for(const t of expanded)if(!t.derived_head)t.head=anchors.get(t.head)??t.head;
 return {clause:{...cl,tokens:expanded},repairs};
}
