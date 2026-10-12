import fs from 'node:fs';import {candidateSchema,auditSchema,operators} from './schema.mjs';
const write=(name,x)=>fs.writeFileSync(new URL(name,import.meta.url),JSON.stringify(x)+'\n');
write('candidate-ir.schema.json',candidateSchema);write('candidate-ir-audit.schema.json',auditSchema);
write('operator-registry.json',Object.fromEntries(Object.entries(operators).map(([operator,[result_type,min_arguments,max_arguments]])=>[operator,{result_type,min_arguments,max_arguments,consumer_status:'NOT_IMPLEMENTED_IN_CURRENT_UI65',semantic_definition:'See CONTRACT.md; typed candidate representation only, never evidence of execution or acceptance.'}])));
