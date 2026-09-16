"""Validated domain action frames for BoundX.

Layers extend lexical recognition only.  They reuse the existing action/role/fact
contract and cannot override evidence, unknown, authorization or 7+1 semantics.
"""
import json
import importlib.util
import re
from pathlib import Path

_data_spec = importlib.util.spec_from_file_location('boundx_semantic_data', Path(__file__).with_name('semantic_data.py'))
_data = importlib.util.module_from_spec(_data_spec)
_data_spec.loader.exec_module(_data)

DOMAIN_ROOT = Path(__file__).parents[1] / "domain-packs"
PACK_REGISTRY = {
    "software-ai": DOMAIN_ROOT / "l2" / "software-ai",
}
CORE = _data.load_legacy_lexicon()
ROLE_BY_OPERATION = {
    operation: definition["role"] for operation, definition in CORE["operations"].items()
}
CORE_ENTITY_TYPES = set(CORE["pack"]["entityMetaTypes"])
ID = re.compile(r"^[a-z][a-z0-9-]*\.[a-z][a-z0-9_]*$")
VERSION = re.compile(r"^[0-9]+\.[0-9]+\.[0-9]+$")


def _read(root, name):
    return json.loads((root / name).read_text(encoding="utf-8"))


def _normalized(value):
    return value.casefold().strip()


def load_pack(pack_id="software-ai"):
    """Explicitly load one registered pack; directories are never auto-scanned."""
    if pack_id not in PACK_REGISTRY:
        raise ValueError("Unregistered domain pack: " + str(pack_id))
    root = PACK_REGISTRY[pack_id]
    manifest = _read(root, "manifest.json")
    actions = _read(root, "actions.json")
    entities = _read(root, "entities.json")
    roles = _read(root, "roles.json")
    resources = _read(root, "resources.json")
    references = _read(root, "references.json")
    completions = _read(root, "completions.json")
    boundaries = _read(root, "boundaries.json")
    if manifest.get("schema") != "boundx-domain-pack-manifest/v1":
        raise ValueError("Unsupported domain pack manifest")
    if manifest.get("layer") not in {"L2", "L3"}:
        raise ValueError("Only L2/L3 packs may use the domain adapter")
    if manifest.get("loadMode") != "explicit":
        raise ValueError("Domain packs must use explicit loading")
    if manifest.get("id") != pack_id:
        raise ValueError("Registry and manifest pack ID mismatch")
    target = manifest.get("normalizesTo", {})
    if target.get("packId") != CORE["pack"]["id"] or target.get("version") != CORE["pack"]["version"]:
        raise ValueError("Domain pack targets a different L1 core ontology")
    if target.get("contract") != CORE["pack"]["compatibility"]:
        raise ValueError("Domain pack semantic contract mismatch")
    if actions.get("schema") != "boundx-domain-actions/v1":
        raise ValueError("Unsupported domain action schema")
    if entities.get("schema") != "boundx-domain-entities/v1":
        raise ValueError("Unsupported domain entity schema")
    if roles.get("schema") != "boundx-domain-roles/v1":
        raise ValueError("Unsupported domain role schema")
    extra_documents = [
        (resources, "boundx-domain-resources/v1", "resources"),
        (references, "boundx-domain-references/v1", "references"),
        (completions, "boundx-domain-completions/v1", "completions"),
        (boundaries, "boundx-domain-boundaries/v1", "risks"),
    ]
    for document, schema, _ in extra_documents:
        if document.get("schema") != schema:
            raise ValueError("Unsupported 7+1 domain document: " + schema)
    identity = (manifest.get("id"), manifest.get("version"))
    if not identity[0] or not VERSION.fullmatch(identity[1] or ""):
        raise ValueError("Invalid domain pack identity")
    if (actions.get("packId"), actions.get("version")) != identity:
        raise ValueError("Action pack identity mismatch")
    if (entities.get("packId"), entities.get("version")) != identity:
        raise ValueError("Entity pack identity mismatch")
    if (roles.get("packId"), roles.get("version")) != identity:
        raise ValueError("Role pack identity mismatch")
    for document, _, _ in extra_documents:
        if (document.get("packId"), document.get("version")) != identity:
            raise ValueError("7+1 domain document identity mismatch")

    category_ids = {item["id"] for item in manifest.get("categories", [])}
    entity_items = entities.get("entities", [])
    entity_ids = {item.get("id") for item in entity_items}
    if len(entity_ids) != len(entity_items) or None in entity_ids:
        raise ValueError("Duplicate or missing entity ID")
    if any(item.get("coreType") not in CORE_ENTITY_TYPES for item in entity_items):
        raise ValueError("Unknown L1 entity metatype")
    role_items = roles.get("roles", [])
    role_ids = {item.get("id") for item in role_items}
    if len(role_ids) != len(role_items) or None in role_ids:
        raise ValueError("Duplicate or missing role ID")
    if any(item.get("coreType") != "actor" for item in role_items):
        raise ValueError("L2 role must normalize to the L1 actor metatype")
    if any(
        category not in category_ids
        for item in role_items for category in item.get("allowedCategories", [])
    ):
        raise ValueError("Unknown category in role contract")
    if any(item.get("authoritySemantics") != "candidate_only_policy_evidence_required" for item in role_items):
        raise ValueError("Role entry may not grant authority")

    required_invariants = {
        "source_evidence_required", "effect_not_inferred",
        "completion_not_inferred", "authorization_not_inferred",
    }
    if not required_invariants.issubset(set(actions.get("invariants", []))):
        raise ValueError("Required L0 invariants are missing")
    role_contracts = actions.get("roleContracts", {})
    projection_contracts = actions.get("projectionContracts", {})
    raw_frames = actions.get("frames", [])
    frame_ids = {item.get("id") for item in raw_frames}
    if len(frame_ids) != len(raw_frames) or None in frame_ids:
        raise ValueError("Duplicate or missing frame ID")
    frame_items = []
    trigger_frames = {}
    for raw in raw_frames:
        if not ID.fullmatch(raw["id"]):
            raise ValueError("Invalid frame ID: " + raw["id"])
        operation = raw.get("operation")
        if operation not in ROLE_BY_OPERATION:
            raise ValueError("Unknown operation: " + str(operation))
        role_contract = role_contracts.get(raw.get("roleContract"))
        projection_contract = projection_contracts.get(raw.get("projectionContract"))
        if not role_contract or role_contract.get("operation") != operation:
            raise ValueError("Role contract does not match operation")
        if not projection_contract or projection_contract.get("operation") != operation:
            raise ValueError("Projection contract does not match operation")
        primary = role_contract.get("primaryRole")
        if primary != ROLE_BY_OPERATION[operation]:
            raise ValueError("Primary role does not match existing L1 operation")
        if raw.get("category") not in category_ids:
            raise ValueError("Unknown frame category")
        if any(value not in entity_ids for value in raw.get("entityTypes", [])):
            raise ValueError("Unknown entity type in " + raw["id"])
        roles = [{"name": primary, "required": True, "entityTypes": raw["entityTypes"]}]
        for name in role_contract.get("optionalRoles", []):
            if name not in {"executor", "recipient"}:
                raise ValueError("Unknown optional role")
            roles.append({"name": name, "required": False, "entityTypes": ["actor"]})
        candidates = projection_contract.get("candidates", [])
        if not any(item.get("field") == "A" for item in candidates):
            raise ValueError("Every frame must retain an A projection")
        frame = {
            **raw,
            "primaryRole": primary,
            "roles": roles,
            "sevenPlusOneCandidates": candidates,
            "boundaries": sorted(required_invariants),
        }
        triggers = [
            value for lang in ("zh", "en")
            for value in frame.get("triggers", {}).get(lang, [])
        ]
        if not triggers or any(not isinstance(value, str) or not value.strip() for value in triggers):
            raise ValueError("Invalid triggers in " + frame["id"])
        for trigger in triggers:
            trigger_frames.setdefault(_normalized(trigger), []).append(frame)
        frame_items.append(frame)

    for document, _, collection in extra_documents:
        items = document.get(collection, [])
        ids = {item.get("id") for item in items}
        if len(ids) != len(items) or None in ids:
            raise ValueError("Duplicate or missing ID in " + collection)
    for risk in boundaries.get("risks", []):
        if risk.get("becomesBOnlyWhen") != "explicit_FORBID_or_effective_policy_binding":
            raise ValueError("Risk class may not become B by vocabulary alone")
        if risk.get("decision") is not None:
            raise ValueError("Risk class may not contain a business decision")
        if any(frame_id not in frame_ids for frame_id in risk.get("frameIds", [])):
            raise ValueError("Risk class references unknown frame")

    coverage = manifest.get("coverage", {})
    actual_coverage = {
        "actionFrames": len(frame_items),
        "entityTypes": len(entity_items),
        "roleTypes": len(role_items),
        "resourceMetrics": len(resources.get("resources", [])),
        "referenceTypes": len(references.get("references", [])),
        "completionFrames": len(completions.get("completions", [])),
        "riskClasses": len(boundaries.get("risks", [])),
    }
    if coverage != actual_coverage:
        raise ValueError("Manifest coverage counts are stale")

    allowed = {
        _normalized(item["trigger"]): set(item["frameIds"])
        for item in manifest.get("allowedAmbiguousTriggers", [])
    }
    for trigger, candidates in trigger_frames.items():
        ids = {item["id"] for item in candidates}
        if len(ids) > 1 and allowed.get(trigger) != ids:
            raise ValueError("Undeclared ambiguous trigger: " + trigger)
    for trigger, ids in allowed.items():
        actual = {item["id"] for item in trigger_frames.get(trigger, [])}
        if actual != ids:
            raise ValueError("Stale ambiguous trigger declaration: " + trigger)
    return {
        "manifest": manifest,
        "frames": tuple(frame_items),
        "entities": tuple(entity_items),
        "roles": tuple(role_items),
        "resources": tuple(resources.get("resources", [])),
        "references": tuple(references.get("references", [])),
        "completions": tuple(completions.get("completions", [])),
        "risks": tuple(boundaries.get("risks", [])),
        "triggerFrames": {key: tuple(value) for key, value in trigger_frames.items()},
    }


# The integration point names enabled packs explicitly.  Future L2/L3 adapters
# can use the same validator; loading every directory is deliberately forbidden.
PACK = load_pack("software-ai")
TRIGGER_FRAMES = PACK["triggerFrames"]
TRIGGERS = tuple(TRIGGER_FRAMES)


def entity_candidates(value, frame):
    """Return lexical type candidates restricted by the frame's role contract."""
    primary = frame["primaryRole"]
    allowed = next(
        (set(role["entityTypes"]) for role in frame["roles"] if role["name"] == primary),
        set(),
    )
    found = []
    for entity in PACK["entities"]:
        if entity["id"] not in allowed:
            continue
        hit = False
        for extension in entity.get("extensions", []):
            if re.search(re.escape(extension) + r"(?![A-Za-z0-9_])", value, re.I):
                hit = True
                break
        if not hit:
            for alias in entity.get("aliases", []):
                pattern = (r"\b" + re.escape(alias) + r"\b") if alias.isascii() else re.escape(alias)
                if re.search(pattern, value, re.I):
                    hit = True
                    break
        if hit:
            found.append(entity["id"])
    return tuple(sorted(found))


def executor_role_candidates(value, frame):
    """Return the most specific source-matched L2 role candidates."""
    matches = []
    for role in PACK["roles"]:
        if frame["category"] not in role.get("allowedCategories", []):
            continue
        for alias in role.get("aliases", []):
            pattern = (r"\b" + re.escape(alias) + r"\b") if alias.isascii() else re.escape(alias)
            if re.search(pattern, value, re.I):
                matches.append((len(alias), role["id"]))
    if not matches:
        return ()
    longest = max(length for length, _ in matches)
    return tuple(sorted({role_id for length, role_id in matches if length == longest}))


def lexical_candidates(value, collection):
    """Classify already evidence-bound text; never creates a 7+1 fact itself."""
    keys = {
        "resources": ("aliases",),
        "references": ("aliases",),
        "completions": ("assertions",),
    }
    if collection not in keys:
        raise ValueError("Unsupported lexical collection")
    matches = []
    for item in PACK[collection]:
        for key in keys[collection]:
            for alias in item.get(key, []):
                pattern = (r"\b" + re.escape(alias) + r"\b") if alias.isascii() else re.escape(alias)
                if re.search(pattern, value, re.I):
                    matches.append((len(alias), item["id"]))
    if not matches:
        return ()
    longest = max(length for length, _ in matches)
    return tuple(sorted({item_id for length, item_id in matches if length == longest}))


def frame_risk_candidates(frame_id):
    """Return risk classifications; these are never B without explicit policy."""
    return tuple(sorted(
        risk["id"] for risk in PACK["risks"] if frame_id in risk.get("frameIds", [])
    ))


def core_entity_candidates(entity_type_ids):
    """Normalize L2 entity candidates to the frozen L1 entity metatypes."""
    selected = set(entity_type_ids)
    return tuple(sorted({
        entity["coreType"] for entity in PACK["entities"] if entity["id"] in selected
    }))
