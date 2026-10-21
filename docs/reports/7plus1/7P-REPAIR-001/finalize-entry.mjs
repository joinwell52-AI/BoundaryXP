import fs from 'node:fs';import {createHash} from 'node:crypto';
const dir='docs/reports/7plus1/7P-REPAIR-001',p='research/7plus1-parser/v0.3-7p-repair-001/web/native-app.js',hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex'),prior=JSON.parse(fs.readFileSync(dir+'/IMPLEMENTATION-FROZEN.json'));
fs.renameSync(dir+'/IMPLEMENTATION-FROZEN.json',dir+'/IMPLEMENTATION-FROZEN-r02.json');
fs.writeFileSync(dir+'/web-native-app-r02.js',fs.readFileSync(p),{flag:'wx'});
const text=fs.readFileSync(p,'utf8'),updated=text.replaceAll("'v0.3-p2.2-scope-consistency-repair'].includes(r.parser_revision)","'v0.3-p2.2-scope-consistency-repair','v0.3-7p-repair-001'].includes(r.parser_revision)");if(updated===text)throw Error('UI_VERSION_DISPATCH_NOT_FOUND');fs.writeFileSync(p,updated);
const delta=Object.keys(prior.files).filter(p=>hash(p)!==prior.files[p]);
if(delta.some(p=>p!=='package.json'&&!p.endsWith('/web/native-app.js')))throw Error('SEMANTIC_REPLAY_INVALIDATED '+delta);
fs.writeFileSync(dir+'/ENTRY-COMPATIBILITY.json',JSON.stringify({semantic_replay_manifest:'IMPLEMENTATION-FROZEN-r02.json',changed_after_semantic_replay:delta,semantic_parser_and_model_dependencies_unchanged:true,reason:'UI recognizes the new revision; global npm aliases restored to preserve prior sealed package.json dependency. New real CLI/server explicitly live in the new revision.',cli:'node research/7plus1-parser/v0.3-7p-repair-001/cli.mjs --input <UTF-8 file>',ui:'node research/7plus1-parser/v0.3-7p-repair-001/server.mjs',existing_58618_process_restarted:false},null,2)+'\n',{flag:'wx'});
