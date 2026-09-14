import unittest

from admin_compute import compute
from source_constraints import analyze_source
from work_packages import partition


def fields(result, key):
    return [x['text']['zh-CN'] for x in result['projection']['fields'][key]]


class LongScope(unittest.TestCase):
    def test_named_work_packages_preserve_ids_and_actual_file_deficit(self):
        text = ('😀\n【阶段一：清洗（WP-OPS-07）】由数据员生成 normalized.json。\n'
                '【阶段二：入库（WP-OPS-08）】读取 reconciliation.csv。')
        result = compute(text)
        self.assertEqual([s['id'] for s in result['pipeline']['stages']], ['WP-OPS-07', 'WP-OPS-08'])
        finding = next(f for f in result['pipeline']['handover']['findings'] if f['code'] == 'io_handover_deficit')
        self.assertEqual(finding['missing_input'], 'reconciliation.csv')
        self.assertEqual(finding['to_stage'], 'WP-OPS-08')
        self.assertEqual(result['pipeline']['globalTopology']['edges'], [])
        for stage in result['pipeline']['stages']:
            s = stage['source']
            self.assertEqual(text.encode('utf-16-le')[2*s['start']:2*s['end']].decode('utf-16-le'), s['quote'])

    def test_named_headers_respect_scope_and_fences(self):
        text = '```md\n## WP-DATA-01\n```\n## WP-DATA-02 Build\n必须修改配置。\n## WP-DATA-03 Review\n不得修改配置。'
        result = compute(text)
        self.assertEqual([s['id'] for s in result['pipeline']['stages']], ['WP-DATA-02', 'WP-DATA-03'])
        self.assertFalse(any(e['findings'] for e in result['engines']))
        self.assertIsNone(partition('文件说明中引用 WP-DATA-01，不是标题。'))

    def test_named_identifiers_keep_duplicate_and_cross_scope_diagnostics(self):
        self.assertIn('duplicate_work_package_id', partition('## WP-OPS-01\nx\n## WP-OPS-01\ny')['issues'])
        result = compute('## WP-OPS-01\n待 WP-OPS-02 完成后必须修改配置。\n## WP-OPS-02\n不得修改配置。')
        self.assertEqual(result['pipeline']['stages'][0]['findings'][0]['code'], 'cross_wp_scope_unresolved')

    def test_reference_mentions_are_not_action_or_output_promises(self):
        for text in ['依照监管部门下发的《数据处理规范》，由审计员生成 report.json。',
                     '根据《生成与发送规范》，由审计员生成 report.json。',
                     'According to the Generate and Send Policy, Analyst creates report.json.']:
            r = analyze_source(text)
            self.assertEqual(len(r['projection']['contract']['actions']), 1)
            self.assertEqual([f['name'] for f in r['projection']['fileOutputs']], ['report.json'])
            self.assertTrue(fields(r, 'V'))

    def test_temporal_nouns_and_duty_words_are_not_calls_or_actor_suffixes(self):
        for text in ['在工艺执行过程中，打印计数。', '全流程执行中存在明确操作红线：严禁删除日志。']:
            actions = analyze_source(text)['projection']['contract']['actions']
            self.assertFalse(any(a['operation'] == 'call' for a in actions))
        for phrase in ['负责统筹执行', '主导处理', '负责处理']:
            r = analyze_source('由质检专员'+phrase+'质检作业。')
            self.assertEqual(fields(r, 'P'), ['质检专员（执行）'])

    def test_currency_prefix_is_exact_and_does_not_change_scale(self):
        r = analyze_source('单笔额度不得超过人民币 80000000 元；总处理耗时限制在 259200 秒（即三天整）以内。')
        self.assertEqual([(n['relation'], n['value'], n['unit']) for n in r['numbers']],
                         [('le', '80000000', 'CNY'), ('le', '259200', 'seconds')])
        self.assertFalse(fields(r, 'B'))
        r = analyze_source('额度至少 CNY 500 元；额度严格小于人民币 400 元。')
        self.assertEqual([n['relation'] for n in r['numbers']], ['ge', 'lt'])

    def test_currency_prefix_conflict_does_not_feed_wrong_quantity(self):
        for text in ['额度不超过人民币 500 USD。', '耗时不超过人民币 50 秒。']:
            r = analyze_source(text)
            self.assertEqual(r['numbers'], [])
            self.assertIn('currency_unit_conflict', [f['code'] for f in r['advice']])


if __name__ == '__main__':
    unittest.main()
