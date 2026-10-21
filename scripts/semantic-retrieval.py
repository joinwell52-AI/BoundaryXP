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


def load_items(path, label, allow_empty=False):
    try:
        encoded = path.read_bytes()
        value = json.loads(encoded.decode('utf-8'))
    except (OSError, UnicodeDecodeError, json.JSONDecodeError) as error:
        raise SystemExit(f'Unable to read {label}: {error}')
    if not isinstance(value, list) or (not value and not allow_empty):
        raise SystemExit(f'{label} must be a JSON array' + ('' if allow_empty else ' with at least one item'))
    if any(not isinstance(item, dict) or not isinstance(item.get('id'), str) or not item['id']
           or not isinstance(item.get('text'), str) or not item['text'] for item in value):
        raise SystemExit(f'Each {label} item requires non-empty string id and text fields')
    if len({item['id'] for item in value}) != len(value):
        raise SystemExit(f'{label} ids must be unique')
    for item in value:
        evidence = item.get('source_evidence')
        contexts = item.get('context_evidence', [])
        if not isinstance(contexts, list) or (contexts and evidence is None):
            raise SystemExit(f'{label} context_evidence requires source_evidence')
        if evidence is None:
            continue
        if not isinstance(evidence, dict) or any(not isinstance(evidence.get(key), str) or not evidence[key]
                                                     for key in ('source_id', 'source_sha256', 'task_node_id', 'quote', 'applicability')) \
                or any(type(evidence.get(key)) is not int or evidence[key] < 0 for key in ('start', 'end')) \
                or evidence['end'] - evidence['start'] != len(item['text']) or evidence['quote'] != item['text']:
            raise SystemExit(f'{label} source_evidence must match exact query text and span')
        previous_end = -1
        for context in contexts:
            if not isinstance(context, dict) or context.get('source_id') != evidence['source_id'] \
                    or context.get('source_sha256') != evidence['source_sha256'] \
                    or not isinstance(context.get('quote'), str) or not context['quote'] \
                    or type(context.get('start')) is not int or type(context.get('end')) is not int \
                    or context['start'] < previous_end or context['end'] > evidence['start'] \
                    or context['end'] - context['start'] != len(context['quote']):
                raise SystemExit(f'{label} context_evidence must precede the query in source order')
            previous_end = context['end']
    return value, hashlib.sha256(encoded).hexdigest()


def verify_query_source(path, queries, task_nodes_path=None):
    if path is None:
        if any(item.get('source_evidence') is not None for item in queries):
            raise SystemExit('Source-bound queries require --source')
        return
    try:
        source = json.loads(path.read_text(encoding='utf-8'))
    except (OSError, json.JSONDecodeError) as error:
        raise SystemExit(f'Unable to read frozen source: {error}')
    if not isinstance(source, dict) or set(source) != {'text', 'sha256'} \
            or not isinstance(source['text'], str) or not isinstance(source['sha256'], str) \
            or hashlib.sha256(source['text'].encode('utf-8')).hexdigest() != source['sha256']:
        raise SystemExit('Frozen source digest does not match its text')
    nodes = None
    if task_nodes_path is not None:
        try:
            listed = json.loads(task_nodes_path.read_text(encoding='utf-8'))
        except (OSError, json.JSONDecodeError) as error:
            raise SystemExit(f'Unable to read task nodes: {error}')
        if not isinstance(listed, list) or any(not isinstance(node, dict) or not isinstance(node.get('id'), str)
                                                for node in listed):
            raise SystemExit('Task nodes must be an array with identities')
        nodes = {node['id']: node for node in listed}
        if len(nodes) != len(listed):
            raise SystemExit('Task node identities must be unique')
    for item in queries:
        evidence_spans = [item.get('source_evidence'), *item.get('context_evidence', [])]
        for evidence in evidence_spans:
            if evidence is None:
                continue
            if evidence['source_id'] != 'task' or evidence['source_sha256'] != source['sha256'] \
                    or source['text'][evidence['start']:evidence['end']] != evidence['quote']:
                raise SystemExit('Query evidence does not replay against the frozen source')
        primary = item.get('source_evidence')
        if primary is not None and nodes is not None:
            owner = nodes.get(primary['task_node_id'])
            span = owner.get('span') if isinstance(owner, dict) else None
            if not isinstance(span, dict) or type(span.get('start')) is not int \
                    or type(span.get('end')) is not int or span['start'] < 0 \
                    or span['end'] > len(source['text']) or span['start'] > primary['start'] \
                    or primary['end'] > span['end']:
                raise SystemExit('Query evidence is outside its declared task node')
            enclosing = [node for node in nodes.values() if isinstance(node.get('span'), dict)
                         and type(node['span'].get('start')) is int and type(node['span'].get('end')) is int
                         and node['span']['start'] <= primary['start'] and primary['end'] <= node['span']['end']]
            smallest = min(node['span']['end'] - node['span']['start'] for node in enclosing)
            if len([node for node in enclosing if node['span']['end'] - node['span']['start'] == smallest]) != 1 \
                    or span['end'] - span['start'] != smallest:
                raise SystemExit('Query evidence is not owned by its most specific task node')
        contexts = item.get('context_evidence', [])
        if contexts:
            if nodes is None:
                raise SystemExit('Context-bound queries require --task-nodes')
            owner = nodes.get(item['source_evidence']['task_node_id'])
            if owner is None:
                raise SystemExit('Query task node is missing')
            ancestors = set()
            while owner is not None:
                if owner['id'] in ancestors:
                    raise SystemExit('Task node ancestry contains a cycle')
                ancestors.add(owner['id'])
                owner = nodes.get(owner.get('parent_id'))
            for context in contexts:
                if not any(nodes[identifier].get('section_role') in ('condition', 'exception')
                           and any(all(context[key] == heading.get(key)
                                       for key in ('source_id', 'start', 'end', 'quote'))
                                   for heading in nodes[identifier].get('heading_evidence', []))
                           for identifier in ancestors):
                    raise SystemExit('Context evidence is not a conditional ancestor heading')


def load_semantic_library(path, candidates):
    if path is None:
        return None, 'not_supplied'
    try:
        encoded = path.read_bytes()
        library = json.loads(encoded.decode('utf-8'))
    except (OSError, UnicodeDecodeError, json.JSONDecodeError) as error:
        raise SystemExit(f'Unable to read effective semantic library: {error}')
    if not isinstance(library, dict) or library.get('format') != 'boundx-effective-semantic-library/experimental-v1' \
            or library.get('status') != 'assembled' or not isinstance(library.get('entries'), list):
        raise SystemExit('Effective semantic library must be an assembled BoundaryXP snapshot')
    def reference_key(reference):
        return json.dumps(reference, ensure_ascii=False, sort_keys=True)

    def entry_reference(entry):
        reference = {key: entry[key] for key in ('kind', 'id', 'digest', 'pack')}
        if 'source' in entry:
            reference['source'] = entry['source']
        return reference

    if not isinstance(library.get('selected_l2'), list):
        raise SystemExit('Effective semantic library selected_l2 must be an array')
    selected_packs = [library.get('l1'), *library['selected_l2'], library.get('l3')]
    entries = {reference_key(entry_reference(entry)): entry.get('retrieval_text') or entry['id']
               for entry in library['entries']
               if isinstance(entry, dict) and all(key in entry for key in ('kind', 'id', 'digest', 'pack'))
               and entry['pack'] in selected_packs}
    if len(entries) != len(library['entries']):
        raise SystemExit('Effective semantic library contains malformed entries')
    binding = 'unbound'
    references = 0
    for candidate in candidates:
        reference = candidate.get('semantic_reference')
        if reference is None:
            continue
        if not isinstance(reference, dict) or set(reference) not in ({'kind', 'id', 'digest', 'pack'},
                                                                   {'kind', 'id', 'digest', 'pack', 'source'}) \
                or not all(isinstance(reference[key], str) and reference[key] for key in ('kind', 'id', 'digest')) \
                or not isinstance(reference['pack'], dict):
            raise SystemExit('Candidate semantic_reference must include kind, id, digest and selected pack')
        if reference_key(reference) not in entries:
            raise SystemExit('Candidate semantic_reference is not in the effective semantic library')
        if candidate['text'] != entries[reference_key(reference)]:
            raise SystemExit('Candidate text does not match its effective semantic library entry')
        references += 1
    if references == len(candidates) and candidates:
        binding = 'bound'
    snapshot = {'format': library['format'], 'sha256': hashlib.sha256(encoded).hexdigest(),
                'l1': library.get('l1'), 'selected_l2': library.get('selected_l2'), 'l3': library.get('l3')}
    return snapshot, binding


def prefix(resource, text, role):
    if resource == 'multilingual-e5-large':
        return f'{"query" if role == "query" else "passage"}: {text}'
    return text


def embed(model, tokenizer, values, batch_size, torch, resource):
    vectors = []
    with torch.no_grad():
        for index in range(0, len(values), batch_size):
            batch = tokenizer(values[index:index + batch_size], padding=True, truncation=False, return_tensors='pt')
            output = model(**batch).last_hidden_state
            if resource == 'bge-m3':
                pooled = output[:, 0]
            else:
                mask = batch['attention_mask'].unsqueeze(-1).expand(output.size()).float()
                pooled = (output * mask).sum(dim=1) / mask.sum(dim=1).clamp(min=1e-9)
            vectors.append(torch.nn.functional.normalize(pooled, p=2, dim=1))
    return torch.cat(vectors, dim=0)


def eligible(items, role, tokenizer, resource, max_length):
    accepted = []
    excluded = []
    for index, item in enumerate(items):
        if role == 'query' and re.fullmatch(r'(?:-{3,}|\*{3,}|_{3,})', item['text'].strip()):
            excluded.append({'id': item['id'], 'reason': 'NON_SEMANTIC_SEPARATOR'})
            continue
        context = '\n'.join(span['quote'] for span in item.get('context_evidence', [])) if role == 'query' else ''
        value = prefix(resource, '\n'.join(filter(None, (context, item['text']))), role)
        if len(value) > 20000:
            excluded.append({'id': item['id'], 'reason': 'INPUT_TOO_LONG'})
            continue
        count = len(tokenizer(value, truncation=False)['input_ids'])
        if count > min(max_length, tokenizer.model_max_length):
            excluded.append({'id': item['id'], 'reason': 'TOKEN_LIMIT_EXCEEDED', 'token_count': count})
            continue
        accepted.append((index, value))
    return accepted, excluded


def retrieval_result(args, directory, manifest, runtime, tokenizer, model, torch, request,
                     accepted_candidates, excluded_candidates, candidate_vectors, started):
    queries = request['queries']
    candidates = request['candidates']
    accepted_queries, excluded_queries = eligible(queries, 'query', tokenizer, args.resource, args.max_length)
    scores = None
    if accepted_queries and accepted_candidates:
        query_vectors = embed(model, tokenizer, [value for _, value in accepted_queries], args.batch_size, torch, args.resource)
        scores = query_vectors @ candidate_vectors.T
    ranked = []
    query_positions = {original: position for position, (original, _) in enumerate(accepted_queries)}
    for query_index, query in enumerate(queries):
        if query_index not in query_positions or not accepted_candidates:
            reason = next((item['reason'] for item in excluded_queries if item['id'] == query['id']), 'NO_ELIGIBLE_CANDIDATES')
            ranked.append({'query_id': query['id'], 'source_evidence': query.get('source_evidence'),
                           'context_evidence': query.get('context_evidence', []),
                           'status': 'unavailable', 'reason': reason, 'candidates': []})
            continue
        position = query_positions[query_index]
        selected = sorted(range(len(accepted_candidates)), key=lambda index: (-float(scores[position, index]), candidates[accepted_candidates[index][0]]['id']))[:args.top_k]
        ranked.append({'query_id': query['id'], 'source_evidence': query.get('source_evidence'),
                       'context_evidence': query.get('context_evidence', []),
                       'status': 'candidate_unresolved', 'candidates': [
            {'candidate_id': candidates[accepted_candidates[index][0]]['id'],
             'semantic_reference': candidates[accepted_candidates[index][0]].get('semantic_reference'),
             'score': float(scores[position, index]), 'status': 'candidate_unresolved'}
            for index in selected]})
    return {'format': 'boundx-semantic-retrieval-run/experimental-v1', 'status': 'completed', 'offline': True,
            'input_files': {'queries_sha256': request['queries_sha256'],
                            'candidates_sha256': request['candidates_sha256']},
            'model_resource': {'resource_id': manifest['resource_id'], 'revision': manifest['revision'],
                               'manifest_sha256': hashlib.sha256((directory / 'MANIFEST.json').read_bytes()).hexdigest(),
                               'license': manifest['license']},
            'runtime': runtime, 'effective_semantic_library': request['semantic_library'],
            'semantic_library_binding': request['semantic_library_binding'],
            'parameters': {'top_k': args.top_k, 'max_length': args.max_length, 'batch_size': args.batch_size},
            'embedding_method': 'normalized_cls' if args.resource == 'bge-m3' else 'normalized_mean',
            'retrieval': ranked, 'excluded_candidates': excluded_candidates,
            'excluded_queries': excluded_queries, 'elapsed_ms': round((time.perf_counter() - started) * 1000, 3),
            'semantic_confirmation': 'not_established', 'business_decision': None, 'execution_authorization': None}


def load_request(queries_path, source_path, nodes_path, candidates_path, library_path):
    queries, queries_sha256 = load_items(queries_path, 'queries')
    verify_query_source(source_path, queries, nodes_path)
    candidates, candidates_sha256 = load_items(candidates_path, 'candidates', allow_empty=True)
    semantic_library, semantic_library_binding = load_semantic_library(library_path, candidates)
    return {'queries': queries, 'queries_sha256': queries_sha256,
            'candidates': candidates, 'candidates_sha256': candidates_sha256,
            'semantic_library': semantic_library, 'semantic_library_binding': semantic_library_binding}


def load_batch_requests(path):
    try:
        batch = json.loads(path.read_text(encoding='utf-8'))
    except (OSError, UnicodeDecodeError, json.JSONDecodeError) as error:
        raise SystemExit(f'Unable to read batch manifest: {error}')
    if not isinstance(batch, dict) or batch.get('format') != 'boundx-semantic-retrieval-batch-input/experimental-v1' \
            or not isinstance(batch.get('cases'), list) or not 1 <= len(batch['cases']) <= 60:
        raise SystemExit('Invalid retrieval batch manifest')
    root = path.parent.resolve()
    requests = []
    seen = set()
    for case in batch['cases']:
        if not isinstance(case, dict) or set(case) != {'case_id', 'queries', 'source', 'task_nodes', 'candidates', 'semantic_library'} \
                or not isinstance(case['case_id'], str) or re.fullmatch(r'REAL-GOLD-\d{3}', case['case_id']) is None \
                or case['case_id'] in seen:
            raise SystemExit('Invalid retrieval batch Case identity')
        seen.add(case['case_id'])
        paths = []
        for key in ('queries', 'source', 'task_nodes', 'candidates', 'semantic_library'):
            value = case[key]
            if not isinstance(value, str) or not value or '\\' in value or ':' in value \
                    or any(part in ('', '.', '..') for part in value.split('/')):
                raise SystemExit('Unsafe retrieval batch input path')
            selected = (root / value).resolve()
            if not selected.is_relative_to(root) or not selected.is_file():
                raise SystemExit('Retrieval batch input is outside its manifest directory')
            paths.append(selected)
        requests.append({'case_id': case['case_id'], **load_request(*paths)})
    if len({request['candidates_sha256'] for request in requests}) != 1 \
            or len({request['semantic_library']['sha256'] if request['semantic_library'] else None for request in requests}) != 1:
        raise SystemExit('Retrieval batch cases must use the same candidate library snapshot')
    return requests


def main():
    parser = argparse.ArgumentParser(description='Generate offline-only semantic retrieval candidates for BoundaryXP review.')
    parser.add_argument('--resource', choices=('bge-m3', 'multilingual-e5-large'), required=True)
    parser.add_argument('--revision')
    parser.add_argument('--home', type=Path, default=DEFAULT_HOME)
    parser.add_argument('--queries', type=Path)
    parser.add_argument('--source', type=Path)
    parser.add_argument('--task-nodes', type=Path)
    parser.add_argument('--candidates', type=Path)
    parser.add_argument('--batch-manifest', type=Path)
    parser.add_argument('--semantic-library', type=Path)
    parser.add_argument('--top-k', type=int, default=5)
    parser.add_argument('--max-length', type=int, default=512)
    parser.add_argument('--batch-size', type=int, default=4)
    parser.add_argument('--output', type=Path)
    parser.add_argument('--offline', action='store_true', required=True)
    args = parser.parse_args()
    if args.top_k < 1 or args.max_length < 1 or args.batch_size < 1:
        parser.error('top-k, max-length and batch-size must all be positive')
    if args.batch_manifest:
        if any((args.queries, args.source, args.task_nodes, args.candidates, args.semantic_library)):
            parser.error('--batch-manifest is incompatible with single-request inputs')
    elif not args.queries or not args.candidates:
        parser.error('--queries and --candidates are required for a single request')
    if args.revision is not None and re.fullmatch(r'[0-9a-f]{40}', args.revision) is None:
        parser.error('--revision must be a 40-character lowercase Git commit SHA')
    if args.output and args.output.exists():
        raise SystemExit('Refusing to overwrite an existing retrieval run')
    directory, manifest = resolve_resource(args.home, args.resource, args.revision)
    requests = load_batch_requests(args.batch_manifest) if args.batch_manifest else [
        load_request(args.queries, args.source, args.task_nodes, args.candidates, args.semantic_library)]
    os.environ['HF_HUB_OFFLINE'] = '1'
    os.environ['TRANSFORMERS_OFFLINE'] = '1'
    os.environ['HF_HUB_DISABLE_TELEMETRY'] = '1'
    try:
        import torch
        from transformers import AutoModel, AutoTokenizer
    except ImportError as error:
        raise SystemExit(f'Required local runtime dependency unavailable: {error.name}')
    options = {'local_files_only': True, 'trust_remote_code': False}
    started = time.perf_counter()
    try:
        tokenizer = AutoTokenizer.from_pretrained(directory, **options)
        model = AutoModel.from_pretrained(directory, **options)
        model.eval()
        runtime = {'python': platform.python_version(), 'torch': torch.__version__,
                   'transformers': importlib.metadata.version('transformers'),
                   'tokenizers': importlib.metadata.version('tokenizers')}
        accepted_candidates, excluded_candidates = eligible(requests[0]['candidates'], 'candidate', tokenizer,
                                                             args.resource, args.max_length)
        candidate_vectors = embed(model, tokenizer, [value for _, value in accepted_candidates],
                                  args.batch_size, torch, args.resource) if accepted_candidates else None
        model_load_and_candidates_ms = round((time.perf_counter() - started) * 1000, 3)
        results = []
        for request in requests:
            case_started = started if not args.batch_manifest else time.perf_counter()
            try:
                output = retrieval_result(args, directory, manifest, runtime, tokenizer, model, torch, request,
                                          accepted_candidates, excluded_candidates, candidate_vectors, case_started)
            except Exception as error:
                if not args.batch_manifest:
                    raise
                output = {'status': 'failed', 'failure_code': 'MODEL_INFERENCE_FAILED',
                          'error_type': error.__class__.__name__}
            results.append(output)
    except Exception as error:
        print(json.dumps({'status': 'unavailable', 'resource_id': manifest.get('resource_id'), 'offline': True,
                          'error_type': error.__class__.__name__, 'message': str(error)}, ensure_ascii=False), file=sys.stderr)
        raise SystemExit(1)
    result = {'format': 'boundx-semantic-retrieval-batch/experimental-v1',
              'status': 'completed' if all(item['status'] == 'completed' for item in results) else 'partial_failure',
              'offline': True, 'resource_id': args.resource,
              'model_load_and_candidates_ms': model_load_and_candidates_ms,
              'results': [{'case_id': request['case_id'], 'output': output}
                          for request, output in zip(requests, results)]} if args.batch_manifest else results[0]
    encoded = json.dumps(result, ensure_ascii=False, indent=2) + '\n'
    if args.output:
        try:
            args.output.parent.mkdir(parents=True, exist_ok=True)
            with args.output.open('x', encoding='utf-8') as handle:
                handle.write(encoded)
        except FileExistsError:
            raise SystemExit('Refusing to overwrite an existing retrieval run')
    else:
        print(encoded, end='')


if __name__ == '__main__':
    main()
