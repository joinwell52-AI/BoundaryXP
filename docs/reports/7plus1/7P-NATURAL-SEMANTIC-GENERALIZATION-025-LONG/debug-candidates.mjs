import fs from 'node:fs';
import {prepareCandidates} from '../../../../research/7plus1-parser/v0.3-natural-generalization-025/candidates.mjs';
import {sourceDocument} from '../../../../research/7plus1-parser/final-v0.1/source.mjs';
const cid='NROOT-'+process.argv[2].padStart(3,'0'),p='docs/reports/7plus1/7P-ADMIN-ROOT-COMPILER-CLOSURE-024-LONG/natural-first/r01/'+cid+'/trace.json',r=JSON.parse(fs.readFileSync(p)),c=r.compiler_v03;
const f=prepareCandidates(sourceDocument(c.source.raw_text),c.nlp_signals);
for(const a of f.analyses){console.log(a.cl.id,a.cl.span.quote,a.discourse.kind,a.parent_structure_id);console.table(a.cl.tokens.map((t,i)=>({i,text:t.text,start:t.start,end:t.end,head:t.head,pos:t.pos,dep:t.dep})));console.log('EVENTS',a.events.map(e=>[e.surface,e.metadata.sense,e.metadata.modality]));console.log('LOCALS',a.locals.map(n=>[n.surface,n.metadata.literal_tag]));}
console.log('IR',JSON.stringify({approval:f.semantic_decoding.approval_domain_ir,temporal:f.semantic_decoding.implicit_subject_temporal_ir}));
