import {makeContract} from './schema.mjs';
import type {Canonical7Plus1,CompilerExecutionContext,ProofNode,ConditionExprNode} from './core.js';
const p:ProofNode={kind:'ELIGIBILITY_DECISION',id:'p',eligibility_decision_id:'e'};
makeContract('ProofNode',p);
const e:ConditionExprNode={expr_id:'e',op:'NOT',operand_expr_id:'o',source_span_ids:['s'],relation_ids:[]};
makeContract('ConditionExprNode',e);
// @ts-expect-error anonymous expressions are forbidden
const anonymous:ConditionExprNode={op:'NOT',operand:{op:'STATE_REF',state_node_id:'s'}};
// @ts-expect-error semantic type cannot be a free relation type
makeContract('RelationType','TASK_INPUT');
// @ts-expect-error wrong proof reference kind
const wrong:ProofNode={kind:'ELIGIBILITY_DECISION',id:'p',node_id:'n'};
// @ts-expect-error Canonical7Plus1 cannot remain unknown
const unknownCanonical:Canonical7Plus1={entries:[]};
type TypedStructure=CompilerExecutionContext['structure'];
// @ts-expect-error Structure is a typed registry, not raw signals
const weakStructure:TypedStructure={nodes:[]};
