import sys, json, time, os, contextlib
from pathlib import Path
ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(ROOT / 'scripts'))
os.environ.update(HF_HUB_OFFLINE='1', TRANSFORMERS_OFFLINE='1', HF_HUB_DISABLE_TELEMETRY='1', OMP_NUM_THREADS='4', MKL_NUM_THREADS='4')
os.environ['HANLP_HOME'] = str(ROOT / '.boundx/nlp-models/hanlp')
import socket
def offline(*args, **kwargs): raise RuntimeError('PARSER_OFFLINE_NETWORK_BLOCKED')
socket.socket.connect = offline
socket.create_connection = offline
MODELS = {}
def semantic(request):
    import importlib.util, torch
    from transformers import AutoTokenizer, AutoModel, AutoModelForSequenceClassification
    torch.set_num_threads(4)
    started = time.perf_counter(); loaded = 0
    resource = request['resource']
    if resource not in ('bge-m3','multilingual-e5-large','mdeberta-nli'): raise ValueError('MODEL_NOT_AUTHORIZED')
    if resource not in MODELS:
        choices = [p for p in (ROOT / '.boundx/semantic-models' / resource).iterdir() if p.is_dir() and (p/'MANIFEST.json').exists()]
        if len(choices) != 1: raise ValueError('MODEL_REVISION_NOT_UNIQUE')
        directory = choices[0]
        tokenizer = AutoTokenizer.from_pretrained(directory, local_files_only=True, trust_remote_code=False)
        cls = AutoModelForSequenceClassification if resource == 'mdeberta-nli' else AutoModel
        model = cls.from_pretrained(directory, local_files_only=True, trust_remote_code=False).eval()
        MODELS[resource] = (tokenizer, model, directory, {}); loaded = 1
    tokenizer, model, directory, cache = MODELS[resource]
    if request.get('warmup'): return {'model_load_count':loaded,'ms':(time.perf_counter()-started)*1000,'resource':resource,'loaded':True,'path':str(directory)}
    script = 'semantic-nli.py' if resource == 'mdeberta-nli' else 'semantic-retrieval.py'
    spec = importlib.util.spec_from_file_location('boundx_semantic', ROOT/'scripts'/script); module = importlib.util.module_from_spec(spec); spec.loader.exec_module(module)
    if resource == 'mdeberta-nli':
        from types import SimpleNamespace
        predictions, _, _ = module.infer_claims(request['claims'], SimpleNamespace(batch_size=4,max_length=512), directory, {'local_files_only':True}, torch, AutoTokenizer, AutoModelForSequenceClassification, tokenizer, model)
        result = {'predictions':predictions,'batches':(len(request['claims'])+3)//4}
    else:
        candidates = request['candidates']; queries = request['queries']
        accepted, excluded = module.eligible(candidates,'candidate',tokenizer,resource,512)
        qa, qe = module.eligible(queries,'query',tokenizer,resource,512)
        key = json.dumps(candidates,ensure_ascii=False,sort_keys=True)
        if not accepted or not qa: return {'retrieval':[],'excluded_queries':qe,'excluded_candidates':excluded,'batches':0,'model_load_count':loaded,'ms':(time.perf_counter()-started)*1000,'resource':resource,'loaded':True,'path':str(directory)}
        if key not in cache: cache[key] = module.embed(model,tokenizer,[v for _,v in accepted],4,torch,resource)
        vectors = module.embed(model,tokenizer,[v for _,v in qa],4,torch,resource)
        rows=[]
        for (query_index,_), vector in zip(qa,vectors):
            scores = (cache[key] @ vector).tolist()
            rows.append({'query_id':queries[query_index]['id'],'candidates':[{'candidate_id':candidates[accepted[i][0]]['id'],'score':scores[i]} for i in sorted(range(len(scores)),key=lambda i:(-scores[i],candidates[accepted[i][0]]['id']))[:3]]})
        result={'retrieval':rows,'excluded_queries':qe,'excluded_candidates':excluded,'batches':(len(qa)+3)//4}
    return {**result,'model_load_count':loaded,'ms':(time.perf_counter()-started)*1000,'resource':resource,'loaded':True,'path':str(directory)}
def analyze(request):
    import spacy
    started = time.perf_counter(); loaded = 0; output = []
    for language in dict.fromkeys(x['language'] for x in request['clauses']):
        name = 'zh_core_web_sm' if language == 'zh' else 'en_core_web_sm'
        if name not in MODELS:
            MODELS[name] = spacy.load(name); loaded += 1
        nlp = MODELS[name]
        subset = [x for x in request['clauses'] if x['language'] == language]
        docs = []
        for clause in subset:
            doc = nlp.make_doc(clause['text'])
            # Protection is applied before POS/dependency/NER, without rewriting text.
            spans = [doc.char_span(p['start'], p['end'], alignment_mode='strict') for p in clause['protected']]
            with doc.retokenize() as retokenizer:
                for span in spacy.util.filter_spans([s for s in spans if s is not None]): retokenizer.merge(span)
            docs.append(doc)
        for clause, doc in zip(subset, nlp.pipe(docs, batch_size=32)):
            output.append({'id': clause['id'], 'model': name, 'tokens': [{'text': t.text, 'start': t.idx, 'end': t.idx + len(t.text), 'pos': t.pos_, 'dep': t.dep_, 'head': t.head.i, 'lemma': t.lemma_} for t in doc], 'entities': [{'text': e.text, 'start': e.start_char, 'end': e.end_char, 'label': e.label_} for e in doc.ents]})
    chinese = [c for c in request['clauses'] if c['language'] == 'zh']
    if chinese:
        import hanlp
        from nlp_model_specs import verify_hanlp_assets
        home = ROOT / '.boundx/nlp-models'
        if 'hanlp-zh' not in MODELS:
            os.environ['HANLP_HOME'] = str(home / 'hanlp')
            verify_hanlp_assets(home, 'zh')
            metadata = json.loads((home / 'hanlp-zh.json').read_text())
            MODELS['hanlp-zh'] = hanlp.load(metadata['model']); loaded += 1
        model = MODELS['hanlp-zh']
        protected = {c['text'][p['start']:p['end']] for c in chinese for p in c['protected']}
        for key, task in model.tasks.items():
            if key.startswith('tok/') and hasattr(task, 'dict_force'): task.dict_force = protected
        values = model([c['text'] for c in chinese], tasks=['pos/ctb','pos/pku','pos/863','dep','srl'])
        token_key = next(k for k in values if k == 'tok' or k.startswith('tok/'))
        for c, words, tags, deps in zip(chinese, values[token_key], values['pos/ctb'], values['dep']):
            cursor = 0; tokens = []
            for i,(word,tag,dep) in enumerate(zip(words,tags,deps)):
                start = c['text'].find(word,cursor)
                if start < 0: raise ValueError('HANLP_SOURCE_ALIGNMENT')
                cursor = start+len(word)
                tokens.append({'text':word,'start':start,'end':cursor,'pos':tag,'dep':dep[1],'head':dep[0]-1 if dep[0] else i,'lemma':word})
            target = next(o for o in output if o['id'] == c['id'])
            target['secondary_tokens'] = target['tokens']; target['tokens'] = tokens; target['model'] = 'hanlp-zh'
            index = chinese.index(c)
            target['pos_alternatives'] = {key: values[key][index] for key in ['pos/pku','pos/863'] if key in values}
            target['srl'] = values.get('srl', [None]*len(chinese))[index]
    return {'clauses': output, 'model_load_count': loaded, 'nlp_ms': (time.perf_counter()-started)*1000, 'models': list(MODELS)}
for line in sys.stdin:
    try:
        with contextlib.redirect_stdout(sys.stderr):
            request=json.loads(line)
            result = semantic(request) if request.get('resource') else analyze(request)
        print(json.dumps(result, ensure_ascii=False), flush=True)
    except Exception as error: print(json.dumps({'error': type(error).__name__ + ': ' + str(error)}), flush=True)
