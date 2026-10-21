import fs from 'node:fs';import {candidateSchema,auditSchema} from './schema.mjs';
import {operatorRegistry} from './runtime-capabilities.mjs';
const write=(name,x)=>{const file=new URL(name,import.meta.url),bytes=JSON.stringify(x,null,2)+'\n';if(process.argv.includes('--check')){if(JSON.stringify(JSON.parse(fs.readFileSync(file,'utf8')))!==JSON.stringify(x))throw Error('GENERATED_IR_RESOURCE_DRIFT:'+name);}else fs.writeFileSync(file,bytes);};
write('candidate-ir.schema.json',candidateSchema);write('candidate-ir-audit.schema.json',auditSchema);
write('operator-registry.json',operatorRegistry());
