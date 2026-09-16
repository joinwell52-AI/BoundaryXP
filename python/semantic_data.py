"""Legacy parser configuration composed with the independent L1 data source."""
import hashlib
import json
from pathlib import Path


def load_legacy_lexicon():
    root = Path(__file__).resolve().parents[1]
    parser = json.loads((root / 'python/semantic_lexicon.json').read_text(encoding='utf-8'))
    package = root / 'domain-packs/l1/core-ontology'
    descriptor = json.loads((package / 'datapackage.json').read_text(encoding='utf-8'))
    resource = next(item for item in descriptor['resources'] if item['boundx']['kind'] == 'ontology')
    data = (package / 'ontology.json').read_bytes()
    if resource['path'] != 'ontology.json' or resource['bytes'] != len(data) or resource['hash'] != 'sha256:' + hashlib.sha256(data).hexdigest():
        raise ValueError('L1 compatibility source digest mismatch')
    ontology = json.loads(data.decode('utf-8'))
    if ontology['packId'] != descriptor['name'] or ontology['version'] != descriptor['version']:
        raise ValueError('L1 compatibility identity mismatch')
    parser['operations'] = ontology['operations']
    parser['modalities'] = ontology['modalities']
    parser['pack']['entityMetaTypes'] = ontology['entityMetaTypes']
    parser['pack']['roleMetaModel'] = ontology['roleMetaModel']
    return parser
