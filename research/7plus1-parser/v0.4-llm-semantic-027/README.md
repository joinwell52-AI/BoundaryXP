# BoundaryXP v0.4 — 027 isolated semantic compiler

The authorized method is the repository v0.4 manual and 027 taskbook. This code
does not import the legacy semantic runtime. Existing production CLI/UI entries
are unchanged.

Run from `D:\boundx` with the authenticated desktop Codex CLI installed:

```text
node research/7plus1-parser/v0.4-llm-semantic-027/cli-selected.mjs parse-boundary task.md --provider codex-local --json new-result.json --receipts new-receipts-directory
```

Both the CLI and the batch runner call `parseBoundary()`. Each call preserves
the input and runs two independent provider turns: a semantic proposal and a
coverage audit. The provider receives no expected answers or repository access.
The output is a full trace, including `canonical_7plus1`; it is not execution
authorization.

For a recorded trace, without new model calls:

```text
node research/7plus1-parser/v0.4-llm-semantic-027/cli-selected.mjs parse-boundary saved-trace.json --provider replay --json new-replay.json
```

Existing receipts/results cannot be overwritten. `mock-for-tests` is available
through the Port only; the CLI refuses it as a real provider.

The selected entry requires `METHOD-FREEZE.json`, validates the provider binary
digest and uses the admitted policy. `cli.mjs` is the preserved first development
baseline, rather than the selected final entry. No production script is changed.

The batch plan uses the frozen 245/105 split. The locked runner requires a method
freeze. Run receipts contain exact commands, schema/prompt hashes, exit status,
stdout/stderr and the original response. Frozen linguistic cache evidence is
explicitly distinguished from a fresh NLP call. BGE/E5/NLI are not invoked by
this implementation; no model invocation is claimed for unavailable adapters.

`evaluator.mjs` is offline and imports historical, exposed reference obligations.
It is never imported by the semantic engine. Its incomplete comparison adapters
produce explicit `NOT_VERIFIED` entries; reference-check success is not a claim
of complete natural-language correctness.
