export const ref=(kind,id)=>({kind,id});
export const E=id=>ref('EXPRESSION',id),O=id=>ref('ENTITY',id),V=id=>ref('VARIABLE',id),T=id=>ref('EVENT',id),S=id=>ref('STATE',id);
export const common=id=>({id,source_refs:['s']});
export function fixture(){return {format:'boundx-candidate-ir/1',contract_version:'candidate-ir/1.4',source_table:[{id:'s',quote:'Structured artificial kernel fixture',occurrence:1}],entities:[],variables:[],events:[event('task',{kind:'TASK',operation:'ORGANIZE',owner_id:'task'})],states:[],expressions:[],requirements:[],issues:[],coverage:[]};}
export function event(id,overrides={}){return {...common(id),label:id,kind:'ACTION',layer:'MAIN',use:'CURRENT_TASK',owner_id:'task',operation:'READ',operation_extent:'EXACT',actor_domain:'EXPLICIT',roles:[],...overrides};}
export const entity=(id,kind='OBJECT',members=[])=>({...common(id),label:id,kind,instance_scope:'task',members});
export const expr=(id,operator,args=[],literal=null,unit=null,bound_variable=null)=>({...common(id),operator,arguments:args,literal,unit,bound_variable});
export const variable=(id,type,domain,binding_mode='TASK_FIXED')=>({...common(id),label:id,type,domain,binding_mode,scope_id:'task',owner:null});
export const req=(id,body,overrides={})=>({...common(id),kind:'CONSTRAINT',views:['B'],scope_id:'task',modality:'REQUIRED',subject:null,applicability:null,body,data_use:null,note:'',...overrides});
export function rename(ir,from,to){return JSON.parse(JSON.stringify(ir),function(k,v){return typeof v==='string'&&['id','owner_id','scope_id','instance_scope'].includes(k)&&v===from?to:v;});}
