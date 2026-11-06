"""Local document/integrity checks; not a BoundaryXP implementation or Gold test."""
from __future__ import annotations

import argparse
import hashlib
import json
import re
from pathlib import Path

HERE = Path(__file__).resolve().parent
VERSION = HERE.parent
ROOT = VERSION.parents[2]
BASELINE = HERE / "preservation-baseline.json"
SOURCE_PATHS = [
    "protocol/versions/0.4.0-draft.1/companion-r02/BXP-0001.md",
    "research/7plus1-compiler/design-baseline/v0.2/BOUNDX-7PLUS1-COMPILER-DESIGN-v0.2.zh-CN.md",
    "protocol/versions/0.4.0-draft.1/companion-r02/authority/BOUNDX-PASS8-CANONICAL-7PLUS1-PROJECTION-SPEC.md",
    "protocol/versions/0.4.0-draft.1/companion-r02/authority/ADMIN-DECISION-BXP-0.4-CORE-PROFILE-STATUS-FREEZE.md",
    "protocol/versions/0.4.0-draft.1/companion-r02/STATUS-REDUCTION-RULES.json",
    "protocol/versions/0.4.0-draft.1/companion-r02/BXP-0.4-COMPANION-ASSET-REPORT.md",
    "docs/SEMANTIC-PACK-SPEC.md",
    "docs/BXP-LOCAL-HOST-OPERATIONS.md",
    "docs/BXP-S01-S09-LOCAL-DELIVERY-RECEIPT.md",
    "docs/BoundaryXP-7plus1-定义原理语义编译与边界计算说明-v0.4.md",
]


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def write_json(path: Path, value: object) -> None:
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def protected_files() -> list[Path]:
    paths = set()
    for base in (ROOT / "protocol", ROOT / "docs/paper",
                 ROOT / "research/7plus1-compiler/design-baseline/v0.2"):
        for path in base.rglob("*"):
            if not path.is_file() or VERSION in path.parents:
                continue
            if path == ROOT / "protocol/README.md":
                continue  # The sole existing navigation file allowed to change.
            paths.add(path)
    return sorted(paths)


def capture() -> None:
    if BASELINE.exists():
        raise RuntimeError("Preservation baseline already exists; never overwrite it")
    files = {p.relative_to(ROOT).as_posix(): digest(p) for p in protected_files()}
    write_json(BASELINE, {"scope": "pre-edit old protocol assets, paper files and compiler design originals",
                          "mutable_existing_file": "protocol/README.md", "files": files})
    print(json.dumps({"baseline_files": len(files), "baseline": BASELINE.relative_to(ROOT).as_posix()}))


def finite_semantic_checks() -> list[str]:
    """Finite set witnesses for the new distinctions, not a product calculator."""
    observations = {(e, u) for e in (0, 1) for u in (0, 1)}
    parent = {(e, 0) for e in (0, 1)}
    # u=1 denotes a forbidden effect, e a committed external context.
    good_only = {(0, 0), (1, 0)}
    bad_only = {(0, 1), (1, 1)}
    mixed = set(observations)
    assert good_only and not good_only - parent
    assert mixed - parent and mixed & parent
    assert bad_only and not bad_only & parent
    empty = set()
    assert not empty and not empty - parent and not empty & parent
    omitted_environment = {(0, 0)}
    assert omitted_environment <= parent
    assert {e for e, _ in omitted_environment} != {0, 1}
    # A closed candidate omits the forbidden effect; an open one permits it.
    assert not good_only - parent and mixed - parent
    # An inactive private variable is harmless only if it does not leak into observation.
    private_values = (0, 1)
    assert {0 * private for private in private_values} == {0}
    assert {private for private in private_values} == {0, 1}
    # Query-level max definition excludes fake auxiliary-variable counterexamples.
    legal = {(t, z) for t in range(-2, 3) for z in range(-2, 3)
             if z >= t and z >= 0 and (z == t or z == 0)}
    assert all(sum(1 for t0, z in legal if t0 == t) == 1 for t in range(-2, 3))
    assert not {(t, z) for t, z in legal if not z >= 0}
    assert (0, -1) not in legal
    assert {t for t, z in legal if not z <= 1} == {2}
    return ["preserved", "not_guaranteed", "necessarily_violating",
            "empty_candidate_not_vacuous_pass", "environment_coverage_not_subset_only",
            "open_closed_silence_difference", "inactive_variable_observation_noninterference",
            "query_level_auxiliary_definitions"]


def checks() -> dict:
    baseline = json.loads(BASELINE.read_text(encoding="utf-8"))
    changes = [name for name, expected in baseline["files"].items()
               if not (ROOT / name).is_file() or digest(ROOT / name) != expected]
    assert not changes, f"Protected bytes changed: {changes[:8]}"
    old_sets = set(baseline["files"])
    new_sets = {p.relative_to(ROOT).as_posix() for p in protected_files()}
    assert old_sets == new_sets, "Protected file inventory changed"

    english = (VERSION / "BXP-0001.md").read_text(encoding="utf-8")
    chinese = (VERSION / "BXP-0001.zh-CN.md").read_text(encoding="utf-8")
    math_blocks = lambda text: re.findall(r"```math\n(.*?)\n```", text, re.S)
    assert math_blocks(english) == math_blocks(chinese), "Translated math differs"
    section_ids = lambda text: re.findall(r"^#{2,3} (\d+(?:\.\d+)?)\.", text, re.M)
    assert section_ids(english) == section_ids(chinese), "Translated section numbering differs"
    rules = lambda text: set(re.findall(r"\*\*(BXP-[A-Z]+-\d{3})\*\*", text))
    assert rules(english) == rules(chinese), "Translated requirement IDs differ"
    assert len(re.findall(r"\*\*(BXP-[A-Z]+-\d{3})\*\*", english)) == len(rules(english))
    assert "version: 0.4.0-draft.2" in english and "version: 0.4.0-draft.2" in chinese
    assert "normative_language: en" in english
    assert "translation_status: NON_NORMATIVE" in chinese

    core = json.loads((VERSION / "contracts/org.boundx.core-7plus1.json").read_text(encoding="utf-8"))
    prior = json.loads((ROOT / "protocol/versions/0.4.0-draft.1/companion-r02/profiles/org.boundx.core-7plus1.json").read_text(encoding="utf-8"))
    assert core["structural_elements"] == prior["structural_elements"]
    assert core["required_elements"] == [] and not core["admission_policy"]
    assert not core["CORE_V_REQUIRED_BY_DEFAULT"]
    assert set(core["required_rule_ids"]) <= rules(english)
    for slot, item in core["element_semantics"].items():
        assert item["meaning"] == prior["element_semantics_refs"][slot]["meaning_verbatim"]
        assert item["meaning"] in english
        assert item["name_zh"] in chinese
    family = json.loads((VERSION / "contracts/PROFILE-FAMILY.json").read_text(encoding="utf-8"))
    old_family = json.loads((ROOT / "protocol/versions/0.4.0-draft.1/companion-r02/profiles/PROFILE-FAMILY.json").read_text(encoding="utf-8"))
    assert [p["id"] for p in family["profiles"]] == [p["id"] for p in old_family["profiles"]]
    assert not family["aliases"] and not family["runtime_registered"]
    reducer = json.loads((VERSION / "contracts/STATUS-REDUCTION-RULES.json").read_text(encoding="utf-8"))
    assert [r["status"] for r in reducer["ordered_rules"]] == ["unresolved", "resolved", "absent"]
    assert reducer["source_coverage_is_separate"] and reducer["incomplete_accountability"]["status"] is None
    assert not reducer["empty_resolved_view_permitted"] and not reducer["synthesized_none_permitted"]
    source_lock = json.loads((HERE / "source-lock.json").read_text(encoding="utf-8"))
    assert set(source_lock["files"]) == set(SOURCE_PATHS)
    for name, expected in source_lock["files"].items():
        assert digest(ROOT / name) == expected, f"Development source changed: {name}"

    bad_links = []
    for path in [*VERSION.rglob("*.md"), ROOT / "protocol/README.md"]:
        text = path.read_text(encoding="utf-8")
        assert "\ufffd" not in text, f"Replacement character: {path}"
        assert len(re.findall(r"^```", text, re.M)) % 2 == 0, f"Unclosed fence: {path}"
        # The root README contains historical links; only the added latest-version links are ours.
        for target in re.findall(r"\]\(([^)]+)\)", text):
            if path == ROOT / "protocol/README.md" and "0.4.0-draft.2" not in target:
                continue
            target = target.split("#")[0]
            if not target or re.match(r"[A-Za-z]+:", target):
                continue
            if not (path.parent / target).resolve().exists():
                bad_links.append((path.name, target))
    assert not bad_links, f"Broken relative links: {bad_links}"
    for path in VERSION.rglob("*.json"):
        json.loads(path.read_text(encoding="utf-8"))
    return {"passed": True, "protected_files_unchanged": len(old_sets),
            "matching_math_blocks": len(math_blocks(english)),
            "matching_sections": len(section_ids(english)),
            "matching_normative_rule_ids": len(rules(english)),
            "semantic_definitions_unchanged": len(core["element_semantics"]),
            "development_source_files_pinned": len(SOURCE_PATHS),
            "finite_semantic_checks": finite_semantic_checks(),
            "scope": "document/contract consistency, finite mathematical illustrations and protected bytes; no product conformance or NLP accuracy claim"}


def seal() -> None:
    if not (HERE / "source-lock.json").exists():
        write_json(HERE / "source-lock.json", {"scope": "development inputs used by this revision",
                   "files": {name: digest(ROOT / name) for name in SOURCE_PATHS}})
    # Create only explicitly pending placeholders so first-pass link validation can run.
    for path in (HERE / "verification.json", VERSION / "MANIFEST.json"):
        if not path.exists():
            write_json(path, {"status": "PENDING_VERIFICATION"})
    report = checks()
    write_json(HERE / "verification.json", report)
    files = {p.relative_to(VERSION).as_posix(): digest(p)
             for p in sorted(VERSION.rglob("*"))
             if p.is_file() and p.name != "MANIFEST.json" and "__pycache__" not in p.parts}
    write_json(VERSION / "MANIFEST.json", {"protocol": "BXP-0001", "version": "0.4.0-draft.2",
               "status": "DRAFT_FOR_REVIEW", "scope": "protocol revision documents; no implementation conformance claim",
               "files": files})
    print(json.dumps({**report, "manifest_files": len(files)}, ensure_ascii=False))


def verify() -> None:
    report = checks()
    manifest = json.loads((VERSION / "MANIFEST.json").read_text(encoding="utf-8"))
    actual = {p.relative_to(VERSION).as_posix() for p in VERSION.rglob("*")
              if p.is_file() and p.name != "MANIFEST.json" and "__pycache__" not in p.parts}
    assert actual == set(manifest["files"]), "Revision inventory differs from manifest"
    for name, expected in manifest["files"].items():
        assert digest(VERSION / name) == expected, f"Manifest mismatch: {name}"
    print(json.dumps({**report, "manifest_files": len(actual)}, ensure_ascii=False))


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("action", choices=["capture", "seal", "verify"])
    args = parser.parse_args()
    {"capture": capture, "seal": seal, "verify": verify}[args.action]()
