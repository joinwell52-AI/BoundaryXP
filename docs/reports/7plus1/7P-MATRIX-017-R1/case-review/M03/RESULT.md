# M03 — frozen actual result / NOT SEMANTICALLY CLOSED

Source SHA-256: 6714fce1c04e4782a16d41b7f7a214ad932efe169278340870c02ced4fb9189a

## Blocks

| block | WP | span | source |
| --- | --- | --- | --- |
| B1 | WP0 | [0,23) | 本任务包含两个可并行的检查阶段和一个汇总阶段。 |
| B2 | WP1 | [25,37) | API 检查由赵岚负责。 |
| B3 | WP1 | [37,67) | 赵岚读取 spec.md，生成 api-review.md。 |
| B4 | WP1 | [67,95) | api-review.md 已生成后，API 检查完成。 |
| B5 | WP2 | [97,107) | 安全检查由何清负责。 |
| B6 | WP2 | [107,142) | 何清读取 spec.md，生成 security-review.md。 |
| B7 | WP2 | [142,173) | security-review.md 已生成后，安全检查完成。 |
| B8 | WP0 | [175,186) | 两个检查阶段可以并行。 |
| B9 | WP3 | [186,212) | 汇总阶段只有在 API 检查和安全检查都完成后开始。 |
| B10 | WP3 | [212,273) | 陈路读取 api-review.md 和 security-review.md，生成 release-review.md。 |
| B11 | WP3 | [273,303) | release-review.md 已生成后，整个任务完成。 |
| B12 | WP0 | [305,318) | 不得修改 spec.md。 |

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
        "source_id": "source:6714fce1c04e4782a16d41b7f7a214ad932efe169278340870c02ced4fb9189a",
        "start": 0,
        "end": 0,
        "quote": ""
      },
      "block_ids": [
        "B1",
        "B8",
        "B12"
      ],
      "local_run_ids": [
        "view:1",
        "view:4",
        "view:6"
      ]
    },
    {
      "wp_id": "WP1",
      "parent_wp_id": "WP0",
      "stage_label": "API 检查",
      "declaration_span": {
        "source_id": "source:6714fce1c04e4782a16d41b7f7a214ad932efe169278340870c02ced4fb9189a",
        "start": 25,
        "end": 37,
        "quote": "API 检查由赵岚负责。"
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
      "stage_label": "安全检查",
      "declaration_span": {
        "source_id": "source:6714fce1c04e4782a16d41b7f7a214ad932efe169278340870c02ced4fb9189a",
        "start": 97,
        "end": 107,
        "quote": "安全检查由何清负责。"
      },
      "block_ids": [
        "B5",
        "B6",
        "B7"
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
        "source_id": "source:6714fce1c04e4782a16d41b7f7a214ad932efe169278340870c02ced4fb9189a",
        "start": 186,
        "end": 212,
        "quote": "汇总阶段只有在 API 检查和安全检查都完成后开始。"
      },
      "block_ids": [
        "B9",
        "B10",
        "B11"
      ],
      "local_run_ids": [
        "view:5"
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
| WP0 | B | RESOLVED | FORBIDDEN 修改 spec.md / RESOLVED / GLOBAL_CONSTRAINT |
| WP1 | I | PARSER_COVERAGE_FAILURE |  |
| WP1 | O | PARSER_COVERAGE_FAILURE | api-review.md / RESOLVED / FINAL_OUTPUT |
| WP1 | A | PARSER_COVERAGE_FAILURE | REQUIRED 生成 api-review.md / RESOLVED / null |
| WP1 | P | PARSER_COVERAGE_FAILURE | 赵岚 [PERFORMER] / RESOLVED / null |
| WP1 | R | PARSER_COVERAGE_FAILURE |  |
| WP1 | V | PARSER_COVERAGE_FAILURE |  |
| WP1 | C | UNRESOLVED | 完成 / UNRESOLVED / LOCAL_COMPLETION |
| WP1 | B | PARSER_COVERAGE_FAILURE |  |
| WP2 | I | PARSER_COVERAGE_FAILURE |  |
| WP2 | O | PARSER_COVERAGE_FAILURE | security-review.md / RESOLVED / FINAL_OUTPUT |
| WP2 | A | PARSER_COVERAGE_FAILURE | REQUIRED 生成 security-review.md / RESOLVED / null |
| WP2 | P | PARSER_COVERAGE_FAILURE |  |
| WP2 | R | PARSER_COVERAGE_FAILURE |  |
| WP2 | V | PARSER_COVERAGE_FAILURE |  |
| WP2 | C | UNRESOLVED | 完成 / UNRESOLVED / LOCAL_COMPLETION |
| WP2 | B | PARSER_COVERAGE_FAILURE |  |
| WP3 | I | ABSENT |  |
| WP3 | O | RESOLVED | release-review.md / RESOLVED / FINAL_OUTPUT |
| WP3 | A | UNRESOLVED | REQUIRED 生成 release-review.md / RESOLVED / null |
| WP3 | P | UNRESOLVED | 陈路 [PERFORMER] / RESOLVED / null |
| WP3 | R | ABSENT |  |
| WP3 | V | ABSENT |  |
| WP3 | C | RESOLVED | 完成 / RESOLVED / GLOBAL_COMPLETION |
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
        "V": [],
        "C": [],
        "B": [
          "matrix:15728e85d26f7012a4693121"
        ]
      }
    },
    {
      "row_id": "WP1",
      "cells": {
        "I": [],
        "O": [
          "matrix:229b2ed529e83f5331ef0342"
        ],
        "A": [
          "matrix:1d04e6277bf4623a82c6f811"
        ],
        "P": [
          "matrix:fc2aa17d114c3697c937709c"
        ],
        "R": [],
        "V": [],
        "C": [
          "matrix:aa87f78615054a435d1919d5"
        ],
        "B": []
      }
    },
    {
      "row_id": "WP2",
      "cells": {
        "I": [],
        "O": [
          "matrix:6745ed4c615f5c2b17815bab"
        ],
        "A": [
          "matrix:c5191aa282ed57e8640651f0"
        ],
        "P": [],
        "R": [],
        "V": [],
        "C": [
          "matrix:19775cc380ff4685e6a1fffc"
        ],
        "B": []
      }
    },
    {
      "row_id": "WP3",
      "cells": {
        "I": [],
        "O": [
          "matrix:96490278b8871b37141a0a34"
        ],
        "A": [
          "matrix:28642606c5b800b0732991f4"
        ],
        "P": [
          "matrix:f66fedb578f9c48e2891fd36"
        ],
        "R": [],
        "V": [],
        "C": [
          "matrix:f3e03e036898343e2c736618"
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
          "matrix:229b2ed529e83f5331ef0342"
        ],
        "A": [
          "matrix:1d04e6277bf4623a82c6f811"
        ],
        "P": [
          "matrix:fc2aa17d114c3697c937709c"
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
          "matrix:aa87f78615054a435d1919d5"
        ],
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
        "V": [],
        "C": [],
        "B": []
      }
    },
    {
      "row_id": "B6",
      "cells": {
        "I": [],
        "O": [
          "matrix:6745ed4c615f5c2b17815bab"
        ],
        "A": [
          "matrix:c5191aa282ed57e8640651f0"
        ],
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
        "O": [],
        "A": [],
        "P": [],
        "R": [],
        "V": [],
        "C": [
          "matrix:19775cc380ff4685e6a1fffc"
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
          "matrix:96490278b8871b37141a0a34"
        ],
        "A": [
          "matrix:28642606c5b800b0732991f4"
        ],
        "P": [
          "matrix:f66fedb578f9c48e2891fd36"
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
          "matrix:f3e03e036898343e2c736618"
        ],
        "B": []
      }
    },
    {
      "row_id": "B12",
      "cells": {
        "I": [],
        "O": [],
        "A": [],
        "P": [],
        "R": [],
        "V": [],
        "C": [],
        "B": [
          "matrix:15728e85d26f7012a4693121"
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
      "edge_id": "matrix:be136ee813bab80279f7494c",
      "type": "PARALLEL",
      "from_wp": "WP1",
      "to_wp": "WP2",
      "state": "RESOLVED",
      "source_spans": [
        {
          "source_id": "source:6714fce1c04e4782a16d41b7f7a214ad932efe169278340870c02ced4fb9189a",
          "start": 175,
          "end": 186,
          "quote": "两个检查阶段可以并行。"
        }
      ],
      "proof": {
        "rule": "POSITIVE_PARALLEL_PERMISSION_AND_UNIQUE_TWO_SIBLINGS",
        "block_id": "B8",
        "declaration_spans": [
          {
            "source_id": "source:6714fce1c04e4782a16d41b7f7a214ad932efe169278340870c02ced4fb9189a",
            "start": 25,
            "end": 37,
            "quote": "API 检查由赵岚负责。"
          },
          {
            "source_id": "source:6714fce1c04e4782a16d41b7f7a214ad932efe169278340870c02ced4fb9189a",
            "start": 97,
            "end": 107,
            "quote": "安全检查由何清负责。"
          }
        ]
      }
    }
  ],
  "unresolved_edges": [
    {
      "edge_id": "matrix:416b33587b9d6ca8200f117f",
      "type": "REQUIRES_COMPLETION",
      "from_wp": "WP3",
      "to_wp": "WP1",
      "state": "UNRESOLVED",
      "source_spans": [
        {
          "source_id": "source:6714fce1c04e4782a16d41b7f7a214ad932efe169278340870c02ced4fb9189a",
          "start": 186,
          "end": 212,
          "quote": "汇总阶段只有在 API 检查和安全检查都完成后开始。"
        }
      ],
      "proof": {
        "rule": "EXPLICIT_ORCHESTRATION_SYNTAX",
        "block_id": "B9"
      },
      "enable_wp": "WP3",
      "join_operator": "AND",
      "join_id": "matrix:5653f2d08419446eeb9faf58",
      "reason": "Predecessor completion is not uniquely certified by local R2",
      "candidate_completion_ids": []
    },
    {
      "edge_id": "matrix:dcec41d92d91d2627f09f0a4",
      "type": "REQUIRES_COMPLETION",
      "from_wp": "WP3",
      "to_wp": "WP2",
      "state": "UNRESOLVED",
      "source_spans": [
        {
          "source_id": "source:6714fce1c04e4782a16d41b7f7a214ad932efe169278340870c02ced4fb9189a",
          "start": 186,
          "end": 212,
          "quote": "汇总阶段只有在 API 检查和安全检查都完成后开始。"
        }
      ],
      "proof": {
        "rule": "EXPLICIT_ORCHESTRATION_SYNTAX",
        "block_id": "B9"
      },
      "enable_wp": "WP3",
      "join_operator": "AND",
      "join_id": "matrix:5653f2d08419446eeb9faf58",
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
| O | PARSER_COVERAGE_FAILURE | WP1: api-review.md [RESOLVED, FINAL_OUTPUT]; WP2: security-review.md [RESOLVED, FINAL_OUTPUT]; WP3: release-review.md [RESOLVED, FINAL_OUTPUT] |
| A | PARSER_COVERAGE_FAILURE | WP1: REQUIRED 生成 api-review.md [RESOLVED, null]; WP2: REQUIRED 生成 security-review.md [RESOLVED, null]; WP3: REQUIRED 生成 release-review.md [RESOLVED, null] |
| P | PARSER_COVERAGE_FAILURE | WP1: 赵岚 [PERFORMER] [RESOLVED, null]; WP3: 陈路 [PERFORMER] [RESOLVED, null] |
| R | PARSER_COVERAGE_FAILURE |  |
| V | PARSER_COVERAGE_FAILURE |  |
| C | UNRESOLVED | WP1: 完成 [UNRESOLVED, LOCAL_COMPLETION]; WP2: 完成 [UNRESOLVED, LOCAL_COMPLETION]; WP3: 完成 [RESOLVED, GLOBAL_COMPLETION] |
| B | PARSER_COVERAGE_FAILURE | WP0: FORBIDDEN 修改 spec.md [RESOLVED, GLOBAL_CONSTRAINT] |

## Gate

```json
{
  "case_id": "M03",
  "source_sha256": "6714fce1c04e4782a16d41b7f7a214ad932efe169278340870c02ced4fb9189a",
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
      "file": "api-review.md",
      "matching_edges": []
    },
    {
      "type": "CONSUMES_OUTPUT",
      "from_wp": "WP3",
      "to_wp": "WP1",
      "file": "api-review.md",
      "matching_edges": []
    },
    {
      "type": "REQUIRES_COMPLETION",
      "from_wp": "WP3",
      "to_wp": "WP1",
      "file": "api-review.md",
      "matching_edges": []
    },
    {
      "type": "PRODUCES_FOR",
      "from_wp": "WP2",
      "to_wp": "WP3",
      "file": "security-review.md",
      "matching_edges": []
    },
    {
      "type": "CONSUMES_OUTPUT",
      "from_wp": "WP3",
      "to_wp": "WP2",
      "file": "security-review.md",
      "matching_edges": []
    },
    {
      "type": "REQUIRES_COMPLETION",
      "from_wp": "WP3",
      "to_wp": "WP2",
      "file": "security-review.md",
      "matching_edges": []
    },
    {
      "type": "PARALLEL",
      "from_wp": "WP1",
      "to_wp": "WP2",
      "matching_edges": [
        "matrix:be136ee813bab80279f7494c"
      ]
    }
  ],
  "wrong_wp": 0,
  "cross_wp_source_contamination": 0,
  "wrong_oi_identity": 0,
  "wrong_completion_binding": 0,
  "missing_oi": 2,
  "missing_completion": 2,
  "unsupported_resolved_orchestration": 0,
  "parallel": true,
  "no_predecessor_order": false,
  "first_divergence": {
    "type": "UNRESOLVED_RELATION",
    "wp_id": "WP1",
    "local_run_id": "view:2",
    "local_unresolved_id": "p1:f595cbf8b782ebb29ef98423",
    "reason": "Action modality is not explicit",
    "source_spans": [
      {
        "source_id": "source:6714fce1c04e4782a16d41b7f7a214ad932efe169278340870c02ced4fb9189a",
        "start": 37,
        "end": 49,
        "quote": "赵岚读取 spec.md"
      }
    ]
  }
}
```

Complete immutable trace: [trace.json](../../final-first/M03/trace.json).
