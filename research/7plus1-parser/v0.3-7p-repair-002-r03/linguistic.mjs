import {lexical,modelRequest,closeNlp} from '../p0-semantic-repair-r02/linguistic.mjs';
export {closeNlp};
// Sentence punctuation outside protected literals is structure, including ASCII periods.
export async function analyze(doc){
 const literals=lexical(doc),p=[...doc.source.raw_text],clauses=[];let start=0,sentence=0;
 for(let i=0;i<=p.length;i++){
  const protectedHere=literals.some(l=>l.span.start<=i&&l.span.end>i);
  if(i<p.length&&(protectedHere||!/[，,。.!?！？；;\n]/u.test(p[i])))continue;
  let a=start,b=i;while(a<b&&/\s/u.test(p[a]))a++;while(b>a&&/\s/u.test(p[b-1]))b--;
  if(b>a)clauses.push({id:'clause:'+clauses.length,span:doc.span(a,b),sentence_id:sentence,delimiter:p[i]??''});
  if(/[。.!?！？；;\n]/u.test(p[i]??''))sentence++;start=i+1;
 }
 const result=await modelRequest({clauses:clauses.map(c=>({id:c.id,text:c.span.quote,language:/\p{Script=Han}/u.test(c.span.quote)?'zh':'en',protected:literals.filter(l=>l.span.start>=c.span.start&&l.span.end<=c.span.end).map(l=>({start:l.span.start-c.span.start,end:l.span.end-c.span.start}))}))});
 for(const c of clauses){const raw=result.clauses.find(x=>x.id===c.id);c.model=raw.model;c.tokens=raw.tokens.map((t,i)=>({...t,id:c.id+':token:'+i,start:c.span.start+t.start,end:c.span.start+t.end,span:doc.span(c.span.start+t.start,c.span.start+t.end)}));c.entities=raw.entities.map(e=>({...e,span:doc.span(c.span.start+e.start,c.span.start+e.end)}));c.pos_alternatives=raw.pos_alternatives;c.srl=raw.srl;}
 return {clauses,literals,metrics:{model_load_count:result.model_load_count,nlp_ms:result.nlp_ms},models:result.models};
}
