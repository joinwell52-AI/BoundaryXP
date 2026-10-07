// Stable product entry, serves the existing UI with the only compiler core.
import {createServer} from '../../research/7plus1-parser/llm-first-028/service.mjs';
const server=createServer({...(process.env.BOUNDX_DATA_DIR?{dataRoot:process.env.BOUNDX_DATA_DIR}:{}),...(process.env.BOUNDX_LEGACY_DIR?{legacyRoot:process.env.BOUNDX_LEGACY_DIR}:{})});
const port=Number(process.env.BOUNDX_PARSER_PORT??58618);
server.on('error',e=>{console.error(e.code==='EADDRINUSE'?'PORT_IN_USE: target was not stopped':e.message);process.exitCode=1;});
server.listen(port,'127.0.0.1',()=>console.log(`BoundX short compiler: http://127.0.0.1:${port}/`));
