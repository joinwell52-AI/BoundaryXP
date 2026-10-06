import contextlib
import hashlib
import json
import os
from pathlib import Path
import socket
import sys
import time
from nlp_model_cache import ModelCache
from nlp_model_specs import validate_nlp_metadata, verify_hanlp_assets, HANLP_ASSET_DIGESTS

ROOT = Path(__file__).resolve().parents[1]
HOME = ROOT / '.boundx' / 'nlp-models'
LIMITS = json.loads((ROOT / 'src/product/nlp-limits.json').read_text(encoding='utf-8'))
MAX_SOURCE_CODEPOINTS = LIMITS['max_source_codepoints']
os.environ.update(HANLP_HOME=str(HOME / 'hanlp'), HF_HOME=str(HOME / 'huggingface'),
                  HF_HUB_OFFLINE='1', TRANSFORMERS_OFFLINE='1', HF_HUB_DISABLE_TELEMETRY='1')


def block_network(*args, **kwargs):
    raise RuntimeError('NLP_OFFLINE_NETWORK_BLOCKED')


socket.socket.connect = block_network
socket.socket.connect_ex = block_network
socket.create_connection = block_network
CACHE = ModelCache(LIMITS['max_loaded_models'])


def analyze(value):
    engine, language, text = value['engine'], value['language'], value['text']
    if engine not in ('spacy', 'hanlp') or language not in ('zh', 'en'):
        raise ValueError('NLP_CONFIG')
    if not isinstance(text, str) or not text.strip() or len(text) > MAX_SOURCE_CODEPOINTS:
        raise ValueError('NLP_TEXT_LIMIT')
    metadata_bytes = (HOME / f'{engine}-{language}.json').read_bytes()
    metadata = json.loads(metadata_bytes)
    validate_nlp_metadata(metadata, engine, language)
    metadata_digest = hashlib.sha256(metadata_bytes).hexdigest()
    started = time.perf_counter()
    key = (engine, language, metadata_digest)
    pipeline = CACHE.get(key)
    cached = pipeline is not None
    entities = []
    if engine == 'spacy':
        import spacy
        if pipeline is None:
            pipeline = spacy.load(metadata['model'])
            CACHE.put(key, pipeline)
        loaded = time.perf_counter()
        document = pipeline(text)
        entities = [{'text': entity.text, 'start': entity.start_char,
                     'end': entity.end_char, 'label': entity.label_}
                    for entity in document.ents]
        tokens = [{'text': token.text, 'start': token.idx, 'end': token.idx + len(token.text),
                   'pos': token.pos_, 'dep': token.dep_, 'head': token.head.i, 'lemma': token.lemma_}
                  for token in document]
    else:
        import hanlp
        if pipeline is None:
            verify_hanlp_assets(HOME, language)
            pipeline = hanlp.load(metadata['model'])
            CACHE.put(key, pipeline)
        loaded = time.perf_counter()
        document = pipeline(text, tasks=['pos/ctb', 'dep'] if language == 'zh' else ['pos', 'dep'])
        token_key = next(key for key in document if key == 'tok' or key.startswith('tok/'))
        pos_key = next(key for key in document if key == 'pos' or key.startswith('pos/'))
        dep_key = next(key for key in document if key in ('dep', 'ud') or key.startswith('dep/') or key.startswith('ud/'))
        words, tags, dependencies = document[token_key], document[pos_key], document[dep_key]
        if words and isinstance(words[0], str):
            words, tags, dependencies = [words], [tags], [dependencies]
        tokens, cursor = [], 0
        if not len(words) == len(tags) == len(dependencies):
            raise ValueError('NLP_SENTENCE_ALIGNMENT')
        for sentence, sentence_tags, sentence_dependencies in zip(words, tags, dependencies):
            if not len(sentence) == len(sentence_tags) == len(sentence_dependencies):
                raise ValueError('NLP_DEPENDENCY_ALIGNMENT')
            base = len(tokens)
            for index, (word, tag, dependency) in enumerate(zip(sentence, sentence_tags, sentence_dependencies)):
                start = text.find(word, cursor)
                if start < 0:
                    raise ValueError('NLP_TOKEN_ALIGNMENT')
                cursor = start + len(word)
                head, relation = dependency
                if not isinstance(head, int) or not 0 <= head <= len(sentence):
                    raise ValueError('NLP_DEPENDENCY_HEAD')
                tokens.append({'text': word, 'start': start, 'end': cursor, 'pos': tag,
                               'dep': relation, 'head': base + head - 1 if head else base + index})
    return {'engine': engine, 'language': language, 'model': metadata['model'], 'tokens': tokens,
            'entities': entities, 'ner_available': engine == 'spacy' and 'ner' in pipeline.pipe_names,
            'model_metadata_digest': metadata_digest, 'model_version': metadata.get('version'),
            'model_asset_digest': HANLP_ASSET_DIGESTS[language] if engine == 'hanlp' else metadata['sha256'],
            'model_license': metadata['license'],
            'cached': cached,
            'load_ms': (loaded - started) * 1000,
            'inference_ms': (time.perf_counter() - loaded) * 1000}


if __name__ == '__main__':
    for line in sys.stdin:
        try:
            if len(line) > 100000:
                raise ValueError('NLP_TEXT_LIMIT')
            value = json.loads(line)
            with contextlib.redirect_stdout(sys.stderr):
                result = analyze(value)
            print(json.dumps(result, ensure_ascii=False), flush=True)
        except Exception as error:
            print(json.dumps({'error': type(error).__name__ + ': ' + str(error)}, ensure_ascii=False), flush=True)
