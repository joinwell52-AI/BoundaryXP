# L2 / L3 dictionaries: format, import and upgrades

[简体中文](DICTIONARIES.zh-CN.md) · [Installation](../INSTALL.md)

**MCP rc.10 / B-345**: the UI and MCP tools share one store and validator. rc.9 single-JSON dictionaries remain compatible, with existing IDs, versions, digests and history preserved.

## Layers

| Layer | Content | Authority |
|---|---|---|
| L2 industry | Actions, entities, roles, resources, references, completion and boundary-risk terminology | Does not invent task requirements or permission |
| L3 enterprise | Enterprise terms, objects and evidence-linked relationship facts; requires boundx.tenant_id | Names, job titles and reporting relationships grant no authority |

There is no active L1. Validation covers transport, manifests, identity, digests and limited entry structure, not semantic correctness or full semantic-schema conformance. Business decision and execution authorization remain null.

## Complete directory

Select the **version folder containing datapackage.json directly**, not one file or a parent folder containing several versions.

| L2: 8 JSON files + README | L3: 3 JSON files + README |
|---|---|
| datapackage.json | datapackage.json |
| actions.json | enterprise-ontology.json |
| entities.json | enterprise-facts.json |
| roles.json | README.md |
| resources.json | |
| references.json | |
| completions.json | |
| boundaries.json | |
| README.md | |

The descriptor uses $schema=urn:boundx:product:semantic-data-package:v1. Its name, version and boundx.layer identify the package. resources lists every other file, including README, with relative path, resource kind, encoding=utf-8, byte count and hash=sha256:digest. Payload packId/version must match. Recompute hashes and use a new version after editing.

Limits: 256 KiB per file, 1 MiB for the complete serialized transfer document and 200 custom packages per installation. Duplicate paths/JSON keys, traversal, missing resources, mixed layers and digest mismatches are rejected. Paths and URLs in data are never fetched or executed. Do not include credentials or sensitive customer data.

Complete importable examples:

- [L2 English](../examples/dictionary-directories/L2-en/) · [L2 中文](../examples/dictionary-directories/L2-zh-CN/)
- [L3 English](../examples/dictionary-directories/L3-en/) · [L3 中文](../examples/dictionary-directories/L3-zh-CN/)

The UI downloads a complete ZIP. Extract it and select its version folder.

## Five-step UI workflow

Open the URL from bx_workbench_open, then **Dictionary settings → Import semantic library**:

1. Select L2/L3.
2. Select the folder and inspect its files.
3. Validate; saving stays disabled until validation succeeds.
4. Enter a display name.
5. Save.

Then select the dictionary under **Installed dictionaries** and save the binding. Import alone does not select it. Names and selections survive refresh; model settings save independently. Binding changes create a new revision. Old results remain readable at their original revisions; no automatic model call or recalculation occurs.

## MCP tools

Ask any stdio host:

> Use BoundaryXP to retrieve the complete English L3 directory specification and example. Validate all supplied files, then import the same document using its returned sha256 with display_name “Enterprise terminology”. Return the ID without changing existing tasks.

Flow: bx_dictionary_format (language=en, layer=L3) → bx_dictionary_validate → bx_dictionary_import → bx_dictionaries_list → explicit bx_dictionaries_bind.

document is a **string encoding the complete transfer envelope**: schema=boundaryxp-dictionary-directory/1 and a files array. Each item has a relative path and full original content. For L3 include datapackage.json, enterprise-ontology.json, enterprise-facts.json and README.md. The format tool returns a complete valid example. A filesystem path alone is not accepted.

The host assembles only files it is authorized to read. Preserve original UTF-8 content; reformatting resource JSON invalidates its manifest digest. Validate, then import the same document with sha256 and optional display_name. Names are separate metadata and do not change content identity or binding digests.

Built-in resources: boundaryxp://dictionaries/en/guide, boundaryxp://dictionaries/schema and boundaryxp://dictionaries/en/L2/example, L3/example. Replace en with zh-CN for Chinese. No local development documentation is required.

## Legacy format and troubleshooting

rc.9 boundaryxp-custom-dictionary/1 remains importable over MCP: 256 KiB, 1–512 entries; required schema/id/layer/version/label/entries plus both null authority fields; L3 requires tenant. Each entry needs unique id, terms and definition. The four historical single-JSON examples remain under examples/dictionary-L2-en.json and corresponding variants. New UI imports use directories.

| Symptom | Resolution |
|---|---|
| DICTIONARY_DESCRIPTOR_REQUIRED | Select the folder directly containing datapackage.json |
| DICTIONARY_REQUIRED_RESOURCE | Include all layer resources and README |
| DICTIONARY_RESOURCE_DIGEST | Check encoding, line endings, bytes and hashes |
| DICTIONARY_LAYER_MISMATCH | Do not mix industry and enterprise resource kinds |
| DICTIONARY_VALIDATION_DIGEST_MISMATCH | Revalidate changed content |
| DICTIONARY_VERSION_CONFLICT | Retain the old package; import a new version |
| Imported dictionary is unused | Save an explicit selection or bind |
| Directory UI is missing | Check rc.10/B-345 capabilities; reconnect after active work ends |

Keep original installation and configuration paths during upgrades. A changed runtime digest requires copy migration as documented in the installation guide. Do not delete original data or force an update during active work. Old dictionaries, failures, reports and task revisions remain intact.
