const id = { type: 'string', minLength: 1, maxLength: 128 };
const quote = { type: 'string', minLength: 1, maxLength: 100000 };
const logic = { $ref: '#/$defs/logic' };
const claim = { type: 'object', additionalProperties: false, required: ['expr','quote'], properties: { expr: logic, quote } };
export const decompositionToolSchema = {
  type: 'object', additionalProperties: false, required: ['input'],
  $defs: { logic: { oneOf: [id,
    { type:'object', additionalProperties:false, required:['all'], properties:{all:{type:'array',maxItems:64,items:logic}} },
    { type:'object', additionalProperties:false, required:['any'], properties:{any:{type:'array',maxItems:64,items:logic}} },
    { type:'object', additionalProperties:false, required:['not'], properties:{not:logic} },
  ] } },
  properties: { input: { type:'object', additionalProperties:false,
    required:['baseline_text','plan_text','variables','assumptions','requirements','tasks','completion'],
    properties: {
      baseline_text:quote, plan_text:quote,
      variables:{type:'array',maxItems:12,items:{type:'object',additionalProperties:false,required:['id','quote'],properties:{id,quote}}},
      assumptions:claim,
      requirements:{type:'array',minItems:1,maxItems:64,items:{type:'object',additionalProperties:false,required:['id','claim'],properties:{id,claim}}},
      tasks:{type:'array',minItems:1,maxItems:64,items:{type:'object',additionalProperties:false,required:['id','requires','ensures','covers','depends_on'],properties:{
        id,requires:claim,ensures:claim,covers:{type:'array',maxItems:64,uniqueItems:true,items:id},depends_on:{type:'array',maxItems:64,uniqueItems:true,items:id},
      }}},
      completion:claim,
    },
  } },
};
