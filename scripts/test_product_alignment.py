from pathlib import Path
import hashlib
import json
import re
import subprocess
import unittest


ROOT = Path(__file__).resolve().parents[1]
TASKBOOK = ROOT / 'docs/tasks/BoundX-BXP-product-alignment-taskbook-v1.md'
TASKBOOK_SHA256 = 'a510c045277a1612c43c71b3cbe459ccbac904e88a3f14a5dc68e23046870d1c'
CURRENT = ['README.md', 'AGENTS.md', 'QUICKSTART.md', 'protocol/IMPLEMENTATION.md',
           'docs/BOUNDX-PRODUCT-MANUAL.md', 'docs/FUNCTIONS.md', 'docs/UI-GUIDE.md',
           'docs/UI-ADVICE.md', 'docs/VALIDATION.md', 'docs/AGENT-BXP-PRODUCER.md']


class ProductAlignmentTests(unittest.TestCase):
    def test_current_documents_use_bxp_not_seven_only_or_old_adapter_claims(self):
        for name in CURRENT:
            text = (ROOT / name).read_text(encoding='utf-8')
            self.assertIn('BXP', text, name)
            self.assertNotRegex(text, r'七参数|七字段|Seven parameters|seven parameters|尚未统一|not yet unified', name)
            self.assertNotRegex(text, r'node cli\.mjs (?:task|plan|decomposition|responses)\b', name)

    def test_historical_seven_only_material_is_explicitly_nonnormative(self):
        for path in (ROOT / 'docs').rglob('*.md'):
            if path == TASKBOOK:
                self.assertEqual(hashlib.sha256(path.read_bytes()).hexdigest(), TASKBOOK_SHA256)
                continue
            text = path.read_text(encoding='utf-8')
            if re.search(r'七参数|七字段|七个字段|seven parameters', text, re.I):
                self.assertIn('non-normative', text[:700], str(path))

    def test_authorized_taskbook_is_preserved_byte_for_byte(self):
        self.assertEqual(hashlib.sha256(TASKBOOK.read_bytes()).hexdigest(), TASKBOOK_SHA256)

    def test_current_release_status_distinguishes_private_source_from_packages(self):
        for name in ['README.md', 'QUICKSTART.md', 'CHANGELOG.md']:
            text = (ROOT / name).read_text(encoding='utf-8')
            current = text.split('## 1.2.4-preview.1')[0]
            self.assertIn('https://github.com/joinwell52-AI/BoundX/releases/tag/v1.3.0-preview.0', current)
            self.assertIn('private', current.lower())
            self.assertIn('source prerelease', current.lower())
            self.assertIn('npm/PyPI', current)
            self.assertIn('installers', current)
            self.assertNotRegex(current, r'未发布 npm/PyPI 或 Release|No release, publication|无公开 Release')

    def test_product_and_lock_versions_match_current_docs(self):
        package = json.loads((ROOT / 'package.json').read_text(encoding='utf-8'))
        lock = json.loads((ROOT / 'package-lock.json').read_text(encoding='utf-8'))
        self.assertEqual(package['version'], '1.3.0-preview.0')
        self.assertEqual(lock['version'], package['version'])
        self.assertEqual(lock['packages']['']['version'], package['version'])
        self.assertTrue(package['private'])
        for name in ['README.md', 'AGENTS.md', 'QUICKSTART.md', 'protocol/IMPLEMENTATION.md', 'docs/BOUNDX-PRODUCT-MANUAL.md']:
            self.assertIn(package['version'], (ROOT / name).read_text(encoding='utf-8'), name)

    def test_readme_first_runnable_example_is_canonical(self):
        text = (ROOT / 'README.md').read_text(encoding='utf-8')
        block = re.search(r'```text\n(.*?)```', text, re.S)[1]
        command = next(line for line in block.splitlines() if line.startswith('node cli.mjs'))
        self.assertEqual(command, 'node cli.mjs evaluate examples/bxp/zh-CN-complete.json')
        task = json.loads((ROOT / command.split()[-1]).read_text(encoding='utf-8'))
        self.assertEqual(task['schema'], 'boundx-task/v1')

    def test_tracked_text_is_valid_utf8_without_replacement_characters(self):
        listing = subprocess.check_output(['git', 'ls-files', '-z', '--cached', '--others', '--exclude-standard'], cwd=ROOT)
        for name in set(listing.decode('utf-8').strip('\0').split('\0')):
            path = ROOT / name
            if path.is_file() and path.suffix in {'.md', '.json', '.py', '.ts', '.mjs', '.html'}:
                self.assertNotIn('\ufffd', path.read_text(encoding='utf-8'), name)


if __name__ == '__main__':
    unittest.main()
