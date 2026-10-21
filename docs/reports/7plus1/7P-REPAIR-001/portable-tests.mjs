import fs from 'node:fs';
const dir='docs/reports/7plus1/7P-REPAIR-001',support=dir+'/test-support';fs.mkdirSync(support,{recursive:true});
for(const n of ['meeting-assertions.mjs','verify-semantics.mjs'])fs.copyFileSync('research/7plus1-parser/v0.3-p2.2-scope-consistency-repair/'+n,support+'/'+n,fs.constants.COPYFILE_EXCL);
let s=fs.readFileSync('tests/parser-7p-repair-001.test.mjs','utf8');
s=s.replaceAll("'../research/","'../../../../research/").replaceAll("'../docs/","'../../../../docs/");
for(const n of ['meeting-assertions.mjs','verify-semantics.mjs'])s=s.replace('../../../../research/7plus1-parser/v0.3-p2.2-scope-consistency-repair/'+n,'../../../../'+support+'/'+n);
s=s.replace(/^const regression=.*;$/mu,"const regression=read('fixtures/7plus1/regression/P22-SAVED-SIGNALS.json').cases.map(c=>({...c,id:c.id==='MEETING'?'REF-001':c.id,base_id:c.id.split('-M')[0]}));");
fs.writeFileSync('src/__tests__/7plus1/regression/repair-001.test.mjs',s,{flag:'wx'});
