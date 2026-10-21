// Hand-written boundary declaration for offline interface tests; never a model input.
export function boundaryFixture(){
 const source_refs=['s'],scope='task',meta=id=>({id,source_refs,scope});
 const object=(id,kind='FILE')=>({...meta(id),label:id,kind,members:[]});
 const action=(id,operation,pairs)=>({...meta(id),label:id,operation,roles:pairs.map(([role,value])=>({role,value}))});
 return {format:'boundx-boundary-rules/1',sources:[{id:'s',quote:'Offline boundary interface fixture',occurrence:1}],tasks:[{id:'task',source_refs,label:'Inspection',parent:null,roles:[{role:'ORGANIZER',value:'pm'},{role:'BASIS',value:'basis'}]}],
  objects:[...['pm','dev','qa','admin'].map(id=>object(id,'PERSON')),...['a','b','c','report','extra'].map(id=>object(id)),object('test','ENVIRONMENT'),object('prod','ENVIRONMENT'),object('basis','DOCUMENT')],
  actions:[action('organize','ORGANIZE',[['PERFORMER','pm']]),action('read','READ',[['PERFORMER','dev'],['OBJECT','choice']]),action('generate','CREATE',[['PERFORMER','dev'],['INPUT_OBJECT','choice'],['BASIS','choice'],['RESULT','report']]),action('submit','DELIVER',[['PERFORMER','dev'],['DELIVERABLE','report'],['RECIPIENT','qa']]),action('review','REVIEW',[['PERFORMER','qa'],['OBJECT','report']]),action('deliver','DELIVER',[['PERFORMER','pm'],['DELIVERABLE','report'],['RECIPIENT','admin']]),action('generate_extra','CREATE',[['PERFORMER','dev'],['RESULT','extra']]),action('deliver_extra','DELIVER',[['DELIVERABLE','extra']])],
  states:[{id:'received',source_refs,label:'Received',kind:'RECEIPT',subject:'submit',arguments:['qa','report']},{id:'passed',source_refs,label:'Passed',kind:'SUCCESS',subject:'review',arguments:['report']}],
  rules:[
   {...meta('input'),type:'INPUT_SCOPE',members:['a','b','c']},
   {...meta('env'),type:'ENVIRONMENT',environment:'test'},
   {...meta('choice'),type:'CHOICE',action:'read',actor:'dev',options:['a','b','c'],excluded:['c'],locked:true,first_required:true},
   {...meta('retry'),type:'RETRY',action:'read',max_extra:2,previous_failure_required:true,match:{operation:'READ',actors:['dev'],objects:['a','b','c'],recipients:[]}},
   ...['organize','generate','submit','deliver'].map(action=>({...meta('norm_'+action),type:'NORM',action,modality:'REQUIRED',when:null})),
   {...meta('review_norm'),type:'NORM',action:'review',modality:'REQUIRED',when:{state:'received'}},
   {...meta('review_gate'),type:'GATE',match:{operation:'REVIEW',actors:['qa'],objects:['report'],recipients:[]},condition:{state:'received'}},
   {...meta('delivery_gate'),type:'GATE',match:{operation:'DELIVER',actors:['pm'],objects:['report'],recipients:['admin']},condition:{state:'passed'}},
   {...meta('extra_norm'),type:'NORM',action:'generate_extra',modality:'PERMITTED',when:null},
   {...meta('extra_delivery'),type:'NORM',action:'deliver_extra',modality:'NOT_REQUIRED',when:null},
   ...[['forbid_c','READ',['c'],[]],['forbid_modify','MODIFY',['a','b','c'],[]],['forbid_prod','ACCESS',['prod'],[]],['forbid_extra','DELIVER',['extra'],['admin']]].map(([id,operation,objects,recipients])=>({...meta(id),type:'FORBID',match:{operation,actors:[],objects,recipients},during_state:null})),
   ...[['use_read','choice','read',null],['use_generate','choice','generate',null],['use_submit','report','submit','generate'],['use_review','report','review','generate'],['use_deliver','report','deliver','generate']].map(([id,object,consumer,producer])=>({...meta(id),type:'DATA_USE',object,consumer,producer,origin:producer?'INTERNAL':'EXTERNAL',availability:'AT_USE'})),
   {...meta('duration'),type:'DURATION',lower:'0',upper:'20',lower_inclusive:false,upper_inclusive:true,unit:'minute'},
   {...meta('completion'),type:'COMPLETION',condition:{all:[{state:'passed'},{completed:'deliver'}]}},
  ],gaps:[]};
}
