from pathlib import Path
import json
import runpy
import tempfile
import unittest
from unittest.mock import patch


CHECKER = runpy.run_path(str(Path(__file__).with_name('check-doc-links.py')))


class DocumentLinksTests(unittest.TestCase):
    def test_inline_image_html_and_autolink(self):
        text = '[guide](guide.md#开始) ![logo](image.png) <a href="guide.md">go</a> <https://example.org/>'
        self.assertEqual([target for _, target in CHECKER['document_links'](text)],
                         ['guide.md#开始', 'image.png', 'guide.md', 'https://example.org/'])

    def test_code_fences_and_inline_code_are_not_links(self):
        text = '```text\n[not a link](missing.md)\n```\n`[0-9][0-9]`\n[real](exists.md)'
        self.assertEqual(list(CHECKER['document_links'](text)), [(5, 'exists.md')])

    def test_reference_links_and_undefined_reference(self):
        text = '[Guide]: guide.md\n[read][guide]\n[missing][unknown]'
        self.assertEqual([target for _, target in CHECKER['document_links'](text)],
                         ['guide.md', 'guide.md', 'missing-reference:unknown'])

    def test_chinese_english_duplicate_and_explicit_anchors(self):
        text = '# 开始 / Start\n## 开始 / Start\n<a id="custom"></a>\n## `code` 与 **示例**'
        self.assertEqual(CHECKER['anchors'](text), {'开始--start', '开始--start-1', 'custom', 'code-与-示例'})

    def audit_fixture(self, files, names):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            for name, text in files.items():
                destination = root / name
                destination.parent.mkdir(parents=True, exist_ok=True)
                destination.write_text(text, encoding='utf-8')
            listing = '\0'.join(names).encode('utf-8') + b'\0'
            with patch('subprocess.check_output', return_value=listing):
                return CHECKER['audit'](root)

    def test_missing_files_and_anchors_are_reported(self):
        report = self.audit_fixture({'README.md': '[bad](missing.md) [anchor](guide.md#missing)', 'guide.md': '# Guide'},
                                    ['README.md', 'guide.md'])
        self.assertEqual([item['reason'] for item in report['problems']], ['missing local target', 'missing Markdown anchor'])

    def test_outside_repository_is_not_followed(self):
        report = self.audit_fixture({'README.md': '[external file](../outside.md)'}, ['README.md'])
        self.assertEqual(report['problems'][0]['reason'], 'outside standalone repository')

    def test_deleted_files_skip_and_added_files_count_once(self):
        report = self.audit_fixture({'README.md': '[new](新文档.md#开始)', '新文档.md': '# 开始'},
                                    ['README.md', 'deleted.md', '新文档.md', '新文档.md'])
        self.assertEqual(report['documents'], 2)
        self.assertEqual(report['problems'], [])

    def test_encoded_paths_and_external_urls(self):
        report = self.audit_fixture({'README.md': '[encoded](hello%20world.md#start) [remote](https://example.org/)',
                                     'hello world.md': '# Start'}, ['README.md', 'hello world.md'])
        self.assertEqual(report['problems'], [])
        self.assertEqual(report['local_links'], 1)
        self.assertEqual(list(report['external']), ['https://example.org/'])

    def test_corpus_manifest_does_not_point_outside_project(self):
        root = Path(__file__).resolve().parents[1]
        manifest = root / 'protocol/benchmarks/corpus-manifest.json'
        data = json.loads(manifest.read_text(encoding='utf-8'))
        for batch in data['batches']:
            for key in ['source', 'local_examples', 'result_notes']:
                target = batch.get(key)
                if target is None:
                    continue
                destination = (manifest.parent / target).resolve()
                self.assertTrue(destination.is_relative_to(root), target)
                self.assertTrue(destination.is_file(), target)
            if batch['source'] is None:
                self.assertEqual(batch['status'], 'source_not_bundled')


if __name__ == '__main__':
    unittest.main()
