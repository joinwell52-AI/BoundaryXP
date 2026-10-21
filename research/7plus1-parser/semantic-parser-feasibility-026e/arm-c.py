import os,sys,json,time,traceback,hashlib
from pathlib import Path
ROOT=Path(__file__).resolve().parents[3]
OUT=ROOT/'docs/reports/7plus1/7P-SEMANTIC-PARSER-FEASIBILITY-026E'
EXPERIMENT=ROOT/'.boundx/experiments/026e'
sys.path.insert(0,str(EXPERIMENT/'deps'))
os.environ['HANLP_HOME']=str(EXPERIMENT/'hanlp-cache')
os.environ['HF_HOME']=str(EXPERIMENT/'hf-cache')
os.environ['HF_HUB_DISABLE_XET']='1'
def save(path,x):
    path.parent.mkdir(parents=True,exist_ok=True)
    with path.open('x',encoding='utf8') as f:json.dump(x,f,ensure_ascii=False,indent=2,default=str)
started=time.perf_counter();rows=[];receipt={}
try:
    import torch,hanlp
    torch.set_num_threads(4)
    # Official pretrained PERIN dataloader contains serialized vocab objects.
    # PyTorch 2.6 changed the default. This is process-local loader compatibility,
    # not any model-byte/model-output change. Never modifies active worker.
    load=torch.load
    def trusted_official_load(*args,**kwargs):
        kwargs.setdefault('weights_only',False)
        return load(*args,**kwargs)
    torch.load=trusted_official_load
    receipt={'torch':torch.__version__,'hanlp':hanlp.__version__,'device':'cpu','threads':4,'compatibility':['Official PERIN pickle loader: explicit weights_only=False in isolated process'],'production_registry_changed':False}
    downloaded=json.loads((OUT/'MODEL-DOWNLOAD.json').read_text(encoding='utf8'))
    if downloaded['status']!='DOWNLOADED':raise RuntimeError('MODEL_DOWNLOAD_NOT_COMPLETE')
    config=Path(downloaded['configs'][0]);model_dir=config.parent
    print(json.dumps({'stage':'LOADING','config':str(config)}),flush=True)
    parser=hanlp.load(str(model_dir),devices=-1)
    receipt.update({'loaded':True,'class':str(type(parser)),'config':dict(parser.config),'parameters':sum(p.numel() for p in parser.model.parameters()),'load_seconds':time.perf_counter()-started})
    save(OUT/'C-MODEL-LOAD.json',receipt)
    corpus=json.loads((OUT/'CORPUS-SELECTION.json').read_text(encoding='utf8'))
    for index,row in enumerate(corpus['cases']):
        signals=json.loads((OUT/'arm-B'/row['id']/'signals.json').read_text(encoding='utf8'))
        sentences=[];begin=time.perf_counter()
        for clause in signals['clauses']:
            if not any('\u4e00'<=c<='\u9fff' for c in clause['span']['quote']):
                sentences.append({'clause_id':clause['id'],'source_span':clause['span'],'status':'UNSUPPORTED_LANGUAGE','reason':'Frozen selected model is Chinese-only; English not scored as Chinese success.'});continue
            tokens=[t['text'] for t in clause['tokens']]
            request={'tokens':tokens,'framework':'amr','language':'zho','whole_sentence':True,'source_span':clause['span'],'token_source_spans':[t['span'] for t in clause['tokens']]}
            try:
                graph=parser(tokens,framework='amr',language='zho',output_amr=False)
                sentences.append({'clause_id':clause['id'],'status':'GRAPH_SAVED','request':request,'raw_graph':graph})
            except Exception as e:sentences.append({'clause_id':clause['id'],'status':'ERROR','request':request,'error':repr(e),'stack':traceback.format_exc()})
        result={'id':row['id'],'source_sha256':row['source_sha256'],'model':'MRP2020_AMR_ZHO_MENGZI_BASE','seconds':time.perf_counter()-begin,'sentences':sentences}
        save(OUT/'arm-C'/row['id']/'raw.json',result)
        graphs=sum(s['status']=='GRAPH_SAVED' for s in sentences)
        rows.append({'id':row['id'],'raw':str((OUT/'arm-C'/row['id']/'raw.json').relative_to(ROOT)).replace('\\','/'),'graphs':graphs,'sentences':len(sentences),'errors':sum(s['status']=='ERROR' for s in sentences),'unsupported_language':sum(s['status']=='UNSUPPORTED_LANGUAGE' for s in sentences)})
        print(json.dumps({'done':index+1,'id':row['id'],'graphs':graphs,'seconds':result['seconds']}),flush=True)
except Exception as e:
    receipt.update({'loaded':False,'error':repr(e),'stack':traceback.format_exc(),'seconds':time.perf_counter()-started})
    save(OUT/'C-MODEL-FAILURE.json',receipt)
    print(json.dumps({'stage':'FAILED','error':repr(e)}),flush=True)
finally:
    save(OUT/'ARM-C-SEMANTIC-GRAPH.json',{'arm':'C','research_only':True,'status':'RUN' if rows else 'NOT_RUN','rows':rows,'model_receipt':receipt,'seconds':time.perf_counter()-started})
