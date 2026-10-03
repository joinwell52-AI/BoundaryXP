# M04 — frozen actual result / NOT SEMANTICALLY CLOSED

Source SHA-256: 2fda4cd312e61e01b41a0a731f92fdb3577f106d4f4fbeb6631ff709c7102041

## Blocks

| block | WP | span | source |
| --- | --- | --- | --- |
| B1 | WP0 | [0,47) | 本任务依据 AUDIT-RULE-3 的 v2.0 版本执行，分为两个检查阶段和一个汇总阶段。 |
| B2 | WP0 | [47,63) | 两个源文件都只能读取，不得修改。 |
| B3 | WP1 | [65,75) | 第一阶段由方敏负责。 |
| B4 | WP1 | [75,143) | 方敏读取 accounts.csv，按照 AUDIT-RULE-3 v2.0 检查账号记录，并生成 account-review.md。 |
| B5 | WP1 | [143,173) | account-review.md 已生成后，第一阶段完成。 |
| B6 | WP2 | [175,185) | 第二阶段由许晨负责。 |
| B7 | WP2 | [185,244) | 许晨读取 permissions.csv，按照同一规则检查权限记录，并生成 permission-review.md。 |
| B8 | WP2 | [244,277) | permission-review.md 已生成后，第二阶段完成。 |
| B9 | WP3 | [279,297) | 两个检查阶段都完成后，汇总阶段开始。 |
| B10 | WP3 | [297,363) | 郭辰读取 account-review.md 和 permission-review.md，生成 audit-summary.md。 |
| B11 | WP3 | [363,392) | audit-summary.md 已生成后，整个任务完成。 |

## WP Tree

```json
{
  "root": "WP0",
  "wps": [
    {
      "wp_id": "WP0",
      "parent_wp_id": null,
      "stage_label": "ROOT_TASK",
      "declaration_span": {
        "source_id": "source:2fda4cd312e61e01b41a0a731f92fdb3577f106d4f4fbeb6631ff709c7102041",
        "start": 0,
        "end": 0,
        "quote": ""
      },
      "block_ids": [
        "B1",
        "B2"
      ],
      "local_run_ids": [
        "view:1"
      ]
    },
    {
      "wp_id": "WP1",
      "parent_wp_id": "WP0",
      "stage_label": "第一阶段",
      "declaration_span": {
        "source_id": "source:2fda4cd312e61e01b41a0a731f92fdb3577f106d4f4fbeb6631ff709c7102041",
        "start": 65,
        "end": 75,
        "quote": "第一阶段由方敏负责。"
      },
      "block_ids": [
        "B3",
        "B4",
        "B5"
      ],
      "local_run_ids": [
        "view:2"
      ]
    },
    {
      "wp_id": "WP2",
      "parent_wp_id": "WP0",
      "stage_label": "第二阶段",
      "declaration_span": {
        "source_id": "source:2fda4cd312e61e01b41a0a731f92fdb3577f106d4f4fbeb6631ff709c7102041",
        "start": 175,
        "end": 185,
        "quote": "第二阶段由许晨负责。"
      },
      "block_ids": [
        "B6",
        "B7",
        "B8"
      ],
      "local_run_ids": [
        "view:3"
      ]
    },
    {
      "wp_id": "WP3",
      "parent_wp_id": "WP0",
      "stage_label": "汇总阶段",
      "declaration_span": {
        "source_id": "source:2fda4cd312e61e01b41a0a731f92fdb3577f106d4f4fbeb6631ff709c7102041",
        "start": 279,
        "end": 297,
        "quote": "两个检查阶段都完成后，汇总阶段开始。"
      },
      "block_ids": [
        "B9",
        "B10",
        "B11"
      ],
      "local_run_ids": [
        "view:4"
      ]
    }
  ]
}
```

## Local 7+1

| WP | slot | status | actual item / state / role |
| --- | --- | --- | --- |
| WP0 | I | ABSENT |  |
| WP0 | O | ABSENT |  |
| WP0 | A | UNRESOLVED |  |
| WP0 | P | ABSENT |  |
| WP0 | R | ABSENT |  |
| WP0 | V | RESOLVED | v2.0 / RESOLVED / GLOBAL_CONSTRAINT |
| WP0 | C | ABSENT |  |
| WP0 | B | UNRESOLVED | PERMITTED 读取 / UNRESOLVED / GLOBAL_CONSTRAINT; FORBIDDEN 修改 / UNRESOLVED / GLOBAL_CONSTRAINT |
| WP1 | I | PARSER_COVERAGE_FAILURE |  |
| WP1 | O | PARSER_COVERAGE_FAILURE | account-review.md / RESOLVED / FINAL_OUTPUT |
| WP1 | A | PARSER_COVERAGE_FAILURE | REQUIRED 生成 account-review.md / RESOLVED / null |
| WP1 | P | PARSER_COVERAGE_FAILURE |  |
| WP1 | R | PARSER_COVERAGE_FAILURE |  |
| WP1 | V | PARSER_COVERAGE_FAILURE | v2.0 / RESOLVED / null; v2.0 / RESOLVED / GLOBAL_CONSTRAINT |
| WP1 | C | UNRESOLVED | 完成 / UNRESOLVED / LOCAL_COMPLETION |
| WP1 | B | PARSER_COVERAGE_FAILURE |  |
| WP2 | I | PARSER_COVERAGE_FAILURE |  |
| WP2 | O | PARSER_COVERAGE_FAILURE | permission-review.md / RESOLVED / FINAL_OUTPUT |
| WP2 | A | PARSER_COVERAGE_FAILURE | REQUIRED 生成 permission-review.md / RESOLVED / null |
| WP2 | P | PARSER_COVERAGE_FAILURE |  |
| WP2 | R | PARSER_COVERAGE_FAILURE |  |
| WP2 | V | PARSER_COVERAGE_FAILURE | v2.0 / RESOLVED / GLOBAL_CONSTRAINT |
| WP2 | C | UNRESOLVED | 完成 / UNRESOLVED / LOCAL_COMPLETION |
| WP2 | B | PARSER_COVERAGE_FAILURE |  |
| WP3 | I | ABSENT |  |
| WP3 | O | RESOLVED | audit-summary.md / RESOLVED / FINAL_OUTPUT |
| WP3 | A | UNRESOLVED | REQUIRED 生成 audit-summary.md / RESOLVED / null |
| WP3 | P | UNRESOLVED | 郭辰 [PERFORMER] / RESOLVED / null |
| WP3 | R | ABSENT |  |
| WP3 | V | RESOLVED | v2.0 / RESOLVED / GLOBAL_CONSTRAINT |
| WP3 | C | UNRESOLVED | 完成 / UNRESOLVED / GLOBAL_COMPLETION |
| WP3 | B | ABSENT |  |

Full expected-vs-actual and every item with provenance: [comparison.json](comparison.json). Source expectations are offline only.

## Semantic Matrix

```json
{
  "columns": [
    "I",
    "O",
    "A",
    "P",
    "R",
    "V",
    "C",
    "B"
  ],
  "rows": [
    {
      "row_id": "WP0",
      "cells": {
        "I": [],
        "O": [],
        "A": [],
        "P": [],
        "R": [],
        "V": [
          "matrix:403f471f3d7adaaef10b947a"
        ],
        "C": [],
        "B": [
          "matrix:e1ac9ffbb0b5010348432b4c",
          "matrix:62cfa2737c452c58b634517d"
        ]
      }
    },
    {
      "row_id": "WP1",
      "cells": {
        "I": [],
        "O": [
          "matrix:e822190ace18d8774c3dc74e"
        ],
        "A": [
          "matrix:d3cc36b730b58302a826383f"
        ],
        "P": [],
        "R": [],
        "V": [
          "matrix:e521035b7a8378fedb79b0b2",
          "matrix:403f471f3d7adaaef10b947a"
        ],
        "C": [
          "matrix:01b5b08e1ee7912f9792baa3"
        ],
        "B": []
      }
    },
    {
      "row_id": "WP2",
      "cells": {
        "I": [],
        "O": [
          "matrix:67db8f6dd7706343ee169661"
        ],
        "A": [
          "matrix:8bd03faafd7b99fdd4af10f7"
        ],
        "P": [],
        "R": [],
        "V": [
          "matrix:403f471f3d7adaaef10b947a"
        ],
        "C": [
          "matrix:343bb39d85bdd871fe5dc9d1"
        ],
        "B": []
      }
    },
    {
      "row_id": "WP3",
      "cells": {
        "I": [],
        "O": [
          "matrix:6993312bc83f8e216a89746a"
        ],
        "A": [
          "matrix:3fb8eb51960123dcb2ea7aad"
        ],
        "P": [
          "matrix:1894f9dad73068f8175342a9"
        ],
        "R": [],
        "V": [
          "matrix:403f471f3d7adaaef10b947a"
        ],
        "C": [
          "matrix:6ad282185bbe8241340cc90b"
        ],
        "B": []
      }
    }
  ],
  "block_rows": [
    {
      "row_id": "B1",
      "cells": {
        "I": [],
        "O": [],
        "A": [],
        "P": [],
        "R": [],
        "V": [
          "matrix:403f471f3d7adaaef10b947a"
        ],
        "C": [],
        "B": []
      }
    },
    {
      "row_id": "B2",
      "cells": {
        "I": [],
        "O": [],
        "A": [],
        "P": [],
        "R": [],
        "V": [
          "matrix:403f471f3d7adaaef10b947a"
        ],
        "C": [],
        "B": [
          "matrix:e1ac9ffbb0b5010348432b4c",
          "matrix:62cfa2737c452c58b634517d"
        ]
      }
    },
    {
      "row_id": "B3",
      "cells": {
        "I": [],
        "O": [],
        "A": [],
        "P": [],
        "R": [],
        "V": [
          "matrix:e521035b7a8378fedb79b0b2"
        ],
        "C": [],
        "B": []
      }
    },
    {
      "row_id": "B4",
      "cells": {
        "I": [],
        "O": [
          "matrix:e822190ace18d8774c3dc74e"
        ],
        "A": [
          "matrix:d3cc36b730b58302a826383f"
        ],
        "P": [],
        "R": [],
        "V": [
          "matrix:e521035b7a8378fedb79b0b2"
        ],
        "C": [],
        "B": []
      }
    },
    {
      "row_id": "B5",
      "cells": {
        "I": [],
        "O": [],
        "A": [],
        "P": [],
        "R": [],
        "V": [
          "matrix:e521035b7a8378fedb79b0b2"
        ],
        "C": [
          "matrix:01b5b08e1ee7912f9792baa3"
        ],
        "B": []
      }
    },
    {
      "row_id": "B6",
      "cells": {
        "I": [],
        "O": [],
        "A": [],
        "P": [],
        "R": [],
        "V": [],
        "C": [],
        "B": []
      }
    },
    {
      "row_id": "B7",
      "cells": {
        "I": [],
        "O": [
          "matrix:67db8f6dd7706343ee169661"
        ],
        "A": [
          "matrix:8bd03faafd7b99fdd4af10f7"
        ],
        "P": [],
        "R": [],
        "V": [],
        "C": [],
        "B": []
      }
    },
    {
      "row_id": "B8",
      "cells": {
        "I": [],
        "O": [],
        "A": [],
        "P": [],
        "R": [],
        "V": [],
        "C": [
          "matrix:343bb39d85bdd871fe5dc9d1"
        ],
        "B": []
      }
    },
    {
      "row_id": "B9",
      "cells": {
        "I": [],
        "O": [],
        "A": [],
        "P": [],
        "R": [],
        "V": [],
        "C": [],
        "B": []
      }
    },
    {
      "row_id": "B10",
      "cells": {
        "I": [],
        "O": [
          "matrix:6993312bc83f8e216a89746a"
        ],
        "A": [
          "matrix:3fb8eb51960123dcb2ea7aad"
        ],
        "P": [
          "matrix:1894f9dad73068f8175342a9"
        ],
        "R": [],
        "V": [],
        "C": [],
        "B": []
      }
    },
    {
      "row_id": "B11",
      "cells": {
        "I": [],
        "O": [],
        "A": [],
        "P": [],
        "R": [],
        "V": [],
        "C": [
          "matrix:6ad282185bbe8241340cc90b"
        ],
        "B": []
      }
    }
  ]
}
```

## Dependency DAG

```json
{
  "edges": [
    {
      "edge_id": "matrix:677abba909ce7c0e7e499a7e",
      "type": "USES_AS_BASIS",
      "from_wp": "WP1",
      "to_wp": "WP0",
      "basis_item_id": "matrix:403f471f3d7adaaef10b947a",
      "state": "RESOLVED",
      "source_spans": [
        {
          "source_id": "source:2fda4cd312e61e01b41a0a731f92fdb3577f106d4f4fbeb6631ff709c7102041",
          "start": 21,
          "end": 25,
          "quote": "v2.0"
        },
        {
          "source_id": "source:2fda4cd312e61e01b41a0a731f92fdb3577f106d4f4fbeb6631ff709c7102041",
          "start": 0,
          "end": 30,
          "quote": "本任务依据 AUDIT-RULE-3 的 v2.0 版本执行"
        },
        {
          "source_id": "source:2fda4cd312e61e01b41a0a731f92fdb3577f106d4f4fbeb6631ff709c7102041",
          "start": 0,
          "end": 63,
          "quote": "本任务依据 AUDIT-RULE-3 的 v2.0 版本执行，分为两个检查阶段和一个汇总阶段。两个源文件都只能读取，不得修改。"
        }
      ],
      "proof": {
        "rule": "EXPLICIT_ROOT_BASIS",
        "local": {
          "local_run_id": "view:1",
          "source_sha256": "b75acc93f67f2cbee3c2e078bec7361740607f75343f4e11ad1a1e522613ec81",
          "canonical_entry_id": "p1:4868840d270b75f296b88f0f",
          "source_offset": 0,
          "local_proof_refs": [
            "p1:915ebd292c833d7f285d3115",
            "p1:7eab1f606584ab1781dc2e3e"
          ],
          "boundary_fact_ids": [
            "p1:54c94a1a1c0df10625e57170"
          ],
          "contract_gate": "PASS"
        }
      }
    },
    {
      "edge_id": "matrix:1bdc6decdab87f358e135a07",
      "type": "USES_AS_BASIS",
      "from_wp": "WP2",
      "to_wp": "WP0",
      "basis_item_id": "matrix:403f471f3d7adaaef10b947a",
      "state": "RESOLVED",
      "source_spans": [
        {
          "source_id": "source:2fda4cd312e61e01b41a0a731f92fdb3577f106d4f4fbeb6631ff709c7102041",
          "start": 21,
          "end": 25,
          "quote": "v2.0"
        },
        {
          "source_id": "source:2fda4cd312e61e01b41a0a731f92fdb3577f106d4f4fbeb6631ff709c7102041",
          "start": 0,
          "end": 30,
          "quote": "本任务依据 AUDIT-RULE-3 的 v2.0 版本执行"
        },
        {
          "source_id": "source:2fda4cd312e61e01b41a0a731f92fdb3577f106d4f4fbeb6631ff709c7102041",
          "start": 0,
          "end": 63,
          "quote": "本任务依据 AUDIT-RULE-3 的 v2.0 版本执行，分为两个检查阶段和一个汇总阶段。两个源文件都只能读取，不得修改。"
        }
      ],
      "proof": {
        "rule": "EXPLICIT_ROOT_BASIS",
        "local": {
          "local_run_id": "view:1",
          "source_sha256": "b75acc93f67f2cbee3c2e078bec7361740607f75343f4e11ad1a1e522613ec81",
          "canonical_entry_id": "p1:4868840d270b75f296b88f0f",
          "source_offset": 0,
          "local_proof_refs": [
            "p1:915ebd292c833d7f285d3115",
            "p1:7eab1f606584ab1781dc2e3e"
          ],
          "boundary_fact_ids": [
            "p1:54c94a1a1c0df10625e57170"
          ],
          "contract_gate": "PASS"
        }
      }
    },
    {
      "edge_id": "matrix:9862f404dccd63d071a7746d",
      "type": "USES_AS_BASIS",
      "from_wp": "WP3",
      "to_wp": "WP0",
      "basis_item_id": "matrix:403f471f3d7adaaef10b947a",
      "state": "RESOLVED",
      "source_spans": [
        {
          "source_id": "source:2fda4cd312e61e01b41a0a731f92fdb3577f106d4f4fbeb6631ff709c7102041",
          "start": 21,
          "end": 25,
          "quote": "v2.0"
        },
        {
          "source_id": "source:2fda4cd312e61e01b41a0a731f92fdb3577f106d4f4fbeb6631ff709c7102041",
          "start": 0,
          "end": 30,
          "quote": "本任务依据 AUDIT-RULE-3 的 v2.0 版本执行"
        },
        {
          "source_id": "source:2fda4cd312e61e01b41a0a731f92fdb3577f106d4f4fbeb6631ff709c7102041",
          "start": 0,
          "end": 63,
          "quote": "本任务依据 AUDIT-RULE-3 的 v2.0 版本执行，分为两个检查阶段和一个汇总阶段。两个源文件都只能读取，不得修改。"
        }
      ],
      "proof": {
        "rule": "EXPLICIT_ROOT_BASIS",
        "local": {
          "local_run_id": "view:1",
          "source_sha256": "b75acc93f67f2cbee3c2e078bec7361740607f75343f4e11ad1a1e522613ec81",
          "canonical_entry_id": "p1:4868840d270b75f296b88f0f",
          "source_offset": 0,
          "local_proof_refs": [
            "p1:915ebd292c833d7f285d3115",
            "p1:7eab1f606584ab1781dc2e3e"
          ],
          "boundary_fact_ids": [
            "p1:54c94a1a1c0df10625e57170"
          ],
          "contract_gate": "PASS"
        }
      }
    }
  ],
  "unresolved_edges": [
    {
      "edge_id": "matrix:65349158fdacf8aff45d4746",
      "type": "REQUIRES_COMPLETION",
      "from_wp": "WP3",
      "to_wp": "WP1",
      "state": "UNRESOLVED",
      "source_spans": [
        {
          "source_id": "source:2fda4cd312e61e01b41a0a731f92fdb3577f106d4f4fbeb6631ff709c7102041",
          "start": 279,
          "end": 297,
          "quote": "两个检查阶段都完成后，汇总阶段开始。"
        }
      ],
      "proof": {
        "rule": "EXPLICIT_ORCHESTRATION_SYNTAX",
        "block_id": "B9"
      },
      "enable_wp": "WP3",
      "join_operator": "AND",
      "join_id": "matrix:ca9912da7742b8b88a98d5cd",
      "reason": "Predecessor completion is not uniquely certified by local R2",
      "candidate_completion_ids": []
    },
    {
      "edge_id": "matrix:be933dc4e466e4448a488056",
      "type": "REQUIRES_COMPLETION",
      "from_wp": "WP3",
      "to_wp": "WP2",
      "state": "UNRESOLVED",
      "source_spans": [
        {
          "source_id": "source:2fda4cd312e61e01b41a0a731f92fdb3577f106d4f4fbeb6631ff709c7102041",
          "start": 279,
          "end": 297,
          "quote": "两个检查阶段都完成后，汇总阶段开始。"
        }
      ],
      "proof": {
        "rule": "EXPLICIT_ORCHESTRATION_SYNTAX",
        "block_id": "B9"
      },
      "enable_wp": "WP3",
      "join_operator": "AND",
      "join_id": "matrix:ca9912da7742b8b88a98d5cd",
      "reason": "Predecessor completion is not uniquely certified by local R2",
      "candidate_completion_ids": []
    }
  ],
  "scheduling_edges": [],
  "acyclic": true
}
```

## Global 7+1

| slot | status | items |
| --- | --- | --- |
| I | PARSER_COVERAGE_FAILURE |  |
| O | PARSER_COVERAGE_FAILURE | WP1: account-review.md [RESOLVED, FINAL_OUTPUT]; WP2: permission-review.md [RESOLVED, FINAL_OUTPUT]; WP3: audit-summary.md [RESOLVED, FINAL_OUTPUT] |
| A | PARSER_COVERAGE_FAILURE | WP1: REQUIRED 生成 account-review.md [RESOLVED, null]; WP2: REQUIRED 生成 permission-review.md [RESOLVED, null]; WP3: REQUIRED 生成 audit-summary.md [RESOLVED, null] |
| P | PARSER_COVERAGE_FAILURE | WP3: 郭辰 [PERFORMER] [RESOLVED, null] |
| R | PARSER_COVERAGE_FAILURE |  |
| V | PARSER_COVERAGE_FAILURE | WP0: v2.0 [RESOLVED, GLOBAL_CONSTRAINT]; WP1: v2.0 [RESOLVED, null] |
| C | UNRESOLVED | WP1: 完成 [UNRESOLVED, LOCAL_COMPLETION]; WP2: 完成 [UNRESOLVED, LOCAL_COMPLETION]; WP3: 完成 [UNRESOLVED, GLOBAL_COMPLETION] |
| B | PARSER_COVERAGE_FAILURE | WP0: PERMITTED 读取 [UNRESOLVED, GLOBAL_CONSTRAINT]; WP0: FORBIDDEN 修改 [UNRESOLVED, GLOBAL_CONSTRAINT] |

## Gate

```json
{
  "case_id": "M04",
  "source_sha256": "2fda4cd312e61e01b41a0a731f92fdb3577f106d4f4fbeb6631ff709c7102041",
  "blocks": true,
  "wp_tree": true,
  "local_7plus1": false,
  "dependency_dag": false,
  "matrix_structure": true,
  "semantic_matrix": false,
  "global_7plus1": false,
  "expected_edges": [
    {
      "type": "PRODUCES_FOR",
      "from_wp": "WP1",
      "to_wp": "WP3",
      "file": "account-review.md",
      "matching_edges": []
    },
    {
      "type": "CONSUMES_OUTPUT",
      "from_wp": "WP3",
      "to_wp": "WP1",
      "file": "account-review.md",
      "matching_edges": []
    },
    {
      "type": "REQUIRES_COMPLETION",
      "from_wp": "WP3",
      "to_wp": "WP1",
      "file": "account-review.md",
      "matching_edges": []
    },
    {
      "type": "PRODUCES_FOR",
      "from_wp": "WP2",
      "to_wp": "WP3",
      "file": "permission-review.md",
      "matching_edges": []
    },
    {
      "type": "CONSUMES_OUTPUT",
      "from_wp": "WP3",
      "to_wp": "WP2",
      "file": "permission-review.md",
      "matching_edges": []
    },
    {
      "type": "REQUIRES_COMPLETION",
      "from_wp": "WP3",
      "to_wp": "WP2",
      "file": "permission-review.md",
      "matching_edges": []
    },
    {
      "type": "USES_AS_BASIS",
      "from_wp": "WP1",
      "to_wp": "WP0",
      "matching_edges": [
        "matrix:677abba909ce7c0e7e499a7e"
      ]
    },
    {
      "type": "USES_AS_BASIS",
      "from_wp": "WP2",
      "to_wp": "WP0",
      "matching_edges": [
        "matrix:1bdc6decdab87f358e135a07"
      ]
    },
    {
      "type": "USES_AS_BASIS",
      "from_wp": "WP3",
      "to_wp": "WP0",
      "matching_edges": [
        "matrix:9862f404dccd63d071a7746d"
      ]
    }
  ],
  "wrong_wp": 0,
  "cross_wp_source_contamination": 0,
  "wrong_oi_identity": 0,
  "wrong_completion_binding": 0,
  "missing_oi": 2,
  "missing_completion": 2,
  "unsupported_resolved_orchestration": 3,
  "parallel": false,
  "no_predecessor_order": true,
  "first_divergence": {
    "type": "UNRESOLVED_RELATION",
    "wp_id": "WP0",
    "local_run_id": "view:1",
    "local_unresolved_id": "p1:7575be69f5316bbb2b9cb891",
    "reason": "Action modality is not explicit",
    "source_spans": [
      {
        "source_id": "source:2fda4cd312e61e01b41a0a731f92fdb3577f106d4f4fbeb6631ff709c7102041",
        "start": 0,
        "end": 30,
        "quote": "本任务依据 AUDIT-RULE-3 的 v2.0 版本执行"
      }
    ]
  }
}
```

Complete immutable trace: [trace.json](../../final-first/M04/trace.json).
