export function resolveEndpoint(address,protocol){
  if(!['responses','chat'].includes(protocol))throw Error('请选择 API 协议。');
  let url;try{url=new URL(address);}catch{throw Error('请填写 HTTPS API 地址。');}
  if(url.protocol!=='https:'||url.username||url.password||url.search||url.hash)throw Error('模型地址须为 HTTPS，不含账号、查询参数或片段。');
  const endpoint=protocol==='responses'?'/responses':'/chat/completions';
  const original=url.href;
  url.pathname=url.pathname.replace(/\/+$/,'');
  if((protocol==='responses'&&url.pathname.endsWith('/chat/completions'))||(protocol==='chat'&&url.pathname.endsWith('/responses')))throw Error('所选协议与地址末尾不一致，请修改协议或接口地址。');
  if(/\/(?:api\/v3|v1)$/.test(url.pathname))url.pathname+=endpoint;
  return {url:url.href,adjusted:url.href!==original};
}
export function createConnectionState(){
  let revision=0,state='untested';
  return {get status(){return state;},invalidate(){revision++;state='untested';},begin(){revision++;state='testing';return revision;},finish(ticket,ok){if(ticket!==revision)return false;state=ok?'connected':'failed';return true;}};
}
