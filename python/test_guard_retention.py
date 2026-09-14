import unittest
from source_constraints import analyze_source


class GuardRetention(unittest.TestCase):
    def test_adjacent_operating_state_is_part_of_independent_prohibition(self):
        for condition, ban in [('在升降机处于上升状态时', '绝对禁止人员进入导轨下方'),
                               ('当仓门开启时', '严禁启动车辆'),
                               ('When the lift is moving', 'must not enter the shaft'),
                               ('While the door is open', 'do not start the motor')]:
            text = condition + ', ' + ban + '.'
            r = analyze_source(text)
            item = r['prohibitions']['records'][0]
            self.assertEqual(item['guardSource']['quote'], condition)
            self.assertEqual(item['source']['quote'], text[:-1])
            self.assertTrue(any(condition in x['text']['zh-CN'] for x in r['projection']['fields']['B']))
            self.assertIsNone(item['predicate'])

    def test_conjunction_is_retained_and_scope_does_not_cross_semicolon(self):
        text = '在未戴手环且未接地的情况下，严禁接触高压插头。'
        item = analyze_source(text)['prohibitions']['records'][0]
        self.assertEqual(item['guardSource']['quote'], '在未戴手环且未接地的情况下')
        self.assertNotIn('或', item['source']['quote'])
        for text in ['在升降机上升时；严禁进入危险区域。', 'When the lift is moving; do not enter the shaft.']:
            self.assertIsNone(analyze_source(text)['prohibitions']['records'][0]['guardSource'])


if __name__ == '__main__':
    unittest.main()
