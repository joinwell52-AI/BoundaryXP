# L2/L3 dictionaries: directory profile and version compatibility

**Create new dictionaries as directory packages: package ID / version / descriptor and content files. Even one content file requires datapackage.json.** L2 identifies industry semantics; L3 identifies enterprise semantics. This workbench resource profile does not redefine the BXP Core protocol.

```text
l2/industry-id/version/
  datapackage.json
  actions.json
  entities.json
  roles.json
  resources.json
  references.json
  completions.json
  boundaries.json
  README.md

l3/enterprise-id/version/
  datapackage.json
  enterprise-ontology.json
  enterprise-facts.json
  README.md
```

L2 uses eight JSON files plus README. L3 uses three JSON files plus README. Keep both L3 ontology and facts files for a small dictionary; unused arrays may be empty. The ontology defines source-backed enterprise concepts and terminology. Facts retain subjects, source records, quotations and explicit relationships. Names, roles and organization positions do not grant authority.

The descriptor uses the project's `urn:boundx:product:semantic-data-package:v1` resource contract and binds name, layer, version, L3 tenant namespace, relative resource paths, types, UTF-8 encoding, exact byte lengths and SHA-256 hashes. Register README.md too. Keep payload identities and versions consistent. Changed bytes require updated hashes and a new version if that identity/version is already imported. Never put credentials, executable code or undeclared files in a dictionary package.

## Standard directory examples

- [L2: software-ai-example / 1.0.0](../examples/dictionary-directories/software-ai-example/1.0.0/) · [Descriptor](../examples/dictionary-directories/software-ai-example/1.0.0/datapackage.json)
- [L3: example-enterprise / 1.0.0](../examples/dictionary-directories/example-enterprise/1.0.0/) · [Descriptor](../examples/dictionary-directories/example-enterprise/1.0.0/datapackage.json)

These examples have separate example identities and fictional data. Dependency references bind resource identities; they do not activate a historical L1 layer or authorize execution. Format and digest checks do not certify semantic quality or full protocol conformance.

## Check implementation support

| Implementation | Import support |
|---|---|
| Port-58618 workbench B345 | Dictionary settings has Installed dictionaries and Import semantic library tabs. New imports follow type, complete folder, validation, name and save. Check the installed version |
| Published MCP 0.4.0-rc.9 | The single-JSON custom dictionary contract below. **This documentation update does not modify or release MCP code and does not add directory import to rc.9** |
| Older workbench rosters, employee-directory and single-JSON custom files | Historical / migration compatibility, not the primary new active L3 profile. Old versions and task bindings remain preserved |

In B345 Dictionary settings, open Import semantic library: (1) select L2 or L3; (2) select the complete version folder directly containing datapackage.json; (3) check requirements; (4) enter a name after validation passes; (5) save. The preview lists files without an editable JSON field. Download and extract the selected type's standard ZIP example if needed. A system resources.json is a valid resource but not a whole package. Then switch to Installed dictionaries, select the package and save the L2/L3 settings. Importing alone does not rebind the current task or rerun an existing result. Single JSON remains a released MCP interface and workbench storage compatibility format, not the new B345 page import format.

## MCP rc.9 single-JSON compatibility contract

The following documents the released interface. Do not submit an individual standard-directory resource to these single-JSON tools. Directory support must be explicitly implemented by the client; changing extensions, concatenating content or ignoring validation errors does not create compatibility.

Applies to MCP 0.4.0-rc.9. rc.8 has built-in dictionaries only and does not expose these import tools.

Upgrade directly from rc.8 without uninstalling, using the [rc.9 installer command](../INSTALL.md#updates) with `--migrate-data`. The old rc.8 manager expects exactly 18 tools and rejects a 21-tool package, so this transition cannot rely on that old automatic updater. The new probe checks the target package's declared tool names and supports installation and rollback. Finish active tasks and disconnect the relevant clients first; data is copied and the original directory is preserved.

UTF-8 JSON (BOM accepted), at most 256 KiB and 1–512 entries. Required: schema/id/layer/version/label/entries and both null authority fields; L3 also requires tenant. IDs use lowercase letters, digits, dots, underscores or hyphens; versions have three numeric parts. Each entry requires a unique id, terms array and definition. Duplicate JSON keys, unknown fields, size violations and changed content at the same identity/version are rejected; ambiguous names remain distinct candidates. Paths and URLs are data, never fetched. Validate first, then import with the returned sha256. Import does not select a dictionary or change tasks. Versions coexist; bind the returned custom/...@version identity. Dictionaries do not grant authority; do not include credentials or executable instructions.

## Format and examples

- [JSON Schema](../schemas/custom-dictionary.json)
- [L2 English](../examples/dictionary-L2-en.json) · [L2 Chinese](../examples/dictionary-L2-zh-CN.json)
- [L3 English](../examples/dictionary-L3-en.json) · [L3 Chinese](../examples/dictionary-L3-zh-CN.json)
- Optional entry fields: canonical, kind, environment, location, repository, directories, system, operation, department, job_title, manager_id, subject_type, role_ref, source. See the schema for types and limits. Unknown fields are rejected, not silently removed.
- Language examples use distinct package IDs and can coexist. A terms array may contain both languages; names are not automatically translated, merged or disambiguated.

## MCP workflow

1. Call bx_dictionary_format({language:"en",layer:"L3"}) for the complete schema, requirements and example without filesystem access.
2. Have your host read the UTF-8 JSON file you selected, then pass its complete text as document to bx_dictionary_validate. The server does not read arbitrary host paths.
3. When valid=true, call bx_dictionary_import with the same document and the returned sha256. Never invent a digest.
4. Use bx_dictionaries_list, then bind the returned pack_id using bx_dictionaries_bind with selection.l2 / selection.l3. One package per layer may be selected at a time.
5. Use the returned binding for a new task. Updating an existing task requires an explicit bx_project_update settings operation at its current revision. Import never edits tasks.

Prompt: “Show the dictionary format, validate my dictionary and explain errors or ambiguity warnings. If valid, import it without changing any task bindings.”

## Workbench

Click **L2/L3 字典 · Dictionaries**. Choose language/layer, download the schema or example, upload a JSON file or paste its text, validate, inspect errors and warnings, then confirm import. Select and save the desired version in the task's Model and dictionary settings. Managing dictionaries does not require a project.

## Preservation and troubleshooting

Records live in custom-dictionaries under the MCP data directory, not in package assets. Back up the full data directory; do not edit stored records manually. Identical reimports are idempotent. Changed content requires a new version; old versions and reports are retained. Copy migration retains these records. rc.8 cannot use custom dictionaries on rollback; the original pre-migration data remains available.

- INVALID_JSON / DUPLICATE_JSON_KEY: repair invalid JSON or duplicate keys.
- DICTIONARY_BYTE_LIMIT: maximum 256 KiB per pack; input is never truncated.
- errors.path: JSON Pointer locates the field. L3 requires tenant; every entry requires definition.
- AMBIGUOUS_TERM_RETAINED: matching candidates are retained, not silently resolved.
- DICTIONARY_VALIDATION_DIGEST_MISMATCH: validate again after editing.
- DICTIONARY_VERSION_CONFLICT: use a new version for changed content.
- CUSTOM_DICTIONARY_INTEGRITY_FAILED: stop and restore from a trusted backup, never bypass verification.

Maximum 200 saved custom package versions. No automatic deletion, overwrite, model invocation, URL fetch or business authorization. Selected dictionary content is supplied to your host LLM or optional model API during analysis; import itself does not send it to a model.
