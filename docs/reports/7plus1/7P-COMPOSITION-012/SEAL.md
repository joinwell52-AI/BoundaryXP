# 7P-COMPOSITION-012 SEAL

TERMINAL_OUTCOME=R1_SEMANTIC_GATE_FAILED
STATUS=WAITING_ADMIN_REVIEW
PRODUCTION_READY=false
R1=FAIL
R2_R3_R4=NOT_STARTED_R1_SEMANTIC_GATE_FAILED
CASE_IOA_JOINT=0/9
STANDARD_PARSED=0/9

Payload: 418 files.
MANIFEST SHA-256: 761930243b7562a69222d6cfbec80402567e22753a4d92587b17327391570f4b
SHA256SUMS SHA-256: 051287e5388f08be23e9b350840af4662919be4a963f050d402e4ef6170d2ada

ADMIN-retired historical Eligibility byte-pin is replaced by actual semantic tests. Original tests and 001–011 evidence preserved. Explicit acceptance BASELINE restored. Non-Gold 25/0, focused 59/0, retained 518/0, original 739/0, full 5939/0/17 SKIP. These do not override the failed R1 semantic floor: new resolved deictic scope and reintroduced dry-run condition misbinding. Source/Gold/v0.3/010 overlay/projection/production unchanged. No R2–R4, merge/release/tag or production adoption.

Envelope exclusions avoid circular hashes. SEAL anchors MANIFEST and SHA256SUMS; SEAL-VERIFICATION checks all payload paths and envelope coverage. Git commit/push receipt stays outside the sealed payload. Integrity PASS is not semantic acceptance.
