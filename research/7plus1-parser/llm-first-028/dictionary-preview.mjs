import { selectDictionaries, scanDictionaries } from './dictionaries.mjs';

// Preview data only: reuse the scan and the selected immutable pack records.
// No model call and no writes to the saved generation/comparison.
export function previewDictionaries(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)
    || typeof input.text !== 'string'
    || Object.keys(input).some(key => !['text', 'dictionaries', 'selection_sha256'].includes(key))) {
    throw Error('INVALID_DICTIONARY_PREVIEW');
  }
  const snapshot = selectDictionaries(input.dictionaries ?? {});
  if (input.selection_sha256 !== undefined && input.selection_sha256 !== snapshot.sha256) {
    throw Error('DICTIONARY_PREVIEW_VERSION_MISMATCH');
  }
  const scan = scanDictionaries(snapshot, input.text);
  return {
    ...scan,
    packs: snapshot.packs.map(({ files, ...pack }) => pack),
    entries: scan.entries.map(entry => {
      const pack = snapshot.packs.find(pack => pack.id === entry.pack_id);
      const file = pack.files.find(file => file.path === entry.path && file.sha256 === entry.file_sha256);
      const value = entry.pointer.split('/').slice(1)
        .map(part => part.replaceAll('~1', '/').replaceAll('~0', '~'))
        .reduce((data, key) => data?.[key], file.data);
      if (value === undefined) throw Error('DICTIONARY_PREVIEW_ENTRY_MISSING');
      return { ...entry, pack_label: pack.label, value };
    }),
  };
}
