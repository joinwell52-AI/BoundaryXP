import fs from 'node:fs';import crypto from 'node:crypto';
export const OUT='docs/reports/7plus1/7P-ADMIN-SHORT-019-LONG/',ROOT='research/7plus1-parser/v0.3-admin-short-019/';
export const sha=b=>crypto.createHash('sha256').update(b).digest('hex'),digest=p=>sha(fs.readFileSync(p)),read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
export const walk=p=>fs.readdirSync(p,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(p+e.name+'/'):[p+e.name]).sort();
export function write(p,v){if(fs.existsSync(OUT+'SEAL.md'))throw Error('SEALED');if(!p.startsWith(OUT))throw Error('OUT_OF_SCOPE');fs.mkdirSync(p.slice(0,p.lastIndexOf('/')),{recursive:true});fs.writeFileSync(p,typeof v==='string'?v:JSON.stringify(v,null,2)+'\n');}
export function signature(r){const g=r.compiler_v03;return sha(JSON.stringify({source:g.source,structure:g.structure,nodes:g.semantic_nodes,relations:g.relations,unresolved:g.unresolved,decisions:g.eligibility_decisions,coverage:g.coverage,ir:g.boundary_ir,canonical:g.canonical_7plus1,proof:g.proof_dag,composition:g.nlp_signals.semantic_decoding.root_contract_ir,domains:g.nlp_signals.semantic_decoding.qualified_domain_ir}));}
