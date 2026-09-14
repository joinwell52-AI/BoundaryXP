import unittest
from source_constraints import analyze_source


def texts(result, key):
    return [v['text']['zh-CN'] for v in result['projection']['fields'][key]]


class RoleFragments(unittest.TestCase):
    def test_coordinated_predicate_is_not_an_input_object(self):
        r = analyze_source('该阶段必须读取、校验并加载 sample_audit.csv。')
        self.assertEqual(texts(r, 'I'), ['sample_audit.csv'])
        self.assertIn('coordinated_argument_unresolved', [u['reason'] for u in r['projection']['contract']['uncovered']])

    def test_completion_reference_is_not_an_assertion(self):
        for text in ['该阶段任务即为完成。', '本任务即为任务完成。', 'This task is completed.']:
            r = analyze_source(text)
            self.assertEqual(texts(r, 'C'), [])
            self.assertIn('completion_antecedent_unresolved', [f['code'] for f in r['advice']])
        self.assertIn('生成审计流水', texts(analyze_source('生成审计流水即为完成。'), 'C'))

    def test_recipient_without_payload_is_not_an_artifact(self):
        for text in ['推送到审计存储桶。', 'Send to Review Team.']:
            r = analyze_source(text)
            self.assertEqual(texts(r, 'O'), [])
        r = analyze_source('发送审计回执至审计员。')
        self.assertEqual(texts(r, 'O'), ['审计回执 → 审计员'])


if __name__ == '__main__':
    unittest.main()
