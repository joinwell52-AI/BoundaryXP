// Read saved requests only. No model calls, prompt editing or account access.
import fs from 'node:fs';import path from 'node:path';
const root=path.resolve(process.argv[2]);
const count=s=>Array.from(s).length;
const rows=[];
for(const phase of ['parse','audit']){
 const dir=path.join(root,'revision-0',phase+'-call');
 const prompt=fs.readFileSync(path.join(dir,'prompt-0.txt'),'utf8');
 const receipt=JSON.parse(fs.readFileSync(path.join(dir,'receipt-0.json'),'utf8'));
 const resources=[...prompt.matchAll(/<RESOURCE path="([^"]+)" sha256=[^>]+>\n([\s\S]*?)\n<\/RESOURCE>/g)].map(m=>({path:m[1],characters:count(m[2]),fixed_within_version:true}));
 const source=prompt.match(/<SOURCE_DATA>\n([\s\S]*?)\n<\/SOURCE_DATA>/)?.[1]??'';
 const candidate=prompt.match(/<CANDIDATE_DATA>\n([\s\S]*?)\n<\/CANDIDATE_DATA>/)?.[1]??'';
 const resourceCount=resources.reduce((n,r)=>n+r.characters,0);
 rows.push({phase,total_characters:count(prompt),resources,resource_characters:resourceCount,source_payload_characters:count(source),candidate_payload_characters:count(candidate),wrapper_and_instructions_characters:count(prompt)-resourceCount-count(source)-count(candidate),elapsed_ms:receipt.elapsed_ms,usage:receipt.usage});
}
console.log(JSON.stringify({source_characters:count(fs.readFileSync(path.join(root,'source.txt'),'utf8')),requests:rows,real_model_calls_started:0},null,2));
