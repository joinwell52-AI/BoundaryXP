const excerpt = { type: "string", minLength: 1, maxLength: 10000, description: "Exact excerpt occurring in the submitted source text; do not invent requirements." };
const shortText = { type: "string", minLength: 1, maxLength: 512 };
const boundaryDocumentSchema = { type: "object", additionalProperties: false, required: ["text", "parameters", "actions", "completion"], properties: {
  text: { type: "string", minLength: 1, maxLength: 100000 },
  parameters: { type: "object", additionalProperties: false, properties: Object.fromEntries(["I", "O", "A", "P", "R", "V", "C"].map(k => [k, excerpt])), description: "I inputs; O outputs; A actions; P responsibilities; R resources; V versions/sources; C completion/stop. Omit unknown mappings." },
  actions: { type: "array", maxItems: 128, items: { type: "object", additionalProperties: false, required: ["actor", "verb", "target", "quote"], properties: { actor: shortText, verb: shortText, target: shortText, quote: excerpt } } },
  completion: { type: "array", maxItems: 128, items: { type: "object", additionalProperties: false, required: ["id", "quote"], properties: { id: shortText, quote: excerpt } } },
} };
const boundaryPlanSchema = { type: "object", additionalProperties: false, required: ["document", "tasks"], properties: {
  document: boundaryDocumentSchema, tasks: { type: "array", maxItems: 64, items: { type: "object", additionalProperties: false, required: ["id", "document", "depends_on"], properties: {
    id: shortText, document: boundaryDocumentSchema, depends_on: { type: "array", maxItems: 64, items: shortText },
  } } },
} };
const boundaryReplySchema = { type: "object", additionalProperties: false, required: ["finding_id", "disposition", "reason", "references"], properties: {
  finding_id: shortText, disposition: { type: "string", enum: ["accepted", "partially_accepted", "not_accepted", "needs_admin"] },
  reason: { type: "string", minLength: 1, maxLength: 10000 }, references: { type: "array", minItems: 1, maxItems: 32, items: { type: "string", minLength: 1, maxLength: 2000 } },
} };
export { boundaryDocumentSchema, boundaryPlanSchema, boundaryReplySchema };
