# M02 — frozen actual result / NOT SEMANTICALLY CLOSED

Source SHA-256: 4651ea81d2e91d08765e567f6634335f7805165f9e193b898e86a0773e2b23c3

## Blocks

| block | WP | span | source |
| --- | --- | --- | --- |
| B1 | WP0 | [0,9) | 本任务分三个阶段。 |
| B2 | WP1 | [11,21) | 第一阶段由林乔负责。 |
| B3 | WP1 | [21,57) | 林乔读取 source.yaml，检查配置项，并生成 check.md。 |
| B4 | WP1 | [57,78) | check.md 已生成后，第一阶段完成。 |
| B5 | WP2 | [80,105) | 第二阶段由周安负责，并且只能在第一阶段完成后开始。 |
| B6 | WP2 | [105,140) | 周安读取 check.md，根据检查结果生成 fix-plan.md。 |
| B7 | WP2 | [140,177) | 第二阶段只有在复核人顾辰确认 fix-plan.md 内容完整后才算完成。 |
| B8 | WP3 | [179,196) | 第三阶段必须在第二阶段完成后开始。 |
| B9 | WP3 | [196,231) | 王宁读取 fix-plan.md，并生成 final-note.md。 |
| B10 | WP3 | [231,257) | final-note.md 已生成后，整个任务完成。 |
| B11 | WP0 | [259,276) | 不得修改 source.yaml。 |

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
        "source_id": "source:4651ea81d2e91d08765e567f6634335f7805165f9e193b898e86a0773e2b23c3",
        "start": 0,
        "end": 0,
        "quote": ""
      },
      "block_ids": [
        "B1",
        "B11"
      ],
      "local_run_ids": [
        "view:1",
        "view:5"
      ]
    },
    {
      "wp_id": "WP1",
      "parent_wp_id": "WP0",
      "stage_label": "第一阶段",
      "declaration_span": {
        "source_id": "source:4651ea81d2e91d08765e567f6634335f7805165f9e193b898e86a0773e2b23c3",
        "start": 11,
        "end": 21,
        "quote": "第一阶段由林乔负责。"
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
        "source_id": "source:4651ea81d2e91d08765e567f6634335f7805165f9e193b898e86a0773e2b23c3",
        "start": 80,
        "end": 105,
        "quote": "第二阶段由周安负责，并且只能在第一阶段完成后开始。"
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
      "stage_label": "第三阶段",
      "declaration_span": {
        "source_id": "source:4651ea81d2e91d08765e567f6634335f7805165f9e193b898e86a0773e2b23c3",
        "start": 179,
        "end": 196,
        "quote": "第三阶段必须在第二阶段完成后开始。"
      },
      "block_ids": [
        "B8",
        "B9",
        "B10"
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
| WP0 | A | ABSENT |  |
| WP0 | P | ABSENT |  |
| WP0 | R | ABSENT |  |
| WP0 | V | ABSENT |  |
| WP0 | C | ABSENT |  |
| WP0 | B | RESOLVED | FORBIDDEN 修改 source.yaml / RESOLVED / GLOBAL_CONSTRAINT |
| WP1 | I | PARSER_COVERAGE_FAILURE |  |
| WP1 | O | PARSER_COVERAGE_FAILURE | check.md / RESOLVED / FINAL_OUTPUT |
| WP1 | A | PARSER_COVERAGE_FAILURE | REQUIRED 生成 check.md / RESOLVED / null |
| WP1 | P | PARSER_COVERAGE_FAILURE | 林乔 [PERFORMER] / RESOLVED / null |
| WP1 | R | PARSER_COVERAGE_FAILURE |  |
| WP1 | V | PARSER_COVERAGE_FAILURE |  |
| WP1 | C | UNRESOLVED | 完成 / UNRESOLVED / LOCAL_COMPLETION |
| WP1 | B | PARSER_COVERAGE_FAILURE |  |
| WP2 | I | PARSER_COVERAGE_FAILURE |  |
| WP2 | O | PARSER_COVERAGE_FAILURE |  |
| WP2 | A | PARSER_COVERAGE_FAILURE |  |
| WP2 | P | PARSER_COVERAGE_FAILURE | 周安 [PERFORMER] / RESOLVED / null |
| WP2 | R | PARSER_COVERAGE_FAILURE |  |
| WP2 | V | PARSER_COVERAGE_FAILURE | fix-plan.md / RESOLVED / null |
| WP2 | C | UNRESOLVED | 完成 / UNRESOLVED / LOCAL_COMPLETION |
| WP2 | B | PARSER_COVERAGE_FAILURE | PERMITTED 后开始 / RESOLVED / null |
| WP3 | I | ABSENT |  |
| WP3 | O | RESOLVED | final-note.md / RESOLVED / FINAL_OUTPUT |
| WP3 | A | UNRESOLVED | REQUIRED 后开始 / RESOLVED / null; REQUIRED 生成 final-note.md / RESOLVED / null |
| WP3 | P | UNRESOLVED | 王宁 [PERFORMER] / RESOLVED / null |
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
          "matrix:743ee1acf1381a21b0ee91a1"
        ]
      }
    },
    {
      "row_id": "WP1",
      "cells": {
        "I": [],
        "O": [
          "matrix:243a7f4968769b54c0c154bd"
        ],
        "A": [
          "matrix:35eade997648892d20d21bc7"
        ],
        "P": [
          "matrix:328067454ace36558bd592fa"
        ],
        "R": [],
        "V": [],
        "C": [
          "matrix:9f09920be33f44bb73041058"
        ],
        "B": []
      }
    },
    {
      "row_id": "WP2",
      "cells": {
        "I": [],
        "O": [],
        "A": [],
        "P": [
          "matrix:89dd24e8dc1b78c26ba833f5"
        ],
        "R": [],
        "V": [
          "matrix:0a58da4de224812c0b44f3db"
        ],
        "C": [
          "matrix:06ae658e86529416a3854688"
        ],
        "B": [
          "matrix:66831240589b4ae7182a55e8"
        ]
      }
    },
    {
      "row_id": "WP3",
      "cells": {
        "I": [],
        "O": [
          "matrix:55da683f2391bdf52507c6b1"
        ],
        "A": [
          "matrix:bd924a45e0deb4ebe9dbf27d",
          "matrix:ae8be42e9b9ca280428983a2"
        ],
        "P": [
          "matrix:3f3c8346f119812d84ce1094"
        ],
        "R": [],
        "V": [],
        "C": [
          "matrix:7982191e145244b31b6d238c"
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
          "matrix:243a7f4968769b54c0c154bd"
        ],
        "A": [
          "matrix:35eade997648892d20d21bc7"
        ],
        "P": [
          "matrix:328067454ace36558bd592fa"
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
          "matrix:9f09920be33f44bb73041058"
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
        "V": [
          "matrix:0a58da4de224812c0b44f3db"
        ],
        "C": [],
        "B": [
          "matrix:66831240589b4ae7182a55e8"
        ]
      }
    },
    {
      "row_id": "B6",
      "cells": {
        "I": [],
        "O": [],
        "A": [],
        "P": [
          "matrix:89dd24e8dc1b78c26ba833f5"
        ],
        "R": [],
        "V": [
          "matrix:0a58da4de224812c0b44f3db"
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
          "matrix:0a58da4de224812c0b44f3db"
        ],
        "C": [
          "matrix:06ae658e86529416a3854688"
        ],
        "B": []
      }
    },
    {
      "row_id": "B8",
      "cells": {
        "I": [],
        "O": [],
        "A": [
          "matrix:bd924a45e0deb4ebe9dbf27d"
        ],
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
        "O": [
          "matrix:55da683f2391bdf52507c6b1"
        ],
        "A": [
          "matrix:ae8be42e9b9ca280428983a2"
        ],
        "P": [
          "matrix:3f3c8346f119812d84ce1094"
        ],
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
        "O": [],
        "A": [],
        "P": [],
        "R": [],
        "V": [],
        "C": [
          "matrix:7982191e145244b31b6d238c"
        ],
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
        "C": [],
        "B": [
          "matrix:743ee1acf1381a21b0ee91a1"
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
      "edge_id": "matrix:812dc59b30371246bb4ce0bc",
      "type": "SEQUENCE",
      "from_wp": "WP1",
      "to_wp": "WP2",
      "state": "RESOLVED",
      "source_spans": [
        {
          "source_id": "source:4651ea81d2e91d08765e567f6634335f7805165f9e193b898e86a0773e2b23c3",
          "start": 80,
          "end": 105,
          "quote": "第二阶段由周安负责，并且只能在第一阶段完成后开始。"
        }
      ],
      "proof": {
        "rule": "EXPLICIT_ORCHESTRATION_SYNTAX",
        "block_id": "B5"
      }
    },
    {
      "edge_id": "matrix:337a8154f1202995753c7e16",
      "type": "SEQUENCE",
      "from_wp": "WP2",
      "to_wp": "WP3",
      "state": "RESOLVED",
      "source_spans": [
        {
          "source_id": "source:4651ea81d2e91d08765e567f6634335f7805165f9e193b898e86a0773e2b23c3",
          "start": 179,
          "end": 196,
          "quote": "第三阶段必须在第二阶段完成后开始。"
        }
      ],
      "proof": {
        "rule": "EXPLICIT_ORCHESTRATION_SYNTAX",
        "block_id": "B8"
      }
    }
  ],
  "unresolved_edges": [
    {
      "edge_id": "matrix:7fc531433c4c44b05b9bdbd0",
      "type": "REQUIRES_COMPLETION",
      "from_wp": "WP2",
      "to_wp": "WP1",
      "state": "UNRESOLVED",
      "source_spans": [
        {
          "source_id": "source:4651ea81d2e91d08765e567f6634335f7805165f9e193b898e86a0773e2b23c3",
          "start": 80,
          "end": 105,
          "quote": "第二阶段由周安负责，并且只能在第一阶段完成后开始。"
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
    },
    {
      "edge_id": "matrix:e82a4884456b3468be38a60c",
      "type": "REQUIRES_COMPLETION",
      "from_wp": "WP3",
      "to_wp": "WP2",
      "state": "UNRESOLVED",
      "source_spans": [
        {
          "source_id": "source:4651ea81d2e91d08765e567f6634335f7805165f9e193b898e86a0773e2b23c3",
          "start": 179,
          "end": 196,
          "quote": "第三阶段必须在第二阶段完成后开始。"
        }
      ],
      "proof": {
        "rule": "EXPLICIT_ORCHESTRATION_SYNTAX",
        "block_id": "B8"
      },
      "enable_wp": "WP3",
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
      "evidence_edge_id": "matrix:812dc59b30371246bb4ce0bc"
    },
    {
      "from": "WP2",
      "to": "WP3",
      "evidence_edge_id": "matrix:337a8154f1202995753c7e16"
    }
  ],
  "acyclic": true
}
```

## Global 7+1

| slot | status | items |
| --- | --- | --- |
| I | PARSER_COVERAGE_FAILURE |  |
| O | PARSER_COVERAGE_FAILURE | WP1: check.md [RESOLVED, FINAL_OUTPUT]; WP3: final-note.md [RESOLVED, FINAL_OUTPUT] |
| A | PARSER_COVERAGE_FAILURE | WP1: REQUIRED 生成 check.md [RESOLVED, null]; WP3: REQUIRED 后开始 [RESOLVED, null]; WP3: REQUIRED 生成 final-note.md [RESOLVED, null] |
| P | PARSER_COVERAGE_FAILURE | WP1: 林乔 [PERFORMER] [RESOLVED, null]; WP2: 周安 [PERFORMER] [RESOLVED, null]; WP3: 王宁 [PERFORMER] [RESOLVED, null] |
| R | PARSER_COVERAGE_FAILURE |  |
| V | PARSER_COVERAGE_FAILURE | WP2: fix-plan.md [RESOLVED, null] |
| C | UNRESOLVED | WP1: 完成 [UNRESOLVED, LOCAL_COMPLETION]; WP2: 完成 [UNRESOLVED, LOCAL_COMPLETION]; WP3: 完成 [RESOLVED, GLOBAL_COMPLETION] |
| B | PARSER_COVERAGE_FAILURE | WP2: PERMITTED 后开始 [RESOLVED, null]; WP0: FORBIDDEN 修改 source.yaml [RESOLVED, GLOBAL_CONSTRAINT] |

## Gate

```json
{
  "case_id": "M02",
  "source_sha256": "4651ea81d2e91d08765e567f6634335f7805165f9e193b898e86a0773e2b23c3",
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
      "file": "check.md",
      "matching_edges": []
    },
    {
      "type": "CONSUMES_OUTPUT",
      "from_wp": "WP2",
      "to_wp": "WP1",
      "file": "check.md",
      "matching_edges": []
    },
    {
      "type": "REQUIRES_COMPLETION",
      "from_wp": "WP2",
      "to_wp": "WP1",
      "file": "check.md",
      "matching_edges": []
    },
    {
      "type": "PRODUCES_FOR",
      "from_wp": "WP2",
      "to_wp": "WP3",
      "file": "fix-plan.md",
      "matching_edges": []
    },
    {
      "type": "CONSUMES_OUTPUT",
      "from_wp": "WP3",
      "to_wp": "WP2",
      "file": "fix-plan.md",
      "matching_edges": []
    },
    {
      "type": "REQUIRES_COMPLETION",
      "from_wp": "WP3",
      "to_wp": "WP2",
      "file": "fix-plan.md",
      "matching_edges": []
    },
    {
      "type": "SEQUENCE",
      "from_wp": "WP1",
      "to_wp": "WP2",
      "matching_edges": [
        "matrix:812dc59b30371246bb4ce0bc"
      ]
    },
    {
      "type": "SEQUENCE",
      "from_wp": "WP2",
      "to_wp": "WP3",
      "matching_edges": [
        "matrix:337a8154f1202995753c7e16"
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
  "parallel": false,
  "no_predecessor_order": false,
  "first_divergence": {
    "type": "UNRESOLVED_RELATION",
    "wp_id": "WP1",
    "local_run_id": "view:2",
    "local_unresolved_id": "p1:dc6590dad608f475b43a3ec8",
    "reason": "Action modality is not explicit",
    "source_spans": [
      {
        "source_id": "source:4651ea81d2e91d08765e567f6634335f7805165f9e193b898e86a0773e2b23c3",
        "start": 21,
        "end": 37,
        "quote": "林乔读取 source.yaml"
      }
    ]
  }
}
```

Complete immutable trace: [trace.json](../../final-first/M02/trace.json).
