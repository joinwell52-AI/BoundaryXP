import {contractGates as baseGates} from '../v0.3-7p-composition-014/compiler/validation/gates.mjs';
import {localizeCoverage} from '../v0.3-7p-composition-014/coverage-locality.mjs';
import {localizeTypedUnresolved} from './anchor-contracts.mjs';
// Preserve all frozen contract checks. Recompute the authorized R2 locality
// contract over immutable input, replacing only the old G16 impact equation.
export function contractGates(c,options){
 const result=baseGates(c,options);if(!Array.isArray(c.coverage)||!c.boundary_ir?.facts)return result;
 const derived=structuredClone(c);localizeCoverage(derived);localizeTypedUnresolved(derived);
 const oldImpact=new Set(c.coverage.map(co=>'INVALID_SLOT_IMPACT '+co.coverage_record_id));
 const g=result.gates.G16;g.errors=g.errors.filter(e=>!oldImpact.has(e));
 for(let i=0;i<c.coverage.length;i++)if(JSON.stringify(c.coverage[i].affected_slots)!==JSON.stringify(derived.coverage[i].affected_slots)||c.coverage[i].impact_kind!==derived.coverage[i].impact_kind)g.errors.push('INVALID_SLOT_IMPACT '+c.coverage[i].coverage_record_id);
 g.status=g.errors.length?'FAIL':'PASS';result.status=Object.values(result.gates).every(g=>g.status==='PASS')?'PASS':'FAIL';return result;
}
