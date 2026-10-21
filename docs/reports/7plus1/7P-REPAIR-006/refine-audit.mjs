import fs from'node:fs';const d='docs/reports/7plus1/7P-REPAIR-006';
const p=d+'/audit.mjs';let s=fs.readFileSync(p,'utf8').split('\n').filter(l=>!l.startsWith("put('CANDIDATE-RECALL-CONTRACT.json'")&&!l.startsWith("put('INHERITED-EDGE-CLOSURE-NOTES.json'")).join('\n');
s=s.replace("eligibility:'compiler_v03.nlp_signals.semantic_decoding.candidate_recall.eligibility_decisions'","certification:'compiler_v03.nlp_signals.semantic_decoding.frame_certification',eligibility:'compiler_v03.nlp_signals.semantic_decoding.frame_certification.eligibility_decisions'");fs.writeFileSync(p,s,'utf8');
fs.writeFileSync(d+'/table-audit.mjs',fs.readFileSync('docs/reports/7plus1/7P-REPAIR-005/table-audit.mjs','utf8').replaceAll('7P-REPAIR-005','7P-REPAIR-006'),{flag:'wx'});
