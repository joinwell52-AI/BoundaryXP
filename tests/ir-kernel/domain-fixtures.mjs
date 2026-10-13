import {fixture,entity,expr,variable,req,E,O,T,V} from './fixtures.mjs';
export function v2(){const i=fixture();i.contract_version='candidate-ir/2.0';i.root_task=T('task');i.sequences=[];return i;}
export const plan=events=>({events,completeness:{kind:'EXACT_SNAPSHOT',task_id:'task',basis:'EXPLICIT_TEST_PLAN_SNAPSHOT'}});
export function callsIR(){
 const i=v2();i.entities.push(entity('allowed','GROUP',[O('worker1'),O('worker2')]),entity('worker1','PERSON'),entity('worker2','PERSON'),entity('tool'));
 i.expressions.push(expr('events','TASK_EVENTS',[T('task')]),expr('op','OPERATION_OF',[V('e')]),expr('invoke','SYMBOL',[],'INVOKE'),expr('isInvoke','EQ',[E('op'),E('invoke')]),expr('targets','TARGETS_OF',[V('e')]),expr('isTool','MEMBER',[O('tool'),E('targets')]),expr('match','AND',[E('isInvoke'),E('isTool')]),expr('calls','SELECT_EVENTS',[E('events'),E('match')],null,null,V('e')),expr('count','COUNT_STARTED',[E('calls')]),expr('three','NUMBER',[],'3'),expr('budget','LTE',[E('count'),E('three')]),expr('actors','ACTORS_OF',[V('e')]),expr('workers','GROUP_MEMBERS',[O('allowed')]),expr('whitelist','SUBSET',[E('actors'),E('workers')]),expr('occurs','EVENT_OCCURRED',[V('e')]),expr('actorRule','IMPLIES',[E('occurs'),E('whitelist')]),expr('allActors','FORALL',[E('calls'),E('actorRule')],null,null,V('e')));
 i.variables.push(variable('e','EVENT',E('events'),'INSTANCE_LOCAL'));i.requirements.push(req('shared-budget',E('budget')),req('actor-boundary',E('allActors')));return i;
}
