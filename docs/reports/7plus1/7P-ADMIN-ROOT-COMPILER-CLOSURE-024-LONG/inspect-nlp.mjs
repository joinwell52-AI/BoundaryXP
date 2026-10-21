import {read,OUT} from './audit-tools.mjs';
const revision=process.argv[2],name=process.argv[3],clauses=process.argv.slice(4).map(Number),trace=read(OUT+'/development/'+revision+'/'+name+'/trace.json');
for(const [i,c] of trace.compiler_v03.nlp_signals.clauses.entries())if(!clauses.length||clauses.includes(i))console.log(JSON.stringify({index:i,text:c.span.quote,tokens:c.tokens.map((t,i)=>({i,text:t.text,pos:t.pos,dep:t.dep,head:t.head,start:t.start,end:t.end})),entities:c.entities,srl:c.srl}));
