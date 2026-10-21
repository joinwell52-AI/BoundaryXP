"""Evidence-bounded state-effect checks for software/AI task language.

The adapter only normalizes effects whose identity is explicitly supported by
the source phrase.  A shared generic word such as "patch" remains unresolved.
It never treats an approval mention as a granted approval or returns a business
decision.
"""
import re
from itertools import product
import z3


def analyze(text, source):
    rules=[];calculations=[];findings=[]
    ban=re.search(
        r'未经(?P<approval>[^，,；;。]{1,60}?)(?:电子签名授权|签字确认|签字|授权|审批)'
        r'[^；;。]*?严禁(?P<ban_action>[^；;。]*?Root\s*权限[^；;。]*)', text, re.I)
    required=re.search(
        r'(?:但)?若(?P<event>[^，,；;。]+)[，,](?:必须|须)(?P<req_action>[^；;。]*?Root\s*权限[^；;。]*)',
        text, re.I)
    if ban and required:
        approval=ban['approval'].strip();event=required['event'].strip()
        ban_source=source(text,ban.start(),ban.end());required_source=source(text,required.start(),required.end())
        rules=[
            {'effect':'root_privilege_possession','modality':'FORBID','guard':{'op':'NOT_APPROVED','actor':approval},'source':ban_source},
            {'effect':'root_privilege_possession','modality':'REQUIRE','guard':{'op':'EVENT','name':event},'source':required_source},
        ]
        approved=z3.Bool('approved');trigger=z3.Bool('event');effect=z3.Bool('root_privilege_possession')
        formula=[z3.Implies(z3.Not(approved),z3.Not(effect)),z3.Implies(trigger,effect)]
        solver=z3.Solver();solver.set(timeout=250);solver.add(*formula,trigger,z3.Not(approved));state=solver.check()
        truth=[]
        for a,e in product([False,True],repeat=2):
            check=z3.Solver();check.set(timeout=250);check.add(*formula,approved==a,trigger==e)
            truth.append({'approval':a,'event':e,'satisfiable':check.check()==z3.sat})
        calc={'operation':'state_effect_guard_slice','effect':'root_privilege_possession',
              'constraints':[str(x) for x in formula],
              'slice':[{'name':'event','value':True},{'name':'approval','value':False}],
              'result':str(state),'truthTable':truth,'sources':[ban_source,required_source],
              'logicFragment':'quantifier-free propositional Boolean constraints','decision':None}
        calculations.append(calc)
        if state==z3.unsat:
            findings.append({'code':'guard_modal_conflict','severity':'conflict','sources':[ban_source,required_source],
                'title':{'zh-CN':'Root 权限状态的要求与禁止条件冲突','en':'Conflicting requirements for the Root-privilege state'},
                'scenario':{'zh-CN':event+'成立且未获'+approval+'授权时，同一 Root 权限状态既必须成立又必须不成立。',
                            'en':'When the event holds and '+approval+' has not approved, the same Root-privilege state is required both true and false.'},
                'suggestion':{'zh-CN':'请明确紧急状态下应等待授权、转人工，或引用一条已正式批准的紧急例外；界痕不自动新增豁免。',
                              'en':'Specify whether to wait for approval, escalate, or cite an approved emergency exception. BoundaryXP does not create an exemption.'},
                'assumption':{'zh-CN':'“授予 Root 权限”和“获取 Root 权限”按同一主体最终持有 Root 权限的状态归一。',
                              'en':'Granting and obtaining Root privilege are normalized to the same final possession state.'},
                'proof':calc,'decision':None})

    guarded_patch=re.search(r'未经[^；;。]+?严禁(?P<action>[^；;。]*补丁[^；;。]*)',text)
    required_patch=re.search(r'(?:但)?若[^，,；;。]+[，,](?:必须|须)(?P<action>[^；;。]*补丁[^；;。]*)',text)
    if guarded_patch and required_patch and not calculations:
        left=source(text,guarded_patch.start('action'),guarded_patch.end('action'))
        right=source(text,required_patch.start('action'),required_patch.end('action'))
        findings.append({'code':'effect_identity_unresolved','severity':'unresolved','sources':[left,right],
            'title':{'zh-CN':'两处“补丁”是否为同一执行效果尚未确定','en':'The two patch effects are not proven identical'},
            'scenario':{'zh-CN':'一处约束自定义系统提示词过滤补丁，另一处要求安全补丁；仅共享“补丁”一词不足以建立同一 SMT 变量。',
                        'en':'One clause constrains a custom system-prompt filter patch and the other requires a security patch; sharing “patch” is insufficient to create one SMT variable.'},
            'suggestion':{'zh-CN':'请为补丁指定相同或不同的制品 ID、目标实例和生效动作；确认同一效果后再做 SAT/UNSAT 求解。',
                          'en':'Assign artifact IDs, target instances and activation actions; run SAT/UNSAT only after effect identity is confirmed.'},
            'decision':None})
    return {'schema':'boundx-effect-constraints/v1','rules':rules,'calculations':calculations,'findings':findings,'decision':None}
