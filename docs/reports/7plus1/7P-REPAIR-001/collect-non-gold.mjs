import fs from 'node:fs';
import {cases} from './non-gold-inputs.mjs';
import {sourceDocument} from '../../../../research/7plus1-parser/p0-semantic-repair-r02/source.mjs';
import {analyze,closeNlp} from '../../../../research/7plus1-parser/v0.3-7p-repair-001/linguistic.mjs';
const dir='docs/reports/7plus1/7P-REPAIR-001/non-gold';fs.mkdirSync(dir,{recursive:true});
try{for(const c of cases){const p=dir+'/'+c.id+'.json';if(fs.existsSync(p))continue;const signals=await analyze(sourceDocument(c.text));fs.writeFileSync(p,JSON.stringify({...c,signals},null,2)+'\n',{flag:'wx'});console.log(c.id);}}finally{closeNlp();}
