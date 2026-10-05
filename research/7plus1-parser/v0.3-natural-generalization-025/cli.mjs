import fs from 'node:fs';import {parse7Plus1} from './engine.mjs';import {closeNlp} from '../v0.3-7p-composition-014/linguistic.mjs';
try{if(!process.argv[2])throw Error('Usage: node cli.mjs source.md');console.log(JSON.stringify(await parse7Plus1(fs.readFileSync(process.argv[2])),null,2));}finally{await closeNlp();}

