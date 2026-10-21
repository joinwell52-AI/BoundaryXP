import hashlib
import json
from pathlib import Path


NLP_SPECS = json.loads(Path(__file__).with_name('nlp-model-specs.json').read_text(encoding='utf-8'))
SPACY = {language: (spec['model'], spec['sha256']) for language, spec in NLP_SPECS['spacy'].items()}
HANLP = {language: spec['model'] for language, spec in NLP_SPECS['hanlp'].items()}
HANLP_ASSET_DIGESTS = {language: spec['asset_sha256'] for language, spec in NLP_SPECS['hanlp'].items()}


def fingerprint_model_directory(directory):
    root = Path(directory)
    if not root.is_dir() or root.is_symlink():
        raise ValueError('NLP_MODEL_ASSET_UNAVAILABLE')
    fingerprint = hashlib.sha256()
    entries = sorted(root.rglob('*'))
    files = [path for path in entries if path.is_file() and '__pycache__' not in path.parts]
    if not files or any(path.is_symlink() or not path.resolve().is_relative_to(root.resolve()) for path in entries):
        raise ValueError('NLP_MODEL_ASSET_INVALID')
    for path in files:
        fingerprint.update(path.relative_to(root).as_posix().encode('utf-8'))
        checksum = hashlib.sha256()
        with path.open('rb') as stream:
            for chunk in iter(lambda: stream.read(1024 * 1024), b''):
                checksum.update(chunk)
        fingerprint.update(checksum.digest())
    return fingerprint.hexdigest()


def verify_hanlp_assets(home, language):
    directory = Path(home) / 'hanlp' / 'mtl' / HANLP[language].rsplit('/', 1)[-1].removesuffix('.zip')
    if fingerprint_model_directory(directory) != HANLP_ASSET_DIGESTS[language]:
        raise ValueError('NLP_MODEL_ASSET_DIGEST_MISMATCH')
    return HANLP_ASSET_DIGESTS[language]


def validate_nlp_metadata(metadata, engine, language):
    if not isinstance(metadata, dict) or metadata.get('engine') != engine or metadata.get('language') != language:
        raise ValueError('NLP_MODEL_IDENTITY')
    if engine == 'spacy':
        model, expected_sha256 = SPACY[language]
        if (metadata.get('model') != model or metadata.get('version') != NLP_SPECS['spacy'][language]['version']
                or metadata.get('sha256') != expected_sha256 or metadata.get('license') != NLP_SPECS['spacy'][language]['license']):
            raise ValueError('NLP_MODEL_IDENTITY')
    elif engine == 'hanlp':
        if (metadata.get('model') != HANLP[language]
                or metadata.get('license') != NLP_SPECS['hanlp'][language]['license']
                or metadata.get('asset_sha256') not in (None, HANLP_ASSET_DIGESTS[language])):
            raise ValueError('NLP_MODEL_IDENTITY')
    else:
        raise ValueError('NLP_CONFIG')
