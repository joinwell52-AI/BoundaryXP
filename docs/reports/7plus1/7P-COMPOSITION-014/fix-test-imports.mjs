import fs from 'node:fs';import {out,write} from './common.mjs';
write(out+'binding-checks.mjs',fs.readFileSync('docs/reports/7plus1/7P-COMPOSITION-013/binding-checks.mjs','utf8'));
for(const p of [out+'retained-tests/parser-7p-composition-013-binding.test.mjs','tests/parser-7p-composition-014-binding.test.mjs']){
 write(p,fs.readFileSync(p,'utf8').replace("inputs=read(frozen.inputs_path)","inputs={cases:read(dir+'NON-GOLD-FROZEN-INPUTS.json').cases.filter(x=>!x.new_in_014)}"));
}
