import unittest
from admin_compute import compute
from work_packages import partition

class WorkPackageTests(unittest.TestCase):
    def findings(self,result):
        return [f for e in result['engines'] for f in e['findings']]

    def test_local_opposites_not_paired(self):
        r=compute('## WP1 准备\n必须修改配置。\n## WP2 验证\n不得修改配置。')
        self.assertEqual(len(r['pipeline']['stages']),2)
        self.assertFalse(self.findings(r))
        self.assertEqual(r['pipeline']['globalTopology']['edges'],[])
        self.assertFalse(r['pipeline']['globalTopology']['terminationProven'])

    def test_global_prohibition_inherited_and_original_offsets(self):
        text='😀 全局要求\n不得修改配置。\n## WP1 准备\n必须修改配置。\n## WP2 验证\n耗时不超过 30 分钟。'
        r=compute(text)
        self.assertTrue(any(f['code']=='modal_overlap' for f in self.findings(r)))
        def verify(x):
            if isinstance(x,list):
                for v in x:verify(v)
            if isinstance(x,dict):
                if {'quote','start','end'}<=x.keys():
                    self.assertEqual(text[x['start']:x['end']],x['quote'])
                for v in x.values():verify(v)
        verify(r)

    def test_explicit_global_label_is_not_lost(self):
        for label,ban,require in [('全局要求：','不得修改配置','必须修改配置'),('Global requirements: ','must not update settings','must update settings')]:
            r=compute(label+ban+'\n## WP1\n'+require)
            self.assertTrue(any(f['code']=='modal_overlap' for f in self.findings(r)))

    def test_unsupported_partition_does_not_flatten(self):
        for text,issue in [
            ('## WP1\n必须修改配置\n## WP1\n不得修改配置','duplicate_work_package_id'),
            ('## WP1\n必须修改配置\n### WP2\n不得修改配置','nested_work_package_scope'),
            ('## WP1\n必须修改配置\n## Other\n不得修改配置','ambiguous_non_wp_heading')]:
            r=compute(text);self.assertIn(issue,r['pipeline']['issues']);self.assertTrue(all(e['status']=='incomplete' and not e['scopes'] for e in r['engines']))

    def test_code_fence_and_english_headers(self):
        self.assertIsNone(partition('```md\n## WP1\n```'))
        r=compute('~~~md\n## WP9\n~~~\n## WP1 Build\nmust update settings\n## WP2 Review\nmust not update settings')
        self.assertEqual([s['id'] for s in r['pipeline']['stages']],['WP1','WP2'])

    def test_cross_wp_reference_does_not_become_unconditional(self):
        r=compute('## WP1\n待 WP2 完成后必须修改配置。\n## WP2\n不得修改配置。')
        self.assertIsNone(r['pipeline']['stages'][0]['result'])
        self.assertEqual(r['pipeline']['stages'][0]['status'],'incomplete')
        self.assertFalse(self.findings(r))

    def test_limits_and_flat_compatibility(self):
        r=compute('\n'.join('## WP'+str(i)+'\ntext' for i in range(1,14)))
        self.assertIn('work_package_limit',r['pipeline']['issues'])
        self.assertNotIn('pipeline',compute('耗时不超过 30 分钟'))
        self.assertTrue(self.findings(compute('必须修改配置；不得修改配置')))

if __name__=='__main__':unittest.main()
