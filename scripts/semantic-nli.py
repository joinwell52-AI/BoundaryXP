import argparse
import hashlib
import importlib.metadata
import json
import os
import platform
import re
import sys
import time
from pathlib import Path
from local_semantic_resource import verify_resource_files, verify_registered_resource_metadata


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_HOME = ROOT / '.boundx' / 'semantic-models'


def resolve_resource(home, resource, revision):
    resource_root = home / resource
    if revision:
        directory = resource_root / revision
    elif resource_root.is_dir():
        candidates = sorted(path for path in resource_root.iterdir() if path.is_dir() and not path.name.endswith('.partial'))
        if len(candidates) != 1:
            raise SystemExit('Specify --revision when the resource does not have exactly one complete local revision')
        directory = candidates[0]
    else:
        directory = resource_root
    try:
        manifest = json.loads((directory / 'MANIFEST.json').read_text(encoding='utf-8'))
    except (OSError, json.JSONDecodeError) as error:
        raise SystemExit(f'Local semantic resource manifest is unavailable: {error}')
    if manifest.get('resource_id') != resource or (revision and manifest.get('revision') != revision):
        raise SystemExit('Local semantic resource manifest does not match requested identity')
    try:
        verify_resource_files(directory, manifest)
        registry = json.loads((ROOT / 'scripts' / 'semantic-model-registry.json').read_text(encoding='utf-8'))
        verify_registered_resource_metadata(manifest, resource, registry['resources'])
    except ValueError as error:
        raise SystemExit(str(error)) from error
    return directory, manifest


def load_claims(path):
    try:
        claims = json.loads(path.read_text(encoding='utf-8'))
    except (OSError, json.JSONDecodeError) as error:
        raise SystemExit(f'Unable to read claims: {error}')
    if not isinstance(claims, list) or not claims:
        raise SystemExit('claims must be a non-empty JSON array')
    if any(not isinstance(item, dict) or not all(isinstance(item.get(key), str) and item[key] for key in ('id', 'premise', 'hypothesis')) for item in claims):
        raise SystemExit('Each claim requires non-empty string id, premise and hypothesis fields')
    if len({item['id'] for item in claims}) != len(claims):
        raise SystemExit('Claim ids must be unique')
    for item in claims:
        evidence = item.get('evidence')
        if evidence is None:
            if 'context_evidence' in item or 'context_status' in item:
                raise SystemExit('Claim context requires source evidence')
            continue
        if not isinstance(evidence, dict) or not all(isinstance(evidence.get(key), str) and evidence[key]
                                                     for key in ('graph_digest', 'unit_id', 'source_id', 'source_sha256', 'quote')) \
                or not all(type(evidence.get(key)) is int and evidence[key] >= 0 for key in ('start', 'end')) \
                or evidence['end'] <= evidence['start'] or evidence['quote'] != item['premise']:
            raise SystemExit('Claim evidence must identify the exact premise span and source')
        contexts = item.get('context_evidence', [])
        status = item.get('context_status')
        if status is not None and status not in ('source_bound', 'unresolved') \
                or status is None and 'context_evidence' in item \
                or status is not None and not isinstance(contexts, list) \
                or status == 'source_bound' and not contexts:
            raise SystemExit('Claim context status or evidence is invalid')
        for context in contexts:
            if not isinstance(context, dict) or context.get('source_id') != evidence['source_id'] \
                    or context.get('source_sha256') != evidence['source_sha256'] \
                    or not isinstance(context.get('quote'), str) or not context['quote'] \
                    or type(context.get('start')) is not int or type(context.get('end')) is not int \
                    or context['start'] < 0 or context['end'] > evidence['start'] \
                    or context['end'] - context['start'] != len(context['quote']):
                raise SystemExit('Claim context evidence must precede its source premise')
    return claims


def verify_claim_sources(request_path, claims):
    try:
        request = json.loads(request_path.read_text(encoding='utf-8'))
        listed = request['ir']['sources']
    except (OSError, UnicodeDecodeError, json.JSONDecodeError, KeyError, TypeError) as error:
        raise SystemExit(f'Frozen NLI request is unavailable: {error}')
    if not isinstance(listed, list) or not listed:
        raise SystemExit('Frozen NLI request has no sources')
    sources = {}
    for source in listed:
        if not isinstance(source, dict) or not isinstance(source.get('id'), str) or not source['id'] \
                or not isinstance(source.get('text'), str) or not isinstance(source.get('sha256'), str) \
                or source['id'] in sources \
                or hashlib.sha256(source['text'].encode('utf-8')).hexdigest() != source['sha256']:
            raise SystemExit('Frozen NLI source identity is invalid')
        sources[source['id']] = source
    for claim in claims:
        evidence = claim.get('evidence')
        if evidence is None:
            raise SystemExit('Source-bound NLI claims require evidence')
        for span in [evidence, *claim.get('context_evidence', [])]:
            source = sources.get(span['source_id'])
            if source is None or span['source_sha256'] != source['sha256'] \
                    or source['text'][span['start']:span['end']] != span['quote']:
                raise SystemExit('NLI claim evidence does not replay against frozen source')


def model_premise(claim):
    return '\n'.join([*[context['quote'] for context in claim.get('context_evidence', [])], claim['premise']])


def signal(label):
    mapping = {'entailment': 'supporting', 'contradiction': 'contradicting', 'neutral': 'neutral'}
    if label not in mapping:
        raise ValueError(f'Unsupported NLI model label: {label}')
    return mapping[label]


def load_batch_cases(path):
    try:
        batch = json.loads(path.read_text(encoding='utf-8'))
    except (OSError, UnicodeDecodeError, json.JSONDecodeError) as error:
        raise SystemExit(f'Unable to read NLI batch manifest: {error}')
    if not isinstance(batch, dict) or batch.get('format') != 'boundx-semantic-nli-batch-input/experimental-v1' \
            or not isinstance(batch.get('cases'), list) or not 1 <= len(batch['cases']) <= 60:
        raise SystemExit('Invalid NLI batch manifest')
    root = path.parent.resolve()
    cases = []
    seen = set()
    for case in batch['cases']:
        if not isinstance(case, dict) or set(case) != {'case_id', 'claims', 'request'} \
                or not isinstance(case['case_id'], str) or re.fullmatch(r'REAL-GOLD-\d{3}', case['case_id']) is None \
                or case['case_id'] in seen:
            raise SystemExit('Invalid NLI batch Case identity')
        seen.add(case['case_id'])
        paths = []
        for key in ('claims', 'request'):
            value = case[key]
            if not isinstance(value, str) or not value or '\\' in value or ':' in value \
                    or any(part in ('', '.', '..') for part in value.split('/')):
                raise SystemExit('Unsafe NLI batch input path')
            selected = (root / value).resolve()
            if not selected.is_relative_to(root) or not selected.is_file():
                raise SystemExit('NLI batch input is outside its manifest directory')
            paths.append(selected)
        claims = load_claims(paths[0])
        verify_claim_sources(paths[1], claims)
        cases.append({'case_id': case['case_id'], 'claims': claims})
    return cases


def infer_claims(claims, args, directory, options, torch, AutoTokenizer, AutoModelForSequenceClassification,
                 tokenizer, model):
    predictions = [None] * len(claims)
    pending = []
    for index, item in enumerate(claims):
        provenance = {key: item[key] for key in ('context_evidence', 'context_status') if key in item}
        if item.get('context_status') == 'unresolved':
            predictions[index] = {'claim_id': item['id'], 'premise': item['premise'],
                                  'hypothesis': item['hypothesis'], 'signal': 'unavailable',
                                  'status': 'candidate_unresolved', 'reason': 'CONTEXT_UNRESOLVED',
                                  'evidence': item.get('evidence'), **provenance}
            continue
        premise = model_premise(item)
        if len(premise) + len(item['hypothesis']) > 20000:
            predictions[index] = {'claim_id': item['id'], 'premise': item['premise'],
                                  'hypothesis': item['hypothesis'], 'signal': 'unavailable',
                                  'status': 'candidate_unresolved', 'reason': 'INPUT_TOO_LONG',
                                  'evidence': item.get('evidence'), **provenance}
            continue
        pending.append((index, item))
    if pending:
        if tokenizer is None:
            tokenizer = AutoTokenizer.from_pretrained(directory, **options)
        eligible = []
        for index, item in pending:
            token_count = len(tokenizer(model_premise(item), item['hypothesis'], truncation=False)['input_ids'])
            if token_count > min(args.max_length, tokenizer.model_max_length):
                predictions[index] = {'claim_id': item['id'], 'premise': item['premise'],
                                      'hypothesis': item['hypothesis'], 'signal': 'unavailable',
                                      'status': 'candidate_unresolved', 'reason': 'TOKEN_LIMIT_EXCEEDED',
                                      'token_count': token_count, 'evidence': item.get('evidence'),
                                      **{key: item[key] for key in ('context_evidence', 'context_status') if key in item}}
            else:
                eligible.append((index, item))
        if eligible:
            if model is None:
                model = AutoModelForSequenceClassification.from_pretrained(directory, **options)
                model.eval()
            label_map = {int(key): value for key, value in model.config.id2label.items()}
            with torch.no_grad():
                for offset in range(0, len(eligible), args.batch_size):
                    batch = eligible[offset:offset + args.batch_size]
                    inputs = tokenizer([model_premise(item) for _, item in batch], [item['hypothesis'] for _, item in batch],
                                       padding=True, truncation=False, return_tensors='pt')
                    probabilities = torch.softmax(model(**inputs).logits, dim=-1)
                    for (claim_index, item), values in zip(batch, probabilities):
                        label_index = int(torch.argmax(values).item())
                        label = str(label_map[label_index])
                        predictions[claim_index] = {
                            'claim_id': item['id'], 'premise': item['premise'], 'hypothesis': item['hypothesis'],
                            'signal': signal(label), 'model_label': label,
                            'confidence': float(values[label_index].item()), 'status': 'candidate_unresolved',
                            'evidence': item.get('evidence'),
                            **{key: item[key] for key in ('context_evidence', 'context_status') if key in item}}
    return predictions, tokenizer, model


def main():
    parser = argparse.ArgumentParser(description='Classify evidence/claim relations using a local offline NLI resource.')
    parser.add_argument('--resource', choices=('mdeberta-nli',), default='mdeberta-nli')
    parser.add_argument('--revision')
    parser.add_argument('--home', type=Path, default=DEFAULT_HOME)
    parser.add_argument('--claims', type=Path)
    parser.add_argument('--request', type=Path)
    parser.add_argument('--batch-manifest', type=Path)
    parser.add_argument('--batch-size', type=int, default=8)
    parser.add_argument('--max-length', type=int, default=512)
    parser.add_argument('--output', type=Path)
    parser.add_argument('--offline', action='store_true', required=True)
    args = parser.parse_args()
    if args.batch_size < 1 or args.max_length < 1:
        parser.error('batch-size and max-length must be positive')
    if args.revision is not None and re.fullmatch(r'[0-9a-f]{40}', args.revision) is None:
        parser.error('--revision must be a 40-character lowercase Git commit SHA')
    if args.output and args.output.exists():
        raise SystemExit('Refusing to overwrite an existing NLI run')
    if args.batch_manifest:
        if args.claims is not None or args.request is not None:
            parser.error('--batch-manifest is incompatible with single-request inputs')
    elif args.claims is None:
        parser.error('--claims is required for a single request')
    directory, manifest = resolve_resource(args.home, args.resource, args.revision)
    cases = load_batch_cases(args.batch_manifest) if args.batch_manifest else [
        {'case_id': None, 'claims': load_claims(args.claims)}]
    if args.request is not None:
        verify_claim_sources(args.request, cases[0]['claims'])
    os.environ['HF_HUB_OFFLINE'] = '1'
    os.environ['TRANSFORMERS_OFFLINE'] = '1'
    os.environ['HF_HUB_DISABLE_TELEMETRY'] = '1'
    try:
        import torch
        from transformers import AutoModelForSequenceClassification, AutoTokenizer
    except ImportError as error:
        raise SystemExit(f'Required local runtime dependency unavailable: {error.name}')
    options = {'local_files_only': True, 'trust_remote_code': False}
    started = time.perf_counter()
    tokenizer = None
    model = None
    results = []
    for case in cases:
        case_started = started if not args.batch_manifest else time.perf_counter()
        try:
            predictions, tokenizer, model = infer_claims(case['claims'], args, directory, options, torch,
                                                          AutoTokenizer, AutoModelForSequenceClassification,
                                                          tokenizer, model)
            output = {'format': 'boundx-semantic-nli-run/experimental-v1', 'status': 'completed', 'offline': True,
                      'model_resource': {'resource_id': manifest['resource_id'], 'revision': manifest['revision'],
                                         'manifest_sha256': hashlib.sha256((directory / 'MANIFEST.json').read_bytes()).hexdigest(),
                                         'license': manifest['license']},
                      'runtime': {'python': platform.python_version(), 'torch': torch.__version__,
                                  'transformers': importlib.metadata.version('transformers'),
                                  'tokenizers': importlib.metadata.version('tokenizers')},
                      'parameters': {'batch_size': args.batch_size, 'max_length': args.max_length},
                      'predictions': predictions,
                      'elapsed_ms': round((time.perf_counter() - case_started) * 1000, 3),
                      'semantic_confirmation': 'not_established', 'admission_effect': 'none',
                      'business_decision': None, 'execution_authorization': None}
        except Exception as error:
            if not args.batch_manifest:
                print(json.dumps({'status': 'unavailable', 'resource_id': manifest.get('resource_id'), 'offline': True,
                                  'error_type': error.__class__.__name__, 'message': str(error)}, ensure_ascii=False), file=sys.stderr)
                raise SystemExit(1)
            output = {'status': 'failed', 'failure_code': 'NLI_CASE_INFERENCE_FAILED',
                      'error_type': error.__class__.__name__}
        results.append({'case_id': case['case_id'], 'output': output})
    result = {'format': 'boundx-semantic-nli-batch/experimental-v1',
              'status': 'completed' if all(item['output']['status'] == 'completed' for item in results) else 'partial_failure',
              'offline': True, 'resource_id': args.resource, 'results': results,
              'total_elapsed_ms': round((time.perf_counter() - started) * 1000, 3)} if args.batch_manifest else results[0]['output']
    encoded = json.dumps(result, ensure_ascii=False, indent=2) + '\n'
    if args.output:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        with args.output.open('x', encoding='utf-8') as handle:
            handle.write(encoded)
    else:
        print(encoded, end='')


if __name__ == '__main__':
    main()
