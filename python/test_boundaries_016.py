"""Original text -> source-backed fields -> calculations, plus counterexamples."""
import json
import unittest
from pathlib import Path
from source_constraints import analyze_source
from admin_compute import compute

CASES=json.loads(Path(__file__).with_name('regression_cases_016.json').read_text(encoding='utf-8'))

class BoundaryRegressionTests(unittest.TestCase):
    def codes(self,r):return {f['code'] for f in r['advice']}
    def fields(self,r,k):return ' '.join(v['text']['zh-CN'] for v in r['projection']['fields'][k])
    def evidence(self,text,result):
        if isinstance(result,list):
            for x in result:self.evidence(text,x)
        elif isinstance(result,dict):
            if {'quote','start','end'}<=result.keys():
                self.assertEqual(text.encode('utf-16-le')[result['start']*2:result['end']*2].decode('utf-16-le'),result['quote'])
            for v in result.values():self.evidence(text,v)

    def test_independent_prohibitions_exact_and_domain_variants(self):
        for text in [CASES['prohibition'],CASES['prohibition'].replace('远程切断油路动力','删除历史记录').replace('扣减未授权押金','导出未授权资料'),
                     'Do not delete historical records, and must not export unauthorized data; total duration must not exceed 30 seconds.']:
            r=analyze_source(text)
            self.assertEqual(len(r['prohibitions']['records']),2)
            self.assertNotIn('guard_binding_unresolved',self.codes(r))
            self.assertTrue(self.fields(r,'B'));self.evidence(text,r)
            for v in r['projection']['fields']['A']:
                self.assertFalse(any(b['actionSource']['quote'].strip() in v['text']['zh-CN'] for b in r['prohibitions']['records']))
        r=analyze_source(CASES['prohibition'])
        self.assertIn('未授权押金',self.fields(r,'B'))
        self.assertEqual([n['value'] for n in r['numbers']],['1800','40'])
        self.assertIn('20 辆别克 GL8',self.fields(r,'I'));self.assertIn('提醒短信',self.fields(r,'O'))
        self.assertIn('转人工跟进',self.fields(r,'C'));self.assertIn('v2.4',self.fields(r,'V'))
        self.assertFalse(r['projection']['fields']['P'])

    def test_negated_mentions_and_numeric_limits_are_not_prohibition_actions(self):
        for text in ['并非禁止导出资料。耗时不得超过30秒。','It is not forbidden to export data; duration must not exceed 30 seconds.']:
            self.assertFalse(analyze_source(text)['prohibitions']['records'])
        text='未经采购经理 Buyer_Lead 签字前，严禁采购设备；严禁采购未授权材料。'
        r=analyze_source(text)
        self.assertIn('Buyer_Lead',self.fields(r,'P'));self.assertIn('未经',self.fields(r,'B'))
        self.assertEqual(len(r['prohibitions']['records']),2)

    def test_forbidden_file_does_not_supply_handover(self):
        r=compute('## WP1 Prepare\n禁止生成 data.csv\n## WP2 Import\n读取 data.csv')
        self.assertTrue(any(f['code']=='io_handover_deficit' for f in r['pipeline']['handover']['findings']))
        self.assertFalse(r['pipeline']['stages'][0]['result']['sourceAnalysis']['projection']['fileOutputs'])

    def test_deduction_original_and_changed_bounds(self):
        text=CASES['additional'][0];r=analyze_source(text)
        self.assertEqual([n['value'] for n in r['numbers']],['200','150','600'])
        f=next(f for f in r['advice'] if f['code']=='interval_empty')
        self.assertTrue(f['proof']['empty']);self.assertEqual(f['proof']['operands'][1]['relation'],'lt')
        self.assertIn('违章扣除',f['metric']);self.assertIn('200',f['scenario']['zh-CN']);self.assertIn('150',f['scenario']['zh-CN'])
        self.assertFalse(f['proof']['binding']['equivalenceProven'])
        self.assertIn('已还车订单',self.fields(r,'I'));self.assertIn('扣款结算流水',self.fields(r,'O'))
        self.assertNotIn('退款指令',self.fields(r,'O'))
        self.assertNotIn('interval_empty',self.codes(analyze_source(text.replace('200','100'))))
        self.assertIn('interval_empty',self.codes(analyze_source(text.replace('150','200'))))
        self.assertNotIn('interval_empty',self.codes(analyze_source(text.replace('严格小于 150','不超过 200'))))

    def test_amount_binding_does_not_combine_distinct_fees_units_or_contexts(self):
        base=CASES['additional'][0]
        for text in [base.replace('违章押金单笔扣除','清洁押金单笔扣除'),base.replace('150 元','150 USD'),
                     base.replace('违章押金单笔扣除','违章押金每次扣除'),base.replace('，但根据承租协议，','；另一个阶段，'),
                     '响应时长至少5秒，重试间隔上限小于3秒。']:
            self.assertNotIn('interval_empty',self.codes(analyze_source(text)))
        r=analyze_source('Per transaction late-fee deduction amount at least 200 USD, but per transaction late-fee deduction upper limit strictly less than 150 USD.')
        self.assertIn('interval_empty',self.codes(r))

    def test_sets_original_renamed_and_nonoverlap(self):
        for text in [CASES['additional'][1],CASES['additional'][1].replace('db-primary','cache-core'),
                     'Target node set includes `web-01`, `web-02` and `cache-core`; forbidden object list includes `cache-core` and `audit-root`.']:
            r=analyze_source(text);f=next(f for f in r['advice'] if f['code']=='target_forbidden_overlap')
            self.assertEqual(len(f['entities']),1);self.assertIsNone(f['proof']['authorized']);self.evidence(text,r)
            self.assertTrue(self.fields(r,'I'));self.assertTrue(self.fields(r,'B'))
        r=analyze_source(CASES['additional'][1])
        self.assertEqual(next(f for f in r['advice'] if f['code']=='target_forbidden_overlap')['entities'],['db-primary'])
        self.assertIn('2400',self.fields(r,'R'));self.assertIn('安装成功',self.fields(r,'O'))
        self.assertNotIn('重启',self.fields(r,'A'))
        self.assertNotIn('target_forbidden_overlap',self.codes(analyze_source(CASES['additional'][1].replace('`db-primary`','`other-node`',1))))

    def test_membership_guard_and_missing_false_branch(self):
        text=CASES['additional'][2];r=analyze_source(text)
        branch=r['membershipBranches'][0]
        self.assertEqual(branch['members'],['VIN-001','VIN-002','VIN-003']);self.assertEqual(len(branch['then']),2)
        f=next(f for f in r['advice'] if f['code']=='dangling_conditional_branch')
        self.assertEqual(f['proof']['coveredOutcomes'],[True]);self.assertFalse(f['proof']['terminationProven'])
        self.assertIn('Risk_Manager',self.fields(r,'P'));self.assertIn('未经',self.fields(r,'B'))
        # The introductory scan is unconditional; lock/alert consequences must
        # retain the membership guard even when more source actions are parsed.
        consequences=[v for v in r['projection']['fields']['A'] if '下发电子锁车' in v['text']['zh-CN'] or '生成红色警报' in v['text']['zh-CN']]
        self.assertTrue(consequences)
        self.assertTrue(all('若车辆属于' in v['text']['zh-CN'] for v in consequences))
        self.assertIn('红色警报',self.fields(r,'O'));self.assertIn('300',self.fields(r,'R'))
        revised=text.replace('生成红色警报；','生成红色警报；否则记录并跳过；')
        self.assertNotIn('dangling_conditional_branch',self.codes(analyze_source(revised)))
        english='If vehicle is in risk list [VIN-021, VIN-022], then send a lock instruction, and generate an alert; duration must not exceed 5 minutes.'
        self.assertIn('dangling_conditional_branch',self.codes(analyze_source(english)))

    def test_actuation_preserves_pending_event_not_positive_current(self):
        text=CASES['additional'][3];r=analyze_source(text)
        f=next(f for f in r['advice'] if f['code']=='modal_logical_conflict')
        self.assertEqual(f['proof']['guardOverlap'],'sat');self.assertEqual(f['proof']['jointActionConstraints'],'unsat')
        self.assertEqual(f['proof']['condition']['numeric'],{'relation':'gt','value':'85','unit':'celsius'})
        self.assertEqual(f['proof']['condition']['pendingEvent'],'电流尚未平稳归零')
        self.assertNotIn('120',json.dumps(f));self.assertTrue(f['proof']['witness']['hypothetical'])
        self.assertIn('当充电桩',self.fields(r,'A'))
        self.assertNotIn('modal_logical_conflict',self.codes(analyze_source(text.replace('供电总线接触器','备用总线接触器'))))

    def test_five_user_originals_without_invented_roles_or_synonyms(self):
        cases=CASES['userFive']
        r=analyze_source(cases[0]);self.assertFalse(r['projection']['fields']['P']);self.assertEqual(len(r['prohibitions']['records']),2)
        self.assertNotIn('调用短信网关上限',self.fields(r,'A'))
        self.assertIn('interval_empty',self.codes(analyze_source(cases[1])))
        r=analyze_source(cases[2]);self.assertIn('调度专员',self.fields(r,'P'));self.assertIn('10 台商务车',self.fields(r,'I'))
        self.assertIn('dependency_identity_unresolved',self.codes(r));self.assertNotIn('explicit_dependency_cycle',self.codes(r))
        self.assertNotIn('生成必须',self.fields(r,'O'))
        r=analyze_source(cases[3]);self.assertIn('guard_modal_conflict',self.codes(r));self.assertIn('异常账户',self.fields(r,'I'))
        self.assertNotIn('调用耗时',self.fields(r,'A'))
        r=compute(cases[4]);self.assertIn('io_handover_deficit',{f['code'] for f in r['pipeline']['handover']['findings']})
        self.assertNotIn('生成的结构化文件',self.fields(r['pipeline']['stages'][1]['result']['sourceAnalysis'],'O'))

    def test_all_originals_repeat_and_preserve_utf16(self):
        for text in [CASES['prohibition'],*CASES['additional'],*CASES['userFive']]:
            text='😀 '+text;r=compute(text)
            self.assertEqual(r,compute(text));self.evidence(text,r)
            self.assertIsNone(r['businessDecision'])

if __name__=='__main__':unittest.main()
