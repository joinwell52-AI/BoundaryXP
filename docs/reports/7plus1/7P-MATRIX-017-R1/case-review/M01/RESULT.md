# M01 — frozen actual result / NOT SEMANTICALLY CLOSED

Source SHA-256: 6116a41d97c8ba56e82bf0d7c9c38621f68889fae5253480ed5b941d18f7e0a0

## Blocks

| block | WP | span | source |
| --- | --- | --- | --- |
| B1 | WP0 | [0,9) | 本任务分两个阶段。 |
| B2 | WP1 | [11,21) | 第一阶段由张宁负责。 |
| B3 | WP1 | [21,61) | 张宁读取 inventory.csv，检查重复记录，并生成 issues.md。 |
| B4 | WP1 | [61,83) | issues.md 已生成后，第一阶段完成。 |
| B5 | WP2 | [85,102) | 第二阶段必须在第一阶段完成后开始。 |
| B6 | WP2 | [102,147) | 李凯读取 issues.md，根据其中的问题生成 remediation-plan.md。 |
| B7 | WP2 | [147,179) | remediation-plan.md 已生成后，整个任务完成。 |
| B8 | WP0 | [181,200) | 不得修改 inventory.csv。 |

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
        "source_id": "source:6116a41d97c8ba56e82bf0d7c9c38621f68889fae5253480ed5b941d18f7e0a0",
        "start": 0,
        "end": 0,
        "quote": ""
      },
      "block_ids": [
        "B1",
        "B8"
      ],
      "local_run_ids": [
        "view:1",
        "view:4"
      ]
    },
    {
      "wp_id": "WP1",
      "parent_wp_id": "WP0",
      "stage_label": "第一阶段",
      "declaration_span": {
        "source_id": "source:6116a41d97c8ba56e82bf0d7c9c38621f68889fae5253480ed5b941d18f7e0a0",
        "start": 11,
        "end": 21,
        "quote": "第一阶段由张宁负责。"
      },
      "block_ids": [
        "B2",
        "B3",
        "B4"
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
        "source_id": "source:6116a41d97c8ba56e82bf0d7c9c38621f68889fae5253480ed5b941d18f7e0a0",
        "start": 85,
        "end": 102,
        "quote": "第二阶段必须在第一阶段完成后开始。"
      },
      "block_ids": [
        "B5",
        "B6",
        "B7"
      ],
      "local_run_ids": [
        "view:3"
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
| WP0 | A | ABSENT |  |
| WP0 | P | ABSENT |  |
| WP0 | R | ABSENT |  |
| WP0 | V | ABSENT |  |
| WP0 | C | ABSENT |  |
| WP0 | B | RESOLVED | FORBIDDEN 修改 inventory.csv / RESOLVED / GLOBAL_CONSTRAINT |
| WP1 | I | PARSER_COVERAGE_FAILURE |  |
| WP1 | O | PARSER_COVERAGE_FAILURE | issues.md / RESOLVED / FINAL_OUTPUT |
| WP1 | A | UNRESOLVED | REQUIRED 检查 / UNRESOLVED / null; REQUIRED 生成 issues.md / RESOLVED / null |
| WP1 | P | PARSER_COVERAGE_FAILURE | 张宁 [PERFORMER] / RESOLVED / null |
| WP1 | R | PARSER_COVERAGE_FAILURE |  |
| WP1 | V | PARSER_COVERAGE_FAILURE |  |
| WP1 | C | UNRESOLVED | 完成 / UNRESOLVED / LOCAL_COMPLETION |
| WP1 | B | PARSER_COVERAGE_FAILURE |  |
| WP2 | I | ABSENT |  |
| WP2 | O | UNRESOLVED |  |
| WP2 | A | UNRESOLVED | REQUIRED 后开始 / RESOLVED / null |
| WP2 | P | UNRESOLVED | 李凯 [PERFORMER] / RESOLVED / null |
| WP2 | R | ABSENT |  |
| WP2 | V | RESOLVED | remediation-plan.md / RESOLVED / null |
| WP2 | C | UNRESOLVED | 完成 / RESOLVED / GLOBAL_COMPLETION |
| WP2 | B | ABSENT |  |

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
        "V": [],
        "C": [],
        "B": [
          "matrix:8dfa5afe16a6bcbce8dd6377"
        ]
      }
    },
    {
      "row_id": "WP1",
      "cells": {
        "I": [],
        "O": [
          "matrix:6794a76336078f8f6e75c193"
        ],
        "A": [
          "matrix:cac26ad8ce6f4e7134a47cf2",
          "matrix:d29dca496138966dab8a4f4e"
        ],
        "P": [
          "matrix:2cc78ae3b3f67552dd86e00a"
        ],
        "R": [],
        "V": [],
        "C": [
          "matrix:26056ec41da9d5a1be4b7ba4"
        ],
        "B": []
      }
    },
    {
      "row_id": "WP2",
      "cells": {
        "I": [],
        "O": [],
        "A": [
          "matrix:d939e5b6783f0c36453e8e81"
        ],
        "P": [
          "matrix:d35c45a3b2feeb7f23a495a5"
        ],
        "R": [],
        "V": [
          "matrix:096ec1c17bfc0db29567865f"
        ],
        "C": [
          "matrix:96d361916f69061cdba9cab3"
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
        "V": [],
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
        "V": [],
        "C": [],
        "B": []
      }
    },
    {
      "row_id": "B3",
      "cells": {
        "I": [],
        "O": [
          "matrix:6794a76336078f8f6e75c193"
        ],
        "A": [
          "matrix:cac26ad8ce6f4e7134a47cf2",
          "matrix:d29dca496138966dab8a4f4e"
        ],
        "P": [
          "matrix:2cc78ae3b3f67552dd86e00a"
        ],
        "R": [],
        "V": [],
        "C": [],
        "B": []
      }
    },
    {
      "row_id": "B4",
      "cells": {
        "I": [],
        "O": [],
        "A": [],
        "P": [],
        "R": [],
        "V": [],
        "C": [
          "matrix:26056ec41da9d5a1be4b7ba4"
        ],
        "B": []
      }
    },
    {
      "row_id": "B5",
      "cells": {
        "I": [],
        "O": [],
        "A": [
          "matrix:d939e5b6783f0c36453e8e81"
        ],
        "P": [],
        "R": [],
        "V": [
          "matrix:096ec1c17bfc0db29567865f"
        ],
        "C": [],
        "B": []
      }
    },
    {
      "row_id": "B6",
      "cells": {
        "I": [],
        "O": [],
        "A": [],
        "P": [
          "matrix:d35c45a3b2feeb7f23a495a5"
        ],
        "R": [],
        "V": [
          "matrix:096ec1c17bfc0db29567865f"
        ],
        "C": [],
        "B": []
      }
    },
    {
      "row_id": "B7",
      "cells": {
        "I": [],
        "O": [],
        "A": [],
        "P": [],
        "R": [],
        "V": [
          "matrix:096ec1c17bfc0db29567865f"
        ],
        "C": [
          "matrix:96d361916f69061cdba9cab3"
        ],
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
        "C": [],
        "B": [
          "matrix:8dfa5afe16a6bcbce8dd6377"
        ]
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
      "edge_id": "matrix:749a44d39bca0294b7a4c829",
      "type": "SEQUENCE",
      "from_wp": "WP1",
      "to_wp": "WP2",
      "state": "RESOLVED",
      "source_spans": [
        {
          "source_id": "source:6116a41d97c8ba56e82bf0d7c9c38621f68889fae5253480ed5b941d18f7e0a0",
          "start": 85,
          "end": 102,
          "quote": "第二阶段必须在第一阶段完成后开始。"
        }
      ],
      "proof": {
        "rule": "EXPLICIT_ORCHESTRATION_SYNTAX",
        "block_id": "B5"
      }
    }
  ],
  "unresolved_edges": [
    {
      "edge_id": "matrix:8a4808afc8bc57f1e945db1c",
      "type": "REQUIRES_COMPLETION",
      "from_wp": "WP2",
      "to_wp": "WP1",
      "state": "UNRESOLVED",
      "source_spans": [
        {
          "source_id": "source:6116a41d97c8ba56e82bf0d7c9c38621f68889fae5253480ed5b941d18f7e0a0",
          "start": 85,
          "end": 102,
          "quote": "第二阶段必须在第一阶段完成后开始。"
        }
      ],
      "proof": {
        "rule": "EXPLICIT_ORCHESTRATION_SYNTAX",
        "block_id": "B5"
      },
      "enable_wp": "WP2",
      "join_operator": null,
      "join_id": null,
      "reason": "Predecessor completion is not uniquely certified by local R2",
      "candidate_completion_ids": []
    }
  ],
  "scheduling_edges": [
    {
      "from": "WP1",
      "to": "WP2",
      "evidence_edge_id": "matrix:749a44d39bca0294b7a4c829"
    }
  ],
  "acyclic": true
}
```

## Global 7+1

| slot | status | items |
| --- | --- | --- |
| I | PARSER_COVERAGE_FAILURE |  |
| O | PARSER_COVERAGE_FAILURE | WP1: issues.md [RESOLVED, FINAL_OUTPUT] |
| A | UNRESOLVED | WP1: REQUIRED 检查 [UNRESOLVED, null]; WP1: REQUIRED 生成 issues.md [RESOLVED, null]; WP2: REQUIRED 后开始 [RESOLVED, null] |
| P | PARSER_COVERAGE_FAILURE | WP1: 张宁 [PERFORMER] [RESOLVED, null]; WP2: 李凯 [PERFORMER] [RESOLVED, null] |
| R | PARSER_COVERAGE_FAILURE |  |
| V | PARSER_COVERAGE_FAILURE | WP2: remediation-plan.md [RESOLVED, null] |
| C | UNRESOLVED | WP1: 完成 [UNRESOLVED, LOCAL_COMPLETION]; WP2: 完成 [RESOLVED, GLOBAL_COMPLETION] |
| B | PARSER_COVERAGE_FAILURE | WP0: FORBIDDEN 修改 inventory.csv [RESOLVED, GLOBAL_CONSTRAINT] |

## Gate

```json
{
  "case_id": "M01",
  "source_sha256": "6116a41d97c8ba56e82bf0d7c9c38621f68889fae5253480ed5b941d18f7e0a0",
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
      "to_wp": "WP2",
      "file": "issues.md",
      "matching_edges": []
    },
    {
      "type": "CONSUMES_OUTPUT",
      "from_wp": "WP2",
      "to_wp": "WP1",
      "file": "issues.md",
      "matching_edges": []
    },
    {
      "type": "REQUIRES_COMPLETION",
      "from_wp": "WP2",
      "to_wp": "WP1",
      "file": "issues.md",
      "matching_edges": []
    },
    {
      "type": "SEQUENCE",
      "from_wp": "WP1",
      "to_wp": "WP2",
      "matching_edges": [
        "matrix:749a44d39bca0294b7a4c829"
      ]
    }
  ],
  "wrong_wp": 0,
  "cross_wp_source_contamination": 0,
  "wrong_oi_identity": 0,
  "wrong_completion_binding": 0,
  "missing_oi": 1,
  "missing_completion": 1,
  "unsupported_resolved_orchestration": 0,
  "parallel": false,
  "no_predecessor_order": false,
  "first_divergence": {
    "type": "UNRESOLVED_RELATION",
    "wp_id": "WP1",
    "local_run_id": "view:2",
    "local_unresolved_id": "p1:c7ff8d6f12edce2f6ece7f3a",
    "reason": "Action modality is not explicit",
    "source_spans": [
      {
        "source_id": "source:6116a41d97c8ba56e82bf0d7c9c38621f68889fae5253480ed5b941d18f7e0a0",
        "start": 21,
        "end": 39,
        "quote": "张宁读取 inventory.csv"
      }
    ]
  }
}
```

Complete immutable trace: [trace.json](../../final-first/M01/trace.json).
