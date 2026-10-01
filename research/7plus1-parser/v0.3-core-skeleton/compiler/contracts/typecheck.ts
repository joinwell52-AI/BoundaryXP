import type {DecodedRelation,ProofNode} from './core.js';
import {makeContract,serialize} from './schema.mjs';
const proof:ProofNode={kind:'SOURCE_SPAN',id:'proof-1',source_span_id:'span-1'};
serialize('ProofNode',proof);
makeContract('EvidenceTier','HARD');
// @ts-expect-error Finite evidence tier; scores cannot replace the tier.
makeContract('EvidenceTier',0.99);
// @ts-expect-error Proof node discriminant requires its own typed reference.
const illegalProof:ProofNode={kind:'SOURCE_SPAN',id:'bad',semantic_node_id:'node-1'};
// @ts-expect-error Relation vocabulary is closed.
const illegalRelation:DecodedRelation['relation_type']='TASK_INPUT';
void illegalProof;void illegalRelation;
