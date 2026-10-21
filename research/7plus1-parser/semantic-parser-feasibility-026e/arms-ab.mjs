import fs from 'node:fs';
import {OUT,read,save,sha} from './setup.mjs';
import {sourceDocument} from '../p0-semantic-repair-r02/source.mjs';
import {analyze as segmented} from '../v0.3-7p-composition-014/linguistic.mjs';
import {lexical} from '../v0.3-7p-composition-014/typed-literals.mjs';
import {modelRequest,closeNlp} from '../p0-semantic-repair-r02/linguistic.mjs';
import {compileNative} from '../v0.3-candidate-parsing-026/engine.mjs';
const corpus=read(`${OUT}/CORPUS-SELECTION.json`);
async function fullSentence(doc){
 const literals=lexical(doc),p=[...doc.source.raw_text],clauses=[];let start=0;
 for(let i=0;i<=p.length;i++){
  const protectedHere=literals.some(l=>l.span.start<=i&&l.span.end>i);
  if(i<p.length&&(protectedHere||!/[。.!?！？；;\n]/u.test(p[i])))continue;
  let a=start,b=i<p.length&&p[i]!=='\n'?i+1:i;while(a<b&&/\s/u.test(p[a]))a++;while(b>a&&/\s/u.test(p[b-1]))b--;
  if(b>a)clauses.push({id:'clause:'+clauses.length,span:doc.span(a,b),sentence_id:clauses.length,delimiter:p[i]??''});start=i+1;
 }
 const request={clauses:clauses.map(c=>({id:c.id,text:c.span.quote,language:/\p{Script=Han}/u.test(c.span.quote)?'zh':'en',protected:literals.filter(l=>l.span.start>=c.span.start&&l.span.end<=c.span.end).map(l=>({start:l.span.start-c.span.start,end:l.span.end-c.span.start}))}))};
 const result=await modelRequest(request);
 for(const c of clauses){const raw=result.clauses.find(x=>x.id===c.id);c.model=raw.model;c.tokens=raw.tokens.map((t,i)=>({...t,id:c.id+':token:'+i,start:c.span.start+t.start,end:c.span.start+t.end,span:doc.span(c.span.start+t.start,c.span.start+t.end)}));c.entities=raw.entities.map(e=>({...e,span:doc.span(c.span.start+e.start,c.span.start+e.end)}));c.pos_alternatives=raw.pos_alternatives;c.srl=raw.srl;}
 return {clauses,literals,metrics:{model_load_count:result.model_load_count,nlp_ms:result.nlp_ms},models:result.models,experiment:{full_sentence:true,punctuation_retained:true,raw_request:request,raw_response:result,altered_candidate_rules:false}};
}
const outputs={A:[],B:[]};
try{
 for(const [index,row]of corpus.cases.entries()){
  const doc=sourceDocument(row.source);
  for(const arm of ['A','B']){
   const prefix=`${OUT}/arm-${arm}/${row.id}`;
   try{const signals=arm==='A'?await segmented(doc):await fullSentence(doc);save(`${prefix}/signals.json`,signals);
    const trace=compileNative(doc,signals,{run_id:`026E-${arm}-${row.id}`,created_at:'2026-10-06T00:00:00.000Z'});save(`${prefix}/trace.json`,trace);save(`${prefix}/canonical.json`,trace.compiler_v03.canonical_7plus1);
    outputs[arm].push({id:row.id,corpus:row.corpus,root:row.root,status:'OUTPUT_SAVED',source_sha256:row.source_sha256,signals:`${prefix}/signals.json`,trace:`${prefix}/trace.json`,clauses:signals.clauses.length,tokens:signals.clauses.reduce((n,c)=>n+c.tokens.length,0),contract:trace.contract_gate_results.status,architecture:trace.candidate_graph_gate_results.status});
   }catch(e){save(`${prefix}/error.json`,{error:String(e),stack:e.stack,source_sha256:row.source_sha256});outputs[arm].push({id:row.id,status:'ERROR',error:String(e)});}
  }
  console.log(JSON.stringify({done:index+1,total:60,id:row.id,A:outputs.A.at(-1).status,B:outputs.B.at(-1).status}));
 }
}finally{closeNlp();for(const arm of ['A','B'])save(`${OUT}/ARM-${arm}-${arm==='A'?'SEGMENTED':'FULL-SENTENCE'}.json`,{arm,models:'SAME_APPROVED_HANLP_SPACY_MODEL_BYTES',candidate_runtime:'UNCHANGED_ADMITTED_026',rows:outputs[arm]});}
