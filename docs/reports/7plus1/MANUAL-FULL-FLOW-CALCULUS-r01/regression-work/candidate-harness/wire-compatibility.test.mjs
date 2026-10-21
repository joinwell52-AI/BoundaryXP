import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const root=path.resolve(process.env.BOUNDARYXP_COMPACT_TEST_ROOT??'.boundx/compact-interface-ui17-work');
const wire=await import(pathToFileURL(path.join(root,'research/7plus1-parser/llm-first-028/compact-wire.mjs')).href);
for(const [kind,schema] of [['proposal',wire.wireProposalSchema],['audit',wire.wireAuditSchema]])test(kind+' outbound compatibility changes only unsupported uniqueItems',()=>{
 const before=JSON.stringify(schema),delivery=wire.codexWireOutputSchema(schema),expected=structuredClone(schema);
 delete expected.$defs.sourceRefs.uniqueItems;
 assert.deepEqual(delivery.schema,expected);assert.equal(JSON.stringify(schema),before);
 assert.equal(schema.$defs.sourceRefs.uniqueItems,true);
 assert.notEqual(delivery.local_schema_sha256,delivery.output_schema_sha256);
 assert.deepEqual(delivery.adjustments,[{path:'/$defs/sourceRefs/uniqueItems',keyword:'uniqueItems',value:true,enforced_by:'FULL_LOCAL_WIRE_SCHEMA'}]);
});
test('No compatibility defaults or semantic fields are added',()=>{
 const s={type:'object',properties:{modality:{enum:['REQUIRED','FORBIDDEN']}},required:['modality'],additionalProperties:false};
 const d=wire.codexWireOutputSchema(s);assert.deepEqual(d.schema,s);assert.deepEqual(d.adjustments,[]);
 assert.equal(d.local_schema_sha256,d.output_schema_sha256);
});
