export function codePointOffsets(text) {
  const offsets = new Uint32Array(text.length + 1);
  let count = 0;
  for (let index = 0; index < text.length; index += 1) {
    offsets[index] = count;
    if (text.codePointAt(index) > 0xffff) {
      offsets[index + 1] = count + 1;
      index += 1;
    }
    count += 1;
  }
  offsets[text.length] = count;
  return offsets;
}
