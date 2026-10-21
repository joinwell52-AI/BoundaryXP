// Existing local UI entry: semantic computation lives only in llm-first-028.
import {pathToFileURL} from 'node:url';
import {startServer} from '../llm-first-028/service.mjs';
export {createServer} from '../llm-first-028/service.mjs';
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)startServer();
