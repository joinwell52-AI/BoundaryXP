"""Document and finite-example verification; not a production evaluator."""
from __future__ import annotations
import argparse
import hashlib
import itertools
import json
import re
import zipfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
VERSION = HERE.parent
ROOT = VERSION.parents[2]
REVISION = "2026-10-27-r2"
BASELINE = HERE / "update-preservation.json"

def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

def dump(path, value):
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

def finite_checks():
    # Finite illustrative valuations; no product, Producer, or solver is invoked.
    bits = (False, True)
    model = {1}
    assert bool(model & {1}) and not bool(model & {2})
    x_models = ({0}, {1})
    assert all(x_models) and x_models[0] != x_models[1]
    resources = set(itertools.product(range(7), repeat=2))
    good = {(a,b) for a,b in resources if a+b <= 10}
    bad = resources - good
    assert (4,4) in good and (6,6) in bad and len(bad) == 3
    parent_environments = {"normal", "fault"}
    claimed_environments = {"normal"}
    assert not parent_environments <= claimed_environments
    assert {"normal"} <= claimed_environments
    raw = {(d,a) for d,a in itertools.product(bits, repeat=2) if d and not a}
    inherited = {(d,a) for d,a in raw if (not d or a)}
    conforming_raw = {(d,a) for d,a in raw if (not d or a)}
    assert raw and not conforming_raw and not inherited
    per_context = all(any(a == b for a in bits) for b in bits)
    fixed_advance_choice = any(all(a == b for b in bits) for a in bits)
    policies = list(itertools.product(bits, repeat=2))
    observe_first_policy = any(all(policy[int(b)] == b for b in bits) for policy in policies)
    assert per_context and not fixed_advance_choice and observe_first_policy
    partial = {"entries": [], "reduction": {"complete": False, "diagnostics": ["coverage gap"]}}
    assert "status" not in partial and partial["reduction"]["complete"] is False
    legal_aux = {(t,z) for t,z in itertools.product(range(-2,3), repeat=2)
                 if z >= t and z >= 0 and (z == t or z == 0)}
    assert all(sum(t0 == t for t0,z in legal_aux) == 1 for t in range(-2,3))
    assert not any(z < 0 for t,z in legal_aux) and (0,-1) not in legal_aux
    assert {t for t,z in legal_aux if z > 1} == {2}
    return {
        "groups": ["exact_query_identity", "SAT_not_boundary_equivalence",
                   "local_vs_joint_resource", "parent_environment_inclusion",
                   "approval_raw_vs_inherited", "per_context_vs_causal_strategy",
                   "partial_status_omission", "query_level_auxiliary_definition"],
        "resource_assignments": len(resources), "resource_conforming": len(good),
        "resource_violating": len(bad), "approval_raw_realizations": len(raw),
        "approval_inherited_realizations": len(inherited),
        "per_context_solution": per_context, "advance_choice_strategy": fixed_advance_choice,
        "observe_first_strategy": observe_first_policy
    }

def check(package=False):
    en = (VERSION / "BXP-0001.md").read_text(encoding="utf-8")
    zh = (VERSION / "BXP-0001.zh-CN.md").read_text(encoding="utf-8")
    original = (VERSION / "source-artifacts/BXP-0001-v0.4.0-draft.3.zh-CN.md").read_text(encoding="utf-8")
    ids = lambda t: re.findall(r"^\*\*(BXP-[A-Z]+-\d{3})\*\*", t, re.M)
    fence = chr(96) * 3
    formulas = lambda t: re.findall("^" + fence + r"math\n(.*?)\n" + fence, t, re.M | re.S)
    sections = lambda t: re.findall(r"^#{2,3} (\d+(?:\.\d+)?)\.", t, re.M)
    assert ids(en) == ids(zh) == ids(original)
    assert len(ids(en)) == len(set(ids(en))) == 40
    assert formulas(en) == formulas(zh) == formulas(original)
    assert sections(en) == sections(zh) == sections(original)
    middle = lambda t: t[t.index("## 2. "):t.index("## 14. ")]
    ending = lambda t: t[t.index("## 15. "):].strip()
    assert middle(zh) == middle(original), "Supplied Chinese semantics in sections 2-13 changed"
    assert ending(zh) == ending(original), "Supplied Chinese section 15 changed"
    for text in (en, zh):
        assert "version: 0.4.0-draft.2\n" in text
        assert "document_revision: " + REVISION in text
        assert "sync_status: SYNCHRONIZED" in text
        assert "version: 0.4.0-draft.3" not in text
    assert "translation_status: NON_NORMATIVE" in zh
    core = json.loads((VERSION / "contracts/org.boundx.core-7plus1.json").read_text(encoding="utf-8"))
    reducer = json.loads((VERSION / "contracts/STATUS-REDUCTION-RULES.json").read_text(encoding="utf-8"))
    family = json.loads((VERSION / "contracts/PROFILE-FAMILY.json").read_text(encoding="utf-8"))
    evaluation = json.loads((VERSION / "contracts/EVALUATION-ASSESSMENT-CONTRACT.json").read_text(encoding="utf-8"))
    assert core["required_elements"] == [] and not core["admission_policy"]
    assert core["partial_carrier"]["incomplete_reduction_view_status"] == "OMIT_FIELD"
    assert not core["partial_carrier"]["null_view_status_permitted"]
    incomplete = reducer["incomplete_accountability"]
    assert "status" not in incomplete and incomplete["view_status_encoding"] == "OMIT_FIELD"
    assert not incomplete["null_status_permitted"]
    assert [r["status"] for r in reducer["ordered_rules"]] == ["unresolved", "resolved", "absent"]
    for slot, item in core["element_semantics"].items():
        assert item["meaning"] in en and item["name_zh"] in zh
    for descriptor in (core, reducer, family, evaluation):
        assert descriptor["protocol_version"] == "0.4.0-draft.2"
        assert descriptor.get("document_revision", descriptor.get("revision")) == REVISION
        assert not descriptor["runtime_registered"]
    assert not evaluation["comparison"]["coverage_alone_proves_causal_strategy"]
    comparison = evaluation["comparison"]
    kinds = comparison["requirements_by_object_kind"]
    downstream = next(p for p in family["profiles"] if p["stage"] == "downstream-conformance")
    assert set(kinds) == set(downstream["comparison_object_kinds"])
    assert family["downstream_claim_scope"]["requirements_ref"] == "EVALUATION-ASSESSMENT-CONTRACT.json#/comparison"
    assert "downstream_claim_scope_requires" not in family
    assert not family["downstream_claim_scope"]["requirements_from_other_object_kinds_apply"]
    assert not comparison["requirements_from_other_object_kinds_apply"]
    assert set(comparison["common_requires"]) == {"object_kind", "observation_scope", "identity_mapping", "completeness_assumptions", "boundary_baseline"}
    assert set(kinds["concrete_realization"]["requires"]) == {"realization_facts", "observation_sufficiency"}
    assert set(kinds["partial_observations"]["requires"]) == {"observed_facts", "legal_completion_set", "supported_conclusion_scope"}
    conditional = comparison["conditional_requirements"]
    parent = conditional["parent_environment_binding"]
    causal = conditional["causal_strategy_evidence"]
    assert parent["applies_when"] == {"object_kind": "candidate_specification", "comparison_relationship_any_of": ["delegation", "refinement"]}
    assert parent["required_inclusion"] == "E_req subseteq E_adm"
    assert causal["applies_when"] == {"object_kind": "candidate_specification", "any_of": [{"claims_runtime_causal_realizability": True}, {"release_policy_requires_causal_realizability": True}]}
    assert causal["missing_evidence"]["blocks_release_when_policy_requires_causal_realizability"]
    assert {item["rule_id"] for item in conditional.values()} <= set(ids(en))
    normative_paragraphs = [p for p in en.split("\n\n") if not p.startswith("**Illustrative example (non-normative):**")]
    assert not re.search(r"\b(?:must|should)\b|\b(?:MUST|SHOULD) not\b", "\n\n".join(normative_paragraphs))
    assert "exact_query_inventory" in evaluation["mathematical_evaluation"]["inputs"]
    assert {"E", "Theta", "exact_query_inventory", "required_query_completion"} <= set(evaluation["identity"]["B_projection_binds"])
    assert set(core["required_rule_ids"] + evaluation["required_rule_ids"]) <= set(ids(en))

    baseline = json.loads(BASELINE.read_text(encoding="utf-8"))
    for item in baseline["provided_originals"]:
        assert sha(VERSION / item["file"]) == item["sha256"]
    protected_count = None
    archive_count = None
    prior_rule_count = None
    new_rule_count = None
    unchanged_view_count = None
    if not package:
        for name, expected in baseline["files"].items():
            assert (ROOT / name).is_file() and sha(ROOT / name) == expected, f"Protected bytes changed: {name}"
        protected_count = len(baseline["files"])
        archive = ROOT / baseline["archive"]
        actual_archive = {p.relative_to(archive).as_posix(): sha(p) for p in archive.rglob("*") if p.is_file()}
        assert actual_archive == baseline["archived_files"]
        archive_count = len(actual_archive)
        prior_en = (archive / "BXP-0001.md").read_text(encoding="utf-8")
        assert set(ids(prior_en)) < set(ids(en)) and len(ids(prior_en)) == 36
        assert set(ids(en)) - set(ids(prior_en)) == {"BXP-STA-003", "BXP-EVA-002", "BXP-CMP-004", "BXP-CMP-005"}
        prior_core = json.loads((archive / "contracts/org.boundx.core-7plus1.json").read_text(encoding="utf-8"))
        assert core["element_semantics"] == prior_core["element_semantics"]
        prior_rule_count = len(ids(prior_en))
        new_rule_count = len(set(ids(en)) - set(ids(prior_en)))
        unchanged_view_count = len(core["element_semantics"])
        lock = json.loads((HERE / "source-lock.json").read_text(encoding="utf-8"))
        for name, expected in lock["files"].items():
            assert sha(ROOT / name) == expected, f"Development source changed: {name}"

    broken = []
    external_links = set()
    for path in VERSION.rglob("*.md"):
        text = path.read_text(encoding="utf-8")
        assert "\ufffd" not in text
        assert len(re.findall("^" + fence, text, re.M)) % 2 == 0, path
        for target in re.findall(r"\]\(([^)]+)\)", text):
            target = target.split("#")[0]
            if not target or re.match(r"[A-Za-z]+:", target):
                continue
            resolved = (path.parent / target).resolve()
            if package and not resolved.is_relative_to(VERSION):
                external_links.add(target)
                continue
            if not resolved.exists():
                broken.append((path.relative_to(VERSION).as_posix(), target))
    assert not broken, f"Broken links: {broken}"
    for path in VERSION.rglob("*.json"):
        json.loads(path.read_text(encoding="utf-8"))
    return {
        "passed": True, "protocol_version": "0.4.0-draft.2", "document_revision": REVISION,
        "mode": "package" if package else "workspace",
        "matching_math_blocks": len(formulas(en)), "matching_sections": len(sections(en)),
        "matching_normative_rules": len(ids(en)),
        "prior_rule_count": prior_rule_count, "new_rule_count": new_rule_count,
        "source_chinese_sections_preserved": "2-13 and 15",
        "semantic_view_definitions_unchanged": unchanged_view_count,
        "historical_comparison": {
            "status": "NOT_RUN_REQUIRES_REPOSITORY" if package else "VERIFIED_THIS_RUN",
            "basis": "Not rerun: previous archive and protected workspace files are outside the package. Bundled verification.json is a recorded workspace run, not this run's evidence." if package else "Compared previous archive and protected workspace bytes against update-preservation.json during this run.",
            "archive": baseline["archive"]
        },
        "provided_originals_unchanged": len(baseline["provided_originals"]),
        "protected_files_unchanged": protected_count, "archived_previous_files": archive_count,
        "repository_links_outside_package": sorted(external_links),
        "finite_examples": finite_checks(),
        "scope": "document and finite-example checks; no product conformance or NLP accuracy claim"
    }

def inventory():
    return {p.relative_to(VERSION).as_posix(): sha(p) for p in sorted(VERSION.rglob("*"))
            if p.is_file() and p.name != "MANIFEST.json" and "__pycache__" not in p.parts}

def seal():
    report = check()
    dump(HERE / "verification.json", report)
    dump(VERSION / "MANIFEST.json", {"protocol": "BXP-0001", "version": "0.4.0-draft.2",
        "document_revision": REVISION, "status": "DRAFT_FOR_REVIEW",
        "english_chinese_sync": "SYNCHRONIZED", "files": inventory()})
    print(json.dumps(report, ensure_ascii=False))

def verify(package=False):
    report = check(package)
    manifest = json.loads((VERSION / "MANIFEST.json").read_text(encoding="utf-8"))
    assert inventory() == manifest["files"], "Current files differ from manifest"
    print(json.dumps({**report, "manifest_files": len(manifest["files"])}, ensure_ascii=False))
    return report

def bundle():
    verify()
    output = ROOT / "output/protocol/BXP-0001-0.4.0-draft.2.zip"
    assert output.resolve().is_relative_to(ROOT / "output/protocol")
    output.parent.mkdir(parents=True, exist_ok=True)
    members = [p for p in sorted(VERSION.rglob("*")) if p.is_file() and "__pycache__" not in p.parts]
    with zipfile.ZipFile(output, "w", compression=zipfile.ZIP_DEFLATED) as z:
        for path in members:
            item = zipfile.ZipInfo("BXP-0001-0.4.0-draft.2/" + path.relative_to(VERSION).as_posix(),
                                   date_time=(2026,10,27,0,0,0))
            item.compress_type = zipfile.ZIP_DEFLATED
            item.external_attr = 0o100644 << 16
            z.writestr(item, path.read_bytes())
    with zipfile.ZipFile(output) as z:
        assert z.testzip() is None
        for path in members:
            name = "BXP-0001-0.4.0-draft.2/" + path.relative_to(VERSION).as_posix()
            assert z.read(name) == path.read_bytes()
    print(json.dumps({"download": str(output), "entries": len(members), "sha256": sha(output)}, ensure_ascii=False))

if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("action", choices=["seal", "verify", "bundle"])
    p.add_argument("--package", action="store_true", help="Verify standalone package; skip repository preservation checks")
    a = p.parse_args()
    if a.action == "seal":
        assert not a.package
        seal()
    elif a.action == "bundle":
        assert not a.package
        bundle()
    else:
        verify(a.package)
