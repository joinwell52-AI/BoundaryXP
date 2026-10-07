import path from 'node:path';import {fileURLToPath,pathToFileURL} from 'node:url';
import {lockProduct} from './resources.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..'),lock=lockProduct(root);
const {runCLI}=await import(pathToFileURL(path.join(root,'research/7plus1-parser/llm-first-028/cli.mjs')));
await runCLI(process.argv.slice(2),{resourceGuard:lock.verify,productSnapshot:lock.snapshot});

