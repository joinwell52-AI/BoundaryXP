"""Software/AI domain pack validation and evidence-backed extraction."""
import unittest

from domain_action_frames import PACK, load_pack
from source_constraints import analyze_source


def projection(text):
    return analyze_source(text)["projection"]


def actions(text):
    return projection(text)["contract"]["actions"]


class DomainActionFrameTests(unittest.TestCase):
    def test_pack_identity_categories_and_declared_ambiguity(self):
        pack = load_pack()
        self.assertEqual(pack["manifest"]["id"], "software-ai")
        self.assertEqual(pack["manifest"]["version"], "0.1.0")
        self.assertEqual(pack["manifest"]["layer"], "L2")
        self.assertEqual(pack["manifest"]["loadMode"], "explicit")
        self.assertEqual(pack["manifest"]["normalizesTo"]["packId"], "core-ontology")
        self.assertEqual(
            {frame["category"] for frame in pack["frames"]},
            {
                "source-control", "analysis-planning", "code-change",
                "build-test", "release-deploy", "data-model",
                "agent-collaboration", "security-access",
            },
        )
        self.assertEqual(len(pack["frames"]), 107)
        self.assertEqual(len(pack["entities"]), 54)
        self.assertEqual(len(pack["roles"]), 22)
        self.assertEqual(len(pack["resources"]), 30)
        self.assertEqual(len(pack["references"]), 12)
        self.assertEqual(len(pack["completions"]), 10)
        self.assertEqual(len(pack["risks"]), 8)
        self.assertEqual(
            {frame["id"] for frame in pack["triggerFrames"]["review"]},
            {"analysis.review_design", "agent.review_delivery"},
        )

    def test_chinese_and_english_domain_actions_share_existing_operations(self):
        cases = [
            ("由 AI 工程师分析 requirements.md。", "analysis.analyze", "process", "target"),
            ("Engineer deploys payment-api to staging.", "release.deploy", "change", "target"),
            ("Developer refactors src/parser.py.", "code.refactor", "change", "target"),
            ("由 Release_Manager 打包 release.zip。", "release.package", "create", "artifact"),
        ]
        for text, frame_id, operation, role in cases:
            result = actions(text)
            self.assertEqual(len(result), 1, text)
            frame = result[0]
            self.assertEqual(frame["operation"], operation)
            self.assertEqual(frame["frame_id"], frame_id)
            self.assertEqual(frame["domain_pack"], "software-ai")
            self.assertEqual(frame["domain_pack_version"], "0.1.0")
            self.assertEqual(frame["rule"], "domain_action_frame/v1")
            self.assertIn(role, {item["name"] for item in frame["roles"]})

    def test_entity_types_are_candidates_not_new_business_facts(self):
        result = projection("由算法工程师训练 fraud-v2 模型。")
        frame = result["contract"]["actions"][0]
        self.assertEqual(frame["frame_id"], "model.train")
        self.assertEqual(frame["entity_type_candidates"], ["model"])
        self.assertEqual(frame["core_entity_type_candidates"], ["artifact"])
        self.assertEqual(frame["executor_role_candidates"], ["ml-engineer"])
        self.assertTrue(result["fields"]["I"])
        self.assertFalse(result["fields"]["O"])
        self.assertFalse(result["fields"]["C"])

    def test_explicit_artifact_can_project_but_typical_effect_cannot(self):
        packaged = projection("打包 release.zip。")
        self.assertEqual([item["name"] for item in packaged["fileOutputs"]], ["release.zip"])
        trained = projection("训练 fraud-v2 模型。")
        self.assertFalse(trained["fileOutputs"])
        self.assertFalse(trained["fields"]["O"])
        self.assertFalse(trained["fields"]["C"])

    def test_prohibition_remains_boundary_not_action_or_authorization(self):
        result = projection("未经 CTO 批准，禁止部署 payment-api。")
        self.assertFalse(result["contract"]["actions"])
        self.assertTrue(result["fields"]["B"])
        self.assertTrue(any(item["kind"] == "approval_actor" for item in result["fields"]["P"]))
        self.assertFalse(any(item["kind"] == "executor" for item in result["fields"]["P"]))

    def test_ambiguous_trigger_is_unresolved(self):
        for text in ["评审 proposal.md。", "Review proposal.md."]:
            result = projection(text)
            self.assertFalse(result["contract"]["actions"])
            unresolved = [
                item for item in result["contract"]["uncovered"]
                if item["reason"] == "domain_frame_ambiguous"
            ]
            self.assertEqual(len(unresolved), 1)
            self.assertEqual(unresolved[0]["packId"], "software-ai")
            self.assertEqual(
                set(unresolved[0]["candidateFrameIds"]),
                {"analysis.review_design", "agent.review_delivery"},
            )

    def test_missing_argument_and_unknown_fallback_stay_unresolved(self):
        missing = projection("执行测试。")
        self.assertFalse(missing["contract"]["actions"])
        self.assertTrue(any(
            item["reason"] == "role_or_scope_not_resolved"
            for item in missing["contract"]["uncovered"]
        ))
        unknown = projection("勘探月球背面。")
        self.assertFalse(unknown["contract"]["actions"])
        self.assertFalse(unknown["fields"]["A"])

    def test_full_seven_plus_one_inventory_has_non_inference_rules(self):
        pack = load_pack()
        self.assertTrue(all(
            item["evidenceRule"] == "explicit_metric_and_bound_required"
            for item in pack["resources"]
        ))
        self.assertTrue(all(
            item["validity"] == "mention_does_not_establish_authenticity_or_effective_status"
            for item in pack["references"]
        ))
        self.assertTrue(all(
            item["evidenceRule"] == "explicit_completion_binding_required"
            for item in pack["completions"]
        ))
        self.assertTrue(all(
            item["becomesBOnlyWhen"] == "explicit_FORBID_or_effective_policy_binding"
            and item["decision"] is None
            for item in pack["risks"]
        ))

    def test_r_v_c_terms_only_classify_existing_evidence(self):
        resource = projection("响应延迟不超过 200 ms。")
        self.assertIn("latency", {
            item["id"] for item in resource["contract"]["domainClassifications"]["resources"]
        })
        reference = projection("根据模型版本 model-v2，评估模型 fraud-v2。")
        self.assertIn("model-version", {
            item["id"] for item in reference["contract"]["domainClassifications"]["references"]
        })
        completion = projection("全部测试通过即为任务完成。")
        self.assertIn("tests-pass", {
            item["id"] for item in completion["contract"]["domainClassifications"]["completions"]
        })
        self.assertTrue(completion["fields"]["C"])
        self.assertIsNone(completion["contract"]["decision"])

    def test_risk_candidate_is_not_silently_projected_as_B(self):
        result = projection("由 SRE 部署 payment-api 到生产环境。")
        frame = result["contract"]["actions"][0]
        self.assertEqual(frame["frame_id"], "release.deploy")
        self.assertEqual(frame["risk_candidates"], ["production-change"])
        self.assertEqual(
            [item["id"] for item in result["contract"]["domainClassifications"]["risks"]],
            ["production-change"],
        )
        self.assertFalse(result["fields"]["B"])
        self.assertIsNone(result["contract"]["decision"])

    def test_expanded_software_ai_actions_are_source_bound(self):
        cases = [
            ("强制推送 main 分支。", "source.force_push", "destructive-source-change"),
            ("运行集成测试 payment-service。", "test.integration", None),
            ("部署模型 fraud-v2 到 staging。", "model.deploy", "model-production"),
            ("扫描依赖 package-lock.json。", "security.scan_dependency", None),
        ]
        for text, frame_id, risk in cases:
            frame = actions(text)[0]
            self.assertEqual(frame["frame_id"], frame_id, text)
            if risk:
                self.assertIn(risk, frame["risk_candidates"])
            else:
                self.assertFalse(frame["risk_candidates"])

    def test_domain_evidence_uses_codepoint_offsets(self):
        text = "😀 由工程师部署 payment-api。"
        frame = actions(text)[0]
        source = frame["source"]
        actual = text[source["start"]:source["end"]]
        self.assertEqual(actual, source["quote"])


if __name__ == "__main__":
    unittest.main()
