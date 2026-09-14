export const pointLength = text => Array.from(text).length;
export const pointSlice = (text, start, end) => Array.from(text).slice(start, end).join('');
export const pointIndex = (text, nativeIndex) => pointLength(text.slice(0, nativeIndex));
export function* pointMatches(text, pattern) {
  let nativeOffset = 0, pointOffset = 0;
  for (const match of text.matchAll(pattern)) {
    pointOffset += pointLength(text.slice(nativeOffset, match.index));
    nativeOffset = match.index;
    match.index = pointOffset;
    yield match;
  }
}
