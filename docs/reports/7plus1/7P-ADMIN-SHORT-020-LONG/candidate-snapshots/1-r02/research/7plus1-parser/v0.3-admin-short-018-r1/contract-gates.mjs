import Ajv from 'ajv';
import {definitions as frozen} from '../v0.3-7p-composition-014/compiler/contracts/schema.mjs';
import {contractGates as frozenGates} from '../v0.3-7p-short-direct-016-r2/contract-gates.mjs';
import {relationTypeAudit} from './relations.mjs';
// A private schema instance extends only the already normative relation enum.
// No global schema, frozen validator or actual graph is mutated.
const definitions=structuredClone(frozen);definitions.RelationType.enum.push('PART_OF');
const validate=new Ajv({strict:false,allErrors:true}).compile({$ref:'#/$defs/CompilerExecutionContext',$defs:definitions});
export function contractGates(c,options){
 const valid=validate(c),errors=valid?[]:['INVALID_CANDIDATE_EXECUTION_CONTEXT'],signature=relationTypeAudit(c);
 if(signature.status!=='PASS')errors.push('ILLEGAL_CANDIDATE_RELATION_SIGNATURE');
 // Legacy validators recognize 19 enum values. This is a validation-only shape
 // adapter: PART_OF has the same endpoint/provenance schema as CONJUNCTION.
 // The actual PART_OF semantics are independently checked above and never
 // rewritten in source, BoundaryIR, canonical output or ProofDAG.
 const view=structuredClone(c);for(const r of view.relations)if(r.relation_type==='PART_OF')r.relation_type='CONJUNCTION';
 const result=frozenGates(view,options);result.gates.G17={status:errors.length?'FAIL':'PASS',errors,schema_errors:structuredClone(validate.errors??[]),relation_audit:signature,validation_adapter:'Only PART_OF enum normalized for frozen invariant validators; real candidate schema and type/provenance audit run first'};
 result.status=Object.values(result.gates).every(g=>g.status==='PASS')?'PASS':'FAIL';return result;
}
