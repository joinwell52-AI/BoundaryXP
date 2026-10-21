// Transport capacity only. No short-text character limit and no source truncation.
// This module is served unchanged to the browser and imported by the shared engine.
export const MAX_SOURCE_BYTES=1024*1024;
export const MAX_REQUEST_BYTES=8*1024*1024;
export const INPUT_LIMITS=Object.freeze({max_codepoints:null,max_source_bytes:MAX_SOURCE_BYTES,max_request_bytes:MAX_REQUEST_BYTES,truncation:false});
