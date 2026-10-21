// Complete package resources are verified before loading the only compiler core.
import path from 'node:path';import {fileURLToPath,pathToFileURL} from 'node:url';
import {lockProduct} from './resources.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..'),lock=lockProduct(root);
const {createServer}=await import(pathToFileURL(path.join(root,'research/7plus1-parser/llm-first-028/service.mjs')));
const server=createServer({resourceGuard:lock.verify,productSnapshot:lock.snapshot,...(process.env.BOUNDX_DATA_DIR?{dataRoot:process.env.BOUNDX_DATA_DIR}:{}),...(process.env.BOUNDX_LEGACY_DIR?{legacyRoot:process.env.BOUNDX_LEGACY_DIR}:{})});
const port=Number(process.env.BOUNDX_PARSER_PORT??58618);
server.on('error',e=>{console.error(e.code==='EADDRINUSE'?'PORT_IN_USE: target was not stopped':e.message);process.exitCode=1;});
server.listen(port,'127.0.0.1',()=>console.log(JSON.stringify({url:`http://127.0.0.1:${server.address().port}/`,pid:process.pid,product_version:lock.snapshot.product_version,compiler_revision:lock.snapshot.compiler_revision,contract:lock.snapshot.contract,manifest_sha256:lock.snapshot.manifest_sha256})));

