# 7P-REPAIR-001

This revision repairs document/discourse scope, participant eligibility and resource eligibility before Boundary IR. Projection, contracts, packs, models and thresholds are unchanged. The Parser does not import Gold or comparison ledgers.

Run from `D:\boundx` with the existing local model installation:

```text
node research/7plus1-parser/v0.3-7p-repair-001/cli.mjs --input task.md
node research/7plus1-parser/v0.3-7p-repair-001/server.mjs
```

The server uses port 58618 by default. An existing process is not replaced automatically. Both entry points import the same `parse7Plus1()` from `engine.mjs`.

Global npm aliases remain unchanged because `package.json` is a dependency of prior sealed implementations. They still invoke legacy P2; use the explicit commands above for this revision. No deployment or restart was performed by this task.

Scope annotations and table row/column evidence are in `nlp_signals.semantic_decoding.discourse` and node metadata. Non-current observations remain traceable with OUTSIDE_ENVELOPE eligibility rather than current-task facts. OUTPUT_CONTENT records are partial typed content, not completed semantic grounding. Participant and quantity eligibility ledgers record the evidence gates. Remaining I/O/V/C and composite A/B/condition gaps are reported separately from contract/test success.
