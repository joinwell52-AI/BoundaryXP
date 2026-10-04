import {sourceDocument} from '../../../../research/7plus1-parser/p0-semantic-repair-r02/source.mjs';
import {analyze,closeNlp} from '../../../../research/7plus1-parser/v0.3-7p-composition-014/linguistic.mjs';
import {compileNative} from '../../../../research/7plus1-parser/v0.3-admin-root-024/engine.mjs';
const d=sourceDocument(process.argv[2]),signals=await analyze(d),r=compileNative(d,signals),c=r.compiler_v03;
console.log(JSON.stringify({nlp:signals.clauses.map(a=>({text:a.span.quote,tokens:a.tokens.map((t,i)=>({i,text:t.text,pos:t.pos,dep:t.dep,head:t.head})),srl:a.srl})),slots:Object.fromEntries(Object.entries(c.canonical_7plus1).filter(([,s])=>s.entries).map(([k,s])=>[k,{status:s.status,entries:s.entries.map(e=>e.display_value)}])),unknown:c.unresolved.map(u=>u.reason),temporal:c.nlp_signals.semantic_decoding.temporal_predicate_ir}));await closeNlp();
