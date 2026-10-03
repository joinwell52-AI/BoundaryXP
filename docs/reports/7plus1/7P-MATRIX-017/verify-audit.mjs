import fs from 'node:fs';import assert from 'node:assert/strict';import crypto from 'node:crypto';
const out='docs/reports/7plus1/7P-MATRIX-017/',read=p=>JSON.parse(fs.readFileSync(p,'utf8')),hash=b=>crypto.createHash('sha256').update(b).digest('hex');assert.ok(!fs.existsSync(out+'SEAL.md'));
const rows=[],ok=(name,fn)=>{fn();rows.push({name,status:'PASS'});},cases=read(out+'FROZEN-CASE-VERIFICATION.json'),issue=read(out+'CONTRACT-CONFLICT.json');
const authority=[...fs.readFileSync(cases.authority.path,'utf8')];
for(const c of cases.cases)ok(c.id+'_exact_source',()=>{const b=fs.readFileSync(c.source_file);assert.equal(hash(b),c.source_sha256);assert.equal(authority.slice(c.authority_source_span.start,c.authority_source_span.end).join(''),b.toString('utf8'));});
for(const [i,e] of [...issue.source_evidence,issue.positive_control.evidence].entries())ok('source_span_'+i,()=>{const b=fs.readFileSync(e.source_path);assert.equal(hash(b),e.source_sha256);assert.equal([...b.toString('utf8')].slice(e.start,e.end).join(''),e.quote);});
for(const e of [issue.rule,issue.expected_evidence])ok('authority_line_'+e.line,()=>assert.equal(fs.readFileSync(e.path,'utf8').split(/\r?\n/)[e.line-1],e.quote));
ok('untested_metrics_not_pass',()=>{for(let i=0;i<4;i++){const x=read(out+'G'+i+'-GATE.json');assert.equal(x.status,'NOT_RUN');assert.equal(x.pass,null);}assert.equal(read(out+'FULL-REGRESSION.json').pass,null);assert.equal(read(out+'FINAL-OUTCOME.json').implementation_started,false);});
fs.writeFileSync(out+'READ-ONLY-VERIFICATION.json',JSON.stringify({status:'PASS',scope:'11 evidence/integrity checks only, not Parser tests',checks:rows},null,2)+'\n');console.log(JSON.stringify({status:'PASS',checks:rows.length}));
