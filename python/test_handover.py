import unittest
from admin_compute import compute

CASE='【阶段一/WP1：数据清洗】由数据分析员处理历史订单日志，清理异常字符，耗时不得超过 30 分钟，执行完毕后在控制台打印日志并输出处理行数计数。\n【阶段二/WP2：报表入库】读取清洗后的中间文件 `cleaned_orders.parquet` 并执行批量入库，操作限制在 15 分钟内完成，入库成功生成审计报告；全过程禁止直接写入主库生产表。'

class HandoverTests(unittest.TestCase):
    def test_exact_bracket_case(self):
        r=compute(CASE);p=r['pipeline']
        self.assertEqual([s['id'] for s in p['stages']],['WP1','WP2'])
        f=next(x for x in p['handover']['findings'] if x['code']=='io_handover_deficit')
        self.assertEqual(f['missing_input'],'cleaned_orders.parquet');self.assertIsNone(f['from_stage'])
        self.assertEqual(p['handover']['calculations'][0]['missing'],['cleaned_orders.parquet'])
        self.assertEqual(p['globalTopology']['edges'],[])
        self.assertTrue(p['globalConstraints'])
        self.assertIn('全过程禁止直接写入主库生产表',[s['quote'] for s in p['stages'][0]['result']['sourceAnalysis']['fields']['B']])
        self.assertEqual([s['result']['sourceAnalysis']['numbers'][0]['value'] for s in p['stages']],['1800','900'])
        inputs=p['stages'][0]['result']['sourceAnalysis']['projection']['fields']['I']
        self.assertEqual([v['text']['zh-CN'] for v in inputs],['历史订单日志'])

    def test_supplier_does_not_infer_dependency(self):
        text=CASE.replace('输出处理行数计数','输出处理行数计数，导出 cleaned_orders.parquet')
        io=compute(text)['pipeline']['handover']
        self.assertFalse(io['calculations'][0]['missing'])
        self.assertEqual(io['findings'][0]['code'],'io_dependency_unresolved')

    def test_external_input_and_name_variation(self):
        text='外部输入：cleaned_orders.parquet\n'+CASE
        self.assertFalse(compute(text)['pipeline']['handover']['findings'])
        renamed=CASE.replace('cleaned_orders.parquet','verified_stock.json')
        self.assertEqual(compute(renamed)['pipeline']['handover']['calculations'][0]['missing'],['verified_stock.json'])

    def test_english_headers_and_source_coordinates(self):
        text='😀\n## WP1 Prepare\nwrite count.log\n## WP2 Import\nread cleaned_orders.parquet'
        r=compute(text);self.assertEqual(r['pipeline']['handover']['findings'][0]['code'],'io_handover_deficit')
        def verify(x):
            if isinstance(x,list):
                for v in x:verify(v)
            elif isinstance(x,dict):
                if {'quote','start','end'}<=x.keys():self.assertEqual(text[x['start']:x['end']],x['quote'])
                for v in x.values():verify(v)
        verify(r)
