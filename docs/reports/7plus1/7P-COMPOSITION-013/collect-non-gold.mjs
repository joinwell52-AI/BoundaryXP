import fs from 'node:fs';
import {out,read,write,digest} from './common.mjs';
import {sourceDocument} from '../../../../research/7plus1-parser/p0-semantic-repair-r02/source.mjs';
import {analyze,closeNlp} from '../../../../research/7plus1-parser/v0.3-7p-composition-013/linguistic.mjs';
const inputs=read(out+'NON-GOLD-FROZEN-INPUTS.json');
try{for(const x of inputs.cases.filter(x=>x.new_in_013)){const path=out+'non-gold-signals/'+x.id+'.json';if(fs.existsSync(path))throw Error('FIRST_SIGNAL_ALREADY_EXISTS '+x.id);const s=await analyze(sourceDocument(x.text));write(path,{input_sha256:x.source_sha256,signals:s,actual_model_execution:true,semantic_retrieval_and_NLI:'NOT_RUN_NOT_NEEDED_FOR_OWNER_MECHANISMS'});console.log(JSON.stringify({id:x.id,clauses:s.clauses.length,nlp_ms:s.metrics.nlp_ms,models:s.models}));}}finally{closeNlp();}
write(out+'NON-GOLD-SIGNALS-MANIFEST.json',{inputs_sha256:digest(out+'NON-GOLD-FROZEN-INPUTS.json'),files:inputs.cases.map(x=>({id:x.id,path:out+'non-gold-signals/'+x.id+'.json',sha256:digest(out+'non-gold-signals/'+x.id+'.json')}))});
