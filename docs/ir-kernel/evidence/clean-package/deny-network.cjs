const deny=()=>{throw Error('OFFLINE_TEST_NETWORK_FORBIDDEN')};
for(const [module,names]of Object.entries({'node:net':['connect','createConnection'],'node:tls':['connect'],'node:http':['request','get'],'node:https':['request','get']})){const m=require(module);for(const name of names)m[name]=deny;}
globalThis.fetch=deny;
require('node:module').syncBuiltinESMExports();
