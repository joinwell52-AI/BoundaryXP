# Native complete Trace

```json
{
  "parser_revision": "v0.3-7p-short-direct-016-r1",
  "contract_version": "0.3-p2.2-scope-consistency-repair",
  "parser_status": "PARSED",
  "compiler_v03": {
    "metadata": {
      "run_id": "016:final-repeat:D01",
      "compiler_version": "0.3-7p-short-direct-016-r1",
      "created_at": "2026-10-03T00:00:00.000Z",
      "source_sha256": "37bc331b435432c551f3996cda23568886d94a11588ab75e1a7b75aa3073818c"
    },
    "source": {
      "source_id": "source:37bc331b435432c551f3996cda23568886d94a11588ab75e1a7b75aa3073818c",
      "sha256": "37bc331b435432c551f3996cda23568886d94a11588ab75e1a7b75aa3073818c",
      "raw_text": "张宁负责这项整理。请读取 input.csv，生成 report.md。不得修改 input.csv。report.md 已生成后，本任务完成。",
      "codepoint_length": 72,
      "language_hint": "mixed",
      "line_index": [
        {
          "start": 0,
          "end": 72
        }
      ],
      "document_kind": "plain",
      "metadata": {
        "filename": "D01.md"
      }
    },
    "structure": {
      "root_structure_node_id": "p1:a23a882789941e922991741b",
      "nodes": [
        {
          "structure_node_id": "p1:a23a882789941e922991741b",
          "kind": "ROOT",
          "child_ids": [
            "p1:4f9bce20abe7b4131e4edfe1"
          ],
          "source_span_ids": [
            "p1:571d80d40877f6505adf1d06"
          ]
        },
        {
          "structure_node_id": "p1:4f9bce20abe7b4131e4edfe1",
          "kind": "PARAGRAPH",
          "parent_id": "p1:a23a882789941e922991741b",
          "child_ids": [
            "p1:790dc1131030de4e896c7d81",
            "p1:295b34de6a82eb3701ccdf5e",
            "p1:9ef48724620d2f05e7b5a545",
            "p1:faf62552282d54f874aaf77f",
            "p1:a27bebeb10ba2b90cb3f17b3",
            "p1:d27ad35fa88623aacaf7228b"
          ],
          "source_span_ids": [
            "p1:571d80d40877f6505adf1d06"
          ]
        },
        {
          "structure_node_id": "p1:790dc1131030de4e896c7d81",
          "kind": "CLAUSE",
          "parent_id": "p1:4f9bce20abe7b4131e4edfe1",
          "child_ids": [],
          "source_span_ids": [
            "p1:e157be95c430ae6af88e6a37"
          ]
        },
        {
          "structure_node_id": "p1:295b34de6a82eb3701ccdf5e",
          "kind": "CLAUSE",
          "parent_id": "p1:4f9bce20abe7b4131e4edfe1",
          "child_ids": [],
          "source_span_ids": [
            "p1:b6f9329b82cfe4bf264e6752"
          ]
        },
        {
          "structure_node_id": "p1:9ef48724620d2f05e7b5a545",
          "kind": "CLAUSE",
          "parent_id": "p1:4f9bce20abe7b4131e4edfe1",
          "child_ids": [],
          "source_span_ids": [
            "p1:7f0793aa43172b583c71aea5"
          ]
        },
        {
          "structure_node_id": "p1:faf62552282d54f874aaf77f",
          "kind": "CLAUSE",
          "parent_id": "p1:4f9bce20abe7b4131e4edfe1",
          "child_ids": [],
          "source_span_ids": [
            "p1:f33c3a1c29e28002155201ca"
          ]
        },
        {
          "structure_node_id": "p1:a27bebeb10ba2b90cb3f17b3",
          "kind": "CLAUSE",
          "parent_id": "p1:4f9bce20abe7b4131e4edfe1",
          "child_ids": [],
          "source_span_ids": [
            "p1:16c6c0a6d036213bdc5dc5e7"
          ]
        },
        {
          "structure_node_id": "p1:d27ad35fa88623aacaf7228b",
          "kind": "CLAUSE",
          "parent_id": "p1:4f9bce20abe7b4131e4edfe1",
          "child_ids": [],
          "source_span_ids": [
            "p1:a85ebf0b750986ebd6f278f6"
          ]
        }
      ],
      "clauses": [
        {
          "clause_id": "clause:0",
          "structure_node_id": "p1:790dc1131030de4e896c7d81",
          "source_span_ids": [
            "p1:e157be95c430ae6af88e6a37"
          ],
          "child_clause_ids": [],
          "clause_kind": "DECLARATIVE"
        },
        {
          "clause_id": "clause:1",
          "structure_node_id": "p1:295b34de6a82eb3701ccdf5e",
          "source_span_ids": [
            "p1:b6f9329b82cfe4bf264e6752"
          ],
          "child_clause_ids": [],
          "clause_kind": "DECLARATIVE"
        },
        {
          "clause_id": "clause:2",
          "structure_node_id": "p1:9ef48724620d2f05e7b5a545",
          "source_span_ids": [
            "p1:7f0793aa43172b583c71aea5"
          ],
          "child_clause_ids": [],
          "clause_kind": "DECLARATIVE"
        },
        {
          "clause_id": "clause:3",
          "structure_node_id": "p1:faf62552282d54f874aaf77f",
          "source_span_ids": [
            "p1:f33c3a1c29e28002155201ca"
          ],
          "child_clause_ids": [],
          "clause_kind": "NEGATIVE"
        },
        {
          "clause_id": "clause:4",
          "structure_node_id": "p1:a27bebeb10ba2b90cb3f17b3",
          "source_span_ids": [
            "p1:16c6c0a6d036213bdc5dc5e7"
          ],
          "child_clause_ids": [],
          "clause_kind": "DECLARATIVE"
        },
        {
          "clause_id": "clause:5",
          "structure_node_id": "p1:d27ad35fa88623aacaf7228b",
          "source_span_ids": [
            "p1:a85ebf0b750986ebd6f278f6"
          ],
          "child_clause_ids": [],
          "clause_kind": "DECLARATIVE"
        }
      ]
    },
    "nlp_signals": {
      "clauses": [
        {
          "id": "clause:0",
          "span": {
            "source_id": "source:37bc331b435432c551f3996cda23568886d94a11588ab75e1a7b75aa3073818c",
            "start": 0,
            "end": 8,
            "quote": "张宁负责这项整理"
          },
          "sentence_id": 0,
          "delimiter": "。",
          "model": "hanlp-zh",
          "tokens": [
            {
              "text": "张宁",
              "start": 0,
              "end": 2,
              "pos": "NR",
              "dep": "nsubj",
              "head": 1,
              "lemma": "张宁",
              "id": "clause:0:token:0",
              "span": {
                "source_id": "source:37bc331b435432c551f3996cda23568886d94a11588ab75e1a7b75aa3073818c",
                "start": 0,
                "end": 2,
                "quote": "张宁"
              }
            },
            {
              "text": "负责",
              "start": 2,
              "end": 4,
              "pos": "VV",
              "dep": "root",
              "head": 1,
              "lemma": "负责",
              "id": "clause:0:token:1",
              "span": {
                "source_id": "source:37bc331b435432c551f3996cda23568886d94a11588ab75e1a7b75aa3073818c",
                "start": 2,
                "end": 4,
                "quote": "负责"
              }
            },
            {
              "text": "这",
              "start": 4,
              "end": 5,
              "pos": "DT",
              "dep": "det",
              "head": 4,
              "lemma": "这",
              "id": "clause:0:token:2",
              "span": {
                "source_id": "source:37bc331b435432c551f3996cda23568886d94a11588ab75e1a7b75aa3073818c",
                "start": 4,
                "end": 5,
                "quote": "这"
              }
            },
            {
              "text": "项",
              "start": 5,
              "end": 6,
              "pos": "M",
              "dep": "mark:clf",
              "head": 2,
              "lemma": "项",
              "id": "clause:0:token:3",
              "span": {
                "source_id": "source:37bc331b435432c551f3996cda23568886d94a11588ab75e1a7b75aa3073818c",
                "start": 5,
                "end": 6,
                "quote": "项"
              }
            },
            {
              "text": "整理",
              "start": 6,
              "end": 8,
              "pos": "NN",
              "dep": "dobj",
              "head": 1,
              "lemma": "整理",
              "id": "clause:0:token:4",
              "span": {
                "source_id": "source:37bc331b435432c551f3996cda23568886d94a11588ab75e1a7b75aa3073818c",
                "start": 6,
                "end": 8,
                "quote": "整理"
              }
            }
          ],
          "entities": [
            {
              "text": "张宁",
              "start": 0,
              "end": 2,
              "label": "PERSON",
              "span": {
                "source_id": "source:37bc331b435432c551f3996cda23568886d94a11588ab75e1a7b75aa3073818c",
                "start": 0,
                "end": 2,
                "quote": "张宁"
              }
            }
          ],
          "pos_alternatives": {
            "pos/pku": [
              "nr",
              "v",
              "r",
              "q",
              "vn"
            ],
            "pos/863": [
              "nh",
              "v",
              "r",
              "q",
              "v"
            ]
          },
          "srl": [
            [
              [
                "张宁",
                "ARG0",
                0,
                1
              ],
              [
                "负责",
                "PRED",
                1,
                2
              ],
              [
                "这项整理",
                "ARG1",
                2,
                5
              ]
            ]
          ]
        },
        {
          "id": "clause:1",
          "span": {
            "source_id": "source:37bc331b435432c551f3996cda23568886d94a11588ab75e1a7b75aa3073818c",
            "start": 9,
            "end": 22,
            "quote": "请读取 input.csv"
          },
          "sentence_id": 1,
          "delimiter": "，",
          "model": "hanlp-zh",
          "tokens": [
            {
              "text": "请",
              "start": 9,
              "end": 10,
              "pos": "VV",
              "dep": "xcomp",
              "head": 1,
              "lemma": "请",
              "id": "clause:1:token:0",
              "span": {
                "source_id": "source:37bc331b435432c551f3996cda23568886d94a11588ab75e1a7b75aa3073818c",
                "start": 9,
                "end": 10,
                "quote": "请"
              }
            },
            {
              "text": "读取",
              "start": 10,
              "end": 12,
              "pos": "VV",
              "dep": "root",
              "head": 1,
              "lemma": "读取",
              "id": "clause:1:token:1",
              "span": {
                "source_id": "source:37bc331b435432c551f3996cda23568886d94a11588ab75e1a7b75aa3073818c",
                "start": 10,
                "end": 12,
                "quote": "读取"
              }
            },
            {
              "text": "input.csv",
              "start": 13,
              "end": 22,
              "pos": "NN",
              "dep": "dobj",
              "head": 1,
              "lemma": "input.csv",
              "id": "clause:1:token:2",
              "span": {
                "source_id": "source:37bc331b435432c551f3996cda23568886d94a11588ab75e1a7b75aa3073818c",
                "start": 13,
                "end": 22,
                "quote": "input.csv"
              }
            }
          ],
          "entities": [],
          "pos_alternatives": {
            "pos/pku": [
              "v",
              "v",
              "n"
            ],
            "pos/863": [
              "v",
              "v",
              "n"
            ]
          },
          "srl": []
        },
        {
          "id": "clause:2",
          "span": {
            "source_id": "source:37bc331b435432c551f3996cda23568886d94a11588ab75e1a7b75aa3073818c",
            "start": 23,
            "end": 35,
            "quote": "生成 report.md"
          },
          "sentence_id": 1,
          "delimiter": "。",
          "model": "hanlp-zh",
          "tokens": [
            {
              "text": "生成",
              "start": 23,
              "end": 25,
              "pos": "VV",
              "dep": "root",
              "head": 0,
              "lemma": "生成",
              "id": "clause:2:token:0",
              "span": {
                "source_id": "source:37bc331b435432c551f3996cda23568886d94a11588ab75e1a7b75aa3073818c",
                "start": 23,
                "end": 25,
                "quote": "生成"
              }
            },
            {
              "text": "report.md",
              "start": 26,
              "end": 35,
              "pos": "NN",
              "dep": "dobj",
              "head": 0,
              "lemma": "report.md",
              "id": "clause:2:token:1",
              "span": {
                "source_id": "source:37bc331b435432c551f3996cda23568886d94a11588ab75e1a7b75aa3073818c",
                "start": 26,
                "end": 35,
                "quote": "report.md"
              }
            }
          ],
          "entities": [],
          "pos_alternatives": {
            "pos/pku": [
              "v",
              "n"
            ],
            "pos/863": [
              "v",
              "n"
            ]
          },
          "srl": []
        },
        {
          "id": "clause:3",
          "span": {
            "source_id": "source:37bc331b435432c551f3996cda23568886d94a11588ab75e1a7b75aa3073818c",
            "start": 36,
            "end": 50,
            "quote": "不得修改 input.csv"
          },
          "sentence_id": 2,
          "delimiter": "。",
          "model": "hanlp-zh",
          "tokens": [
            {
              "text": "不",
              "start": 36,
              "end": 37,
              "pos": "AD",
              "dep": "neg",
              "head": 2,
              "lemma": "不",
              "id": "clause:3:token:0",
              "span": {
                "source_id": "source:37bc331b435432c551f3996cda23568886d94a11588ab75e1a7b75aa3073818c",
                "start": 36,
                "end": 37,
                "quote": "不"
              }
            },
            {
              "text": "得",
              "start": 37,
              "end": 38,
              "pos": "VV",
              "dep": "xcomp",
              "head": 2,
              "lemma": "得",
              "id": "clause:3:token:1",
              "span": {
                "source_id": "source:37bc331b435432c551f3996cda23568886d94a11588ab75e1a7b75aa3073818c",
                "start": 37,
                "end": 38,
                "quote": "得"
              }
            },
            {
              "text": "修改",
              "start": 38,
              "end": 40,
              "pos": "VV",
              "dep": "root",
              "head": 2,
              "lemma": "修改",
              "id": "clause:3:token:2",
              "span": {
                "source_id": "source:37bc331b435432c551f3996cda23568886d94a11588ab75e1a7b75aa3073818c",
                "start": 38,
                "end": 40,
                "quote": "修改"
              }
            },
            {
              "text": "input.csv",
              "start": 41,
              "end": 50,
              "pos": "NN",
              "dep": "dobj",
              "head": 2,
              "lemma": "input.csv",
              "id": "clause:3:token:3",
              "span": {
                "source_id": "source:37bc331b435432c551f3996cda23568886d94a11588ab75e1a7b75aa3073818c",
                "start": 41,
                "end": 50,
                "quote": "input.csv"
              }
            }
          ],
          "entities": [],
          "pos_alternatives": {
            "pos/pku": [
              "d",
              "v",
              "v",
              "n"
            ],
            "pos/863": [
              "d",
              "vu",
              "v",
              "n"
            ]
          },
          "srl": [
            [
              [
                "不",
                "ARGM-ADV",
                0,
                1
              ],
              [
                "修改",
                "PRED",
                2,
                3
              ]
            ]
          ]
        },
        {
          "id": "clause:4",
          "span": {
            "source_id": "source:37bc331b435432c551f3996cda23568886d94a11588ab75e1a7b75aa3073818c",
            "start": 51,
            "end": 65,
            "quote": "report.md 已生成后"
          },
          "sentence_id": 3,
          "delimiter": "，",
          "model": "hanlp-zh",
          "tokens": [
            {
              "text": "report.md",
              "start": 51,
              "end": 60,
              "pos": "NN",
              "dep": "nsubj",
              "head": 2,
              "lemma": "report.md",
              "id": "clause:4:token:0",
              "span": {
                "source_id": "source:37bc331b435432c551f3996cda23568886d94a11588ab75e1a7b75aa3073818c",
                "start": 51,
                "end": 60,
                "quote": "report.md"
              }
            },
            {
              "text": "已",
              "start": 61,
              "end": 62,
              "pos": "AD",
              "dep": "advmod",
              "head": 2,
              "lemma": "已",
              "id": "clause:4:token:1",
              "span": {
                "source_id": "source:37bc331b435432c551f3996cda23568886d94a11588ab75e1a7b75aa3073818c",
                "start": 61,
                "end": 62,
                "quote": "已"
              }
            },
            {
              "text": "生成",
              "start": 62,
              "end": 64,
              "pos": "VV",
              "dep": "root",
              "head": 2,
              "lemma": "生成",
              "id": "clause:4:token:2",
              "span": {
                "source_id": "source:37bc331b435432c551f3996cda23568886d94a11588ab75e1a7b75aa3073818c",
                "start": 62,
                "end": 64,
                "quote": "生成"
              }
            },
            {
              "text": "后",
              "start": 64,
              "end": 65,
              "pos": "LC",
              "dep": "case",
              "head": 2,
              "lemma": "后",
              "id": "clause:4:token:3",
              "span": {
                "source_id": "source:37bc331b435432c551f3996cda23568886d94a11588ab75e1a7b75aa3073818c",
                "start": 64,
                "end": 65,
                "quote": "后"
              }
            }
          ],
          "entities": [],
          "pos_alternatives": {
            "pos/pku": [
              "nx",
              "d",
              "v",
              "f"
            ],
            "pos/863": [
              "w",
              "d",
              "v",
              "nd"
            ]
          },
          "srl": [
            [
              [
                "report.md",
                "ARG0",
                0,
                1
              ],
              [
                "已",
                "ARGM-ADV",
                1,
                2
              ],
              [
                "生成",
                "PRED",
                2,
                3
              ]
            ]
          ]
        },
        {
          "id": "clause:5",
          "span": {
            "source_id": "source:37bc331b435432c551f3996cda23568886d94a11588ab75e1a7b75aa3073818c",
            "start": 66,
            "end": 71,
            "quote": "本任务完成"
          },
          "sentence_id": 3,
          "delimiter": "。",
          "model": "hanlp-zh",
          "tokens": [
            {
              "text": "本",
              "start": 66,
              "end": 67,
              "pos": "DT",
              "dep": "det",
              "head": 1,
              "lemma": "本",
              "id": "clause:5:token:0",
              "span": {
                "source_id": "source:37bc331b435432c551f3996cda23568886d94a11588ab75e1a7b75aa3073818c",
                "start": 66,
                "end": 67,
                "quote": "本"
              }
            },
            {
              "text": "任务",
              "start": 67,
              "end": 69,
              "pos": "NN",
              "dep": "nsubj",
              "head": 2,
              "lemma": "任务",
              "id": "clause:5:token:1",
              "span": {
                "source_id": "source:37bc331b435432c551f3996cda23568886d94a11588ab75e1a7b75aa3073818c",
                "start": 67,
                "end": 69,
                "quote": "任务"
              }
            },
            {
              "text": "完成",
              "start": 69,
              "end": 71,
              "pos": "VV",
              "dep": "root",
              "head": 2,
              "lemma": "完成",
              "id": "clause:5:token:2",
              "span": {
                "source_id": "source:37bc331b435432c551f3996cda23568886d94a11588ab75e1a7b75aa3073818c",
                "start": 69,
                "end": 71,
                "quote": "完成"
              }
            }
          ],
          "entities": [],
          "pos_alternatives": {
            "pos/pku": [
              "r",
              "n",
              "v"
            ],
            "pos/863": [
              "r",
              "n",
              "v"
            ]
          },
          "srl": [
            [
              [
                "本任务",
                "ARG1",
                0,
                2
              ],
              [
                "完成",
                "PRED",
                2,
                3
              ]
            ]
          ]
        }
      ],
      "literals": [
        {
          "type": "FILE",
          "span": {
            "source_id": "source:37bc331b435432c551f3996cda23568886d94a11588ab75e1a7b75aa3073818c",
            "start": 13,
            "end": 22,
            "quote": "input.csv"
          },
          "id": "literal:0"
        },
        {
          "type": "FILE",
          "span": {
            "source_id": "source:37bc331b435432c551f3996cda23568886d94a11588ab75e1a7b75aa3073818c",
            "start": 26,
            "end": 35,
            "quote": "report.md"
          },
          "id": "literal:1"
        },
        {
          "type": "FILE",
          "span": {
            "source_id": "source:37bc331b435432c551f3996cda23568886d94a11588ab75e1a7b75aa3073818c",
            "start": 41,
            "end": 50,
            "quote": "input.csv"
          },
          "id": "literal:2"
        },
        {
          "type": "FILE",
          "span": {
            "source_id": "source:37bc331b435432c551f3996cda23568886d94a11588ab75e1a7b75aa3073818c",
            "start": 51,
            "end": 60,
            "quote": "report.md"
          },
          "id": "literal:3"
        }
      ],
      "metrics": {
        "model_load_count": 2,
        "nlp_ms": 6788.57189998962
      },
      "models": [
        "zh_core_web_sm",
        "hanlp-zh"
      ],
      "semantic_decoding": {
        "method": "CANDIDATE_TYPE_CONSTRAINT_FIXED_POINT",
        "max_passes": 6,
        "candidates": [
          {
            "candidate_id": "p1:7f4c84c0301f8068cdaa6f37",
            "clause_id": "clause:0",
            "kind": "SUPPORT_COMPLEMENT",
            "evidence": [
              "clause:0:token:4"
            ],
            "hard_type_compatible": true,
            "decision": "ACCEPTED",
            "reason": "Explicit local support predicate and coordinated complements",
            "evidence_tier": "EXPLICIT_LOCAL_SYNTAX",
            "source_span_ids": [
              "p1:e157be95c430ae6af88e6a37"
            ]
          },
          {
            "candidate_id": "p1:5269ab36a9f5f77d08d49358",
            "clause_id": "clause:4",
            "kind": "GENERIC_EVENT",
            "evidence": [
              "clause:4:token:2"
            ],
            "hard_type_compatible": true,
            "decision": "ACCEPTED",
            "reason": "Typed root/complement syntax",
            "evidence_tier": "EXPLICIT_LOCAL_SYNTAX",
            "source_span_ids": [
              "p1:16c6c0a6d036213bdc5dc5e7"
            ]
          },
          {
            "candidate_id": "p1:9a1356179ef6b0a998e369fb",
            "kind": "RELATION",
            "clause_id": "clause:0",
            "source_span_ids": [
              "p1:b0eccf72b3d1edf969c8f671",
              "p1:71bb1d16f0709043431028ea",
              "p1:e157be95c430ae6af88e6a37"
            ],
            "endpoint_ids": [
              "p1:23c59e2354e7b39c3fb9b70d",
              "p1:0a644412188024b2b0ff4db1"
            ],
            "hard_type_compatible": true,
            "evidence_score": {
              "typed": 1,
              "structural": 1,
              "model_override": 0
            },
            "evidence_priority": [
              "TYPED_EXACT",
              "SRL",
              "DEPENDENCY",
              "LOCAL_COMPOSITION",
              "DISCOURSE",
              "NLI",
              "BGE_E5"
            ],
            "decision": "REJECTED",
            "reason": "NATIVE_AGENT"
          },
          {
            "candidate_id": "p1:7a1cf1efe8021d18c5f21cc7",
            "kind": "RELATION",
            "clause_id": "clause:0",
            "source_span_ids": [
              "p1:b0eccf72b3d1edf969c8f671",
              "p1:e157be95c430ae6af88e6a37"
            ],
            "endpoint_ids": [
              "p1:23c59e2354e7b39c3fb9b70d",
              "p1:13b991f220929572e7a8b1fa"
            ],
            "hard_type_compatible": true,
            "evidence_score": {
              "typed": 1,
              "structural": 1,
              "model_override": 0
            },
            "evidence_priority": [
              "TYPED_EXACT",
              "SRL",
              "DEPENDENCY",
              "LOCAL_COMPOSITION",
              "DISCOURSE",
              "NLI",
              "BGE_E5"
            ],
            "decision": "REJECTED",
            "reason": "NATIVE_PATIENT"
          },
          {
            "candidate_id": "p1:89a7f7c1806e1f6bce40b78c",
            "kind": "RELATION",
            "clause_id": "clause:0",
            "source_span_ids": [
              "p1:571d80d40877f6505adf1d06",
              "p1:b0eccf72b3d1edf969c8f671",
              "p1:e157be95c430ae6af88e6a37"
            ],
            "endpoint_ids": [
              "p1:3ddbd3949281cbe0716e59ad",
              "p1:13b991f220929572e7a8b1fa"
            ],
            "hard_type_compatible": true,
            "evidence_score": {
              "typed": 1,
              "structural": 1,
              "model_override": 0
            },
            "evidence_priority": [
              "TYPED_EXACT",
              "SRL",
              "DEPENDENCY",
              "LOCAL_COMPOSITION",
              "DISCOURSE",
              "NLI",
              "BGE_E5"
            ],
            "decision": "REJECTED",
            "reason": "NATIVE_SCOPE_MEMBER"
          },
          {
            "candidate_id": "p1:0fd472c5ca879d856e495479",
            "kind": "RELATION",
            "clause_id": "clause:1",
            "source_span_ids": [
              "p1:fd66e7077083782d8fc63cf9",
              "p1:9d123dd0da21f3490930ff89",
              "p1:b6f9329b82cfe4bf264e6752"
            ],
            "endpoint_ids": [
              "p1:55751628ba342c5905e06203",
              "p1:a017f65f2618791bc5728c63"
            ],
            "hard_type_compatible": true,
            "evidence_score": {
              "typed": 1,
              "structural": 1,
              "model_override": 0
            },
            "evidence_priority": [
              "TYPED_EXACT",
              "SRL",
              "DEPENDENCY",
              "LOCAL_COMPOSITION",
              "DISCOURSE",
              "NLI",
              "BGE_E5"
            ],
            "decision": "ACCEPTED",
            "reason": "NATIVE_PATIENT"
          },
          {
            "candidate_id": "p1:36ac3c5793dabb687e58d8be",
            "kind": "RELATION",
            "clause_id": "clause:2",
            "source_span_ids": [
              "p1:73e3c5ea188ca1c5d3a01a25",
              "p1:816520f3f44f6ecce1fcffe1",
              "p1:7f0793aa43172b583c71aea5"
            ],
            "endpoint_ids": [
              "p1:7be272d3f3a2df10061bef21",
              "p1:fc5bd600086ab6090e519d5c"
            ],
            "hard_type_compatible": true,
            "evidence_score": {
              "typed": 1,
              "structural": 1,
              "model_override": 0
            },
            "evidence_priority": [
              "TYPED_EXACT",
              "SRL",
              "DEPENDENCY",
              "LOCAL_COMPOSITION",
              "DISCOURSE",
              "NLI",
              "BGE_E5"
            ],
            "decision": "ACCEPTED",
            "reason": "NATIVE_RESULT"
          },
          {
            "candidate_id": "p1:f93ea6ea733bc8fc9e674b73",
            "kind": "RELATION",
            "clause_id": "clause:3",
            "source_span_ids": [
              "p1:0ac85b43b0dc6a80218e77f0",
              "p1:55ad616030ab5968a94ded69",
              "p1:f33c3a1c29e28002155201ca"
            ],
            "endpoint_ids": [
              "p1:5005d79d390f276a34b7caf4",
              "p1:5e56145673653f1ee7f21e69"
            ],
            "hard_type_compatible": true,
            "evidence_score": {
              "typed": 1,
              "structural": 1,
              "model_override": 0
            },
            "evidence_priority": [
              "TYPED_EXACT",
              "SRL",
              "DEPENDENCY",
              "LOCAL_COMPOSITION",
              "DISCOURSE",
              "NLI",
              "BGE_E5"
            ],
            "decision": "ACCEPTED",
            "reason": "NATIVE_FORBIDS"
          },
          {
            "candidate_id": "p1:d394d120378224a6b4da7245",
            "kind": "RELATION",
            "clause_id": "clause:5",
            "source_span_ids": [
              "p1:389fc6806e332239f3a0a558",
              "p1:3dc88c03831e32f9a8fc67ce",
              "p1:a85ebf0b750986ebd6f278f6"
            ],
            "endpoint_ids": [
              "p1:00c60db12ccee968ea34ba91",
              "p1:3cfba2fb6a90ae4e9f6ecd34"
            ],
            "hard_type_compatible": true,
            "evidence_score": {
              "typed": 1,
              "structural": 1,
              "model_override": 0
            },
            "evidence_priority": [
              "TYPED_EXACT",
              "SRL",
              "DEPENDENCY",
              "LOCAL_COMPOSITION",
              "DISCOURSE",
              "NLI",
              "BGE_E5"
            ],
            "decision": "ACCEPTED",
            "reason": "NATIVE_AGENT"
          },
          {
            "candidate_id": "p1:79a08469cd000a3ff52ee6f4",
            "kind": "RELATION",
            "clause_id": "clause:4",
            "source_span_ids": [
              "p1:c5e695a4d3c696b147d967d9",
              "p1:128b95de26c3a7705c96510e",
              "p1:16c6c0a6d036213bdc5dc5e7"
            ],
            "endpoint_ids": [
              "p1:3c21a1bf090fbc6ec5a038c3",
              "p1:ecd17316cc63a98d630af1d8"
            ],
            "hard_type_compatible": true,
            "evidence_score": {
              "typed": 1,
              "structural": 1,
              "model_override": 0
            },
            "evidence_priority": [
              "TYPED_EXACT",
              "SRL",
              "DEPENDENCY",
              "LOCAL_COMPOSITION",
              "DISCOURSE",
              "NLI",
              "BGE_E5"
            ],
            "decision": "REJECTED",
            "reason": "NATIVE_AGENT"
          },
          {
            "candidate_id": "p1:f763ba315058fb8aea451f0b",
            "kind": "RELATION",
            "clause_id": "clause:1",
            "source_span_ids": [
              "p1:fd66e7077083782d8fc63cf9",
              "p1:71bb1d16f0709043431028ea",
              "p1:b6f9329b82cfe4bf264e6752"
            ],
            "endpoint_ids": [
              "p1:55751628ba342c5905e06203",
              "p1:0a644412188024b2b0ff4db1"
            ],
            "hard_type_compatible": true,
            "evidence_score": {
              "typed": 1,
              "structural": 1,
              "model_override": 0
            },
            "evidence_priority": [
              "TYPED_EXACT",
              "SRL",
              "DEPENDENCY",
              "LOCAL_COMPOSITION",
              "DISCOURSE",
              "NLI",
              "BGE_E5"
            ],
            "decision": "ACCEPTED",
            "reason": "NATIVE_AGENT"
          },
          {
            "candidate_id": "p1:f3a3ec29582ca92036ced2f9",
            "kind": "RELATION",
            "clause_id": "clause:2",
            "source_span_ids": [
              "p1:73e3c5ea188ca1c5d3a01a25",
              "p1:71bb1d16f0709043431028ea",
              "p1:7f0793aa43172b583c71aea5"
            ],
            "endpoint_ids": [
              "p1:7be272d3f3a2df10061bef21",
              "p1:0a644412188024b2b0ff4db1"
            ],
            "hard_type_compatible": true,
            "evidence_score": {
              "typed": 1,
              "structural": 1,
              "model_override": 0
            },
            "evidence_priority": [
              "TYPED_EXACT",
              "SRL",
              "DEPENDENCY",
              "LOCAL_COMPOSITION",
              "DISCOURSE",
              "NLI",
              "BGE_E5"
            ],
            "decision": "ACCEPTED",
            "reason": "NATIVE_AGENT"
          },
          {
            "candidate_id": "p1:ee1f0ad948cdfe14a4c667a6",
            "kind": "RELATION",
            "clause_id": "clause:3",
            "source_span_ids": [
              "p1:0ac85b43b0dc6a80218e77f0",
              "p1:71bb1d16f0709043431028ea",
              "p1:f33c3a1c29e28002155201ca"
            ],
            "endpoint_ids": [
              "p1:5005d79d390f276a34b7caf4",
              "p1:0a644412188024b2b0ff4db1"
            ],
            "hard_type_compatible": true,
            "evidence_score": {
              "typed": 1,
              "structural": 1,
              "model_override": 0
            },
            "evidence_priority": [
              "TYPED_EXACT",
              "SRL",
              "DEPENDENCY",
              "LOCAL_COMPOSITION",
              "DISCOURSE",
              "NLI",
              "BGE_E5"
            ],
            "decision": "ACCEPTED",
            "reason": "NATIVE_AGENT"
          },
          {
            "candidate_id": "p1:30f048f55c1175bd7c206c2d",
            "kind": "RELATION",
            "clause_id": "clause:1",
            "source_span_ids": [
              "p1:fd66e7077083782d8fc63cf9",
              "p1:9d123dd0da21f3490930ff89",
              "p1:b6f9329b82cfe4bf264e6752"
            ],
            "endpoint_ids": [
              "p1:55751628ba342c5905e06203",
              "p1:a017f65f2618791bc5728c63"
            ],
            "hard_type_compatible": true,
            "evidence_score": {
              "typed": 1,
              "structural": 1,
              "model_override": 0
            },
            "evidence_priority": [
              "TYPED_EXACT",
              "SRL",
              "DEPENDENCY",
              "LOCAL_COMPOSITION",
              "DISCOURSE",
              "NLI",
              "BGE_E5"
            ],
            "decision": "ACCEPTED",
            "reason": "NATIVE_SCOPE_MEMBER"
          },
          {
            "candidate_id": "p1:be818ec586992582f977e909",
            "kind": "RELATION",
            "clause_id": "clause:0",
            "source_span_ids": [
              "p1:2cbc54e36db5ace4bf94cf39",
              "p1:71bb1d16f0709043431028ea",
              "p1:e157be95c430ae6af88e6a37"
            ],
            "endpoint_ids": [
              "p1:2de8e54fcb2f544ce2f6d95d",
              "p1:664c7119ec8c17c7363d4a2d"
            ],
            "hard_type_compatible": true,
            "evidence_score": {
              "typed": 1,
              "structural": 1,
              "model_override": 0
            },
            "evidence_priority": [
              "TYPED_EXACT",
              "SRL",
              "DEPENDENCY",
              "LOCAL_COMPOSITION",
              "DISCOURSE",
              "NLI",
              "BGE_E5"
            ],
            "decision": "ACCEPTED",
            "reason": "NATIVE_AGENT / SHORT_DIRECT_SYNTAX"
          },
          {
            "candidate_id": "p1:9a7186b2ce7dc7f94f019028",
            "kind": "RELATION",
            "clause_id": "clause:4",
            "source_span_ids": [
              "p1:5e3b5ab04595aef88e78c85c",
              "p1:816520f3f44f6ecce1fcffe1",
              "p1:7f0793aa43172b583c71aea5",
              "p1:16c6c0a6d036213bdc5dc5e7"
            ],
            "endpoint_ids": [
              "p1:2b1849abc7e29105eb70b977",
              "p1:fc5bd600086ab6090e519d5c"
            ],
            "hard_type_compatible": true,
            "evidence_score": {
              "typed": 1,
              "structural": 1,
              "model_override": 0
            },
            "evidence_priority": [
              "TYPED_EXACT",
              "SRL",
              "DEPENDENCY",
              "LOCAL_COMPOSITION",
              "DISCOURSE",
              "NLI",
              "BGE_E5"
            ],
            "decision": "ACCEPTED",
            "reason": "NATIVE_CONJUNCTION / SHORT_DIRECT_SYNTAX"
          },
          {
            "candidate_id": "p1:846306081530b2461ab45f14",
            "kind": "RELATION",
            "clause_id": "clause:5",
            "source_span_ids": [
              "p1:5e3b5ab04595aef88e78c85c",
              "p1:389fc6806e332239f3a0a558",
              "p1:a85ebf0b750986ebd6f278f6",
              "p1:16c6c0a6d036213bdc5dc5e7"
            ],
            "endpoint_ids": [
              "p1:2b1849abc7e29105eb70b977",
              "p1:00c60db12ccee968ea34ba91"
            ],
            "hard_type_compatible": true,
            "evidence_score": {
              "typed": 1,
              "structural": 1,
              "model_override": 0
            },
            "evidence_priority": [
              "TYPED_EXACT",
              "SRL",
              "DEPENDENCY",
              "LOCAL_COMPOSITION",
              "DISCOURSE",
              "NLI",
              "BGE_E5"
            ],
            "decision": "ACCEPTED",
            "reason": "NATIVE_COMPLETION_OF / SHORT_DIRECT_SYNTAX"
          }
        ],
        "passes": [
          {
            "pass": 0,
            "changes": 0
          }
        ],
        "converged": true,
        "discourse": {
          "authoring_document": false,
          "annotations": [
            {
              "annotation_id": "p1:2e2c6592bde11ad4fdc19e24",
              "structure_id": "structure:0",
              "kind": "CURRENT_TASK",
              "inherited_kind": "CURRENT_TASK",
              "owner_structure_id": "document",
              "structural_path": [
                "document"
              ],
              "source_span": {
                "source_id": "source:37bc331b435432c551f3996cda23568886d94a11588ab75e1a7b75aa3073818c",
                "start": 0,
                "end": 72,
                "quote": "张宁负责这项整理。请读取 input.csv，生成 report.md。不得修改 input.csv。report.md 已生成后，本任务完成。"
              },
              "heading_marker_span": null
            }
          ],
          "source_sha256": "37bc331b435432c551f3996cda23568886d94a11588ab75e1a7b75aa3073818c",
          "rule": "MARKUP_HIERARCHY_AND_DOCUMENT_GENRE",
          "raw_source_unchanged": true,
          "structural_accountability": [],
          "output_content_requirements": []
        },
        "participant_eligibility": [
          {
            "node_id": "p1:0a644412188024b2b0ff4db1",
            "eligible": true,
            "reason": "PERSON_NER",
            "source_span_ids": [
              "p1:71bb1d16f0709043431028ea",
              "p1:e157be95c430ae6af88e6a37"
            ],
            "ner_evidence": [
              {
                "text": "张宁",
                "start": 0,
                "end": 2,
                "label": "PERSON",
                "span": {
                  "source_id": "source:37bc331b435432c551f3996cda23568886d94a11588ab75e1a7b75aa3073818c",
                  "start": 0,
                  "end": 2,
                  "quote": "张宁"
                }
              }
            ],
            "name_token_evidence": [
              "clause:0:token:0"
            ]
          },
          {
            "node_id": "p1:ecd17316cc63a98d630af1d8",
            "eligible": false,
            "reason": "NON_PARTICIPANT_TYPE"
          },
          {
            "node_id": "p1:3cfba2fb6a90ae4e9f6ecd34",
            "eligible": false,
            "reason": "SRL_AGENT_IS_NOT_IDENTITY",
            "source_span_ids": [
              "p1:3dc88c03831e32f9a8fc67ce",
              "p1:a85ebf0b750986ebd6f278f6"
            ],
            "ner_evidence": [],
            "name_token_evidence": []
          }
        ],
        "soundness": {
          "status": "PASS",
          "errors": [],
          "checks": [
            "PREDICATE_LAYER_OWNERSHIP",
            "QUANTITY_TARGET_IDENTITY",
            "NORMATIVE_REFERENCE_SCOPE"
          ],
          "contract_gates_are_not_semantic_certification": true
        },
        "structured_recovery": {
          "version": "7P-REPAIR-002",
          "artifact_roles": [
            {
              "artifact_node_id": "p1:a017f65f2618791bc5728c63",
              "event_node_id": "p1:55751628ba342c5905e06203",
              "roles": [
                "READ_ONLY_INPUT"
              ],
              "source_span_ids": [
                "p1:b6f9329b82cfe4bf264e6752",
                "p1:9d123dd0da21f3490930ff89",
                "p1:fd66e7077083782d8fc63cf9"
              ],
              "condition_expr_id": null
            },
            {
              "artifact_node_id": "p1:fc5bd600086ab6090e519d5c",
              "event_node_id": "p1:7be272d3f3a2df10061bef21",
              "roles": [
                "GENERATED_OUTPUT"
              ],
              "source_span_ids": [
                "p1:7f0793aa43172b583c71aea5",
                "p1:816520f3f44f6ecce1fcffe1",
                "p1:73e3c5ea188ca1c5d3a01a25"
              ],
              "condition_expr_id": null
            },
            {
              "source_span_ids": [
                "p1:55ad616030ab5968a94ded69"
              ],
              "roles": [
                "UNRESOLVED_ARTIFACT_ROLE"
              ]
            },
            {
              "source_span_ids": [
                "p1:128b95de26c3a7705c96510e"
              ],
              "roles": [
                "UNRESOLVED_ARTIFACT_ROLE"
              ]
            }
          ],
          "references": [],
          "tables": [],
          "completion": [],
          "output_content": [],
          "diagnostics": []
        },
        "graph_closure": {
          "version": "7P-REPAIR-003",
          "composition_edges": [],
          "object_bundles": [
            {
              "event_node_id": "p1:7be272d3f3a2df10061bef21",
              "mode": "CREATE",
              "object_node_ids": [
                "p1:fc5bd600086ab6090e519d5c"
              ],
              "scope_expr_id": "p1:f5c4097140b3a14c789d8249",
              "source_span_ids": [
                "p1:816520f3f44f6ecce1fcffe1",
                "p1:73e3c5ea188ca1c5d3a01a25"
              ],
              "domain": "CURRENT_TASK"
            }
          ],
          "restrictions": [],
          "content_graphs": [],
          "unresolved": []
        },
        "candidate_recall": {
          "version": "7P-REPAIR-005",
          "before": {
            "nodes": [
              {
                "node_id": "p1:3ddbd3949281cbe0716e59ad",
                "node_type": "DISCOURSE",
                "surface": "张宁负责这项整理。请读取 input.csv，生成 report.md。不得修改 input.csv。report.md 已生成后，本任务完成。",
                "source_span_ids": [
                  "p1:571d80d40877f6505adf1d06"
                ],
                "state": "RESOLVED"
              },
              {
                "node_id": "p1:23c59e2354e7b39c3fb9b70d",
                "node_type": "EVENT",
                "surface": "这项整理",
                "source_span_ids": [
                  "p1:b0eccf72b3d1edf969c8f671"
                ],
                "state": "RESOLVED",
                "modality": "REQUIRED",
                "clause_id": "clause:0"
              },
              {
                "node_id": "p1:0a644412188024b2b0ff4db1",
                "node_type": "ENTITY",
                "surface": "张宁",
                "source_span_ids": [
                  "p1:71bb1d16f0709043431028ea"
                ],
                "state": "RESOLVED",
                "clause_id": "clause:0",
                "participant_eligibility": {
                  "eligible": true,
                  "reason": "PERSON_NER",
                  "source_span_ids": [
                    "p1:71bb1d16f0709043431028ea"
                  ],
                  "ner_evidence": [
                    {
                      "text": "张宁",
                      "start": 0,
                      "end": 2,
                      "label": "PERSON",
                      "span": {
                        "source_id": "source:37bc331b435432c551f3996cda23568886d94a11588ab75e1a7b75aa3073818c",
                        "start": 0,
                        "end": 2,
                        "quote": "张宁"
                      }
                    }
                  ],
                  "name_token_evidence": [
                    "clause:0:token:0"
                  ]
                }
              },
              {
                "node_id": "p1:13b991f220929572e7a8b1fa",
                "node_type": "ENTITY",
                "surface": "这项整理",
                "source_span_ids": [
                  "p1:b0eccf72b3d1edf969c8f671"
                ],
                "state": "RESOLVED",
                "clause_id": "clause:0",
                "participant_eligibility": {
                  "eligible": false,
                  "reason": "SRL_AGENT_IS_NOT_IDENTITY",
                  "source_span_ids": [
                    "p1:b0eccf72b3d1edf969c8f671"
                  ],
                  "ner_evidence": [],
                  "name_token_evidence": []
                }
              },
              {
                "node_id": "p1:a017f65f2618791bc5728c63",
                "node_type": "ENTITY",
                "surface": "input.csv",
                "source_span_ids": [
                  "p1:9d123dd0da21f3490930ff89"
                ],
                "state": "RESOLVED",
                "clause_id": "clause:1",
                "participant_eligibility": {
                  "eligible": false,
                  "reason": "NON_PARTICIPANT_TYPE"
                }
              },
              {
                "node_id": "p1:55751628ba342c5905e06203",
                "node_type": "EVENT",
                "surface": "读取",
                "source_span_ids": [
                  "p1:fd66e7077083782d8fc63cf9"
                ],
                "state": "RESOLVED",
                "modality": "REQUIRED",
                "clause_id": "clause:1"
              },
              {
                "node_id": "p1:fc5bd600086ab6090e519d5c",
                "node_type": "ENTITY",
                "surface": "report.md",
                "source_span_ids": [
                  "p1:816520f3f44f6ecce1fcffe1"
                ],
                "state": "RESOLVED",
                "clause_id": "clause:2",
                "technical_type": "ABSTRACT_DELIVERABLE",
                "participant_eligibility": {
                  "eligible": false,
                  "reason": "NON_PARTICIPANT_TYPE"
                }
              },
              {
                "node_id": "p1:7be272d3f3a2df10061bef21",
                "node_type": "EVENT",
                "surface": "生成",
                "source_span_ids": [
                  "p1:73e3c5ea188ca1c5d3a01a25"
                ],
                "state": "RESOLVED",
                "modality": "REQUIRED",
                "clause_id": "clause:2"
              },
              {
                "node_id": "p1:5e56145673653f1ee7f21e69",
                "node_type": "ENTITY",
                "surface": "input.csv",
                "source_span_ids": [
                  "p1:55ad616030ab5968a94ded69"
                ],
                "state": "RESOLVED",
                "clause_id": "clause:3",
                "participant_eligibility": {
                  "eligible": false,
                  "reason": "NON_PARTICIPANT_TYPE"
                }
              },
              {
                "node_id": "p1:5005d79d390f276a34b7caf4",
                "node_type": "EVENT",
                "surface": "修改",
                "source_span_ids": [
                  "p1:0ac85b43b0dc6a80218e77f0"
                ],
                "state": "RESOLVED",
                "modality": "FORBIDDEN",
                "clause_id": "clause:3"
              },
              {
                "node_id": "p1:ecd17316cc63a98d630af1d8",
                "node_type": "ENTITY",
                "surface": "report.md",
                "source_span_ids": [
                  "p1:128b95de26c3a7705c96510e"
                ],
                "state": "RESOLVED",
                "clause_id": "clause:4",
                "participant_eligibility": {
                  "eligible": false,
                  "reason": "NON_PARTICIPANT_TYPE"
                }
              },
              {
                "node_id": "p1:00c60db12ccee968ea34ba91",
                "node_type": "EVENT",
                "surface": "完成",
                "source_span_ids": [
                  "p1:389fc6806e332239f3a0a558"
                ],
                "state": "RESOLVED",
                "modality": "UNSTATED",
                "clause_id": "clause:5"
              },
              {
                "node_id": "p1:3cfba2fb6a90ae4e9f6ecd34",
                "node_type": "ENTITY",
                "surface": "本任务",
                "source_span_ids": [
                  "p1:3dc88c03831e32f9a8fc67ce"
                ],
                "state": "RESOLVED",
                "clause_id": "clause:5",
                "participant_eligibility": {
                  "eligible": false,
                  "reason": "SRL_AGENT_IS_NOT_IDENTITY",
                  "source_span_ids": [
                    "p1:3dc88c03831e32f9a8fc67ce"
                  ],
                  "ner_evidence": [],
                  "name_token_evidence": []
                }
              },
              {
                "node_id": "p1:3c21a1bf090fbc6ec5a038c3",
                "node_type": "EVENT",
                "surface": "生成",
                "source_span_ids": [
                  "p1:c5e695a4d3c696b147d967d9"
                ],
                "state": "RESOLVED",
                "modality": "UNSTATED",
                "clause_id": "clause:4"
              }
            ],
            "relations": [
              {
                "relation_id": "p1:9a1356179ef6b0a998e369fb",
                "clause_id": "clause:0",
                "relation_type": "AGENT",
                "head_node_id": "p1:23c59e2354e7b39c3fb9b70d",
                "tail_node_id": "p1:0a644412188024b2b0ff4db1",
                "evidence_span_ids": [
                  "p1:b0eccf72b3d1edf969c8f671",
                  "p1:71bb1d16f0709043431028ea",
                  "p1:e157be95c430ae6af88e6a37"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [
                  "clause:0:token:4",
                  "clause:0:token:0"
                ],
                "rule_refs": [
                  "NATIVE_AGENT"
                ]
              },
              {
                "relation_id": "p1:7a1cf1efe8021d18c5f21cc7",
                "clause_id": "clause:0",
                "relation_type": "PATIENT",
                "head_node_id": "p1:23c59e2354e7b39c3fb9b70d",
                "tail_node_id": "p1:13b991f220929572e7a8b1fa",
                "evidence_span_ids": [
                  "p1:b0eccf72b3d1edf969c8f671",
                  "p1:e157be95c430ae6af88e6a37"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [
                  "clause:0:token:4"
                ],
                "rule_refs": [
                  "NATIVE_PATIENT"
                ]
              },
              {
                "relation_id": "p1:89a7f7c1806e1f6bce40b78c",
                "clause_id": "clause:0",
                "relation_type": "SCOPE_MEMBER",
                "head_node_id": "p1:3ddbd3949281cbe0716e59ad",
                "tail_node_id": "p1:13b991f220929572e7a8b1fa",
                "evidence_span_ids": [
                  "p1:571d80d40877f6505adf1d06",
                  "p1:b0eccf72b3d1edf969c8f671",
                  "p1:e157be95c430ae6af88e6a37"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [],
                "rule_refs": [
                  "NATIVE_SCOPE_MEMBER"
                ]
              },
              {
                "relation_id": "p1:0fd472c5ca879d856e495479",
                "clause_id": "clause:1",
                "relation_type": "PATIENT",
                "head_node_id": "p1:55751628ba342c5905e06203",
                "tail_node_id": "p1:a017f65f2618791bc5728c63",
                "evidence_span_ids": [
                  "p1:fd66e7077083782d8fc63cf9",
                  "p1:9d123dd0da21f3490930ff89",
                  "p1:b6f9329b82cfe4bf264e6752"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [
                  "clause:1:token:1"
                ],
                "rule_refs": [
                  "NATIVE_PATIENT"
                ]
              },
              {
                "relation_id": "p1:36ac3c5793dabb687e58d8be",
                "clause_id": "clause:2",
                "relation_type": "RESULT",
                "head_node_id": "p1:7be272d3f3a2df10061bef21",
                "tail_node_id": "p1:fc5bd600086ab6090e519d5c",
                "evidence_span_ids": [
                  "p1:73e3c5ea188ca1c5d3a01a25",
                  "p1:816520f3f44f6ecce1fcffe1",
                  "p1:7f0793aa43172b583c71aea5"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [
                  "clause:2:token:0"
                ],
                "rule_refs": [
                  "NATIVE_RESULT"
                ]
              },
              {
                "relation_id": "p1:f93ea6ea733bc8fc9e674b73",
                "clause_id": "clause:3",
                "relation_type": "FORBIDS",
                "head_node_id": "p1:5005d79d390f276a34b7caf4",
                "tail_node_id": "p1:5e56145673653f1ee7f21e69",
                "evidence_span_ids": [
                  "p1:0ac85b43b0dc6a80218e77f0",
                  "p1:55ad616030ab5968a94ded69",
                  "p1:f33c3a1c29e28002155201ca"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [
                  "clause:3:token:2"
                ],
                "rule_refs": [
                  "NATIVE_FORBIDS"
                ]
              },
              {
                "relation_id": "p1:d394d120378224a6b4da7245",
                "clause_id": "clause:5",
                "relation_type": "AGENT",
                "head_node_id": "p1:00c60db12ccee968ea34ba91",
                "tail_node_id": "p1:3cfba2fb6a90ae4e9f6ecd34",
                "evidence_span_ids": [
                  "p1:389fc6806e332239f3a0a558",
                  "p1:3dc88c03831e32f9a8fc67ce",
                  "p1:a85ebf0b750986ebd6f278f6"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [
                  "clause:5:token:2",
                  "clause:5:token:1"
                ],
                "rule_refs": [
                  "NATIVE_AGENT"
                ]
              },
              {
                "relation_id": "p1:79a08469cd000a3ff52ee6f4",
                "clause_id": "clause:4",
                "relation_type": "AGENT",
                "head_node_id": "p1:3c21a1bf090fbc6ec5a038c3",
                "tail_node_id": "p1:ecd17316cc63a98d630af1d8",
                "evidence_span_ids": [
                  "p1:c5e695a4d3c696b147d967d9",
                  "p1:128b95de26c3a7705c96510e",
                  "p1:16c6c0a6d036213bdc5dc5e7"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [
                  "clause:4:token:2"
                ],
                "rule_refs": [
                  "NATIVE_AGENT"
                ]
              },
              {
                "relation_id": "p1:f763ba315058fb8aea451f0b",
                "clause_id": "clause:1",
                "relation_type": "AGENT",
                "head_node_id": "p1:55751628ba342c5905e06203",
                "tail_node_id": "p1:0a644412188024b2b0ff4db1",
                "evidence_span_ids": [
                  "p1:fd66e7077083782d8fc63cf9",
                  "p1:71bb1d16f0709043431028ea",
                  "p1:b6f9329b82cfe4bf264e6752"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [
                  "clause:1:token:1",
                  "clause:0:token:0"
                ],
                "rule_refs": [
                  "NATIVE_AGENT"
                ]
              },
              {
                "relation_id": "p1:f3a3ec29582ca92036ced2f9",
                "clause_id": "clause:2",
                "relation_type": "AGENT",
                "head_node_id": "p1:7be272d3f3a2df10061bef21",
                "tail_node_id": "p1:0a644412188024b2b0ff4db1",
                "evidence_span_ids": [
                  "p1:73e3c5ea188ca1c5d3a01a25",
                  "p1:71bb1d16f0709043431028ea",
                  "p1:7f0793aa43172b583c71aea5"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [
                  "clause:2:token:0",
                  "clause:0:token:0"
                ],
                "rule_refs": [
                  "NATIVE_AGENT"
                ]
              },
              {
                "relation_id": "p1:ee1f0ad948cdfe14a4c667a6",
                "clause_id": "clause:3",
                "relation_type": "AGENT",
                "head_node_id": "p1:5005d79d390f276a34b7caf4",
                "tail_node_id": "p1:0a644412188024b2b0ff4db1",
                "evidence_span_ids": [
                  "p1:0ac85b43b0dc6a80218e77f0",
                  "p1:71bb1d16f0709043431028ea",
                  "p1:f33c3a1c29e28002155201ca"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [
                  "clause:3:token:2",
                  "clause:0:token:0"
                ],
                "rule_refs": [
                  "NATIVE_AGENT"
                ]
              },
              {
                "relation_id": "p1:30f048f55c1175bd7c206c2d",
                "clause_id": "clause:1",
                "relation_type": "SCOPE_MEMBER",
                "head_node_id": "p1:55751628ba342c5905e06203",
                "tail_node_id": "p1:a017f65f2618791bc5728c63",
                "evidence_span_ids": [
                  "p1:fd66e7077083782d8fc63cf9",
                  "p1:9d123dd0da21f3490930ff89",
                  "p1:b6f9329b82cfe4bf264e6752"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [
                  "clause:1:token:1"
                ],
                "rule_refs": [
                  "NATIVE_SCOPE_MEMBER"
                ]
              }
            ],
            "set_expressions": [
              {
                "expr_id": "p1:82292b0e875921429a84e3ff",
                "kind": "ITEM",
                "entity_node_id": "p1:13b991f220929572e7a8b1fa",
                "source_span_ids": [
                  "p1:b0eccf72b3d1edf969c8f671"
                ],
                "relation_ids": [
                  "p1:7a1cf1efe8021d18c5f21cc7"
                ]
              },
              {
                "expr_id": "p1:41531131ef88c5f0e156cbc6",
                "kind": "ITEM",
                "entity_node_id": "p1:13b991f220929572e7a8b1fa",
                "source_span_ids": [
                  "p1:b0eccf72b3d1edf969c8f671"
                ],
                "relation_ids": [
                  "p1:89a7f7c1806e1f6bce40b78c"
                ]
              },
              {
                "expr_id": "p1:4ac8dd9472408c314bb27336",
                "kind": "ITEM",
                "entity_node_id": "p1:a017f65f2618791bc5728c63",
                "source_span_ids": [
                  "p1:9d123dd0da21f3490930ff89"
                ],
                "relation_ids": [
                  "p1:0fd472c5ca879d856e495479"
                ]
              },
              {
                "expr_id": "p1:b12999225efa8d7cefc8b8df",
                "kind": "ITEM",
                "entity_node_id": "p1:5e56145673653f1ee7f21e69",
                "source_span_ids": [
                  "p1:55ad616030ab5968a94ded69"
                ],
                "relation_ids": [
                  "p1:f93ea6ea733bc8fc9e674b73"
                ]
              },
              {
                "expr_id": "p1:f9cc48d78faa50dad8627855",
                "kind": "ITEM",
                "entity_node_id": "p1:a017f65f2618791bc5728c63",
                "source_span_ids": [
                  "p1:9d123dd0da21f3490930ff89"
                ],
                "relation_ids": [
                  "p1:30f048f55c1175bd7c206c2d"
                ]
              },
              {
                "expr_id": "p1:f5c4097140b3a14c789d8249",
                "kind": "ITEM",
                "entity_node_id": "p1:fc5bd600086ab6090e519d5c",
                "source_span_ids": [
                  "p1:816520f3f44f6ecce1fcffe1"
                ],
                "relation_ids": [
                  "p1:36ac3c5793dabb687e58d8be"
                ]
              }
            ]
          },
          "predicates": [
            {
              "node_id": "p1:4ccdd8b53cd9e017cbb17dbb",
              "clause_id": "clause:0",
              "token_id": "clause:0:token:1",
              "was_present": false,
              "evidence_kind": "SRL_PRED",
              "dependency": "root",
              "pos": "VV",
              "source_span_ids": [
                "p1:2cbc54e36db5ace4bf94cf39",
                "p1:e157be95c430ae6af88e6a37"
              ],
              "structural_path": [
                "document",
                "clause:0",
                "clause:0:token:1",
                "p1:4ccdd8b53cd9e017cbb17dbb"
              ]
            },
            {
              "node_id": "p1:a78bc4d47f94e06bd7c43b20",
              "clause_id": "clause:1",
              "token_id": "clause:1:token:0",
              "was_present": false,
              "evidence_kind": "VERBAL_DEPENDENCY",
              "dependency": "xcomp",
              "pos": "VV",
              "source_span_ids": [
                "p1:5843a93c9de7260207fbac4e",
                "p1:b6f9329b82cfe4bf264e6752"
              ],
              "structural_path": [
                "document",
                "clause:1",
                "clause:1:token:0",
                "p1:a78bc4d47f94e06bd7c43b20"
              ]
            },
            {
              "node_id": "p1:55751628ba342c5905e06203",
              "clause_id": "clause:1",
              "token_id": "clause:1:token:1",
              "was_present": true,
              "evidence_kind": "VERBAL_DEPENDENCY",
              "dependency": "root",
              "pos": "VV",
              "source_span_ids": [
                "p1:fd66e7077083782d8fc63cf9",
                "p1:b6f9329b82cfe4bf264e6752"
              ],
              "structural_path": [
                "document",
                "clause:1",
                "clause:1:token:1",
                "p1:55751628ba342c5905e06203"
              ]
            },
            {
              "node_id": "p1:7be272d3f3a2df10061bef21",
              "clause_id": "clause:2",
              "token_id": "clause:2:token:0",
              "was_present": true,
              "evidence_kind": "VERBAL_DEPENDENCY",
              "dependency": "root",
              "pos": "VV",
              "source_span_ids": [
                "p1:73e3c5ea188ca1c5d3a01a25",
                "p1:7f0793aa43172b583c71aea5"
              ],
              "structural_path": [
                "document",
                "clause:2",
                "clause:2:token:0",
                "p1:7be272d3f3a2df10061bef21"
              ]
            },
            {
              "node_id": "p1:5005d79d390f276a34b7caf4",
              "clause_id": "clause:3",
              "token_id": "clause:3:token:2",
              "was_present": true,
              "evidence_kind": "SRL_PRED",
              "dependency": "root",
              "pos": "VV",
              "source_span_ids": [
                "p1:0ac85b43b0dc6a80218e77f0",
                "p1:f33c3a1c29e28002155201ca"
              ],
              "structural_path": [
                "document",
                "clause:3",
                "clause:3:token:2",
                "p1:5005d79d390f276a34b7caf4"
              ]
            },
            {
              "node_id": "p1:3c21a1bf090fbc6ec5a038c3",
              "clause_id": "clause:4",
              "token_id": "clause:4:token:2",
              "was_present": true,
              "evidence_kind": "SRL_PRED",
              "dependency": "root",
              "pos": "VV",
              "source_span_ids": [
                "p1:c5e695a4d3c696b147d967d9",
                "p1:16c6c0a6d036213bdc5dc5e7"
              ],
              "structural_path": [
                "document",
                "clause:4",
                "clause:4:token:2",
                "p1:3c21a1bf090fbc6ec5a038c3"
              ]
            },
            {
              "node_id": "p1:00c60db12ccee968ea34ba91",
              "clause_id": "clause:5",
              "token_id": "clause:5:token:2",
              "was_present": true,
              "evidence_kind": "SRL_PRED",
              "dependency": "root",
              "pos": "VV",
              "source_span_ids": [
                "p1:389fc6806e332239f3a0a558",
                "p1:a85ebf0b750986ebd6f278f6"
              ],
              "structural_path": [
                "document",
                "clause:5",
                "clause:5:token:2",
                "p1:00c60db12ccee968ea34ba91"
              ]
            }
          ],
          "frames": [
            {
              "frame_id": "p1:4f78cb48d8c95d290d501684",
              "frame_kind": "MULTI_ARGUMENT",
              "event_node_id": "p1:4ccdd8b53cd9e017cbb17dbb",
              "primary_target_context_ids": [],
              "source_input_ids": [],
              "result_ids": [],
              "recipient_ids": [],
              "basis_ids": [],
              "condition_ids": [],
              "governing_action_ids": [],
              "governing_target_ids": [],
              "governing_clause_id": "clause:0",
              "source_span_ids": [
                "p1:e157be95c430ae6af88e6a37",
                "p1:2cbc54e36db5ace4bf94cf39"
              ],
              "structural_path": [
                "document",
                "clause:0",
                "p1:4ccdd8b53cd9e017cbb17dbb"
              ],
              "state": "CANDIDATE"
            },
            {
              "frame_id": "p1:9f94a520aa63b8c945fa9818",
              "frame_kind": "MULTI_ARGUMENT",
              "event_node_id": "p1:a78bc4d47f94e06bd7c43b20",
              "primary_target_context_ids": [],
              "source_input_ids": [],
              "result_ids": [],
              "recipient_ids": [],
              "basis_ids": [],
              "condition_ids": [],
              "governing_action_ids": [],
              "governing_target_ids": [],
              "governing_clause_id": "clause:1",
              "source_span_ids": [
                "p1:b6f9329b82cfe4bf264e6752",
                "p1:5843a93c9de7260207fbac4e"
              ],
              "structural_path": [
                "document",
                "clause:1",
                "p1:a78bc4d47f94e06bd7c43b20"
              ],
              "state": "CANDIDATE"
            },
            {
              "frame_id": "p1:64c6aec94a5fe63d7c8b7516",
              "frame_kind": "MULTI_ARGUMENT",
              "event_node_id": "p1:55751628ba342c5905e06203",
              "primary_target_context_ids": [],
              "source_input_ids": [],
              "result_ids": [],
              "recipient_ids": [],
              "basis_ids": [],
              "condition_ids": [],
              "governing_action_ids": [],
              "governing_target_ids": [],
              "governing_clause_id": "clause:1",
              "source_span_ids": [
                "p1:b6f9329b82cfe4bf264e6752",
                "p1:fd66e7077083782d8fc63cf9"
              ],
              "structural_path": [
                "document",
                "clause:1",
                "p1:55751628ba342c5905e06203"
              ],
              "state": "CANDIDATE"
            },
            {
              "frame_id": "p1:f6b39578d3a554bc8c0cfe7b",
              "frame_kind": "MULTI_ARGUMENT",
              "event_node_id": "p1:7be272d3f3a2df10061bef21",
              "primary_target_context_ids": [],
              "source_input_ids": [],
              "result_ids": [
                "p1:fc5bd600086ab6090e519d5c"
              ],
              "recipient_ids": [],
              "basis_ids": [],
              "condition_ids": [],
              "governing_action_ids": [],
              "governing_target_ids": [],
              "governing_clause_id": "clause:2",
              "source_span_ids": [
                "p1:7f0793aa43172b583c71aea5",
                "p1:73e3c5ea188ca1c5d3a01a25"
              ],
              "structural_path": [
                "document",
                "clause:2",
                "p1:7be272d3f3a2df10061bef21"
              ],
              "state": "CANDIDATE"
            },
            {
              "frame_id": "p1:479b3e27bf5d3980c9beaaf1",
              "frame_kind": "MULTI_ARGUMENT",
              "event_node_id": "p1:5005d79d390f276a34b7caf4",
              "primary_target_context_ids": [],
              "source_input_ids": [],
              "result_ids": [],
              "recipient_ids": [],
              "basis_ids": [],
              "condition_ids": [],
              "governing_action_ids": [],
              "governing_target_ids": [],
              "governing_clause_id": "clause:3",
              "source_span_ids": [
                "p1:f33c3a1c29e28002155201ca",
                "p1:0ac85b43b0dc6a80218e77f0"
              ],
              "structural_path": [
                "document",
                "clause:3",
                "p1:5005d79d390f276a34b7caf4"
              ],
              "state": "CANDIDATE"
            },
            {
              "frame_id": "p1:37d8a67343a6fec44fed2fb7",
              "frame_kind": "MULTI_ARGUMENT",
              "event_node_id": "p1:3c21a1bf090fbc6ec5a038c3",
              "primary_target_context_ids": [],
              "source_input_ids": [],
              "result_ids": [],
              "recipient_ids": [],
              "basis_ids": [],
              "condition_ids": [],
              "governing_action_ids": [],
              "governing_target_ids": [],
              "governing_clause_id": "clause:4",
              "source_span_ids": [
                "p1:16c6c0a6d036213bdc5dc5e7",
                "p1:c5e695a4d3c696b147d967d9"
              ],
              "structural_path": [
                "document",
                "clause:4",
                "p1:3c21a1bf090fbc6ec5a038c3"
              ],
              "state": "CANDIDATE"
            },
            {
              "frame_id": "p1:619842fee61654fb4914b208",
              "frame_kind": "MULTI_ARGUMENT",
              "event_node_id": "p1:00c60db12ccee968ea34ba91",
              "primary_target_context_ids": [],
              "source_input_ids": [],
              "result_ids": [],
              "recipient_ids": [],
              "basis_ids": [],
              "condition_ids": [],
              "governing_action_ids": [],
              "governing_target_ids": [],
              "governing_clause_id": "clause:5",
              "source_span_ids": [
                "p1:a85ebf0b750986ebd6f278f6",
                "p1:389fc6806e332239f3a0a558"
              ],
              "structural_path": [
                "document",
                "clause:5",
                "p1:00c60db12ccee968ea34ba91"
              ],
              "state": "CANDIDATE"
            }
          ],
          "operand_sets": [],
          "literal_precedence": [
            {
              "node_id": "p1:a017f65f2618791bc5728c63",
              "before": {
                "eligible": false,
                "reason": "NON_PARTICIPANT_TYPE"
              },
              "after": {
                "eligible": false,
                "reason": "PROTECTED_TECHNICAL_TYPE_PRECEDES_NER",
                "source_span_ids": [
                  "p1:9d123dd0da21f3490930ff89"
                ]
              },
              "technical_type": "FILE",
              "evidence_span_ids": [
                "p1:9d123dd0da21f3490930ff89"
              ]
            },
            {
              "node_id": "p1:fc5bd600086ab6090e519d5c",
              "before": {
                "eligible": false,
                "reason": "NON_PARTICIPANT_TYPE"
              },
              "after": {
                "eligible": false,
                "reason": "PROTECTED_TECHNICAL_TYPE_PRECEDES_NER",
                "source_span_ids": [
                  "p1:816520f3f44f6ecce1fcffe1"
                ]
              },
              "technical_type": "ABSTRACT_DELIVERABLE",
              "evidence_span_ids": [
                "p1:816520f3f44f6ecce1fcffe1"
              ]
            },
            {
              "node_id": "p1:5e56145673653f1ee7f21e69",
              "before": {
                "eligible": false,
                "reason": "NON_PARTICIPANT_TYPE"
              },
              "after": {
                "eligible": false,
                "reason": "PROTECTED_TECHNICAL_TYPE_PRECEDES_NER",
                "source_span_ids": [
                  "p1:55ad616030ab5968a94ded69"
                ]
              },
              "technical_type": "FILE",
              "evidence_span_ids": [
                "p1:55ad616030ab5968a94ded69"
              ]
            },
            {
              "node_id": "p1:ecd17316cc63a98d630af1d8",
              "before": {
                "eligible": false,
                "reason": "NON_PARTICIPANT_TYPE"
              },
              "after": {
                "eligible": false,
                "reason": "PROTECTED_TECHNICAL_TYPE_PRECEDES_NER",
                "source_span_ids": [
                  "p1:128b95de26c3a7705c96510e"
                ]
              },
              "technical_type": "FILE",
              "evidence_span_ids": [
                "p1:128b95de26c3a7705c96510e"
              ]
            }
          ],
          "excluded": [],
          "after_materialization": {
            "nodes": [
              {
                "node_id": "p1:3ddbd3949281cbe0716e59ad",
                "node_type": "DISCOURSE",
                "surface": "张宁负责这项整理。请读取 input.csv，生成 report.md。不得修改 input.csv。report.md 已生成后，本任务完成。",
                "source_span_ids": [
                  "p1:571d80d40877f6505adf1d06"
                ],
                "state": "RESOLVED"
              },
              {
                "node_id": "p1:23c59e2354e7b39c3fb9b70d",
                "node_type": "EVENT",
                "surface": "这项整理",
                "source_span_ids": [
                  "p1:b0eccf72b3d1edf969c8f671"
                ],
                "state": "RESOLVED",
                "modality": "REQUIRED",
                "clause_id": "clause:0"
              },
              {
                "node_id": "p1:0a644412188024b2b0ff4db1",
                "node_type": "ENTITY",
                "surface": "张宁",
                "source_span_ids": [
                  "p1:71bb1d16f0709043431028ea"
                ],
                "state": "RESOLVED",
                "clause_id": "clause:0",
                "participant_eligibility": {
                  "eligible": true,
                  "reason": "PERSON_NER",
                  "source_span_ids": [
                    "p1:71bb1d16f0709043431028ea"
                  ],
                  "ner_evidence": [
                    {
                      "text": "张宁",
                      "start": 0,
                      "end": 2,
                      "label": "PERSON",
                      "span": {
                        "source_id": "source:37bc331b435432c551f3996cda23568886d94a11588ab75e1a7b75aa3073818c",
                        "start": 0,
                        "end": 2,
                        "quote": "张宁"
                      }
                    }
                  ],
                  "name_token_evidence": [
                    "clause:0:token:0"
                  ]
                }
              },
              {
                "node_id": "p1:13b991f220929572e7a8b1fa",
                "node_type": "ENTITY",
                "surface": "这项整理",
                "source_span_ids": [
                  "p1:b0eccf72b3d1edf969c8f671"
                ],
                "state": "RESOLVED",
                "clause_id": "clause:0",
                "participant_eligibility": {
                  "eligible": false,
                  "reason": "SRL_AGENT_IS_NOT_IDENTITY",
                  "source_span_ids": [
                    "p1:b0eccf72b3d1edf969c8f671"
                  ],
                  "ner_evidence": [],
                  "name_token_evidence": []
                }
              },
              {
                "node_id": "p1:a017f65f2618791bc5728c63",
                "node_type": "ENTITY",
                "surface": "input.csv",
                "source_span_ids": [
                  "p1:9d123dd0da21f3490930ff89"
                ],
                "state": "RESOLVED",
                "clause_id": "clause:1",
                "technical_type": "FILE",
                "participant_eligibility": {
                  "eligible": false,
                  "reason": "PROTECTED_TECHNICAL_TYPE_PRECEDES_NER",
                  "source_span_ids": [
                    "p1:9d123dd0da21f3490930ff89"
                  ]
                }
              },
              {
                "node_id": "p1:55751628ba342c5905e06203",
                "node_type": "EVENT",
                "surface": "读取",
                "source_span_ids": [
                  "p1:fd66e7077083782d8fc63cf9"
                ],
                "state": "RESOLVED",
                "modality": "REQUIRED",
                "clause_id": "clause:1"
              },
              {
                "node_id": "p1:fc5bd600086ab6090e519d5c",
                "node_type": "ENTITY",
                "surface": "report.md",
                "source_span_ids": [
                  "p1:816520f3f44f6ecce1fcffe1"
                ],
                "state": "RESOLVED",
                "clause_id": "clause:2",
                "technical_type": "ABSTRACT_DELIVERABLE",
                "participant_eligibility": {
                  "eligible": false,
                  "reason": "PROTECTED_TECHNICAL_TYPE_PRECEDES_NER",
                  "source_span_ids": [
                    "p1:816520f3f44f6ecce1fcffe1"
                  ]
                }
              },
              {
                "node_id": "p1:7be272d3f3a2df10061bef21",
                "node_type": "EVENT",
                "surface": "生成",
                "source_span_ids": [
                  "p1:73e3c5ea188ca1c5d3a01a25"
                ],
                "state": "RESOLVED",
                "modality": "REQUIRED",
                "clause_id": "clause:2"
              },
              {
                "node_id": "p1:5e56145673653f1ee7f21e69",
                "node_type": "ENTITY",
                "surface": "input.csv",
                "source_span_ids": [
                  "p1:55ad616030ab5968a94ded69"
                ],
                "state": "RESOLVED",
                "clause_id": "clause:3",
                "technical_type": "FILE",
                "participant_eligibility": {
                  "eligible": false,
                  "reason": "PROTECTED_TECHNICAL_TYPE_PRECEDES_NER",
                  "source_span_ids": [
                    "p1:55ad616030ab5968a94ded69"
                  ]
                }
              },
              {
                "node_id": "p1:5005d79d390f276a34b7caf4",
                "node_type": "EVENT",
                "surface": "修改",
                "source_span_ids": [
                  "p1:0ac85b43b0dc6a80218e77f0"
                ],
                "state": "RESOLVED",
                "modality": "FORBIDDEN",
                "clause_id": "clause:3"
              },
              {
                "node_id": "p1:ecd17316cc63a98d630af1d8",
                "node_type": "ENTITY",
                "surface": "report.md",
                "source_span_ids": [
                  "p1:128b95de26c3a7705c96510e"
                ],
                "state": "RESOLVED",
                "clause_id": "clause:4",
                "technical_type": "FILE",
                "participant_eligibility": {
                  "eligible": false,
                  "reason": "PROTECTED_TECHNICAL_TYPE_PRECEDES_NER",
                  "source_span_ids": [
                    "p1:128b95de26c3a7705c96510e"
                  ]
                }
              },
              {
                "node_id": "p1:00c60db12ccee968ea34ba91",
                "node_type": "EVENT",
                "surface": "完成",
                "source_span_ids": [
                  "p1:389fc6806e332239f3a0a558"
                ],
                "state": "RESOLVED",
                "modality": "UNSTATED",
                "clause_id": "clause:5"
              },
              {
                "node_id": "p1:3cfba2fb6a90ae4e9f6ecd34",
                "node_type": "ENTITY",
                "surface": "本任务",
                "source_span_ids": [
                  "p1:3dc88c03831e32f9a8fc67ce"
                ],
                "state": "RESOLVED",
                "clause_id": "clause:5",
                "participant_eligibility": {
                  "eligible": false,
                  "reason": "SRL_AGENT_IS_NOT_IDENTITY",
                  "source_span_ids": [
                    "p1:3dc88c03831e32f9a8fc67ce"
                  ],
                  "ner_evidence": [],
                  "name_token_evidence": []
                }
              },
              {
                "node_id": "p1:3c21a1bf090fbc6ec5a038c3",
                "node_type": "EVENT",
                "surface": "生成",
                "source_span_ids": [
                  "p1:c5e695a4d3c696b147d967d9"
                ],
                "state": "RESOLVED",
                "modality": "UNSTATED",
                "clause_id": "clause:4"
              },
              {
                "node_id": "p1:4ccdd8b53cd9e017cbb17dbb",
                "node_type": "EVENT",
                "surface": "负责",
                "source_span_ids": [
                  "p1:2cbc54e36db5ace4bf94cf39"
                ],
                "state": "RESOLVED",
                "modality": "UNSTATED",
                "clause_id": "clause:0"
              },
              {
                "node_id": "p1:a78bc4d47f94e06bd7c43b20",
                "node_type": "EVENT",
                "surface": "请",
                "source_span_ids": [
                  "p1:5843a93c9de7260207fbac4e"
                ],
                "state": "RESOLVED",
                "modality": "UNSTATED",
                "clause_id": "clause:1"
              }
            ],
            "relations": [
              {
                "relation_id": "p1:9a1356179ef6b0a998e369fb",
                "clause_id": "clause:0",
                "relation_type": "AGENT",
                "head_node_id": "p1:23c59e2354e7b39c3fb9b70d",
                "tail_node_id": "p1:0a644412188024b2b0ff4db1",
                "evidence_span_ids": [
                  "p1:b0eccf72b3d1edf969c8f671",
                  "p1:71bb1d16f0709043431028ea",
                  "p1:e157be95c430ae6af88e6a37"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [
                  "clause:0:token:4",
                  "clause:0:token:0"
                ],
                "rule_refs": [
                  "NATIVE_AGENT"
                ]
              },
              {
                "relation_id": "p1:7a1cf1efe8021d18c5f21cc7",
                "clause_id": "clause:0",
                "relation_type": "PATIENT",
                "head_node_id": "p1:23c59e2354e7b39c3fb9b70d",
                "tail_node_id": "p1:13b991f220929572e7a8b1fa",
                "evidence_span_ids": [
                  "p1:b0eccf72b3d1edf969c8f671",
                  "p1:e157be95c430ae6af88e6a37"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [
                  "clause:0:token:4"
                ],
                "rule_refs": [
                  "NATIVE_PATIENT"
                ]
              },
              {
                "relation_id": "p1:89a7f7c1806e1f6bce40b78c",
                "clause_id": "clause:0",
                "relation_type": "SCOPE_MEMBER",
                "head_node_id": "p1:3ddbd3949281cbe0716e59ad",
                "tail_node_id": "p1:13b991f220929572e7a8b1fa",
                "evidence_span_ids": [
                  "p1:571d80d40877f6505adf1d06",
                  "p1:b0eccf72b3d1edf969c8f671",
                  "p1:e157be95c430ae6af88e6a37"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [],
                "rule_refs": [
                  "NATIVE_SCOPE_MEMBER"
                ]
              },
              {
                "relation_id": "p1:0fd472c5ca879d856e495479",
                "clause_id": "clause:1",
                "relation_type": "PATIENT",
                "head_node_id": "p1:55751628ba342c5905e06203",
                "tail_node_id": "p1:a017f65f2618791bc5728c63",
                "evidence_span_ids": [
                  "p1:fd66e7077083782d8fc63cf9",
                  "p1:9d123dd0da21f3490930ff89",
                  "p1:b6f9329b82cfe4bf264e6752"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [
                  "clause:1:token:1"
                ],
                "rule_refs": [
                  "NATIVE_PATIENT"
                ]
              },
              {
                "relation_id": "p1:36ac3c5793dabb687e58d8be",
                "clause_id": "clause:2",
                "relation_type": "RESULT",
                "head_node_id": "p1:7be272d3f3a2df10061bef21",
                "tail_node_id": "p1:fc5bd600086ab6090e519d5c",
                "evidence_span_ids": [
                  "p1:73e3c5ea188ca1c5d3a01a25",
                  "p1:816520f3f44f6ecce1fcffe1",
                  "p1:7f0793aa43172b583c71aea5"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [
                  "clause:2:token:0"
                ],
                "rule_refs": [
                  "NATIVE_RESULT"
                ]
              },
              {
                "relation_id": "p1:f93ea6ea733bc8fc9e674b73",
                "clause_id": "clause:3",
                "relation_type": "FORBIDS",
                "head_node_id": "p1:5005d79d390f276a34b7caf4",
                "tail_node_id": "p1:5e56145673653f1ee7f21e69",
                "evidence_span_ids": [
                  "p1:0ac85b43b0dc6a80218e77f0",
                  "p1:55ad616030ab5968a94ded69",
                  "p1:f33c3a1c29e28002155201ca"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [
                  "clause:3:token:2"
                ],
                "rule_refs": [
                  "NATIVE_FORBIDS"
                ]
              },
              {
                "relation_id": "p1:d394d120378224a6b4da7245",
                "clause_id": "clause:5",
                "relation_type": "AGENT",
                "head_node_id": "p1:00c60db12ccee968ea34ba91",
                "tail_node_id": "p1:3cfba2fb6a90ae4e9f6ecd34",
                "evidence_span_ids": [
                  "p1:389fc6806e332239f3a0a558",
                  "p1:3dc88c03831e32f9a8fc67ce",
                  "p1:a85ebf0b750986ebd6f278f6"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [
                  "clause:5:token:2",
                  "clause:5:token:1"
                ],
                "rule_refs": [
                  "NATIVE_AGENT"
                ]
              },
              {
                "relation_id": "p1:79a08469cd000a3ff52ee6f4",
                "clause_id": "clause:4",
                "relation_type": "AGENT",
                "head_node_id": "p1:3c21a1bf090fbc6ec5a038c3",
                "tail_node_id": "p1:ecd17316cc63a98d630af1d8",
                "evidence_span_ids": [
                  "p1:c5e695a4d3c696b147d967d9",
                  "p1:128b95de26c3a7705c96510e",
                  "p1:16c6c0a6d036213bdc5dc5e7"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [
                  "clause:4:token:2"
                ],
                "rule_refs": [
                  "NATIVE_AGENT"
                ]
              },
              {
                "relation_id": "p1:f763ba315058fb8aea451f0b",
                "clause_id": "clause:1",
                "relation_type": "AGENT",
                "head_node_id": "p1:55751628ba342c5905e06203",
                "tail_node_id": "p1:0a644412188024b2b0ff4db1",
                "evidence_span_ids": [
                  "p1:fd66e7077083782d8fc63cf9",
                  "p1:71bb1d16f0709043431028ea",
                  "p1:b6f9329b82cfe4bf264e6752"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [
                  "clause:1:token:1",
                  "clause:0:token:0"
                ],
                "rule_refs": [
                  "NATIVE_AGENT"
                ]
              },
              {
                "relation_id": "p1:f3a3ec29582ca92036ced2f9",
                "clause_id": "clause:2",
                "relation_type": "AGENT",
                "head_node_id": "p1:7be272d3f3a2df10061bef21",
                "tail_node_id": "p1:0a644412188024b2b0ff4db1",
                "evidence_span_ids": [
                  "p1:73e3c5ea188ca1c5d3a01a25",
                  "p1:71bb1d16f0709043431028ea",
                  "p1:7f0793aa43172b583c71aea5"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [
                  "clause:2:token:0",
                  "clause:0:token:0"
                ],
                "rule_refs": [
                  "NATIVE_AGENT"
                ]
              },
              {
                "relation_id": "p1:ee1f0ad948cdfe14a4c667a6",
                "clause_id": "clause:3",
                "relation_type": "AGENT",
                "head_node_id": "p1:5005d79d390f276a34b7caf4",
                "tail_node_id": "p1:0a644412188024b2b0ff4db1",
                "evidence_span_ids": [
                  "p1:0ac85b43b0dc6a80218e77f0",
                  "p1:71bb1d16f0709043431028ea",
                  "p1:f33c3a1c29e28002155201ca"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [
                  "clause:3:token:2",
                  "clause:0:token:0"
                ],
                "rule_refs": [
                  "NATIVE_AGENT"
                ]
              },
              {
                "relation_id": "p1:30f048f55c1175bd7c206c2d",
                "clause_id": "clause:1",
                "relation_type": "SCOPE_MEMBER",
                "head_node_id": "p1:55751628ba342c5905e06203",
                "tail_node_id": "p1:a017f65f2618791bc5728c63",
                "evidence_span_ids": [
                  "p1:fd66e7077083782d8fc63cf9",
                  "p1:9d123dd0da21f3490930ff89",
                  "p1:b6f9329b82cfe4bf264e6752"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [
                  "clause:1:token:1"
                ],
                "rule_refs": [
                  "NATIVE_SCOPE_MEMBER"
                ]
              }
            ],
            "set_expressions": [
              {
                "expr_id": "p1:82292b0e875921429a84e3ff",
                "kind": "ITEM",
                "entity_node_id": "p1:13b991f220929572e7a8b1fa",
                "source_span_ids": [
                  "p1:b0eccf72b3d1edf969c8f671"
                ],
                "relation_ids": [
                  "p1:7a1cf1efe8021d18c5f21cc7"
                ]
              },
              {
                "expr_id": "p1:41531131ef88c5f0e156cbc6",
                "kind": "ITEM",
                "entity_node_id": "p1:13b991f220929572e7a8b1fa",
                "source_span_ids": [
                  "p1:b0eccf72b3d1edf969c8f671"
                ],
                "relation_ids": [
                  "p1:89a7f7c1806e1f6bce40b78c"
                ]
              },
              {
                "expr_id": "p1:4ac8dd9472408c314bb27336",
                "kind": "ITEM",
                "entity_node_id": "p1:a017f65f2618791bc5728c63",
                "source_span_ids": [
                  "p1:9d123dd0da21f3490930ff89"
                ],
                "relation_ids": [
                  "p1:0fd472c5ca879d856e495479"
                ]
              },
              {
                "expr_id": "p1:b12999225efa8d7cefc8b8df",
                "kind": "ITEM",
                "entity_node_id": "p1:5e56145673653f1ee7f21e69",
                "source_span_ids": [
                  "p1:55ad616030ab5968a94ded69"
                ],
                "relation_ids": [
                  "p1:f93ea6ea733bc8fc9e674b73"
                ]
              },
              {
                "expr_id": "p1:f9cc48d78faa50dad8627855",
                "kind": "ITEM",
                "entity_node_id": "p1:a017f65f2618791bc5728c63",
                "source_span_ids": [
                  "p1:9d123dd0da21f3490930ff89"
                ],
                "relation_ids": [
                  "p1:30f048f55c1175bd7c206c2d"
                ]
              },
              {
                "expr_id": "p1:f5c4097140b3a14c789d8249",
                "kind": "ITEM",
                "entity_node_id": "p1:fc5bd600086ab6090e519d5c",
                "source_span_ids": [
                  "p1:816520f3f44f6ecce1fcffe1"
                ],
                "relation_ids": [
                  "p1:36ac3c5793dabb687e58d8be"
                ]
              }
            ]
          },
          "edge_input": {
            "nodes": [
              {
                "node_id": "p1:3ddbd3949281cbe0716e59ad",
                "node_type": "DISCOURSE",
                "surface": "张宁负责这项整理。请读取 input.csv，生成 report.md。不得修改 input.csv。report.md 已生成后，本任务完成。",
                "source_span_ids": [
                  "p1:571d80d40877f6505adf1d06"
                ],
                "state": "RESOLVED"
              },
              {
                "node_id": "p1:23c59e2354e7b39c3fb9b70d",
                "node_type": "EVENT",
                "surface": "这项整理",
                "source_span_ids": [
                  "p1:b0eccf72b3d1edf969c8f671"
                ],
                "state": "RESOLVED",
                "modality": "REQUIRED",
                "clause_id": "clause:0"
              },
              {
                "node_id": "p1:0a644412188024b2b0ff4db1",
                "node_type": "ENTITY",
                "surface": "张宁",
                "source_span_ids": [
                  "p1:71bb1d16f0709043431028ea"
                ],
                "state": "RESOLVED",
                "clause_id": "clause:0",
                "participant_eligibility": {
                  "eligible": true,
                  "reason": "PERSON_NER",
                  "source_span_ids": [
                    "p1:71bb1d16f0709043431028ea"
                  ],
                  "ner_evidence": [
                    {
                      "text": "张宁",
                      "start": 0,
                      "end": 2,
                      "label": "PERSON",
                      "span": {
                        "source_id": "source:37bc331b435432c551f3996cda23568886d94a11588ab75e1a7b75aa3073818c",
                        "start": 0,
                        "end": 2,
                        "quote": "张宁"
                      }
                    }
                  ],
                  "name_token_evidence": [
                    "clause:0:token:0"
                  ]
                }
              },
              {
                "node_id": "p1:13b991f220929572e7a8b1fa",
                "node_type": "ENTITY",
                "surface": "这项整理",
                "source_span_ids": [
                  "p1:b0eccf72b3d1edf969c8f671"
                ],
                "state": "RESOLVED",
                "clause_id": "clause:0",
                "participant_eligibility": {
                  "eligible": false,
                  "reason": "SRL_AGENT_IS_NOT_IDENTITY",
                  "source_span_ids": [
                    "p1:b0eccf72b3d1edf969c8f671"
                  ],
                  "ner_evidence": [],
                  "name_token_evidence": []
                }
              },
              {
                "node_id": "p1:a017f65f2618791bc5728c63",
                "node_type": "ENTITY",
                "surface": "input.csv",
                "source_span_ids": [
                  "p1:9d123dd0da21f3490930ff89"
                ],
                "state": "RESOLVED",
                "clause_id": "clause:1",
                "technical_type": "FILE",
                "participant_eligibility": {
                  "eligible": false,
                  "reason": "PROTECTED_TECHNICAL_TYPE_PRECEDES_NER",
                  "source_span_ids": [
                    "p1:9d123dd0da21f3490930ff89"
                  ]
                }
              },
              {
                "node_id": "p1:55751628ba342c5905e06203",
                "node_type": "EVENT",
                "surface": "读取",
                "source_span_ids": [
                  "p1:fd66e7077083782d8fc63cf9"
                ],
                "state": "RESOLVED",
                "modality": "REQUIRED",
                "clause_id": "clause:1"
              },
              {
                "node_id": "p1:fc5bd600086ab6090e519d5c",
                "node_type": "ENTITY",
                "surface": "report.md",
                "source_span_ids": [
                  "p1:816520f3f44f6ecce1fcffe1"
                ],
                "state": "RESOLVED",
                "clause_id": "clause:2",
                "technical_type": "ABSTRACT_DELIVERABLE",
                "participant_eligibility": {
                  "eligible": false,
                  "reason": "PROTECTED_TECHNICAL_TYPE_PRECEDES_NER",
                  "source_span_ids": [
                    "p1:816520f3f44f6ecce1fcffe1"
                  ]
                }
              },
              {
                "node_id": "p1:7be272d3f3a2df10061bef21",
                "node_type": "EVENT",
                "surface": "生成",
                "source_span_ids": [
                  "p1:73e3c5ea188ca1c5d3a01a25"
                ],
                "state": "RESOLVED",
                "modality": "REQUIRED",
                "clause_id": "clause:2"
              },
              {
                "node_id": "p1:5e56145673653f1ee7f21e69",
                "node_type": "ENTITY",
                "surface": "input.csv",
                "source_span_ids": [
                  "p1:55ad616030ab5968a94ded69"
                ],
                "state": "RESOLVED",
                "clause_id": "clause:3",
                "technical_type": "FILE",
                "participant_eligibility": {
                  "eligible": false,
                  "reason": "PROTECTED_TECHNICAL_TYPE_PRECEDES_NER",
                  "source_span_ids": [
                    "p1:55ad616030ab5968a94ded69"
                  ]
                }
              },
              {
                "node_id": "p1:5005d79d390f276a34b7caf4",
                "node_type": "EVENT",
                "surface": "修改",
                "source_span_ids": [
                  "p1:0ac85b43b0dc6a80218e77f0"
                ],
                "state": "RESOLVED",
                "modality": "FORBIDDEN",
                "clause_id": "clause:3"
              },
              {
                "node_id": "p1:ecd17316cc63a98d630af1d8",
                "node_type": "ENTITY",
                "surface": "report.md",
                "source_span_ids": [
                  "p1:128b95de26c3a7705c96510e"
                ],
                "state": "RESOLVED",
                "clause_id": "clause:4",
                "technical_type": "FILE",
                "participant_eligibility": {
                  "eligible": false,
                  "reason": "PROTECTED_TECHNICAL_TYPE_PRECEDES_NER",
                  "source_span_ids": [
                    "p1:128b95de26c3a7705c96510e"
                  ]
                }
              },
              {
                "node_id": "p1:00c60db12ccee968ea34ba91",
                "node_type": "EVENT",
                "surface": "完成",
                "source_span_ids": [
                  "p1:389fc6806e332239f3a0a558"
                ],
                "state": "RESOLVED",
                "modality": "UNSTATED",
                "clause_id": "clause:5"
              },
              {
                "node_id": "p1:3cfba2fb6a90ae4e9f6ecd34",
                "node_type": "ENTITY",
                "surface": "本任务",
                "source_span_ids": [
                  "p1:3dc88c03831e32f9a8fc67ce"
                ],
                "state": "RESOLVED",
                "clause_id": "clause:5",
                "participant_eligibility": {
                  "eligible": false,
                  "reason": "SRL_AGENT_IS_NOT_IDENTITY",
                  "source_span_ids": [
                    "p1:3dc88c03831e32f9a8fc67ce"
                  ],
                  "ner_evidence": [],
                  "name_token_evidence": []
                }
              },
              {
                "node_id": "p1:3c21a1bf090fbc6ec5a038c3",
                "node_type": "EVENT",
                "surface": "生成",
                "source_span_ids": [
                  "p1:c5e695a4d3c696b147d967d9"
                ],
                "state": "RESOLVED",
                "modality": "UNSTATED",
                "clause_id": "clause:4"
              },
              {
                "node_id": "p1:4ccdd8b53cd9e017cbb17dbb",
                "node_type": "EVENT",
                "surface": "负责",
                "source_span_ids": [
                  "p1:2cbc54e36db5ace4bf94cf39"
                ],
                "state": "RESOLVED",
                "modality": "UNSTATED",
                "clause_id": "clause:0"
              },
              {
                "node_id": "p1:a78bc4d47f94e06bd7c43b20",
                "node_type": "EVENT",
                "surface": "请",
                "source_span_ids": [
                  "p1:5843a93c9de7260207fbac4e"
                ],
                "state": "RESOLVED",
                "modality": "UNSTATED",
                "clause_id": "clause:1"
              }
            ],
            "relations": [
              {
                "relation_id": "p1:9a1356179ef6b0a998e369fb",
                "clause_id": "clause:0",
                "relation_type": "AGENT",
                "head_node_id": "p1:23c59e2354e7b39c3fb9b70d",
                "tail_node_id": "p1:0a644412188024b2b0ff4db1",
                "evidence_span_ids": [
                  "p1:b0eccf72b3d1edf969c8f671",
                  "p1:71bb1d16f0709043431028ea",
                  "p1:e157be95c430ae6af88e6a37"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [
                  "clause:0:token:4",
                  "clause:0:token:0"
                ],
                "rule_refs": [
                  "NATIVE_AGENT"
                ]
              },
              {
                "relation_id": "p1:7a1cf1efe8021d18c5f21cc7",
                "clause_id": "clause:0",
                "relation_type": "PATIENT",
                "head_node_id": "p1:23c59e2354e7b39c3fb9b70d",
                "tail_node_id": "p1:13b991f220929572e7a8b1fa",
                "evidence_span_ids": [
                  "p1:b0eccf72b3d1edf969c8f671",
                  "p1:e157be95c430ae6af88e6a37"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [
                  "clause:0:token:4"
                ],
                "rule_refs": [
                  "NATIVE_PATIENT"
                ]
              },
              {
                "relation_id": "p1:89a7f7c1806e1f6bce40b78c",
                "clause_id": "clause:0",
                "relation_type": "SCOPE_MEMBER",
                "head_node_id": "p1:3ddbd3949281cbe0716e59ad",
                "tail_node_id": "p1:13b991f220929572e7a8b1fa",
                "evidence_span_ids": [
                  "p1:571d80d40877f6505adf1d06",
                  "p1:b0eccf72b3d1edf969c8f671",
                  "p1:e157be95c430ae6af88e6a37"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [],
                "rule_refs": [
                  "NATIVE_SCOPE_MEMBER"
                ]
              },
              {
                "relation_id": "p1:0fd472c5ca879d856e495479",
                "clause_id": "clause:1",
                "relation_type": "PATIENT",
                "head_node_id": "p1:55751628ba342c5905e06203",
                "tail_node_id": "p1:a017f65f2618791bc5728c63",
                "evidence_span_ids": [
                  "p1:fd66e7077083782d8fc63cf9",
                  "p1:9d123dd0da21f3490930ff89",
                  "p1:b6f9329b82cfe4bf264e6752"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [
                  "clause:1:token:1"
                ],
                "rule_refs": [
                  "NATIVE_PATIENT"
                ]
              },
              {
                "relation_id": "p1:36ac3c5793dabb687e58d8be",
                "clause_id": "clause:2",
                "relation_type": "RESULT",
                "head_node_id": "p1:7be272d3f3a2df10061bef21",
                "tail_node_id": "p1:fc5bd600086ab6090e519d5c",
                "evidence_span_ids": [
                  "p1:73e3c5ea188ca1c5d3a01a25",
                  "p1:816520f3f44f6ecce1fcffe1",
                  "p1:7f0793aa43172b583c71aea5"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [
                  "clause:2:token:0"
                ],
                "rule_refs": [
                  "NATIVE_RESULT"
                ]
              },
              {
                "relation_id": "p1:f93ea6ea733bc8fc9e674b73",
                "clause_id": "clause:3",
                "relation_type": "FORBIDS",
                "head_node_id": "p1:5005d79d390f276a34b7caf4",
                "tail_node_id": "p1:5e56145673653f1ee7f21e69",
                "evidence_span_ids": [
                  "p1:0ac85b43b0dc6a80218e77f0",
                  "p1:55ad616030ab5968a94ded69",
                  "p1:f33c3a1c29e28002155201ca"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [
                  "clause:3:token:2"
                ],
                "rule_refs": [
                  "NATIVE_FORBIDS"
                ]
              },
              {
                "relation_id": "p1:d394d120378224a6b4da7245",
                "clause_id": "clause:5",
                "relation_type": "AGENT",
                "head_node_id": "p1:00c60db12ccee968ea34ba91",
                "tail_node_id": "p1:3cfba2fb6a90ae4e9f6ecd34",
                "evidence_span_ids": [
                  "p1:389fc6806e332239f3a0a558",
                  "p1:3dc88c03831e32f9a8fc67ce",
                  "p1:a85ebf0b750986ebd6f278f6"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [
                  "clause:5:token:2",
                  "clause:5:token:1"
                ],
                "rule_refs": [
                  "NATIVE_AGENT"
                ]
              },
              {
                "relation_id": "p1:79a08469cd000a3ff52ee6f4",
                "clause_id": "clause:4",
                "relation_type": "AGENT",
                "head_node_id": "p1:3c21a1bf090fbc6ec5a038c3",
                "tail_node_id": "p1:ecd17316cc63a98d630af1d8",
                "evidence_span_ids": [
                  "p1:c5e695a4d3c696b147d967d9",
                  "p1:128b95de26c3a7705c96510e",
                  "p1:16c6c0a6d036213bdc5dc5e7"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [
                  "clause:4:token:2"
                ],
                "rule_refs": [
                  "NATIVE_AGENT"
                ]
              },
              {
                "relation_id": "p1:f763ba315058fb8aea451f0b",
                "clause_id": "clause:1",
                "relation_type": "AGENT",
                "head_node_id": "p1:55751628ba342c5905e06203",
                "tail_node_id": "p1:0a644412188024b2b0ff4db1",
                "evidence_span_ids": [
                  "p1:fd66e7077083782d8fc63cf9",
                  "p1:71bb1d16f0709043431028ea",
                  "p1:b6f9329b82cfe4bf264e6752"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [
                  "clause:1:token:1",
                  "clause:0:token:0"
                ],
                "rule_refs": [
                  "NATIVE_AGENT"
                ]
              },
              {
                "relation_id": "p1:f3a3ec29582ca92036ced2f9",
                "clause_id": "clause:2",
                "relation_type": "AGENT",
                "head_node_id": "p1:7be272d3f3a2df10061bef21",
                "tail_node_id": "p1:0a644412188024b2b0ff4db1",
                "evidence_span_ids": [
                  "p1:73e3c5ea188ca1c5d3a01a25",
                  "p1:71bb1d16f0709043431028ea",
                  "p1:7f0793aa43172b583c71aea5"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [
                  "clause:2:token:0",
                  "clause:0:token:0"
                ],
                "rule_refs": [
                  "NATIVE_AGENT"
                ]
              },
              {
                "relation_id": "p1:ee1f0ad948cdfe14a4c667a6",
                "clause_id": "clause:3",
                "relation_type": "AGENT",
                "head_node_id": "p1:5005d79d390f276a34b7caf4",
                "tail_node_id": "p1:0a644412188024b2b0ff4db1",
                "evidence_span_ids": [
                  "p1:0ac85b43b0dc6a80218e77f0",
                  "p1:71bb1d16f0709043431028ea",
                  "p1:f33c3a1c29e28002155201ca"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [
                  "clause:3:token:2",
                  "clause:0:token:0"
                ],
                "rule_refs": [
                  "NATIVE_AGENT"
                ]
              },
              {
                "relation_id": "p1:30f048f55c1175bd7c206c2d",
                "clause_id": "clause:1",
                "relation_type": "SCOPE_MEMBER",
                "head_node_id": "p1:55751628ba342c5905e06203",
                "tail_node_id": "p1:a017f65f2618791bc5728c63",
                "evidence_span_ids": [
                  "p1:fd66e7077083782d8fc63cf9",
                  "p1:9d123dd0da21f3490930ff89",
                  "p1:b6f9329b82cfe4bf264e6752"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [
                  "clause:1:token:1"
                ],
                "rule_refs": [
                  "NATIVE_SCOPE_MEMBER"
                ]
              }
            ],
            "set_expressions": [
              {
                "expr_id": "p1:82292b0e875921429a84e3ff",
                "kind": "ITEM",
                "entity_node_id": "p1:13b991f220929572e7a8b1fa",
                "source_span_ids": [
                  "p1:b0eccf72b3d1edf969c8f671"
                ],
                "relation_ids": [
                  "p1:7a1cf1efe8021d18c5f21cc7"
                ]
              },
              {
                "expr_id": "p1:41531131ef88c5f0e156cbc6",
                "kind": "ITEM",
                "entity_node_id": "p1:13b991f220929572e7a8b1fa",
                "source_span_ids": [
                  "p1:b0eccf72b3d1edf969c8f671"
                ],
                "relation_ids": [
                  "p1:89a7f7c1806e1f6bce40b78c"
                ]
              },
              {
                "expr_id": "p1:4ac8dd9472408c314bb27336",
                "kind": "ITEM",
                "entity_node_id": "p1:a017f65f2618791bc5728c63",
                "source_span_ids": [
                  "p1:9d123dd0da21f3490930ff89"
                ],
                "relation_ids": [
                  "p1:0fd472c5ca879d856e495479"
                ]
              },
              {
                "expr_id": "p1:b12999225efa8d7cefc8b8df",
                "kind": "ITEM",
                "entity_node_id": "p1:5e56145673653f1ee7f21e69",
                "source_span_ids": [
                  "p1:55ad616030ab5968a94ded69"
                ],
                "relation_ids": [
                  "p1:f93ea6ea733bc8fc9e674b73"
                ]
              },
              {
                "expr_id": "p1:f9cc48d78faa50dad8627855",
                "kind": "ITEM",
                "entity_node_id": "p1:a017f65f2618791bc5728c63",
                "source_span_ids": [
                  "p1:9d123dd0da21f3490930ff89"
                ],
                "relation_ids": [
                  "p1:30f048f55c1175bd7c206c2d"
                ]
              },
              {
                "expr_id": "p1:f5c4097140b3a14c789d8249",
                "kind": "ITEM",
                "entity_node_id": "p1:fc5bd600086ab6090e519d5c",
                "source_span_ids": [
                  "p1:816520f3f44f6ecce1fcffe1"
                ],
                "relation_ids": [
                  "p1:36ac3c5793dabb687e58d8be"
                ]
              }
            ]
          },
          "edge_output": {
            "nodes": [
              {
                "node_id": "p1:3ddbd3949281cbe0716e59ad",
                "node_type": "DISCOURSE",
                "surface": "张宁负责这项整理。请读取 input.csv，生成 report.md。不得修改 input.csv。report.md 已生成后，本任务完成。",
                "source_span_ids": [
                  "p1:571d80d40877f6505adf1d06"
                ],
                "state": "RESOLVED"
              },
              {
                "node_id": "p1:23c59e2354e7b39c3fb9b70d",
                "node_type": "EVENT",
                "surface": "这项整理",
                "source_span_ids": [
                  "p1:b0eccf72b3d1edf969c8f671"
                ],
                "state": "RESOLVED",
                "modality": "REQUIRED",
                "clause_id": "clause:0"
              },
              {
                "node_id": "p1:0a644412188024b2b0ff4db1",
                "node_type": "ENTITY",
                "surface": "张宁",
                "source_span_ids": [
                  "p1:71bb1d16f0709043431028ea"
                ],
                "state": "RESOLVED",
                "clause_id": "clause:0",
                "participant_eligibility": {
                  "eligible": true,
                  "reason": "PERSON_NER",
                  "source_span_ids": [
                    "p1:71bb1d16f0709043431028ea"
                  ],
                  "ner_evidence": [
                    {
                      "text": "张宁",
                      "start": 0,
                      "end": 2,
                      "label": "PERSON",
                      "span": {
                        "source_id": "source:37bc331b435432c551f3996cda23568886d94a11588ab75e1a7b75aa3073818c",
                        "start": 0,
                        "end": 2,
                        "quote": "张宁"
                      }
                    }
                  ],
                  "name_token_evidence": [
                    "clause:0:token:0"
                  ]
                }
              },
              {
                "node_id": "p1:13b991f220929572e7a8b1fa",
                "node_type": "ENTITY",
                "surface": "这项整理",
                "source_span_ids": [
                  "p1:b0eccf72b3d1edf969c8f671"
                ],
                "state": "RESOLVED",
                "clause_id": "clause:0",
                "participant_eligibility": {
                  "eligible": false,
                  "reason": "SRL_AGENT_IS_NOT_IDENTITY",
                  "source_span_ids": [
                    "p1:b0eccf72b3d1edf969c8f671"
                  ],
                  "ner_evidence": [],
                  "name_token_evidence": []
                }
              },
              {
                "node_id": "p1:a017f65f2618791bc5728c63",
                "node_type": "ENTITY",
                "surface": "input.csv",
                "source_span_ids": [
                  "p1:9d123dd0da21f3490930ff89"
                ],
                "state": "RESOLVED",
                "clause_id": "clause:1",
                "technical_type": "FILE",
                "participant_eligibility": {
                  "eligible": false,
                  "reason": "PROTECTED_TECHNICAL_TYPE_PRECEDES_NER",
                  "source_span_ids": [
                    "p1:9d123dd0da21f3490930ff89"
                  ]
                }
              },
              {
                "node_id": "p1:55751628ba342c5905e06203",
                "node_type": "EVENT",
                "surface": "读取",
                "source_span_ids": [
                  "p1:fd66e7077083782d8fc63cf9"
                ],
                "state": "RESOLVED",
                "modality": "REQUIRED",
                "clause_id": "clause:1"
              },
              {
                "node_id": "p1:fc5bd600086ab6090e519d5c",
                "node_type": "ENTITY",
                "surface": "report.md",
                "source_span_ids": [
                  "p1:816520f3f44f6ecce1fcffe1"
                ],
                "state": "RESOLVED",
                "clause_id": "clause:2",
                "technical_type": "ABSTRACT_DELIVERABLE",
                "participant_eligibility": {
                  "eligible": false,
                  "reason": "PROTECTED_TECHNICAL_TYPE_PRECEDES_NER",
                  "source_span_ids": [
                    "p1:816520f3f44f6ecce1fcffe1"
                  ]
                }
              },
              {
                "node_id": "p1:7be272d3f3a2df10061bef21",
                "node_type": "EVENT",
                "surface": "生成",
                "source_span_ids": [
                  "p1:73e3c5ea188ca1c5d3a01a25"
                ],
                "state": "RESOLVED",
                "modality": "REQUIRED",
                "clause_id": "clause:2"
              },
              {
                "node_id": "p1:5e56145673653f1ee7f21e69",
                "node_type": "ENTITY",
                "surface": "input.csv",
                "source_span_ids": [
                  "p1:55ad616030ab5968a94ded69"
                ],
                "state": "RESOLVED",
                "clause_id": "clause:3",
                "technical_type": "FILE",
                "participant_eligibility": {
                  "eligible": false,
                  "reason": "PROTECTED_TECHNICAL_TYPE_PRECEDES_NER",
                  "source_span_ids": [
                    "p1:55ad616030ab5968a94ded69"
                  ]
                }
              },
              {
                "node_id": "p1:5005d79d390f276a34b7caf4",
                "node_type": "EVENT",
                "surface": "修改",
                "source_span_ids": [
                  "p1:0ac85b43b0dc6a80218e77f0"
                ],
                "state": "RESOLVED",
                "modality": "FORBIDDEN",
                "clause_id": "clause:3"
              },
              {
                "node_id": "p1:ecd17316cc63a98d630af1d8",
                "node_type": "ENTITY",
                "surface": "report.md",
                "source_span_ids": [
                  "p1:128b95de26c3a7705c96510e"
                ],
                "state": "RESOLVED",
                "clause_id": "clause:4",
                "technical_type": "FILE",
                "participant_eligibility": {
                  "eligible": false,
                  "reason": "PROTECTED_TECHNICAL_TYPE_PRECEDES_NER",
                  "source_span_ids": [
                    "p1:128b95de26c3a7705c96510e"
                  ]
                }
              },
              {
                "node_id": "p1:00c60db12ccee968ea34ba91",
                "node_type": "EVENT",
                "surface": "完成",
                "source_span_ids": [
                  "p1:389fc6806e332239f3a0a558"
                ],
                "state": "RESOLVED",
                "modality": "UNSTATED",
                "clause_id": "clause:5"
              },
              {
                "node_id": "p1:3cfba2fb6a90ae4e9f6ecd34",
                "node_type": "ENTITY",
                "surface": "本任务",
                "source_span_ids": [
                  "p1:3dc88c03831e32f9a8fc67ce"
                ],
                "state": "RESOLVED",
                "clause_id": "clause:5",
                "participant_eligibility": {
                  "eligible": false,
                  "reason": "SRL_AGENT_IS_NOT_IDENTITY",
                  "source_span_ids": [
                    "p1:3dc88c03831e32f9a8fc67ce"
                  ],
                  "ner_evidence": [],
                  "name_token_evidence": []
                }
              },
              {
                "node_id": "p1:3c21a1bf090fbc6ec5a038c3",
                "node_type": "EVENT",
                "surface": "生成",
                "source_span_ids": [
                  "p1:c5e695a4d3c696b147d967d9"
                ],
                "state": "RESOLVED",
                "modality": "UNSTATED",
                "clause_id": "clause:4"
              },
              {
                "node_id": "p1:4ccdd8b53cd9e017cbb17dbb",
                "node_type": "EVENT",
                "surface": "负责",
                "source_span_ids": [
                  "p1:2cbc54e36db5ace4bf94cf39"
                ],
                "state": "RESOLVED",
                "modality": "UNSTATED",
                "clause_id": "clause:0"
              },
              {
                "node_id": "p1:a78bc4d47f94e06bd7c43b20",
                "node_type": "EVENT",
                "surface": "请",
                "source_span_ids": [
                  "p1:5843a93c9de7260207fbac4e"
                ],
                "state": "RESOLVED",
                "modality": "UNSTATED",
                "clause_id": "clause:1"
              }
            ],
            "relations": [
              {
                "relation_id": "p1:9a1356179ef6b0a998e369fb",
                "clause_id": "clause:0",
                "relation_type": "AGENT",
                "head_node_id": "p1:23c59e2354e7b39c3fb9b70d",
                "tail_node_id": "p1:0a644412188024b2b0ff4db1",
                "evidence_span_ids": [
                  "p1:b0eccf72b3d1edf969c8f671",
                  "p1:71bb1d16f0709043431028ea",
                  "p1:e157be95c430ae6af88e6a37"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [
                  "clause:0:token:4",
                  "clause:0:token:0"
                ],
                "rule_refs": [
                  "NATIVE_AGENT"
                ]
              },
              {
                "relation_id": "p1:7a1cf1efe8021d18c5f21cc7",
                "clause_id": "clause:0",
                "relation_type": "PATIENT",
                "head_node_id": "p1:23c59e2354e7b39c3fb9b70d",
                "tail_node_id": "p1:13b991f220929572e7a8b1fa",
                "evidence_span_ids": [
                  "p1:b0eccf72b3d1edf969c8f671",
                  "p1:e157be95c430ae6af88e6a37"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [
                  "clause:0:token:4"
                ],
                "rule_refs": [
                  "NATIVE_PATIENT"
                ]
              },
              {
                "relation_id": "p1:89a7f7c1806e1f6bce40b78c",
                "clause_id": "clause:0",
                "relation_type": "SCOPE_MEMBER",
                "head_node_id": "p1:3ddbd3949281cbe0716e59ad",
                "tail_node_id": "p1:13b991f220929572e7a8b1fa",
                "evidence_span_ids": [
                  "p1:571d80d40877f6505adf1d06",
                  "p1:b0eccf72b3d1edf969c8f671",
                  "p1:e157be95c430ae6af88e6a37"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [],
                "rule_refs": [
                  "NATIVE_SCOPE_MEMBER"
                ]
              },
              {
                "relation_id": "p1:0fd472c5ca879d856e495479",
                "clause_id": "clause:1",
                "relation_type": "PATIENT",
                "head_node_id": "p1:55751628ba342c5905e06203",
                "tail_node_id": "p1:a017f65f2618791bc5728c63",
                "evidence_span_ids": [
                  "p1:fd66e7077083782d8fc63cf9",
                  "p1:9d123dd0da21f3490930ff89",
                  "p1:b6f9329b82cfe4bf264e6752"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [
                  "clause:1:token:1"
                ],
                "rule_refs": [
                  "NATIVE_PATIENT"
                ]
              },
              {
                "relation_id": "p1:36ac3c5793dabb687e58d8be",
                "clause_id": "clause:2",
                "relation_type": "RESULT",
                "head_node_id": "p1:7be272d3f3a2df10061bef21",
                "tail_node_id": "p1:fc5bd600086ab6090e519d5c",
                "evidence_span_ids": [
                  "p1:73e3c5ea188ca1c5d3a01a25",
                  "p1:816520f3f44f6ecce1fcffe1",
                  "p1:7f0793aa43172b583c71aea5"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [
                  "clause:2:token:0"
                ],
                "rule_refs": [
                  "NATIVE_RESULT"
                ]
              },
              {
                "relation_id": "p1:f93ea6ea733bc8fc9e674b73",
                "clause_id": "clause:3",
                "relation_type": "FORBIDS",
                "head_node_id": "p1:5005d79d390f276a34b7caf4",
                "tail_node_id": "p1:5e56145673653f1ee7f21e69",
                "evidence_span_ids": [
                  "p1:0ac85b43b0dc6a80218e77f0",
                  "p1:55ad616030ab5968a94ded69",
                  "p1:f33c3a1c29e28002155201ca"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [
                  "clause:3:token:2"
                ],
                "rule_refs": [
                  "NATIVE_FORBIDS"
                ]
              },
              {
                "relation_id": "p1:d394d120378224a6b4da7245",
                "clause_id": "clause:5",
                "relation_type": "AGENT",
                "head_node_id": "p1:00c60db12ccee968ea34ba91",
                "tail_node_id": "p1:3cfba2fb6a90ae4e9f6ecd34",
                "evidence_span_ids": [
                  "p1:389fc6806e332239f3a0a558",
                  "p1:3dc88c03831e32f9a8fc67ce",
                  "p1:a85ebf0b750986ebd6f278f6"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [
                  "clause:5:token:2",
                  "clause:5:token:1"
                ],
                "rule_refs": [
                  "NATIVE_AGENT"
                ]
              },
              {
                "relation_id": "p1:79a08469cd000a3ff52ee6f4",
                "clause_id": "clause:4",
                "relation_type": "AGENT",
                "head_node_id": "p1:3c21a1bf090fbc6ec5a038c3",
                "tail_node_id": "p1:ecd17316cc63a98d630af1d8",
                "evidence_span_ids": [
                  "p1:c5e695a4d3c696b147d967d9",
                  "p1:128b95de26c3a7705c96510e",
                  "p1:16c6c0a6d036213bdc5dc5e7"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [
                  "clause:4:token:2"
                ],
                "rule_refs": [
                  "NATIVE_AGENT"
                ]
              },
              {
                "relation_id": "p1:f763ba315058fb8aea451f0b",
                "clause_id": "clause:1",
                "relation_type": "AGENT",
                "head_node_id": "p1:55751628ba342c5905e06203",
                "tail_node_id": "p1:0a644412188024b2b0ff4db1",
                "evidence_span_ids": [
                  "p1:fd66e7077083782d8fc63cf9",
                  "p1:71bb1d16f0709043431028ea",
                  "p1:b6f9329b82cfe4bf264e6752"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [
                  "clause:1:token:1",
                  "clause:0:token:0"
                ],
                "rule_refs": [
                  "NATIVE_AGENT"
                ]
              },
              {
                "relation_id": "p1:f3a3ec29582ca92036ced2f9",
                "clause_id": "clause:2",
                "relation_type": "AGENT",
                "head_node_id": "p1:7be272d3f3a2df10061bef21",
                "tail_node_id": "p1:0a644412188024b2b0ff4db1",
                "evidence_span_ids": [
                  "p1:73e3c5ea188ca1c5d3a01a25",
                  "p1:71bb1d16f0709043431028ea",
                  "p1:7f0793aa43172b583c71aea5"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [
                  "clause:2:token:0",
                  "clause:0:token:0"
                ],
                "rule_refs": [
                  "NATIVE_AGENT"
                ]
              },
              {
                "relation_id": "p1:ee1f0ad948cdfe14a4c667a6",
                "clause_id": "clause:3",
                "relation_type": "AGENT",
                "head_node_id": "p1:5005d79d390f276a34b7caf4",
                "tail_node_id": "p1:0a644412188024b2b0ff4db1",
                "evidence_span_ids": [
                  "p1:0ac85b43b0dc6a80218e77f0",
                  "p1:71bb1d16f0709043431028ea",
                  "p1:f33c3a1c29e28002155201ca"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [
                  "clause:3:token:2",
                  "clause:0:token:0"
                ],
                "rule_refs": [
                  "NATIVE_AGENT"
                ]
              },
              {
                "relation_id": "p1:30f048f55c1175bd7c206c2d",
                "clause_id": "clause:1",
                "relation_type": "SCOPE_MEMBER",
                "head_node_id": "p1:55751628ba342c5905e06203",
                "tail_node_id": "p1:a017f65f2618791bc5728c63",
                "evidence_span_ids": [
                  "p1:fd66e7077083782d8fc63cf9",
                  "p1:9d123dd0da21f3490930ff89",
                  "p1:b6f9329b82cfe4bf264e6752"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [
                  "clause:1:token:1"
                ],
                "rule_refs": [
                  "NATIVE_SCOPE_MEMBER"
                ]
              }
            ],
            "set_expressions": [
              {
                "expr_id": "p1:82292b0e875921429a84e3ff",
                "kind": "ITEM",
                "entity_node_id": "p1:13b991f220929572e7a8b1fa",
                "source_span_ids": [
                  "p1:b0eccf72b3d1edf969c8f671"
                ],
                "relation_ids": [
                  "p1:7a1cf1efe8021d18c5f21cc7"
                ]
              },
              {
                "expr_id": "p1:41531131ef88c5f0e156cbc6",
                "kind": "ITEM",
                "entity_node_id": "p1:13b991f220929572e7a8b1fa",
                "source_span_ids": [
                  "p1:b0eccf72b3d1edf969c8f671"
                ],
                "relation_ids": [
                  "p1:89a7f7c1806e1f6bce40b78c"
                ]
              },
              {
                "expr_id": "p1:4ac8dd9472408c314bb27336",
                "kind": "ITEM",
                "entity_node_id": "p1:a017f65f2618791bc5728c63",
                "source_span_ids": [
                  "p1:9d123dd0da21f3490930ff89"
                ],
                "relation_ids": [
                  "p1:0fd472c5ca879d856e495479"
                ]
              },
              {
                "expr_id": "p1:b12999225efa8d7cefc8b8df",
                "kind": "ITEM",
                "entity_node_id": "p1:5e56145673653f1ee7f21e69",
                "source_span_ids": [
                  "p1:55ad616030ab5968a94ded69"
                ],
                "relation_ids": [
                  "p1:f93ea6ea733bc8fc9e674b73"
                ]
              },
              {
                "expr_id": "p1:f9cc48d78faa50dad8627855",
                "kind": "ITEM",
                "entity_node_id": "p1:a017f65f2618791bc5728c63",
                "source_span_ids": [
                  "p1:9d123dd0da21f3490930ff89"
                ],
                "relation_ids": [
                  "p1:30f048f55c1175bd7c206c2d"
                ]
              },
              {
                "expr_id": "p1:f5c4097140b3a14c789d8249",
                "kind": "ITEM",
                "entity_node_id": "p1:fc5bd600086ab6090e519d5c",
                "source_span_ids": [
                  "p1:816520f3f44f6ecce1fcffe1"
                ],
                "relation_ids": [
                  "p1:36ac3c5793dabb687e58d8be"
                ]
              }
            ]
          },
          "eligibility_decisions": [
            {
              "eligibility_decision_id": "p1:b44eb5a9e9218085a49d4520",
              "disposition": "BOUNDARY",
              "candidate_relation_ids": [
                "p1:36ac3c5793dabb687e58d8be",
                "p1:f3a3ec29582ca92036ced2f9"
              ],
              "candidate_node_ids": [
                "p1:7be272d3f3a2df10061bef21",
                "p1:fc5bd600086ab6090e519d5c",
                "p1:0a644412188024b2b0ff4db1"
              ],
              "proposed_fact_type": "DELIVERABLE",
              "reason_code": "EXPLICIT_DELIVERABLE",
              "source_span_ids": [
                "p1:73e3c5ea188ca1c5d3a01a25",
                "p1:7f0793aa43172b583c71aea5",
                "p1:816520f3f44f6ecce1fcffe1",
                "p1:71bb1d16f0709043431028ea",
                "p1:e157be95c430ae6af88e6a37"
              ]
            },
            {
              "eligibility_decision_id": "p1:598c3fcb7e54f82ca73630ff",
              "disposition": "BOUNDARY",
              "candidate_relation_ids": [
                "p1:f763ba315058fb8aea451f0b"
              ],
              "candidate_node_ids": [
                "p1:0a644412188024b2b0ff4db1",
                "p1:55751628ba342c5905e06203"
              ],
              "proposed_fact_type": "PARTICIPANT",
              "reason_code": "PARTICIPATION_RELATION",
              "source_span_ids": [
                "p1:71bb1d16f0709043431028ea",
                "p1:e157be95c430ae6af88e6a37",
                "p1:fd66e7077083782d8fc63cf9",
                "p1:b6f9329b82cfe4bf264e6752"
              ]
            },
            {
              "eligibility_decision_id": "p1:20e2a0f291dbc0a9f5854330",
              "disposition": "BOUNDARY",
              "candidate_relation_ids": [
                "p1:f3a3ec29582ca92036ced2f9"
              ],
              "candidate_node_ids": [
                "p1:0a644412188024b2b0ff4db1",
                "p1:7be272d3f3a2df10061bef21"
              ],
              "proposed_fact_type": "PARTICIPANT",
              "reason_code": "PARTICIPATION_RELATION",
              "source_span_ids": [
                "p1:71bb1d16f0709043431028ea",
                "p1:e157be95c430ae6af88e6a37",
                "p1:73e3c5ea188ca1c5d3a01a25",
                "p1:7f0793aa43172b583c71aea5"
              ]
            },
            {
              "eligibility_decision_id": "p1:169edde73f610443fdc66893",
              "disposition": "BOUNDARY",
              "candidate_relation_ids": [
                "p1:ee1f0ad948cdfe14a4c667a6"
              ],
              "candidate_node_ids": [
                "p1:0a644412188024b2b0ff4db1",
                "p1:5005d79d390f276a34b7caf4"
              ],
              "proposed_fact_type": "PARTICIPANT",
              "reason_code": "PARTICIPATION_RELATION",
              "source_span_ids": [
                "p1:71bb1d16f0709043431028ea",
                "p1:e157be95c430ae6af88e6a37",
                "p1:0ac85b43b0dc6a80218e77f0",
                "p1:f33c3a1c29e28002155201ca"
              ]
            },
            {
              "eligibility_decision_id": "p1:67f822d410e84a3321cb8820",
              "disposition": "BOUNDARY",
              "candidate_relation_ids": [
                "p1:30f048f55c1175bd7c206c2d"
              ],
              "candidate_node_ids": [
                "p1:a017f65f2618791bc5728c63",
                "p1:55751628ba342c5905e06203"
              ],
              "proposed_fact_type": "TASK_OBJECT",
              "reason_code": "EXPLICIT_TASK_SCOPE",
              "source_span_ids": [
                "p1:9d123dd0da21f3490930ff89",
                "p1:b6f9329b82cfe4bf264e6752",
                "p1:fd66e7077083782d8fc63cf9"
              ]
            },
            {
              "eligibility_decision_id": "p1:c7ec0f12624379da4dff5302",
              "disposition": "BOUNDARY",
              "candidate_relation_ids": [
                "p1:be818ec586992582f977e909"
              ],
              "candidate_node_ids": [
                "p1:664c7119ec8c17c7363d4a2d",
                "p1:2de8e54fcb2f544ce2f6d95d"
              ],
              "proposed_fact_type": "PARTICIPANT",
              "reason_code": "PARTICIPATION_RELATION",
              "source_span_ids": [
                "p1:71bb1d16f0709043431028ea",
                "p1:e157be95c430ae6af88e6a37",
                "p1:2cbc54e36db5ace4bf94cf39"
              ]
            },
            {
              "eligibility_decision_id": "p1:3bfc3ff113e3f5fd52b90c53",
              "disposition": "AUXILIARY",
              "candidate_relation_ids": [
                "p1:be818ec586992582f977e909"
              ],
              "candidate_node_ids": [
                "p1:2de8e54fcb2f544ce2f6d95d",
                "p1:664c7119ec8c17c7363d4a2d"
              ],
              "proposed_fact_type": "AUX_CONDITION",
              "reason_code": "AUXILIARY_CONDITION",
              "source_span_ids": [
                "p1:2cbc54e36db5ace4bf94cf39",
                "p1:e157be95c430ae6af88e6a37",
                "p1:71bb1d16f0709043431028ea"
              ]
            },
            {
              "eligibility_decision_id": "p1:a1c1a7ea3b1afcc1ac66e181",
              "disposition": "BOUNDARY",
              "candidate_relation_ids": [
                "p1:0fd472c5ca879d856e495479",
                "p1:f763ba315058fb8aea451f0b",
                "p1:30f048f55c1175bd7c206c2d"
              ],
              "candidate_node_ids": [
                "p1:55751628ba342c5905e06203",
                "p1:a017f65f2618791bc5728c63",
                "p1:0a644412188024b2b0ff4db1"
              ],
              "proposed_fact_type": "ACTION",
              "reason_code": "POSITIVE_ACTION_TARGET",
              "source_span_ids": [
                "p1:fd66e7077083782d8fc63cf9",
                "p1:b6f9329b82cfe4bf264e6752",
                "p1:9d123dd0da21f3490930ff89",
                "p1:71bb1d16f0709043431028ea",
                "p1:e157be95c430ae6af88e6a37"
              ]
            },
            {
              "eligibility_decision_id": "p1:20c6751b0e65ecf36bc0244e",
              "disposition": "BOUNDARY",
              "candidate_relation_ids": [
                "p1:36ac3c5793dabb687e58d8be",
                "p1:f3a3ec29582ca92036ced2f9"
              ],
              "candidate_node_ids": [
                "p1:7be272d3f3a2df10061bef21",
                "p1:fc5bd600086ab6090e519d5c",
                "p1:0a644412188024b2b0ff4db1"
              ],
              "proposed_fact_type": "ACTION",
              "reason_code": "POSITIVE_ACTION_TARGET",
              "source_span_ids": [
                "p1:73e3c5ea188ca1c5d3a01a25",
                "p1:7f0793aa43172b583c71aea5",
                "p1:816520f3f44f6ecce1fcffe1",
                "p1:71bb1d16f0709043431028ea",
                "p1:e157be95c430ae6af88e6a37"
              ]
            },
            {
              "eligibility_decision_id": "p1:e84eb5c0ac1d8a838a64e408",
              "disposition": "BOUNDARY",
              "candidate_relation_ids": [
                "p1:f93ea6ea733bc8fc9e674b73",
                "p1:ee1f0ad948cdfe14a4c667a6"
              ],
              "candidate_node_ids": [
                "p1:5005d79d390f276a34b7caf4",
                "p1:5e56145673653f1ee7f21e69",
                "p1:0a644412188024b2b0ff4db1"
              ],
              "proposed_fact_type": "FORBID",
              "reason_code": "FORBIDDEN_OR_RESTRICTED",
              "source_span_ids": [
                "p1:0ac85b43b0dc6a80218e77f0",
                "p1:f33c3a1c29e28002155201ca",
                "p1:55ad616030ab5968a94ded69",
                "p1:71bb1d16f0709043431028ea",
                "p1:e157be95c430ae6af88e6a37"
              ]
            },
            {
              "eligibility_decision_id": "p1:78258d164c6ec4e7fbe251cf",
              "disposition": "AUXILIARY",
              "candidate_relation_ids": [
                "p1:9a7186b2ce7dc7f94f019028",
                "p1:846306081530b2461ab45f14"
              ],
              "candidate_node_ids": [
                "p1:2b1849abc7e29105eb70b977",
                "p1:fc5bd600086ab6090e519d5c",
                "p1:00c60db12ccee968ea34ba91"
              ],
              "proposed_fact_type": "AUX_CONDITION",
              "reason_code": "AUXILIARY_CONDITION",
              "source_span_ids": [
                "p1:5e3b5ab04595aef88e78c85c",
                "p1:16c6c0a6d036213bdc5dc5e7",
                "p1:816520f3f44f6ecce1fcffe1",
                "p1:7f0793aa43172b583c71aea5",
                "p1:389fc6806e332239f3a0a558",
                "p1:a85ebf0b750986ebd6f278f6"
              ]
            },
            {
              "eligibility_decision_id": "p1:119c8d1c48d9ef2d0ef26a59",
              "disposition": "BOUNDARY",
              "candidate_relation_ids": [
                "p1:d394d120378224a6b4da7245",
                "p1:846306081530b2461ab45f14"
              ],
              "candidate_node_ids": [
                "p1:00c60db12ccee968ea34ba91",
                "p1:3cfba2fb6a90ae4e9f6ecd34",
                "p1:2b1849abc7e29105eb70b977"
              ],
              "proposed_fact_type": "COMPLETION",
              "reason_code": "COMPLETION_OR_STOP",
              "source_span_ids": [
                "p1:389fc6806e332239f3a0a558",
                "p1:a85ebf0b750986ebd6f278f6",
                "p1:3dc88c03831e32f9a8fc67ce",
                "p1:5e3b5ab04595aef88e78c85c",
                "p1:16c6c0a6d036213bdc5dc5e7"
              ]
            }
          ]
        },
        "edge_closure": {
          "version": "7P-REPAIR-004",
          "evidence_order": [
            "DEPENDENCY_SRL",
            "PROTECTED_OPERAND",
            "EXPLICIT_COORDINATION",
            "STRUCTURAL_CHILD",
            "SENTENCE_CONTINUATION",
            "UNIQUE_COREFERENCE",
            "TYPED_UNRESOLVED"
          ],
          "edges": [],
          "decisions": []
        },
        "table_instructions": {
          "frames": [],
          "unsupported": []
        },
        "semantic_ownership": {
          "version": "7P-COMPOSITION-013-R1",
          "phase": "SHORT_DIRECT_FINAL",
          "precedence": [
            "EXPLICIT_STRUCTURE",
            "EXPLICIT_OUTPUT_CONTENT",
            "CURRENT_SUBTASK_HEADING",
            "ACCEPTANCE_OUT_OF_SCOPE",
            "CERTIFIED_FRAME",
            "LOCAL_LINGUISTIC",
            "UNRESOLVED"
          ],
          "owners": [
            {
              "semantic_owner_id": "p1:c04a6fcca8a88e2ce3052a12",
              "category": "CURRENT_TASK_ROOT",
              "parent_owner_id": null,
              "structural_parent_path": [
                "document"
              ],
              "owner_output_ids": [],
              "source_span_ids": [
                "p1:571d80d40877f6505adf1d06"
              ]
            }
          ],
          "records": [
            {
              "node_id": "p1:3ddbd3949281cbe0716e59ad",
              "status": "UNIQUE",
              "semantic_owner_id": "p1:c04a6fcca8a88e2ce3052a12",
              "owner_category": "CURRENT_TASK_ROOT",
              "predicate_layer": "MAIN",
              "syntactic_layer_id": "p1:edfb0fd1d9c6e2bd7c657938",
              "owning_proposition_id": "DOCUMENT",
              "discourse_domain": "CURRENT_TASK",
              "structural_parent_path": [
                "document"
              ],
              "attachment_path": [
                "document"
              ],
              "owner_output_ids": [],
              "ownership_relation_ids": [],
              "source_span_ids": [
                "p1:571d80d40877f6505adf1d06"
              ],
              "inheritance_override_proof": [
                {
                  "rank": 1,
                  "rule": "EXPLICIT_STRUCTURE_PATH",
                  "structural_path": [
                    "document"
                  ],
                  "source_span_ids": [
                    "p1:571d80d40877f6505adf1d06"
                  ]
                }
              ],
              "negative_ownership_evidence": []
            },
            {
              "node_id": "p1:23c59e2354e7b39c3fb9b70d",
              "status": "UNIQUE",
              "semantic_owner_id": "p1:c04a6fcca8a88e2ce3052a12",
              "owner_category": "CURRENT_TASK_ROOT",
              "predicate_layer": "MAIN",
              "syntactic_layer_id": "p1:0e41aeaeffc8210a3977f2e6",
              "owning_proposition_id": "clause:0",
              "discourse_domain": "CURRENT_TASK",
              "structural_parent_path": [
                "document",
                "structure:0"
              ],
              "attachment_path": [
                "document",
                "structure:0",
                "clause:0"
              ],
              "owner_output_ids": [],
              "ownership_relation_ids": [],
              "source_span_ids": [
                "p1:b0eccf72b3d1edf969c8f671",
                "p1:e157be95c430ae6af88e6a37",
                "p1:571d80d40877f6505adf1d06"
              ],
              "inheritance_override_proof": [
                {
                  "rank": 1,
                  "rule": "EXPLICIT_STRUCTURE_PATH",
                  "structural_path": [
                    "document",
                    "structure:0"
                  ],
                  "source_span_ids": [
                    "p1:571d80d40877f6505adf1d06"
                  ]
                }
              ],
              "negative_ownership_evidence": []
            },
            {
              "node_id": "p1:0a644412188024b2b0ff4db1",
              "status": "UNIQUE",
              "semantic_owner_id": "p1:c04a6fcca8a88e2ce3052a12",
              "owner_category": "CURRENT_TASK_ROOT",
              "predicate_layer": "MAIN",
              "syntactic_layer_id": "p1:0e41aeaeffc8210a3977f2e6",
              "owning_proposition_id": "clause:0",
              "discourse_domain": "CURRENT_TASK",
              "structural_parent_path": [
                "document",
                "structure:0"
              ],
              "attachment_path": [
                "document",
                "structure:0",
                "clause:0"
              ],
              "owner_output_ids": [],
              "ownership_relation_ids": [],
              "source_span_ids": [
                "p1:71bb1d16f0709043431028ea",
                "p1:e157be95c430ae6af88e6a37",
                "p1:571d80d40877f6505adf1d06"
              ],
              "inheritance_override_proof": [
                {
                  "rank": 1,
                  "rule": "EXPLICIT_STRUCTURE_PATH",
                  "structural_path": [
                    "document",
                    "structure:0"
                  ],
                  "source_span_ids": [
                    "p1:571d80d40877f6505adf1d06"
                  ]
                }
              ],
              "negative_ownership_evidence": []
            },
            {
              "node_id": "p1:13b991f220929572e7a8b1fa",
              "status": "UNIQUE",
              "semantic_owner_id": "p1:c04a6fcca8a88e2ce3052a12",
              "owner_category": "CURRENT_TASK_ROOT",
              "predicate_layer": "MAIN",
              "syntactic_layer_id": "p1:0e41aeaeffc8210a3977f2e6",
              "owning_proposition_id": "clause:0",
              "discourse_domain": "CURRENT_TASK",
              "structural_parent_path": [
                "document",
                "structure:0"
              ],
              "attachment_path": [
                "document",
                "structure:0",
                "clause:0"
              ],
              "owner_output_ids": [],
              "ownership_relation_ids": [],
              "source_span_ids": [
                "p1:b0eccf72b3d1edf969c8f671",
                "p1:e157be95c430ae6af88e6a37",
                "p1:571d80d40877f6505adf1d06"
              ],
              "inheritance_override_proof": [
                {
                  "rank": 1,
                  "rule": "EXPLICIT_STRUCTURE_PATH",
                  "structural_path": [
                    "document",
                    "structure:0"
                  ],
                  "source_span_ids": [
                    "p1:571d80d40877f6505adf1d06"
                  ]
                }
              ],
              "negative_ownership_evidence": []
            },
            {
              "node_id": "p1:a017f65f2618791bc5728c63",
              "status": "UNIQUE",
              "semantic_owner_id": "p1:c04a6fcca8a88e2ce3052a12",
              "owner_category": "CURRENT_TASK_ROOT",
              "predicate_layer": "MAIN",
              "syntactic_layer_id": "p1:a6da896017ae3ee48122e5fa",
              "owning_proposition_id": "clause:1",
              "discourse_domain": "CURRENT_TASK",
              "structural_parent_path": [
                "document",
                "structure:0"
              ],
              "attachment_path": [
                "document",
                "structure:0",
                "clause:1"
              ],
              "owner_output_ids": [],
              "ownership_relation_ids": [],
              "source_span_ids": [
                "p1:9d123dd0da21f3490930ff89",
                "p1:b6f9329b82cfe4bf264e6752",
                "p1:571d80d40877f6505adf1d06"
              ],
              "inheritance_override_proof": [
                {
                  "rank": 1,
                  "rule": "EXPLICIT_STRUCTURE_PATH",
                  "structural_path": [
                    "document",
                    "structure:0"
                  ],
                  "source_span_ids": [
                    "p1:571d80d40877f6505adf1d06"
                  ]
                }
              ],
              "negative_ownership_evidence": []
            },
            {
              "node_id": "p1:55751628ba342c5905e06203",
              "status": "UNIQUE",
              "semantic_owner_id": "p1:c04a6fcca8a88e2ce3052a12",
              "owner_category": "CURRENT_TASK_ROOT",
              "predicate_layer": "MAIN",
              "syntactic_layer_id": "p1:a6da896017ae3ee48122e5fa",
              "owning_proposition_id": "clause:1",
              "discourse_domain": "CURRENT_TASK",
              "structural_parent_path": [
                "document",
                "structure:0"
              ],
              "attachment_path": [
                "document",
                "structure:0",
                "clause:1"
              ],
              "owner_output_ids": [],
              "ownership_relation_ids": [],
              "source_span_ids": [
                "p1:fd66e7077083782d8fc63cf9",
                "p1:b6f9329b82cfe4bf264e6752",
                "p1:571d80d40877f6505adf1d06"
              ],
              "inheritance_override_proof": [
                {
                  "rank": 1,
                  "rule": "EXPLICIT_STRUCTURE_PATH",
                  "structural_path": [
                    "document",
                    "structure:0"
                  ],
                  "source_span_ids": [
                    "p1:571d80d40877f6505adf1d06"
                  ]
                }
              ],
              "negative_ownership_evidence": []
            },
            {
              "node_id": "p1:fc5bd600086ab6090e519d5c",
              "status": "UNIQUE",
              "semantic_owner_id": "p1:c04a6fcca8a88e2ce3052a12",
              "owner_category": "CURRENT_TASK_ROOT",
              "predicate_layer": "MAIN",
              "syntactic_layer_id": "p1:a6da896017ae3ee48122e5fa",
              "owning_proposition_id": "clause:2",
              "discourse_domain": "CURRENT_TASK",
              "structural_parent_path": [
                "document",
                "structure:0"
              ],
              "attachment_path": [
                "document",
                "structure:0",
                "clause:2"
              ],
              "owner_output_ids": [],
              "ownership_relation_ids": [],
              "source_span_ids": [
                "p1:816520f3f44f6ecce1fcffe1",
                "p1:7f0793aa43172b583c71aea5",
                "p1:571d80d40877f6505adf1d06"
              ],
              "inheritance_override_proof": [
                {
                  "rank": 1,
                  "rule": "EXPLICIT_STRUCTURE_PATH",
                  "structural_path": [
                    "document",
                    "structure:0"
                  ],
                  "source_span_ids": [
                    "p1:571d80d40877f6505adf1d06"
                  ]
                }
              ],
              "negative_ownership_evidence": []
            },
            {
              "node_id": "p1:7be272d3f3a2df10061bef21",
              "status": "UNIQUE",
              "semantic_owner_id": "p1:c04a6fcca8a88e2ce3052a12",
              "owner_category": "CURRENT_TASK_ROOT",
              "predicate_layer": "MAIN",
              "syntactic_layer_id": "p1:a6da896017ae3ee48122e5fa",
              "owning_proposition_id": "clause:2",
              "discourse_domain": "CURRENT_TASK",
              "structural_parent_path": [
                "document",
                "structure:0"
              ],
              "attachment_path": [
                "document",
                "structure:0",
                "clause:2"
              ],
              "owner_output_ids": [],
              "ownership_relation_ids": [],
              "source_span_ids": [
                "p1:73e3c5ea188ca1c5d3a01a25",
                "p1:7f0793aa43172b583c71aea5",
                "p1:571d80d40877f6505adf1d06"
              ],
              "inheritance_override_proof": [
                {
                  "rank": 1,
                  "rule": "EXPLICIT_STRUCTURE_PATH",
                  "structural_path": [
                    "document",
                    "structure:0"
                  ],
                  "source_span_ids": [
                    "p1:571d80d40877f6505adf1d06"
                  ]
                }
              ],
              "negative_ownership_evidence": []
            },
            {
              "node_id": "p1:5e56145673653f1ee7f21e69",
              "status": "UNIQUE",
              "semantic_owner_id": "p1:c04a6fcca8a88e2ce3052a12",
              "owner_category": "CURRENT_TASK_ROOT",
              "predicate_layer": "MAIN",
              "syntactic_layer_id": "p1:97c9d7b5c58dd5b6ed9a4cd2",
              "owning_proposition_id": "clause:3",
              "discourse_domain": "CURRENT_TASK",
              "structural_parent_path": [
                "document",
                "structure:0"
              ],
              "attachment_path": [
                "document",
                "structure:0",
                "clause:3"
              ],
              "owner_output_ids": [],
              "ownership_relation_ids": [],
              "source_span_ids": [
                "p1:55ad616030ab5968a94ded69",
                "p1:f33c3a1c29e28002155201ca",
                "p1:571d80d40877f6505adf1d06"
              ],
              "inheritance_override_proof": [
                {
                  "rank": 1,
                  "rule": "EXPLICIT_STRUCTURE_PATH",
                  "structural_path": [
                    "document",
                    "structure:0"
                  ],
                  "source_span_ids": [
                    "p1:571d80d40877f6505adf1d06"
                  ]
                }
              ],
              "negative_ownership_evidence": []
            },
            {
              "node_id": "p1:5005d79d390f276a34b7caf4",
              "status": "UNIQUE",
              "semantic_owner_id": "p1:c04a6fcca8a88e2ce3052a12",
              "owner_category": "CURRENT_TASK_ROOT",
              "predicate_layer": "MAIN",
              "syntactic_layer_id": "p1:97c9d7b5c58dd5b6ed9a4cd2",
              "owning_proposition_id": "clause:3",
              "discourse_domain": "CURRENT_TASK",
              "structural_parent_path": [
                "document",
                "structure:0"
              ],
              "attachment_path": [
                "document",
                "structure:0",
                "clause:3"
              ],
              "owner_output_ids": [],
              "ownership_relation_ids": [],
              "source_span_ids": [
                "p1:0ac85b43b0dc6a80218e77f0",
                "p1:f33c3a1c29e28002155201ca",
                "p1:571d80d40877f6505adf1d06"
              ],
              "inheritance_override_proof": [
                {
                  "rank": 1,
                  "rule": "EXPLICIT_STRUCTURE_PATH",
                  "structural_path": [
                    "document",
                    "structure:0"
                  ],
                  "source_span_ids": [
                    "p1:571d80d40877f6505adf1d06"
                  ]
                }
              ],
              "negative_ownership_evidence": []
            },
            {
              "node_id": "p1:ecd17316cc63a98d630af1d8",
              "status": "UNIQUE",
              "semantic_owner_id": "p1:c04a6fcca8a88e2ce3052a12",
              "owner_category": "CURRENT_TASK_ROOT",
              "predicate_layer": "MAIN",
              "syntactic_layer_id": "p1:e901b62daac62e628f4f901b",
              "owning_proposition_id": "clause:4",
              "discourse_domain": "CURRENT_TASK",
              "structural_parent_path": [
                "document",
                "structure:0"
              ],
              "attachment_path": [
                "document",
                "structure:0",
                "clause:4"
              ],
              "owner_output_ids": [],
              "ownership_relation_ids": [],
              "source_span_ids": [
                "p1:128b95de26c3a7705c96510e",
                "p1:16c6c0a6d036213bdc5dc5e7",
                "p1:571d80d40877f6505adf1d06"
              ],
              "inheritance_override_proof": [
                {
                  "rank": 1,
                  "rule": "EXPLICIT_STRUCTURE_PATH",
                  "structural_path": [
                    "document",
                    "structure:0"
                  ],
                  "source_span_ids": [
                    "p1:571d80d40877f6505adf1d06"
                  ]
                }
              ],
              "negative_ownership_evidence": []
            },
            {
              "node_id": "p1:00c60db12ccee968ea34ba91",
              "status": "UNIQUE",
              "semantic_owner_id": "p1:c04a6fcca8a88e2ce3052a12",
              "owner_category": "CURRENT_TASK_ROOT",
              "predicate_layer": "MAIN",
              "syntactic_layer_id": "p1:e901b62daac62e628f4f901b",
              "owning_proposition_id": "clause:5",
              "discourse_domain": "CURRENT_TASK",
              "structural_parent_path": [
                "document",
                "structure:0"
              ],
              "attachment_path": [
                "document",
                "structure:0",
                "clause:5"
              ],
              "owner_output_ids": [],
              "ownership_relation_ids": [],
              "source_span_ids": [
                "p1:389fc6806e332239f3a0a558",
                "p1:a85ebf0b750986ebd6f278f6",
                "p1:571d80d40877f6505adf1d06"
              ],
              "inheritance_override_proof": [
                {
                  "rank": 1,
                  "rule": "EXPLICIT_STRUCTURE_PATH",
                  "structural_path": [
                    "document",
                    "structure:0"
                  ],
                  "source_span_ids": [
                    "p1:571d80d40877f6505adf1d06"
                  ]
                }
              ],
              "negative_ownership_evidence": []
            },
            {
              "node_id": "p1:3cfba2fb6a90ae4e9f6ecd34",
              "status": "UNIQUE",
              "semantic_owner_id": "p1:c04a6fcca8a88e2ce3052a12",
              "owner_category": "CURRENT_TASK_ROOT",
              "predicate_layer": "MAIN",
              "syntactic_layer_id": "p1:e901b62daac62e628f4f901b",
              "owning_proposition_id": "clause:5",
              "discourse_domain": "CURRENT_TASK",
              "structural_parent_path": [
                "document",
                "structure:0"
              ],
              "attachment_path": [
                "document",
                "structure:0",
                "clause:5"
              ],
              "owner_output_ids": [],
              "ownership_relation_ids": [],
              "source_span_ids": [
                "p1:3dc88c03831e32f9a8fc67ce",
                "p1:a85ebf0b750986ebd6f278f6",
                "p1:571d80d40877f6505adf1d06"
              ],
              "inheritance_override_proof": [
                {
                  "rank": 1,
                  "rule": "EXPLICIT_STRUCTURE_PATH",
                  "structural_path": [
                    "document",
                    "structure:0"
                  ],
                  "source_span_ids": [
                    "p1:571d80d40877f6505adf1d06"
                  ]
                }
              ],
              "negative_ownership_evidence": []
            },
            {
              "node_id": "p1:3c21a1bf090fbc6ec5a038c3",
              "status": "UNIQUE",
              "semantic_owner_id": "p1:c04a6fcca8a88e2ce3052a12",
              "owner_category": "CURRENT_TASK_ROOT",
              "predicate_layer": "MAIN",
              "syntactic_layer_id": "p1:e901b62daac62e628f4f901b",
              "owning_proposition_id": "clause:4",
              "discourse_domain": "CURRENT_TASK",
              "structural_parent_path": [
                "document",
                "structure:0"
              ],
              "attachment_path": [
                "document",
                "structure:0",
                "clause:4"
              ],
              "owner_output_ids": [],
              "ownership_relation_ids": [],
              "source_span_ids": [
                "p1:c5e695a4d3c696b147d967d9",
                "p1:16c6c0a6d036213bdc5dc5e7",
                "p1:571d80d40877f6505adf1d06"
              ],
              "inheritance_override_proof": [
                {
                  "rank": 1,
                  "rule": "EXPLICIT_STRUCTURE_PATH",
                  "structural_path": [
                    "document",
                    "structure:0"
                  ],
                  "source_span_ids": [
                    "p1:571d80d40877f6505adf1d06"
                  ]
                }
              ],
              "negative_ownership_evidence": []
            },
            {
              "node_id": "p1:4ccdd8b53cd9e017cbb17dbb",
              "status": "UNIQUE",
              "semantic_owner_id": "p1:c04a6fcca8a88e2ce3052a12",
              "owner_category": "CURRENT_TASK_ROOT",
              "predicate_layer": "MAIN",
              "syntactic_layer_id": "p1:0e41aeaeffc8210a3977f2e6",
              "owning_proposition_id": "clause:0",
              "discourse_domain": "CURRENT_TASK",
              "structural_parent_path": [
                "document",
                "structure:0"
              ],
              "attachment_path": [
                "document",
                "structure:0",
                "clause:0"
              ],
              "owner_output_ids": [],
              "ownership_relation_ids": [],
              "source_span_ids": [
                "p1:2cbc54e36db5ace4bf94cf39",
                "p1:e157be95c430ae6af88e6a37",
                "p1:571d80d40877f6505adf1d06"
              ],
              "inheritance_override_proof": [
                {
                  "rank": 1,
                  "rule": "EXPLICIT_STRUCTURE_PATH",
                  "structural_path": [
                    "document",
                    "structure:0"
                  ],
                  "source_span_ids": [
                    "p1:571d80d40877f6505adf1d06"
                  ]
                }
              ],
              "negative_ownership_evidence": []
            },
            {
              "node_id": "p1:a78bc4d47f94e06bd7c43b20",
              "status": "UNIQUE",
              "semantic_owner_id": "p1:c04a6fcca8a88e2ce3052a12",
              "owner_category": "CURRENT_TASK_ROOT",
              "predicate_layer": "MAIN",
              "syntactic_layer_id": "p1:a6da896017ae3ee48122e5fa",
              "owning_proposition_id": "clause:1",
              "discourse_domain": "CURRENT_TASK",
              "structural_parent_path": [
                "document",
                "structure:0"
              ],
              "attachment_path": [
                "document",
                "structure:0",
                "clause:1"
              ],
              "owner_output_ids": [],
              "ownership_relation_ids": [],
              "source_span_ids": [
                "p1:5843a93c9de7260207fbac4e",
                "p1:b6f9329b82cfe4bf264e6752",
                "p1:571d80d40877f6505adf1d06"
              ],
              "inheritance_override_proof": [
                {
                  "rank": 1,
                  "rule": "EXPLICIT_STRUCTURE_PATH",
                  "structural_path": [
                    "document",
                    "structure:0"
                  ],
                  "source_span_ids": [
                    "p1:571d80d40877f6505adf1d06"
                  ]
                }
              ],
              "negative_ownership_evidence": []
            },
            {
              "node_id": "p1:664c7119ec8c17c7363d4a2d",
              "status": "UNIQUE",
              "semantic_owner_id": "p1:c04a6fcca8a88e2ce3052a12",
              "owner_category": "CURRENT_TASK_ROOT",
              "predicate_layer": "MAIN",
              "syntactic_layer_id": "p1:0e41aeaeffc8210a3977f2e6",
              "owning_proposition_id": "clause:0",
              "discourse_domain": "CURRENT_TASK",
              "structural_parent_path": [
                "document",
                "structure:0"
              ],
              "attachment_path": [
                "document",
                "structure:0",
                "clause:0"
              ],
              "owner_output_ids": [],
              "ownership_relation_ids": [],
              "source_span_ids": [
                "p1:71bb1d16f0709043431028ea",
                "p1:e157be95c430ae6af88e6a37",
                "p1:571d80d40877f6505adf1d06"
              ],
              "inheritance_override_proof": [
                {
                  "rank": 1,
                  "rule": "EXPLICIT_STRUCTURE_PATH",
                  "structural_path": [
                    "document",
                    "structure:0"
                  ],
                  "source_span_ids": [
                    "p1:571d80d40877f6505adf1d06"
                  ]
                }
              ],
              "negative_ownership_evidence": []
            },
            {
              "node_id": "p1:2de8e54fcb2f544ce2f6d95d",
              "status": "UNIQUE",
              "semantic_owner_id": "p1:c04a6fcca8a88e2ce3052a12",
              "owner_category": "CURRENT_TASK_ROOT",
              "predicate_layer": "MAIN",
              "syntactic_layer_id": "p1:0e41aeaeffc8210a3977f2e6",
              "owning_proposition_id": "clause:0",
              "discourse_domain": "CURRENT_TASK",
              "structural_parent_path": [
                "document",
                "structure:0"
              ],
              "attachment_path": [
                "document",
                "structure:0",
                "clause:0"
              ],
              "owner_output_ids": [],
              "ownership_relation_ids": [],
              "source_span_ids": [
                "p1:2cbc54e36db5ace4bf94cf39",
                "p1:e157be95c430ae6af88e6a37",
                "p1:571d80d40877f6505adf1d06"
              ],
              "inheritance_override_proof": [
                {
                  "rank": 1,
                  "rule": "EXPLICIT_STRUCTURE_PATH",
                  "structural_path": [
                    "document",
                    "structure:0"
                  ],
                  "source_span_ids": [
                    "p1:571d80d40877f6505adf1d06"
                  ]
                }
              ],
              "negative_ownership_evidence": []
            },
            {
              "node_id": "p1:2b1849abc7e29105eb70b977",
              "status": "UNIQUE",
              "semantic_owner_id": "p1:c04a6fcca8a88e2ce3052a12",
              "owner_category": "CURRENT_TASK_ROOT",
              "predicate_layer": "MAIN",
              "syntactic_layer_id": "p1:e901b62daac62e628f4f901b",
              "owning_proposition_id": "clause:4",
              "discourse_domain": "CURRENT_TASK",
              "structural_parent_path": [
                "document",
                "structure:0"
              ],
              "attachment_path": [
                "document",
                "structure:0",
                "clause:4"
              ],
              "owner_output_ids": [],
              "ownership_relation_ids": [],
              "source_span_ids": [
                "p1:5e3b5ab04595aef88e78c85c",
                "p1:16c6c0a6d036213bdc5dc5e7",
                "p1:571d80d40877f6505adf1d06"
              ],
              "inheritance_override_proof": [
                {
                  "rank": 1,
                  "rule": "EXPLICIT_STRUCTURE_PATH",
                  "structural_path": [
                    "document",
                    "structure:0"
                  ],
                  "source_span_ids": [
                    "p1:571d80d40877f6505adf1d06"
                  ]
                }
              ],
              "negative_ownership_evidence": []
            }
          ],
          "consumed_by": [
            "FRAME_CERTIFICATION",
            "ELIGIBILITY"
          ],
          "pre_frame_consumption": [],
          "decisions": [
            {
              "type": "DELIVERABLE",
              "candidate_node_ids": [
                "p1:7be272d3f3a2df10061bef21"
              ],
              "owner_record_node_ids": [
                "p1:7be272d3f3a2df10061bef21"
              ],
              "semantic_owner_ids": [
                "p1:c04a6fcca8a88e2ce3052a12"
              ],
              "source_span_ids": [
                "p1:73e3c5ea188ca1c5d3a01a25",
                "p1:7f0793aa43172b583c71aea5",
                "p1:571d80d40877f6505adf1d06"
              ],
              "negative_ownership_evidence": [],
              "fact_role_policy": {
                "candidate_fact_role": "ARTIFACT_ROLE",
                "owner_categories": [
                  "CURRENT_TASK_ROOT"
                ],
                "acceptance_domain": false,
                "allowed": true,
                "policy": "EXISTING_OWNER_DOMAIN_GATES",
                "licensing_relation_ids": [],
                "reason": "OWNER_FACT_ROLE_COMPATIBLE"
              },
              "decision": "ALLOW",
              "reason": "OWNER_AND_LAYER_RETAINED"
            },
            {
              "type": "PARTICIPANT",
              "candidate_node_ids": [
                "p1:55751628ba342c5905e06203"
              ],
              "owner_record_node_ids": [
                "p1:55751628ba342c5905e06203"
              ],
              "semantic_owner_ids": [
                "p1:c04a6fcca8a88e2ce3052a12"
              ],
              "source_span_ids": [
                "p1:fd66e7077083782d8fc63cf9",
                "p1:b6f9329b82cfe4bf264e6752",
                "p1:571d80d40877f6505adf1d06"
              ],
              "negative_ownership_evidence": [],
              "fact_role_policy": {
                "candidate_fact_role": "PARTICIPATION",
                "owner_categories": [
                  "CURRENT_TASK_ROOT"
                ],
                "acceptance_domain": false,
                "allowed": true,
                "policy": "EXISTING_OWNER_DOMAIN_GATES",
                "licensing_relation_ids": [],
                "reason": "OWNER_FACT_ROLE_COMPATIBLE"
              },
              "decision": "ALLOW",
              "reason": "OWNER_AND_LAYER_RETAINED"
            },
            {
              "type": "PARTICIPANT",
              "candidate_node_ids": [
                "p1:7be272d3f3a2df10061bef21"
              ],
              "owner_record_node_ids": [
                "p1:7be272d3f3a2df10061bef21"
              ],
              "semantic_owner_ids": [
                "p1:c04a6fcca8a88e2ce3052a12"
              ],
              "source_span_ids": [
                "p1:73e3c5ea188ca1c5d3a01a25",
                "p1:7f0793aa43172b583c71aea5",
                "p1:571d80d40877f6505adf1d06"
              ],
              "negative_ownership_evidence": [],
              "fact_role_policy": {
                "candidate_fact_role": "PARTICIPATION",
                "owner_categories": [
                  "CURRENT_TASK_ROOT"
                ],
                "acceptance_domain": false,
                "allowed": true,
                "policy": "EXISTING_OWNER_DOMAIN_GATES",
                "licensing_relation_ids": [],
                "reason": "OWNER_FACT_ROLE_COMPATIBLE"
              },
              "decision": "ALLOW",
              "reason": "OWNER_AND_LAYER_RETAINED"
            },
            {
              "type": "PARTICIPANT",
              "candidate_node_ids": [
                "p1:5005d79d390f276a34b7caf4"
              ],
              "owner_record_node_ids": [
                "p1:5005d79d390f276a34b7caf4"
              ],
              "semantic_owner_ids": [
                "p1:c04a6fcca8a88e2ce3052a12"
              ],
              "source_span_ids": [
                "p1:0ac85b43b0dc6a80218e77f0",
                "p1:f33c3a1c29e28002155201ca",
                "p1:571d80d40877f6505adf1d06"
              ],
              "negative_ownership_evidence": [],
              "fact_role_policy": {
                "candidate_fact_role": "PARTICIPATION",
                "owner_categories": [
                  "CURRENT_TASK_ROOT"
                ],
                "acceptance_domain": false,
                "allowed": true,
                "policy": "EXISTING_OWNER_DOMAIN_GATES",
                "licensing_relation_ids": [],
                "reason": "OWNER_FACT_ROLE_COMPATIBLE"
              },
              "decision": "ALLOW",
              "reason": "OWNER_AND_LAYER_RETAINED"
            },
            {
              "type": "TASK_OBJECT",
              "candidate_node_ids": [
                "p1:55751628ba342c5905e06203"
              ],
              "owner_record_node_ids": [
                "p1:55751628ba342c5905e06203"
              ],
              "semantic_owner_ids": [
                "p1:c04a6fcca8a88e2ce3052a12"
              ],
              "source_span_ids": [
                "p1:fd66e7077083782d8fc63cf9",
                "p1:b6f9329b82cfe4bf264e6752",
                "p1:571d80d40877f6505adf1d06"
              ],
              "negative_ownership_evidence": [],
              "fact_role_policy": {
                "candidate_fact_role": "ARTIFACT_ROLE",
                "owner_categories": [
                  "CURRENT_TASK_ROOT"
                ],
                "acceptance_domain": false,
                "allowed": true,
                "policy": "EXISTING_OWNER_DOMAIN_GATES",
                "licensing_relation_ids": [],
                "reason": "OWNER_FACT_ROLE_COMPATIBLE"
              },
              "decision": "ALLOW",
              "reason": "OWNER_AND_LAYER_RETAINED"
            },
            {
              "type": "PARTICIPANT",
              "candidate_node_ids": [
                "p1:2de8e54fcb2f544ce2f6d95d"
              ],
              "owner_record_node_ids": [
                "p1:2de8e54fcb2f544ce2f6d95d"
              ],
              "semantic_owner_ids": [
                "p1:c04a6fcca8a88e2ce3052a12"
              ],
              "source_span_ids": [
                "p1:2cbc54e36db5ace4bf94cf39",
                "p1:e157be95c430ae6af88e6a37",
                "p1:571d80d40877f6505adf1d06"
              ],
              "negative_ownership_evidence": [],
              "fact_role_policy": {
                "candidate_fact_role": "PARTICIPATION",
                "owner_categories": [
                  "CURRENT_TASK_ROOT"
                ],
                "acceptance_domain": false,
                "allowed": true,
                "policy": "EXISTING_OWNER_DOMAIN_GATES",
                "licensing_relation_ids": [],
                "reason": "OWNER_FACT_ROLE_COMPATIBLE"
              },
              "decision": "ALLOW",
              "reason": "OWNER_AND_LAYER_RETAINED"
            },
            {
              "type": "AUX_CONDITION",
              "candidate_node_ids": [
                "p1:2de8e54fcb2f544ce2f6d95d"
              ],
              "owner_record_node_ids": [
                "p1:2de8e54fcb2f544ce2f6d95d"
              ],
              "semantic_owner_ids": [
                "p1:c04a6fcca8a88e2ce3052a12"
              ],
              "source_span_ids": [
                "p1:2cbc54e36db5ace4bf94cf39",
                "p1:e157be95c430ae6af88e6a37",
                "p1:571d80d40877f6505adf1d06"
              ],
              "negative_ownership_evidence": [],
              "fact_role_policy": {
                "candidate_fact_role": "COMPLETION_CONDITION",
                "owner_categories": [
                  "CURRENT_TASK_ROOT"
                ],
                "acceptance_domain": false,
                "allowed": true,
                "policy": "EXISTING_OWNER_DOMAIN_GATES",
                "licensing_relation_ids": [],
                "reason": "OWNER_FACT_ROLE_COMPATIBLE"
              },
              "decision": "ALLOW",
              "reason": "OWNER_AND_LAYER_RETAINED"
            },
            {
              "type": "ACTION",
              "candidate_node_ids": [
                "p1:55751628ba342c5905e06203"
              ],
              "owner_record_node_ids": [
                "p1:55751628ba342c5905e06203"
              ],
              "semantic_owner_ids": [
                "p1:c04a6fcca8a88e2ce3052a12"
              ],
              "source_span_ids": [
                "p1:fd66e7077083782d8fc63cf9",
                "p1:b6f9329b82cfe4bf264e6752",
                "p1:571d80d40877f6505adf1d06"
              ],
              "negative_ownership_evidence": [],
              "fact_role_policy": {
                "candidate_fact_role": "EXECUTION_ACTION",
                "owner_categories": [
                  "CURRENT_TASK_ROOT"
                ],
                "acceptance_domain": false,
                "allowed": true,
                "policy": "EXISTING_OWNER_DOMAIN_GATES",
                "licensing_relation_ids": [],
                "reason": "OWNER_FACT_ROLE_COMPATIBLE"
              },
              "decision": "ALLOW",
              "reason": "OWNER_AND_LAYER_RETAINED"
            },
            {
              "type": "ACTION",
              "candidate_node_ids": [
                "p1:7be272d3f3a2df10061bef21"
              ],
              "owner_record_node_ids": [
                "p1:7be272d3f3a2df10061bef21"
              ],
              "semantic_owner_ids": [
                "p1:c04a6fcca8a88e2ce3052a12"
              ],
              "source_span_ids": [
                "p1:73e3c5ea188ca1c5d3a01a25",
                "p1:7f0793aa43172b583c71aea5",
                "p1:571d80d40877f6505adf1d06"
              ],
              "negative_ownership_evidence": [],
              "fact_role_policy": {
                "candidate_fact_role": "EXECUTION_ACTION",
                "owner_categories": [
                  "CURRENT_TASK_ROOT"
                ],
                "acceptance_domain": false,
                "allowed": true,
                "policy": "EXISTING_OWNER_DOMAIN_GATES",
                "licensing_relation_ids": [],
                "reason": "OWNER_FACT_ROLE_COMPATIBLE"
              },
              "decision": "ALLOW",
              "reason": "OWNER_AND_LAYER_RETAINED"
            },
            {
              "type": "FORBID",
              "candidate_node_ids": [
                "p1:5005d79d390f276a34b7caf4"
              ],
              "owner_record_node_ids": [
                "p1:5005d79d390f276a34b7caf4"
              ],
              "semantic_owner_ids": [
                "p1:c04a6fcca8a88e2ce3052a12"
              ],
              "source_span_ids": [
                "p1:0ac85b43b0dc6a80218e77f0",
                "p1:f33c3a1c29e28002155201ca",
                "p1:571d80d40877f6505adf1d06"
              ],
              "negative_ownership_evidence": [],
              "fact_role_policy": {
                "candidate_fact_role": "CONSTRAINT",
                "owner_categories": [
                  "CURRENT_TASK_ROOT"
                ],
                "acceptance_domain": false,
                "allowed": true,
                "policy": "EXISTING_OWNER_DOMAIN_GATES",
                "licensing_relation_ids": [],
                "reason": "OWNER_FACT_ROLE_COMPATIBLE"
              },
              "decision": "ALLOW",
              "reason": "OWNER_AND_LAYER_RETAINED"
            },
            {
              "type": "AUX_CONDITION",
              "candidate_node_ids": [
                "p1:2b1849abc7e29105eb70b977"
              ],
              "owner_record_node_ids": [
                "p1:2b1849abc7e29105eb70b977"
              ],
              "semantic_owner_ids": [
                "p1:c04a6fcca8a88e2ce3052a12"
              ],
              "source_span_ids": [
                "p1:5e3b5ab04595aef88e78c85c",
                "p1:16c6c0a6d036213bdc5dc5e7",
                "p1:571d80d40877f6505adf1d06"
              ],
              "negative_ownership_evidence": [],
              "fact_role_policy": {
                "candidate_fact_role": "COMPLETION_CONDITION",
                "owner_categories": [
                  "CURRENT_TASK_ROOT"
                ],
                "acceptance_domain": false,
                "allowed": true,
                "policy": "EXISTING_OWNER_DOMAIN_GATES",
                "licensing_relation_ids": [],
                "reason": "OWNER_FACT_ROLE_COMPATIBLE"
              },
              "decision": "ALLOW",
              "reason": "OWNER_AND_LAYER_RETAINED"
            },
            {
              "type": "COMPLETION",
              "candidate_node_ids": [
                "p1:00c60db12ccee968ea34ba91"
              ],
              "owner_record_node_ids": [
                "p1:00c60db12ccee968ea34ba91"
              ],
              "semantic_owner_ids": [
                "p1:c04a6fcca8a88e2ce3052a12"
              ],
              "source_span_ids": [
                "p1:389fc6806e332239f3a0a558",
                "p1:a85ebf0b750986ebd6f278f6",
                "p1:571d80d40877f6505adf1d06"
              ],
              "negative_ownership_evidence": [],
              "fact_role_policy": {
                "candidate_fact_role": "COMPLETION_CONDITION",
                "owner_categories": [
                  "CURRENT_TASK_ROOT"
                ],
                "acceptance_domain": false,
                "allowed": true,
                "policy": "EXISTING_OWNER_DOMAIN_GATES",
                "licensing_relation_ids": [],
                "reason": "OWNER_FACT_ROLE_COMPATIBLE"
              },
              "decision": "ALLOW",
              "reason": "OWNER_AND_LAYER_RETAINED"
            }
          ]
        },
        "frame_certification": {
          "version": "7P-REPAIR-006",
          "before": {
            "nodes": [
              {
                "node_id": "p1:3ddbd3949281cbe0716e59ad",
                "node_type": "DISCOURSE",
                "surface": "张宁负责这项整理。请读取 input.csv，生成 report.md。不得修改 input.csv。report.md 已生成后，本任务完成。",
                "source_span_ids": [
                  "p1:571d80d40877f6505adf1d06"
                ],
                "state": "RESOLVED"
              },
              {
                "node_id": "p1:23c59e2354e7b39c3fb9b70d",
                "node_type": "EVENT",
                "surface": "这项整理",
                "source_span_ids": [
                  "p1:b0eccf72b3d1edf969c8f671"
                ],
                "state": "RESOLVED",
                "modality": "REQUIRED",
                "clause_id": "clause:0"
              },
              {
                "node_id": "p1:0a644412188024b2b0ff4db1",
                "node_type": "ENTITY",
                "surface": "张宁",
                "source_span_ids": [
                  "p1:71bb1d16f0709043431028ea"
                ],
                "state": "RESOLVED",
                "clause_id": "clause:0",
                "participant_eligibility": {
                  "eligible": true,
                  "reason": "PERSON_NER",
                  "source_span_ids": [
                    "p1:71bb1d16f0709043431028ea"
                  ],
                  "ner_evidence": [
                    {
                      "text": "张宁",
                      "start": 0,
                      "end": 2,
                      "label": "PERSON",
                      "span": {
                        "source_id": "source:37bc331b435432c551f3996cda23568886d94a11588ab75e1a7b75aa3073818c",
                        "start": 0,
                        "end": 2,
                        "quote": "张宁"
                      }
                    }
                  ],
                  "name_token_evidence": [
                    "clause:0:token:0"
                  ]
                }
              },
              {
                "node_id": "p1:13b991f220929572e7a8b1fa",
                "node_type": "ENTITY",
                "surface": "这项整理",
                "source_span_ids": [
                  "p1:b0eccf72b3d1edf969c8f671"
                ],
                "state": "RESOLVED",
                "clause_id": "clause:0",
                "participant_eligibility": {
                  "eligible": false,
                  "reason": "SRL_AGENT_IS_NOT_IDENTITY",
                  "source_span_ids": [
                    "p1:b0eccf72b3d1edf969c8f671"
                  ],
                  "ner_evidence": [],
                  "name_token_evidence": []
                }
              },
              {
                "node_id": "p1:a017f65f2618791bc5728c63",
                "node_type": "ENTITY",
                "surface": "input.csv",
                "source_span_ids": [
                  "p1:9d123dd0da21f3490930ff89"
                ],
                "state": "RESOLVED",
                "clause_id": "clause:1",
                "technical_type": "FILE",
                "participant_eligibility": {
                  "eligible": false,
                  "reason": "PROTECTED_TECHNICAL_TYPE_PRECEDES_NER",
                  "source_span_ids": [
                    "p1:9d123dd0da21f3490930ff89"
                  ]
                }
              },
              {
                "node_id": "p1:55751628ba342c5905e06203",
                "node_type": "EVENT",
                "surface": "读取",
                "source_span_ids": [
                  "p1:fd66e7077083782d8fc63cf9"
                ],
                "state": "RESOLVED",
                "modality": "REQUIRED",
                "clause_id": "clause:1"
              },
              {
                "node_id": "p1:fc5bd600086ab6090e519d5c",
                "node_type": "ENTITY",
                "surface": "report.md",
                "source_span_ids": [
                  "p1:816520f3f44f6ecce1fcffe1"
                ],
                "state": "RESOLVED",
                "clause_id": "clause:2",
                "technical_type": "ABSTRACT_DELIVERABLE",
                "participant_eligibility": {
                  "eligible": false,
                  "reason": "PROTECTED_TECHNICAL_TYPE_PRECEDES_NER",
                  "source_span_ids": [
                    "p1:816520f3f44f6ecce1fcffe1"
                  ]
                }
              },
              {
                "node_id": "p1:7be272d3f3a2df10061bef21",
                "node_type": "EVENT",
                "surface": "生成",
                "source_span_ids": [
                  "p1:73e3c5ea188ca1c5d3a01a25"
                ],
                "state": "RESOLVED",
                "modality": "REQUIRED",
                "clause_id": "clause:2"
              },
              {
                "node_id": "p1:5e56145673653f1ee7f21e69",
                "node_type": "ENTITY",
                "surface": "input.csv",
                "source_span_ids": [
                  "p1:55ad616030ab5968a94ded69"
                ],
                "state": "RESOLVED",
                "clause_id": "clause:3",
                "technical_type": "FILE",
                "participant_eligibility": {
                  "eligible": false,
                  "reason": "PROTECTED_TECHNICAL_TYPE_PRECEDES_NER",
                  "source_span_ids": [
                    "p1:55ad616030ab5968a94ded69"
                  ]
                }
              },
              {
                "node_id": "p1:5005d79d390f276a34b7caf4",
                "node_type": "EVENT",
                "surface": "修改",
                "source_span_ids": [
                  "p1:0ac85b43b0dc6a80218e77f0"
                ],
                "state": "RESOLVED",
                "modality": "FORBIDDEN",
                "clause_id": "clause:3"
              },
              {
                "node_id": "p1:ecd17316cc63a98d630af1d8",
                "node_type": "ENTITY",
                "surface": "report.md",
                "source_span_ids": [
                  "p1:128b95de26c3a7705c96510e"
                ],
                "state": "RESOLVED",
                "clause_id": "clause:4",
                "technical_type": "FILE",
                "participant_eligibility": {
                  "eligible": false,
                  "reason": "PROTECTED_TECHNICAL_TYPE_PRECEDES_NER",
                  "source_span_ids": [
                    "p1:128b95de26c3a7705c96510e"
                  ]
                }
              },
              {
                "node_id": "p1:00c60db12ccee968ea34ba91",
                "node_type": "EVENT",
                "surface": "完成",
                "source_span_ids": [
                  "p1:389fc6806e332239f3a0a558"
                ],
                "state": "RESOLVED",
                "modality": "UNSTATED",
                "clause_id": "clause:5"
              },
              {
                "node_id": "p1:3cfba2fb6a90ae4e9f6ecd34",
                "node_type": "ENTITY",
                "surface": "本任务",
                "source_span_ids": [
                  "p1:3dc88c03831e32f9a8fc67ce"
                ],
                "state": "RESOLVED",
                "clause_id": "clause:5",
                "participant_eligibility": {
                  "eligible": false,
                  "reason": "SRL_AGENT_IS_NOT_IDENTITY",
                  "source_span_ids": [
                    "p1:3dc88c03831e32f9a8fc67ce"
                  ],
                  "ner_evidence": [],
                  "name_token_evidence": []
                }
              },
              {
                "node_id": "p1:3c21a1bf090fbc6ec5a038c3",
                "node_type": "EVENT",
                "surface": "生成",
                "source_span_ids": [
                  "p1:c5e695a4d3c696b147d967d9"
                ],
                "state": "RESOLVED",
                "modality": "UNSTATED",
                "clause_id": "clause:4"
              },
              {
                "node_id": "p1:4ccdd8b53cd9e017cbb17dbb",
                "node_type": "EVENT",
                "surface": "负责",
                "source_span_ids": [
                  "p1:2cbc54e36db5ace4bf94cf39"
                ],
                "state": "RESOLVED",
                "modality": "UNSTATED",
                "clause_id": "clause:0"
              },
              {
                "node_id": "p1:a78bc4d47f94e06bd7c43b20",
                "node_type": "EVENT",
                "surface": "请",
                "source_span_ids": [
                  "p1:5843a93c9de7260207fbac4e"
                ],
                "state": "RESOLVED",
                "modality": "UNSTATED",
                "clause_id": "clause:1"
              }
            ],
            "relations": [
              {
                "relation_id": "p1:9a1356179ef6b0a998e369fb",
                "clause_id": "clause:0",
                "relation_type": "AGENT",
                "head_node_id": "p1:23c59e2354e7b39c3fb9b70d",
                "tail_node_id": "p1:0a644412188024b2b0ff4db1",
                "evidence_span_ids": [
                  "p1:b0eccf72b3d1edf969c8f671",
                  "p1:71bb1d16f0709043431028ea",
                  "p1:e157be95c430ae6af88e6a37"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [
                  "clause:0:token:4",
                  "clause:0:token:0"
                ],
                "rule_refs": [
                  "NATIVE_AGENT"
                ]
              },
              {
                "relation_id": "p1:7a1cf1efe8021d18c5f21cc7",
                "clause_id": "clause:0",
                "relation_type": "PATIENT",
                "head_node_id": "p1:23c59e2354e7b39c3fb9b70d",
                "tail_node_id": "p1:13b991f220929572e7a8b1fa",
                "evidence_span_ids": [
                  "p1:b0eccf72b3d1edf969c8f671",
                  "p1:e157be95c430ae6af88e6a37"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [
                  "clause:0:token:4"
                ],
                "rule_refs": [
                  "NATIVE_PATIENT"
                ]
              },
              {
                "relation_id": "p1:89a7f7c1806e1f6bce40b78c",
                "clause_id": "clause:0",
                "relation_type": "SCOPE_MEMBER",
                "head_node_id": "p1:3ddbd3949281cbe0716e59ad",
                "tail_node_id": "p1:13b991f220929572e7a8b1fa",
                "evidence_span_ids": [
                  "p1:571d80d40877f6505adf1d06",
                  "p1:b0eccf72b3d1edf969c8f671",
                  "p1:e157be95c430ae6af88e6a37"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [],
                "rule_refs": [
                  "NATIVE_SCOPE_MEMBER"
                ]
              },
              {
                "relation_id": "p1:0fd472c5ca879d856e495479",
                "clause_id": "clause:1",
                "relation_type": "PATIENT",
                "head_node_id": "p1:55751628ba342c5905e06203",
                "tail_node_id": "p1:a017f65f2618791bc5728c63",
                "evidence_span_ids": [
                  "p1:fd66e7077083782d8fc63cf9",
                  "p1:9d123dd0da21f3490930ff89",
                  "p1:b6f9329b82cfe4bf264e6752"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [
                  "clause:1:token:1"
                ],
                "rule_refs": [
                  "NATIVE_PATIENT"
                ]
              },
              {
                "relation_id": "p1:36ac3c5793dabb687e58d8be",
                "clause_id": "clause:2",
                "relation_type": "RESULT",
                "head_node_id": "p1:7be272d3f3a2df10061bef21",
                "tail_node_id": "p1:fc5bd600086ab6090e519d5c",
                "evidence_span_ids": [
                  "p1:73e3c5ea188ca1c5d3a01a25",
                  "p1:816520f3f44f6ecce1fcffe1",
                  "p1:7f0793aa43172b583c71aea5"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [
                  "clause:2:token:0"
                ],
                "rule_refs": [
                  "NATIVE_RESULT"
                ]
              },
              {
                "relation_id": "p1:f93ea6ea733bc8fc9e674b73",
                "clause_id": "clause:3",
                "relation_type": "FORBIDS",
                "head_node_id": "p1:5005d79d390f276a34b7caf4",
                "tail_node_id": "p1:5e56145673653f1ee7f21e69",
                "evidence_span_ids": [
                  "p1:0ac85b43b0dc6a80218e77f0",
                  "p1:55ad616030ab5968a94ded69",
                  "p1:f33c3a1c29e28002155201ca"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [
                  "clause:3:token:2"
                ],
                "rule_refs": [
                  "NATIVE_FORBIDS"
                ]
              },
              {
                "relation_id": "p1:d394d120378224a6b4da7245",
                "clause_id": "clause:5",
                "relation_type": "AGENT",
                "head_node_id": "p1:00c60db12ccee968ea34ba91",
                "tail_node_id": "p1:3cfba2fb6a90ae4e9f6ecd34",
                "evidence_span_ids": [
                  "p1:389fc6806e332239f3a0a558",
                  "p1:3dc88c03831e32f9a8fc67ce",
                  "p1:a85ebf0b750986ebd6f278f6"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [
                  "clause:5:token:2",
                  "clause:5:token:1"
                ],
                "rule_refs": [
                  "NATIVE_AGENT"
                ]
              },
              {
                "relation_id": "p1:79a08469cd000a3ff52ee6f4",
                "clause_id": "clause:4",
                "relation_type": "AGENT",
                "head_node_id": "p1:3c21a1bf090fbc6ec5a038c3",
                "tail_node_id": "p1:ecd17316cc63a98d630af1d8",
                "evidence_span_ids": [
                  "p1:c5e695a4d3c696b147d967d9",
                  "p1:128b95de26c3a7705c96510e",
                  "p1:16c6c0a6d036213bdc5dc5e7"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [
                  "clause:4:token:2"
                ],
                "rule_refs": [
                  "NATIVE_AGENT"
                ]
              },
              {
                "relation_id": "p1:f763ba315058fb8aea451f0b",
                "clause_id": "clause:1",
                "relation_type": "AGENT",
                "head_node_id": "p1:55751628ba342c5905e06203",
                "tail_node_id": "p1:0a644412188024b2b0ff4db1",
                "evidence_span_ids": [
                  "p1:fd66e7077083782d8fc63cf9",
                  "p1:71bb1d16f0709043431028ea",
                  "p1:b6f9329b82cfe4bf264e6752"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [
                  "clause:1:token:1",
                  "clause:0:token:0"
                ],
                "rule_refs": [
                  "NATIVE_AGENT"
                ]
              },
              {
                "relation_id": "p1:f3a3ec29582ca92036ced2f9",
                "clause_id": "clause:2",
                "relation_type": "AGENT",
                "head_node_id": "p1:7be272d3f3a2df10061bef21",
                "tail_node_id": "p1:0a644412188024b2b0ff4db1",
                "evidence_span_ids": [
                  "p1:73e3c5ea188ca1c5d3a01a25",
                  "p1:71bb1d16f0709043431028ea",
                  "p1:7f0793aa43172b583c71aea5"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [
                  "clause:2:token:0",
                  "clause:0:token:0"
                ],
                "rule_refs": [
                  "NATIVE_AGENT"
                ]
              },
              {
                "relation_id": "p1:ee1f0ad948cdfe14a4c667a6",
                "clause_id": "clause:3",
                "relation_type": "AGENT",
                "head_node_id": "p1:5005d79d390f276a34b7caf4",
                "tail_node_id": "p1:0a644412188024b2b0ff4db1",
                "evidence_span_ids": [
                  "p1:0ac85b43b0dc6a80218e77f0",
                  "p1:71bb1d16f0709043431028ea",
                  "p1:f33c3a1c29e28002155201ca"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [
                  "clause:3:token:2",
                  "clause:0:token:0"
                ],
                "rule_refs": [
                  "NATIVE_AGENT"
                ]
              },
              {
                "relation_id": "p1:30f048f55c1175bd7c206c2d",
                "clause_id": "clause:1",
                "relation_type": "SCOPE_MEMBER",
                "head_node_id": "p1:55751628ba342c5905e06203",
                "tail_node_id": "p1:a017f65f2618791bc5728c63",
                "evidence_span_ids": [
                  "p1:fd66e7077083782d8fc63cf9",
                  "p1:9d123dd0da21f3490930ff89",
                  "p1:b6f9329b82cfe4bf264e6752"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [
                  "clause:1:token:1"
                ],
                "rule_refs": [
                  "NATIVE_SCOPE_MEMBER"
                ]
              }
            ],
            "set_expressions": [
              {
                "expr_id": "p1:82292b0e875921429a84e3ff",
                "kind": "ITEM",
                "entity_node_id": "p1:13b991f220929572e7a8b1fa",
                "source_span_ids": [
                  "p1:b0eccf72b3d1edf969c8f671"
                ],
                "relation_ids": [
                  "p1:7a1cf1efe8021d18c5f21cc7"
                ]
              },
              {
                "expr_id": "p1:41531131ef88c5f0e156cbc6",
                "kind": "ITEM",
                "entity_node_id": "p1:13b991f220929572e7a8b1fa",
                "source_span_ids": [
                  "p1:b0eccf72b3d1edf969c8f671"
                ],
                "relation_ids": [
                  "p1:89a7f7c1806e1f6bce40b78c"
                ]
              },
              {
                "expr_id": "p1:4ac8dd9472408c314bb27336",
                "kind": "ITEM",
                "entity_node_id": "p1:a017f65f2618791bc5728c63",
                "source_span_ids": [
                  "p1:9d123dd0da21f3490930ff89"
                ],
                "relation_ids": [
                  "p1:0fd472c5ca879d856e495479"
                ]
              },
              {
                "expr_id": "p1:b12999225efa8d7cefc8b8df",
                "kind": "ITEM",
                "entity_node_id": "p1:5e56145673653f1ee7f21e69",
                "source_span_ids": [
                  "p1:55ad616030ab5968a94ded69"
                ],
                "relation_ids": [
                  "p1:f93ea6ea733bc8fc9e674b73"
                ]
              },
              {
                "expr_id": "p1:f9cc48d78faa50dad8627855",
                "kind": "ITEM",
                "entity_node_id": "p1:a017f65f2618791bc5728c63",
                "source_span_ids": [
                  "p1:9d123dd0da21f3490930ff89"
                ],
                "relation_ids": [
                  "p1:30f048f55c1175bd7c206c2d"
                ]
              },
              {
                "expr_id": "p1:f5c4097140b3a14c789d8249",
                "kind": "ITEM",
                "entity_node_id": "p1:fc5bd600086ab6090e519d5c",
                "source_span_ids": [
                  "p1:816520f3f44f6ecce1fcffe1"
                ],
                "relation_ids": [
                  "p1:36ac3c5793dabb687e58d8be"
                ]
              }
            ]
          },
          "controlled": [],
          "primary_targets": [],
          "governing": [],
          "call_sites": [],
          "code_ownership": [],
          "test_insertions": [],
          "arbitration": [],
          "source_accountability": [],
          "after": {
            "nodes": [
              {
                "node_id": "p1:3ddbd3949281cbe0716e59ad",
                "node_type": "DISCOURSE",
                "surface": "张宁负责这项整理。请读取 input.csv，生成 report.md。不得修改 input.csv。report.md 已生成后，本任务完成。",
                "source_span_ids": [
                  "p1:571d80d40877f6505adf1d06"
                ],
                "state": "RESOLVED"
              },
              {
                "node_id": "p1:23c59e2354e7b39c3fb9b70d",
                "node_type": "EVENT",
                "surface": "这项整理",
                "source_span_ids": [
                  "p1:b0eccf72b3d1edf969c8f671"
                ],
                "state": "RESOLVED",
                "modality": "REQUIRED",
                "clause_id": "clause:0"
              },
              {
                "node_id": "p1:0a644412188024b2b0ff4db1",
                "node_type": "ENTITY",
                "surface": "张宁",
                "source_span_ids": [
                  "p1:71bb1d16f0709043431028ea"
                ],
                "state": "RESOLVED",
                "clause_id": "clause:0",
                "participant_eligibility": {
                  "eligible": true,
                  "reason": "PERSON_NER",
                  "source_span_ids": [
                    "p1:71bb1d16f0709043431028ea"
                  ],
                  "ner_evidence": [
                    {
                      "text": "张宁",
                      "start": 0,
                      "end": 2,
                      "label": "PERSON",
                      "span": {
                        "source_id": "source:37bc331b435432c551f3996cda23568886d94a11588ab75e1a7b75aa3073818c",
                        "start": 0,
                        "end": 2,
                        "quote": "张宁"
                      }
                    }
                  ],
                  "name_token_evidence": [
                    "clause:0:token:0"
                  ]
                }
              },
              {
                "node_id": "p1:13b991f220929572e7a8b1fa",
                "node_type": "ENTITY",
                "surface": "这项整理",
                "source_span_ids": [
                  "p1:b0eccf72b3d1edf969c8f671"
                ],
                "state": "RESOLVED",
                "clause_id": "clause:0",
                "participant_eligibility": {
                  "eligible": false,
                  "reason": "SRL_AGENT_IS_NOT_IDENTITY",
                  "source_span_ids": [
                    "p1:b0eccf72b3d1edf969c8f671"
                  ],
                  "ner_evidence": [],
                  "name_token_evidence": []
                }
              },
              {
                "node_id": "p1:a017f65f2618791bc5728c63",
                "node_type": "ENTITY",
                "surface": "input.csv",
                "source_span_ids": [
                  "p1:9d123dd0da21f3490930ff89"
                ],
                "state": "RESOLVED",
                "clause_id": "clause:1",
                "technical_type": "FILE",
                "participant_eligibility": {
                  "eligible": false,
                  "reason": "PROTECTED_TECHNICAL_TYPE_PRECEDES_NER",
                  "source_span_ids": [
                    "p1:9d123dd0da21f3490930ff89"
                  ]
                }
              },
              {
                "node_id": "p1:55751628ba342c5905e06203",
                "node_type": "EVENT",
                "surface": "读取",
                "source_span_ids": [
                  "p1:fd66e7077083782d8fc63cf9"
                ],
                "state": "RESOLVED",
                "modality": "REQUIRED",
                "clause_id": "clause:1"
              },
              {
                "node_id": "p1:fc5bd600086ab6090e519d5c",
                "node_type": "ENTITY",
                "surface": "report.md",
                "source_span_ids": [
                  "p1:816520f3f44f6ecce1fcffe1"
                ],
                "state": "RESOLVED",
                "clause_id": "clause:2",
                "technical_type": "ABSTRACT_DELIVERABLE",
                "participant_eligibility": {
                  "eligible": false,
                  "reason": "PROTECTED_TECHNICAL_TYPE_PRECEDES_NER",
                  "source_span_ids": [
                    "p1:816520f3f44f6ecce1fcffe1"
                  ]
                }
              },
              {
                "node_id": "p1:7be272d3f3a2df10061bef21",
                "node_type": "EVENT",
                "surface": "生成",
                "source_span_ids": [
                  "p1:73e3c5ea188ca1c5d3a01a25"
                ],
                "state": "RESOLVED",
                "modality": "REQUIRED",
                "clause_id": "clause:2"
              },
              {
                "node_id": "p1:5e56145673653f1ee7f21e69",
                "node_type": "ENTITY",
                "surface": "input.csv",
                "source_span_ids": [
                  "p1:55ad616030ab5968a94ded69"
                ],
                "state": "RESOLVED",
                "clause_id": "clause:3",
                "technical_type": "FILE",
                "participant_eligibility": {
                  "eligible": false,
                  "reason": "PROTECTED_TECHNICAL_TYPE_PRECEDES_NER",
                  "source_span_ids": [
                    "p1:55ad616030ab5968a94ded69"
                  ]
                }
              },
              {
                "node_id": "p1:5005d79d390f276a34b7caf4",
                "node_type": "EVENT",
                "surface": "修改",
                "source_span_ids": [
                  "p1:0ac85b43b0dc6a80218e77f0"
                ],
                "state": "RESOLVED",
                "modality": "FORBIDDEN",
                "clause_id": "clause:3"
              },
              {
                "node_id": "p1:ecd17316cc63a98d630af1d8",
                "node_type": "ENTITY",
                "surface": "report.md",
                "source_span_ids": [
                  "p1:128b95de26c3a7705c96510e"
                ],
                "state": "RESOLVED",
                "clause_id": "clause:4",
                "technical_type": "FILE",
                "participant_eligibility": {
                  "eligible": false,
                  "reason": "PROTECTED_TECHNICAL_TYPE_PRECEDES_NER",
                  "source_span_ids": [
                    "p1:128b95de26c3a7705c96510e"
                  ]
                }
              },
              {
                "node_id": "p1:00c60db12ccee968ea34ba91",
                "node_type": "EVENT",
                "surface": "完成",
                "source_span_ids": [
                  "p1:389fc6806e332239f3a0a558"
                ],
                "state": "RESOLVED",
                "modality": "UNSTATED",
                "clause_id": "clause:5"
              },
              {
                "node_id": "p1:3cfba2fb6a90ae4e9f6ecd34",
                "node_type": "ENTITY",
                "surface": "本任务",
                "source_span_ids": [
                  "p1:3dc88c03831e32f9a8fc67ce"
                ],
                "state": "RESOLVED",
                "clause_id": "clause:5",
                "participant_eligibility": {
                  "eligible": false,
                  "reason": "SRL_AGENT_IS_NOT_IDENTITY",
                  "source_span_ids": [
                    "p1:3dc88c03831e32f9a8fc67ce"
                  ],
                  "ner_evidence": [],
                  "name_token_evidence": []
                }
              },
              {
                "node_id": "p1:3c21a1bf090fbc6ec5a038c3",
                "node_type": "EVENT",
                "surface": "生成",
                "source_span_ids": [
                  "p1:c5e695a4d3c696b147d967d9"
                ],
                "state": "RESOLVED",
                "modality": "UNSTATED",
                "clause_id": "clause:4"
              },
              {
                "node_id": "p1:4ccdd8b53cd9e017cbb17dbb",
                "node_type": "EVENT",
                "surface": "负责",
                "source_span_ids": [
                  "p1:2cbc54e36db5ace4bf94cf39"
                ],
                "state": "RESOLVED",
                "modality": "UNSTATED",
                "clause_id": "clause:0"
              },
              {
                "node_id": "p1:a78bc4d47f94e06bd7c43b20",
                "node_type": "EVENT",
                "surface": "请",
                "source_span_ids": [
                  "p1:5843a93c9de7260207fbac4e"
                ],
                "state": "RESOLVED",
                "modality": "UNSTATED",
                "clause_id": "clause:1"
              }
            ],
            "relations": [
              {
                "relation_id": "p1:9a1356179ef6b0a998e369fb",
                "clause_id": "clause:0",
                "relation_type": "AGENT",
                "head_node_id": "p1:23c59e2354e7b39c3fb9b70d",
                "tail_node_id": "p1:0a644412188024b2b0ff4db1",
                "evidence_span_ids": [
                  "p1:b0eccf72b3d1edf969c8f671",
                  "p1:71bb1d16f0709043431028ea",
                  "p1:e157be95c430ae6af88e6a37"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [
                  "clause:0:token:4",
                  "clause:0:token:0"
                ],
                "rule_refs": [
                  "NATIVE_AGENT"
                ]
              },
              {
                "relation_id": "p1:7a1cf1efe8021d18c5f21cc7",
                "clause_id": "clause:0",
                "relation_type": "PATIENT",
                "head_node_id": "p1:23c59e2354e7b39c3fb9b70d",
                "tail_node_id": "p1:13b991f220929572e7a8b1fa",
                "evidence_span_ids": [
                  "p1:b0eccf72b3d1edf969c8f671",
                  "p1:e157be95c430ae6af88e6a37"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [
                  "clause:0:token:4"
                ],
                "rule_refs": [
                  "NATIVE_PATIENT"
                ]
              },
              {
                "relation_id": "p1:89a7f7c1806e1f6bce40b78c",
                "clause_id": "clause:0",
                "relation_type": "SCOPE_MEMBER",
                "head_node_id": "p1:3ddbd3949281cbe0716e59ad",
                "tail_node_id": "p1:13b991f220929572e7a8b1fa",
                "evidence_span_ids": [
                  "p1:571d80d40877f6505adf1d06",
                  "p1:b0eccf72b3d1edf969c8f671",
                  "p1:e157be95c430ae6af88e6a37"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [],
                "rule_refs": [
                  "NATIVE_SCOPE_MEMBER"
                ]
              },
              {
                "relation_id": "p1:0fd472c5ca879d856e495479",
                "clause_id": "clause:1",
                "relation_type": "PATIENT",
                "head_node_id": "p1:55751628ba342c5905e06203",
                "tail_node_id": "p1:a017f65f2618791bc5728c63",
                "evidence_span_ids": [
                  "p1:fd66e7077083782d8fc63cf9",
                  "p1:9d123dd0da21f3490930ff89",
                  "p1:b6f9329b82cfe4bf264e6752"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [
                  "clause:1:token:1"
                ],
                "rule_refs": [
                  "NATIVE_PATIENT"
                ]
              },
              {
                "relation_id": "p1:36ac3c5793dabb687e58d8be",
                "clause_id": "clause:2",
                "relation_type": "RESULT",
                "head_node_id": "p1:7be272d3f3a2df10061bef21",
                "tail_node_id": "p1:fc5bd600086ab6090e519d5c",
                "evidence_span_ids": [
                  "p1:73e3c5ea188ca1c5d3a01a25",
                  "p1:816520f3f44f6ecce1fcffe1",
                  "p1:7f0793aa43172b583c71aea5"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [
                  "clause:2:token:0"
                ],
                "rule_refs": [
                  "NATIVE_RESULT"
                ]
              },
              {
                "relation_id": "p1:f93ea6ea733bc8fc9e674b73",
                "clause_id": "clause:3",
                "relation_type": "FORBIDS",
                "head_node_id": "p1:5005d79d390f276a34b7caf4",
                "tail_node_id": "p1:5e56145673653f1ee7f21e69",
                "evidence_span_ids": [
                  "p1:0ac85b43b0dc6a80218e77f0",
                  "p1:55ad616030ab5968a94ded69",
                  "p1:f33c3a1c29e28002155201ca"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [
                  "clause:3:token:2"
                ],
                "rule_refs": [
                  "NATIVE_FORBIDS"
                ]
              },
              {
                "relation_id": "p1:d394d120378224a6b4da7245",
                "clause_id": "clause:5",
                "relation_type": "AGENT",
                "head_node_id": "p1:00c60db12ccee968ea34ba91",
                "tail_node_id": "p1:3cfba2fb6a90ae4e9f6ecd34",
                "evidence_span_ids": [
                  "p1:389fc6806e332239f3a0a558",
                  "p1:3dc88c03831e32f9a8fc67ce",
                  "p1:a85ebf0b750986ebd6f278f6"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [
                  "clause:5:token:2",
                  "clause:5:token:1"
                ],
                "rule_refs": [
                  "NATIVE_AGENT"
                ]
              },
              {
                "relation_id": "p1:79a08469cd000a3ff52ee6f4",
                "clause_id": "clause:4",
                "relation_type": "AGENT",
                "head_node_id": "p1:3c21a1bf090fbc6ec5a038c3",
                "tail_node_id": "p1:ecd17316cc63a98d630af1d8",
                "evidence_span_ids": [
                  "p1:c5e695a4d3c696b147d967d9",
                  "p1:128b95de26c3a7705c96510e",
                  "p1:16c6c0a6d036213bdc5dc5e7"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [
                  "clause:4:token:2"
                ],
                "rule_refs": [
                  "NATIVE_AGENT"
                ]
              },
              {
                "relation_id": "p1:f763ba315058fb8aea451f0b",
                "clause_id": "clause:1",
                "relation_type": "AGENT",
                "head_node_id": "p1:55751628ba342c5905e06203",
                "tail_node_id": "p1:0a644412188024b2b0ff4db1",
                "evidence_span_ids": [
                  "p1:fd66e7077083782d8fc63cf9",
                  "p1:71bb1d16f0709043431028ea",
                  "p1:b6f9329b82cfe4bf264e6752"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [
                  "clause:1:token:1",
                  "clause:0:token:0"
                ],
                "rule_refs": [
                  "NATIVE_AGENT"
                ]
              },
              {
                "relation_id": "p1:f3a3ec29582ca92036ced2f9",
                "clause_id": "clause:2",
                "relation_type": "AGENT",
                "head_node_id": "p1:7be272d3f3a2df10061bef21",
                "tail_node_id": "p1:0a644412188024b2b0ff4db1",
                "evidence_span_ids": [
                  "p1:73e3c5ea188ca1c5d3a01a25",
                  "p1:71bb1d16f0709043431028ea",
                  "p1:7f0793aa43172b583c71aea5"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [
                  "clause:2:token:0",
                  "clause:0:token:0"
                ],
                "rule_refs": [
                  "NATIVE_AGENT"
                ]
              },
              {
                "relation_id": "p1:ee1f0ad948cdfe14a4c667a6",
                "clause_id": "clause:3",
                "relation_type": "AGENT",
                "head_node_id": "p1:5005d79d390f276a34b7caf4",
                "tail_node_id": "p1:0a644412188024b2b0ff4db1",
                "evidence_span_ids": [
                  "p1:0ac85b43b0dc6a80218e77f0",
                  "p1:71bb1d16f0709043431028ea",
                  "p1:f33c3a1c29e28002155201ca"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [
                  "clause:3:token:2",
                  "clause:0:token:0"
                ],
                "rule_refs": [
                  "NATIVE_AGENT"
                ]
              },
              {
                "relation_id": "p1:30f048f55c1175bd7c206c2d",
                "clause_id": "clause:1",
                "relation_type": "SCOPE_MEMBER",
                "head_node_id": "p1:55751628ba342c5905e06203",
                "tail_node_id": "p1:a017f65f2618791bc5728c63",
                "evidence_span_ids": [
                  "p1:fd66e7077083782d8fc63cf9",
                  "p1:9d123dd0da21f3490930ff89",
                  "p1:b6f9329b82cfe4bf264e6752"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [
                  "clause:1:token:1"
                ],
                "rule_refs": [
                  "NATIVE_SCOPE_MEMBER"
                ]
              }
            ],
            "set_expressions": [
              {
                "expr_id": "p1:82292b0e875921429a84e3ff",
                "kind": "ITEM",
                "entity_node_id": "p1:13b991f220929572e7a8b1fa",
                "source_span_ids": [
                  "p1:b0eccf72b3d1edf969c8f671"
                ],
                "relation_ids": [
                  "p1:7a1cf1efe8021d18c5f21cc7"
                ]
              },
              {
                "expr_id": "p1:41531131ef88c5f0e156cbc6",
                "kind": "ITEM",
                "entity_node_id": "p1:13b991f220929572e7a8b1fa",
                "source_span_ids": [
                  "p1:b0eccf72b3d1edf969c8f671"
                ],
                "relation_ids": [
                  "p1:89a7f7c1806e1f6bce40b78c"
                ]
              },
              {
                "expr_id": "p1:4ac8dd9472408c314bb27336",
                "kind": "ITEM",
                "entity_node_id": "p1:a017f65f2618791bc5728c63",
                "source_span_ids": [
                  "p1:9d123dd0da21f3490930ff89"
                ],
                "relation_ids": [
                  "p1:0fd472c5ca879d856e495479"
                ]
              },
              {
                "expr_id": "p1:b12999225efa8d7cefc8b8df",
                "kind": "ITEM",
                "entity_node_id": "p1:5e56145673653f1ee7f21e69",
                "source_span_ids": [
                  "p1:55ad616030ab5968a94ded69"
                ],
                "relation_ids": [
                  "p1:f93ea6ea733bc8fc9e674b73"
                ]
              },
              {
                "expr_id": "p1:f9cc48d78faa50dad8627855",
                "kind": "ITEM",
                "entity_node_id": "p1:a017f65f2618791bc5728c63",
                "source_span_ids": [
                  "p1:9d123dd0da21f3490930ff89"
                ],
                "relation_ids": [
                  "p1:30f048f55c1175bd7c206c2d"
                ]
              },
              {
                "expr_id": "p1:f5c4097140b3a14c789d8249",
                "kind": "ITEM",
                "entity_node_id": "p1:fc5bd600086ab6090e519d5c",
                "source_span_ids": [
                  "p1:816520f3f44f6ecce1fcffe1"
                ],
                "relation_ids": [
                  "p1:36ac3c5793dabb687e58d8be"
                ]
              }
            ]
          },
          "eligibility_decisions": [
            {
              "eligibility_decision_id": "p1:b44eb5a9e9218085a49d4520",
              "disposition": "BOUNDARY",
              "candidate_relation_ids": [
                "p1:36ac3c5793dabb687e58d8be",
                "p1:f3a3ec29582ca92036ced2f9"
              ],
              "candidate_node_ids": [
                "p1:7be272d3f3a2df10061bef21",
                "p1:fc5bd600086ab6090e519d5c",
                "p1:0a644412188024b2b0ff4db1"
              ],
              "proposed_fact_type": "DELIVERABLE",
              "reason_code": "EXPLICIT_DELIVERABLE",
              "source_span_ids": [
                "p1:73e3c5ea188ca1c5d3a01a25",
                "p1:7f0793aa43172b583c71aea5",
                "p1:816520f3f44f6ecce1fcffe1",
                "p1:71bb1d16f0709043431028ea",
                "p1:e157be95c430ae6af88e6a37"
              ]
            },
            {
              "eligibility_decision_id": "p1:598c3fcb7e54f82ca73630ff",
              "disposition": "BOUNDARY",
              "candidate_relation_ids": [
                "p1:f763ba315058fb8aea451f0b"
              ],
              "candidate_node_ids": [
                "p1:0a644412188024b2b0ff4db1",
                "p1:55751628ba342c5905e06203"
              ],
              "proposed_fact_type": "PARTICIPANT",
              "reason_code": "PARTICIPATION_RELATION",
              "source_span_ids": [
                "p1:71bb1d16f0709043431028ea",
                "p1:e157be95c430ae6af88e6a37",
                "p1:fd66e7077083782d8fc63cf9",
                "p1:b6f9329b82cfe4bf264e6752"
              ]
            },
            {
              "eligibility_decision_id": "p1:20e2a0f291dbc0a9f5854330",
              "disposition": "BOUNDARY",
              "candidate_relation_ids": [
                "p1:f3a3ec29582ca92036ced2f9"
              ],
              "candidate_node_ids": [
                "p1:0a644412188024b2b0ff4db1",
                "p1:7be272d3f3a2df10061bef21"
              ],
              "proposed_fact_type": "PARTICIPANT",
              "reason_code": "PARTICIPATION_RELATION",
              "source_span_ids": [
                "p1:71bb1d16f0709043431028ea",
                "p1:e157be95c430ae6af88e6a37",
                "p1:73e3c5ea188ca1c5d3a01a25",
                "p1:7f0793aa43172b583c71aea5"
              ]
            },
            {
              "eligibility_decision_id": "p1:169edde73f610443fdc66893",
              "disposition": "BOUNDARY",
              "candidate_relation_ids": [
                "p1:ee1f0ad948cdfe14a4c667a6"
              ],
              "candidate_node_ids": [
                "p1:0a644412188024b2b0ff4db1",
                "p1:5005d79d390f276a34b7caf4"
              ],
              "proposed_fact_type": "PARTICIPANT",
              "reason_code": "PARTICIPATION_RELATION",
              "source_span_ids": [
                "p1:71bb1d16f0709043431028ea",
                "p1:e157be95c430ae6af88e6a37",
                "p1:0ac85b43b0dc6a80218e77f0",
                "p1:f33c3a1c29e28002155201ca"
              ]
            },
            {
              "eligibility_decision_id": "p1:67f822d410e84a3321cb8820",
              "disposition": "BOUNDARY",
              "candidate_relation_ids": [
                "p1:30f048f55c1175bd7c206c2d"
              ],
              "candidate_node_ids": [
                "p1:a017f65f2618791bc5728c63",
                "p1:55751628ba342c5905e06203"
              ],
              "proposed_fact_type": "TASK_OBJECT",
              "reason_code": "EXPLICIT_TASK_SCOPE",
              "source_span_ids": [
                "p1:9d123dd0da21f3490930ff89",
                "p1:b6f9329b82cfe4bf264e6752",
                "p1:fd66e7077083782d8fc63cf9"
              ]
            },
            {
              "eligibility_decision_id": "p1:c7ec0f12624379da4dff5302",
              "disposition": "BOUNDARY",
              "candidate_relation_ids": [
                "p1:be818ec586992582f977e909"
              ],
              "candidate_node_ids": [
                "p1:664c7119ec8c17c7363d4a2d",
                "p1:2de8e54fcb2f544ce2f6d95d"
              ],
              "proposed_fact_type": "PARTICIPANT",
              "reason_code": "PARTICIPATION_RELATION",
              "source_span_ids": [
                "p1:71bb1d16f0709043431028ea",
                "p1:e157be95c430ae6af88e6a37",
                "p1:2cbc54e36db5ace4bf94cf39"
              ]
            },
            {
              "eligibility_decision_id": "p1:3bfc3ff113e3f5fd52b90c53",
              "disposition": "AUXILIARY",
              "candidate_relation_ids": [
                "p1:be818ec586992582f977e909"
              ],
              "candidate_node_ids": [
                "p1:2de8e54fcb2f544ce2f6d95d",
                "p1:664c7119ec8c17c7363d4a2d"
              ],
              "proposed_fact_type": "AUX_CONDITION",
              "reason_code": "AUXILIARY_CONDITION",
              "source_span_ids": [
                "p1:2cbc54e36db5ace4bf94cf39",
                "p1:e157be95c430ae6af88e6a37",
                "p1:71bb1d16f0709043431028ea"
              ]
            },
            {
              "eligibility_decision_id": "p1:a1c1a7ea3b1afcc1ac66e181",
              "disposition": "BOUNDARY",
              "candidate_relation_ids": [
                "p1:0fd472c5ca879d856e495479",
                "p1:f763ba315058fb8aea451f0b",
                "p1:30f048f55c1175bd7c206c2d"
              ],
              "candidate_node_ids": [
                "p1:55751628ba342c5905e06203",
                "p1:a017f65f2618791bc5728c63",
                "p1:0a644412188024b2b0ff4db1"
              ],
              "proposed_fact_type": "ACTION",
              "reason_code": "POSITIVE_ACTION_TARGET",
              "source_span_ids": [
                "p1:fd66e7077083782d8fc63cf9",
                "p1:b6f9329b82cfe4bf264e6752",
                "p1:9d123dd0da21f3490930ff89",
                "p1:71bb1d16f0709043431028ea",
                "p1:e157be95c430ae6af88e6a37"
              ]
            },
            {
              "eligibility_decision_id": "p1:20c6751b0e65ecf36bc0244e",
              "disposition": "BOUNDARY",
              "candidate_relation_ids": [
                "p1:36ac3c5793dabb687e58d8be",
                "p1:f3a3ec29582ca92036ced2f9"
              ],
              "candidate_node_ids": [
                "p1:7be272d3f3a2df10061bef21",
                "p1:fc5bd600086ab6090e519d5c",
                "p1:0a644412188024b2b0ff4db1"
              ],
              "proposed_fact_type": "ACTION",
              "reason_code": "POSITIVE_ACTION_TARGET",
              "source_span_ids": [
                "p1:73e3c5ea188ca1c5d3a01a25",
                "p1:7f0793aa43172b583c71aea5",
                "p1:816520f3f44f6ecce1fcffe1",
                "p1:71bb1d16f0709043431028ea",
                "p1:e157be95c430ae6af88e6a37"
              ]
            },
            {
              "eligibility_decision_id": "p1:e84eb5c0ac1d8a838a64e408",
              "disposition": "BOUNDARY",
              "candidate_relation_ids": [
                "p1:f93ea6ea733bc8fc9e674b73",
                "p1:ee1f0ad948cdfe14a4c667a6"
              ],
              "candidate_node_ids": [
                "p1:5005d79d390f276a34b7caf4",
                "p1:5e56145673653f1ee7f21e69",
                "p1:0a644412188024b2b0ff4db1"
              ],
              "proposed_fact_type": "FORBID",
              "reason_code": "FORBIDDEN_OR_RESTRICTED",
              "source_span_ids": [
                "p1:0ac85b43b0dc6a80218e77f0",
                "p1:f33c3a1c29e28002155201ca",
                "p1:55ad616030ab5968a94ded69",
                "p1:71bb1d16f0709043431028ea",
                "p1:e157be95c430ae6af88e6a37"
              ]
            },
            {
              "eligibility_decision_id": "p1:78258d164c6ec4e7fbe251cf",
              "disposition": "AUXILIARY",
              "candidate_relation_ids": [
                "p1:9a7186b2ce7dc7f94f019028",
                "p1:846306081530b2461ab45f14"
              ],
              "candidate_node_ids": [
                "p1:2b1849abc7e29105eb70b977",
                "p1:fc5bd600086ab6090e519d5c",
                "p1:00c60db12ccee968ea34ba91"
              ],
              "proposed_fact_type": "AUX_CONDITION",
              "reason_code": "AUXILIARY_CONDITION",
              "source_span_ids": [
                "p1:5e3b5ab04595aef88e78c85c",
                "p1:16c6c0a6d036213bdc5dc5e7",
                "p1:816520f3f44f6ecce1fcffe1",
                "p1:7f0793aa43172b583c71aea5",
                "p1:389fc6806e332239f3a0a558",
                "p1:a85ebf0b750986ebd6f278f6"
              ]
            },
            {
              "eligibility_decision_id": "p1:119c8d1c48d9ef2d0ef26a59",
              "disposition": "BOUNDARY",
              "candidate_relation_ids": [
                "p1:d394d120378224a6b4da7245",
                "p1:846306081530b2461ab45f14"
              ],
              "candidate_node_ids": [
                "p1:00c60db12ccee968ea34ba91",
                "p1:3cfba2fb6a90ae4e9f6ecd34",
                "p1:2b1849abc7e29105eb70b977"
              ],
              "proposed_fact_type": "COMPLETION",
              "reason_code": "COMPLETION_OR_STOP",
              "source_span_ids": [
                "p1:389fc6806e332239f3a0a558",
                "p1:a85ebf0b750986ebd6f278f6",
                "p1:3dc88c03831e32f9a8fc67ce",
                "p1:5e3b5ab04595aef88e78c85c",
                "p1:16c6c0a6d036213bdc5dc5e7"
              ]
            }
          ]
        },
        "cross_instruction_identity": {
          "version": "7P-REPAIR-007",
          "before": {
            "nodes": [
              {
                "node_id": "p1:3ddbd3949281cbe0716e59ad",
                "node_type": "DISCOURSE",
                "surface": "张宁负责这项整理。请读取 input.csv，生成 report.md。不得修改 input.csv。report.md 已生成后，本任务完成。",
                "source_span_ids": [
                  "p1:571d80d40877f6505adf1d06"
                ],
                "state": "RESOLVED"
              },
              {
                "node_id": "p1:23c59e2354e7b39c3fb9b70d",
                "node_type": "EVENT",
                "surface": "这项整理",
                "source_span_ids": [
                  "p1:b0eccf72b3d1edf969c8f671"
                ],
                "state": "RESOLVED",
                "modality": "REQUIRED",
                "clause_id": "clause:0"
              },
              {
                "node_id": "p1:0a644412188024b2b0ff4db1",
                "node_type": "ENTITY",
                "surface": "张宁",
                "source_span_ids": [
                  "p1:71bb1d16f0709043431028ea"
                ],
                "state": "RESOLVED",
                "clause_id": "clause:0",
                "participant_eligibility": {
                  "eligible": true,
                  "reason": "PERSON_NER",
                  "source_span_ids": [
                    "p1:71bb1d16f0709043431028ea"
                  ],
                  "ner_evidence": [
                    {
                      "text": "张宁",
                      "start": 0,
                      "end": 2,
                      "label": "PERSON",
                      "span": {
                        "source_id": "source:37bc331b435432c551f3996cda23568886d94a11588ab75e1a7b75aa3073818c",
                        "start": 0,
                        "end": 2,
                        "quote": "张宁"
                      }
                    }
                  ],
                  "name_token_evidence": [
                    "clause:0:token:0"
                  ]
                }
              },
              {
                "node_id": "p1:13b991f220929572e7a8b1fa",
                "node_type": "ENTITY",
                "surface": "这项整理",
                "source_span_ids": [
                  "p1:b0eccf72b3d1edf969c8f671"
                ],
                "state": "RESOLVED",
                "clause_id": "clause:0",
                "participant_eligibility": {
                  "eligible": false,
                  "reason": "SRL_AGENT_IS_NOT_IDENTITY",
                  "source_span_ids": [
                    "p1:b0eccf72b3d1edf969c8f671"
                  ],
                  "ner_evidence": [],
                  "name_token_evidence": []
                }
              },
              {
                "node_id": "p1:a017f65f2618791bc5728c63",
                "node_type": "ENTITY",
                "surface": "input.csv",
                "source_span_ids": [
                  "p1:9d123dd0da21f3490930ff89"
                ],
                "state": "RESOLVED",
                "clause_id": "clause:1",
                "technical_type": "FILE",
                "participant_eligibility": {
                  "eligible": false,
                  "reason": "PROTECTED_TECHNICAL_TYPE_PRECEDES_NER",
                  "source_span_ids": [
                    "p1:9d123dd0da21f3490930ff89"
                  ]
                }
              },
              {
                "node_id": "p1:55751628ba342c5905e06203",
                "node_type": "EVENT",
                "surface": "读取",
                "source_span_ids": [
                  "p1:fd66e7077083782d8fc63cf9"
                ],
                "state": "RESOLVED",
                "modality": "REQUIRED",
                "clause_id": "clause:1"
              },
              {
                "node_id": "p1:fc5bd600086ab6090e519d5c",
                "node_type": "ENTITY",
                "surface": "report.md",
                "source_span_ids": [
                  "p1:816520f3f44f6ecce1fcffe1"
                ],
                "state": "RESOLVED",
                "clause_id": "clause:2",
                "technical_type": "ABSTRACT_DELIVERABLE",
                "participant_eligibility": {
                  "eligible": false,
                  "reason": "PROTECTED_TECHNICAL_TYPE_PRECEDES_NER",
                  "source_span_ids": [
                    "p1:816520f3f44f6ecce1fcffe1"
                  ]
                }
              },
              {
                "node_id": "p1:7be272d3f3a2df10061bef21",
                "node_type": "EVENT",
                "surface": "生成",
                "source_span_ids": [
                  "p1:73e3c5ea188ca1c5d3a01a25"
                ],
                "state": "RESOLVED",
                "modality": "REQUIRED",
                "clause_id": "clause:2"
              },
              {
                "node_id": "p1:5e56145673653f1ee7f21e69",
                "node_type": "ENTITY",
                "surface": "input.csv",
                "source_span_ids": [
                  "p1:55ad616030ab5968a94ded69"
                ],
                "state": "RESOLVED",
                "clause_id": "clause:3",
                "technical_type": "FILE",
                "participant_eligibility": {
                  "eligible": false,
                  "reason": "PROTECTED_TECHNICAL_TYPE_PRECEDES_NER",
                  "source_span_ids": [
                    "p1:55ad616030ab5968a94ded69"
                  ]
                }
              },
              {
                "node_id": "p1:5005d79d390f276a34b7caf4",
                "node_type": "EVENT",
                "surface": "修改",
                "source_span_ids": [
                  "p1:0ac85b43b0dc6a80218e77f0"
                ],
                "state": "RESOLVED",
                "modality": "FORBIDDEN",
                "clause_id": "clause:3"
              },
              {
                "node_id": "p1:ecd17316cc63a98d630af1d8",
                "node_type": "ENTITY",
                "surface": "report.md",
                "source_span_ids": [
                  "p1:128b95de26c3a7705c96510e"
                ],
                "state": "RESOLVED",
                "clause_id": "clause:4",
                "technical_type": "FILE",
                "participant_eligibility": {
                  "eligible": false,
                  "reason": "PROTECTED_TECHNICAL_TYPE_PRECEDES_NER",
                  "source_span_ids": [
                    "p1:128b95de26c3a7705c96510e"
                  ]
                }
              },
              {
                "node_id": "p1:00c60db12ccee968ea34ba91",
                "node_type": "EVENT",
                "surface": "完成",
                "source_span_ids": [
                  "p1:389fc6806e332239f3a0a558"
                ],
                "state": "RESOLVED",
                "modality": "UNSTATED",
                "clause_id": "clause:5"
              },
              {
                "node_id": "p1:3cfba2fb6a90ae4e9f6ecd34",
                "node_type": "ENTITY",
                "surface": "本任务",
                "source_span_ids": [
                  "p1:3dc88c03831e32f9a8fc67ce"
                ],
                "state": "RESOLVED",
                "clause_id": "clause:5",
                "participant_eligibility": {
                  "eligible": false,
                  "reason": "SRL_AGENT_IS_NOT_IDENTITY",
                  "source_span_ids": [
                    "p1:3dc88c03831e32f9a8fc67ce"
                  ],
                  "ner_evidence": [],
                  "name_token_evidence": []
                }
              },
              {
                "node_id": "p1:3c21a1bf090fbc6ec5a038c3",
                "node_type": "EVENT",
                "surface": "生成",
                "source_span_ids": [
                  "p1:c5e695a4d3c696b147d967d9"
                ],
                "state": "RESOLVED",
                "modality": "UNSTATED",
                "clause_id": "clause:4"
              },
              {
                "node_id": "p1:4ccdd8b53cd9e017cbb17dbb",
                "node_type": "EVENT",
                "surface": "负责",
                "source_span_ids": [
                  "p1:2cbc54e36db5ace4bf94cf39"
                ],
                "state": "RESOLVED",
                "modality": "UNSTATED",
                "clause_id": "clause:0"
              },
              {
                "node_id": "p1:a78bc4d47f94e06bd7c43b20",
                "node_type": "EVENT",
                "surface": "请",
                "source_span_ids": [
                  "p1:5843a93c9de7260207fbac4e"
                ],
                "state": "RESOLVED",
                "modality": "UNSTATED",
                "clause_id": "clause:1"
              }
            ],
            "relations": [
              {
                "relation_id": "p1:9a1356179ef6b0a998e369fb",
                "clause_id": "clause:0",
                "relation_type": "AGENT",
                "head_node_id": "p1:23c59e2354e7b39c3fb9b70d",
                "tail_node_id": "p1:0a644412188024b2b0ff4db1",
                "evidence_span_ids": [
                  "p1:b0eccf72b3d1edf969c8f671",
                  "p1:71bb1d16f0709043431028ea",
                  "p1:e157be95c430ae6af88e6a37"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [
                  "clause:0:token:4",
                  "clause:0:token:0"
                ],
                "rule_refs": [
                  "NATIVE_AGENT"
                ]
              },
              {
                "relation_id": "p1:7a1cf1efe8021d18c5f21cc7",
                "clause_id": "clause:0",
                "relation_type": "PATIENT",
                "head_node_id": "p1:23c59e2354e7b39c3fb9b70d",
                "tail_node_id": "p1:13b991f220929572e7a8b1fa",
                "evidence_span_ids": [
                  "p1:b0eccf72b3d1edf969c8f671",
                  "p1:e157be95c430ae6af88e6a37"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [
                  "clause:0:token:4"
                ],
                "rule_refs": [
                  "NATIVE_PATIENT"
                ]
              },
              {
                "relation_id": "p1:89a7f7c1806e1f6bce40b78c",
                "clause_id": "clause:0",
                "relation_type": "SCOPE_MEMBER",
                "head_node_id": "p1:3ddbd3949281cbe0716e59ad",
                "tail_node_id": "p1:13b991f220929572e7a8b1fa",
                "evidence_span_ids": [
                  "p1:571d80d40877f6505adf1d06",
                  "p1:b0eccf72b3d1edf969c8f671",
                  "p1:e157be95c430ae6af88e6a37"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [],
                "rule_refs": [
                  "NATIVE_SCOPE_MEMBER"
                ]
              },
              {
                "relation_id": "p1:0fd472c5ca879d856e495479",
                "clause_id": "clause:1",
                "relation_type": "PATIENT",
                "head_node_id": "p1:55751628ba342c5905e06203",
                "tail_node_id": "p1:a017f65f2618791bc5728c63",
                "evidence_span_ids": [
                  "p1:fd66e7077083782d8fc63cf9",
                  "p1:9d123dd0da21f3490930ff89",
                  "p1:b6f9329b82cfe4bf264e6752"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [
                  "clause:1:token:1"
                ],
                "rule_refs": [
                  "NATIVE_PATIENT"
                ]
              },
              {
                "relation_id": "p1:36ac3c5793dabb687e58d8be",
                "clause_id": "clause:2",
                "relation_type": "RESULT",
                "head_node_id": "p1:7be272d3f3a2df10061bef21",
                "tail_node_id": "p1:fc5bd600086ab6090e519d5c",
                "evidence_span_ids": [
                  "p1:73e3c5ea188ca1c5d3a01a25",
                  "p1:816520f3f44f6ecce1fcffe1",
                  "p1:7f0793aa43172b583c71aea5"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [
                  "clause:2:token:0"
                ],
                "rule_refs": [
                  "NATIVE_RESULT"
                ]
              },
              {
                "relation_id": "p1:f93ea6ea733bc8fc9e674b73",
                "clause_id": "clause:3",
                "relation_type": "FORBIDS",
                "head_node_id": "p1:5005d79d390f276a34b7caf4",
                "tail_node_id": "p1:5e56145673653f1ee7f21e69",
                "evidence_span_ids": [
                  "p1:0ac85b43b0dc6a80218e77f0",
                  "p1:55ad616030ab5968a94ded69",
                  "p1:f33c3a1c29e28002155201ca"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [
                  "clause:3:token:2"
                ],
                "rule_refs": [
                  "NATIVE_FORBIDS"
                ]
              },
              {
                "relation_id": "p1:d394d120378224a6b4da7245",
                "clause_id": "clause:5",
                "relation_type": "AGENT",
                "head_node_id": "p1:00c60db12ccee968ea34ba91",
                "tail_node_id": "p1:3cfba2fb6a90ae4e9f6ecd34",
                "evidence_span_ids": [
                  "p1:389fc6806e332239f3a0a558",
                  "p1:3dc88c03831e32f9a8fc67ce",
                  "p1:a85ebf0b750986ebd6f278f6"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [
                  "clause:5:token:2",
                  "clause:5:token:1"
                ],
                "rule_refs": [
                  "NATIVE_AGENT"
                ]
              },
              {
                "relation_id": "p1:79a08469cd000a3ff52ee6f4",
                "clause_id": "clause:4",
                "relation_type": "AGENT",
                "head_node_id": "p1:3c21a1bf090fbc6ec5a038c3",
                "tail_node_id": "p1:ecd17316cc63a98d630af1d8",
                "evidence_span_ids": [
                  "p1:c5e695a4d3c696b147d967d9",
                  "p1:128b95de26c3a7705c96510e",
                  "p1:16c6c0a6d036213bdc5dc5e7"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [
                  "clause:4:token:2"
                ],
                "rule_refs": [
                  "NATIVE_AGENT"
                ]
              },
              {
                "relation_id": "p1:f763ba315058fb8aea451f0b",
                "clause_id": "clause:1",
                "relation_type": "AGENT",
                "head_node_id": "p1:55751628ba342c5905e06203",
                "tail_node_id": "p1:0a644412188024b2b0ff4db1",
                "evidence_span_ids": [
                  "p1:fd66e7077083782d8fc63cf9",
                  "p1:71bb1d16f0709043431028ea",
                  "p1:b6f9329b82cfe4bf264e6752"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [
                  "clause:1:token:1",
                  "clause:0:token:0"
                ],
                "rule_refs": [
                  "NATIVE_AGENT"
                ]
              },
              {
                "relation_id": "p1:f3a3ec29582ca92036ced2f9",
                "clause_id": "clause:2",
                "relation_type": "AGENT",
                "head_node_id": "p1:7be272d3f3a2df10061bef21",
                "tail_node_id": "p1:0a644412188024b2b0ff4db1",
                "evidence_span_ids": [
                  "p1:73e3c5ea188ca1c5d3a01a25",
                  "p1:71bb1d16f0709043431028ea",
                  "p1:7f0793aa43172b583c71aea5"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [
                  "clause:2:token:0",
                  "clause:0:token:0"
                ],
                "rule_refs": [
                  "NATIVE_AGENT"
                ]
              },
              {
                "relation_id": "p1:ee1f0ad948cdfe14a4c667a6",
                "clause_id": "clause:3",
                "relation_type": "AGENT",
                "head_node_id": "p1:5005d79d390f276a34b7caf4",
                "tail_node_id": "p1:0a644412188024b2b0ff4db1",
                "evidence_span_ids": [
                  "p1:0ac85b43b0dc6a80218e77f0",
                  "p1:71bb1d16f0709043431028ea",
                  "p1:f33c3a1c29e28002155201ca"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [
                  "clause:3:token:2",
                  "clause:0:token:0"
                ],
                "rule_refs": [
                  "NATIVE_AGENT"
                ]
              },
              {
                "relation_id": "p1:30f048f55c1175bd7c206c2d",
                "clause_id": "clause:1",
                "relation_type": "SCOPE_MEMBER",
                "head_node_id": "p1:55751628ba342c5905e06203",
                "tail_node_id": "p1:a017f65f2618791bc5728c63",
                "evidence_span_ids": [
                  "p1:fd66e7077083782d8fc63cf9",
                  "p1:9d123dd0da21f3490930ff89",
                  "p1:b6f9329b82cfe4bf264e6752"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [
                  "clause:1:token:1"
                ],
                "rule_refs": [
                  "NATIVE_SCOPE_MEMBER"
                ]
              }
            ],
            "set_expressions": [
              {
                "expr_id": "p1:82292b0e875921429a84e3ff",
                "kind": "ITEM",
                "entity_node_id": "p1:13b991f220929572e7a8b1fa",
                "source_span_ids": [
                  "p1:b0eccf72b3d1edf969c8f671"
                ],
                "relation_ids": [
                  "p1:7a1cf1efe8021d18c5f21cc7"
                ]
              },
              {
                "expr_id": "p1:41531131ef88c5f0e156cbc6",
                "kind": "ITEM",
                "entity_node_id": "p1:13b991f220929572e7a8b1fa",
                "source_span_ids": [
                  "p1:b0eccf72b3d1edf969c8f671"
                ],
                "relation_ids": [
                  "p1:89a7f7c1806e1f6bce40b78c"
                ]
              },
              {
                "expr_id": "p1:4ac8dd9472408c314bb27336",
                "kind": "ITEM",
                "entity_node_id": "p1:a017f65f2618791bc5728c63",
                "source_span_ids": [
                  "p1:9d123dd0da21f3490930ff89"
                ],
                "relation_ids": [
                  "p1:0fd472c5ca879d856e495479"
                ]
              },
              {
                "expr_id": "p1:b12999225efa8d7cefc8b8df",
                "kind": "ITEM",
                "entity_node_id": "p1:5e56145673653f1ee7f21e69",
                "source_span_ids": [
                  "p1:55ad616030ab5968a94ded69"
                ],
                "relation_ids": [
                  "p1:f93ea6ea733bc8fc9e674b73"
                ]
              },
              {
                "expr_id": "p1:f9cc48d78faa50dad8627855",
                "kind": "ITEM",
                "entity_node_id": "p1:a017f65f2618791bc5728c63",
                "source_span_ids": [
                  "p1:9d123dd0da21f3490930ff89"
                ],
                "relation_ids": [
                  "p1:30f048f55c1175bd7c206c2d"
                ]
              },
              {
                "expr_id": "p1:f5c4097140b3a14c789d8249",
                "kind": "ITEM",
                "entity_node_id": "p1:fc5bd600086ab6090e519d5c",
                "source_span_ids": [
                  "p1:816520f3f44f6ecce1fcffe1"
                ],
                "relation_ids": [
                  "p1:36ac3c5793dabb687e58d8be"
                ]
              }
            ]
          },
          "aggregates": [],
          "continuity": [],
          "call_bindings": [],
          "compositions": [],
          "after": {
            "nodes": [
              {
                "node_id": "p1:3ddbd3949281cbe0716e59ad",
                "node_type": "DISCOURSE",
                "surface": "张宁负责这项整理。请读取 input.csv，生成 report.md。不得修改 input.csv。report.md 已生成后，本任务完成。",
                "source_span_ids": [
                  "p1:571d80d40877f6505adf1d06"
                ],
                "state": "RESOLVED"
              },
              {
                "node_id": "p1:23c59e2354e7b39c3fb9b70d",
                "node_type": "EVENT",
                "surface": "这项整理",
                "source_span_ids": [
                  "p1:b0eccf72b3d1edf969c8f671"
                ],
                "state": "RESOLVED",
                "modality": "REQUIRED",
                "clause_id": "clause:0"
              },
              {
                "node_id": "p1:0a644412188024b2b0ff4db1",
                "node_type": "ENTITY",
                "surface": "张宁",
                "source_span_ids": [
                  "p1:71bb1d16f0709043431028ea"
                ],
                "state": "RESOLVED",
                "clause_id": "clause:0",
                "participant_eligibility": {
                  "eligible": true,
                  "reason": "PERSON_NER",
                  "source_span_ids": [
                    "p1:71bb1d16f0709043431028ea"
                  ],
                  "ner_evidence": [
                    {
                      "text": "张宁",
                      "start": 0,
                      "end": 2,
                      "label": "PERSON",
                      "span": {
                        "source_id": "source:37bc331b435432c551f3996cda23568886d94a11588ab75e1a7b75aa3073818c",
                        "start": 0,
                        "end": 2,
                        "quote": "张宁"
                      }
                    }
                  ],
                  "name_token_evidence": [
                    "clause:0:token:0"
                  ]
                }
              },
              {
                "node_id": "p1:13b991f220929572e7a8b1fa",
                "node_type": "ENTITY",
                "surface": "这项整理",
                "source_span_ids": [
                  "p1:b0eccf72b3d1edf969c8f671"
                ],
                "state": "RESOLVED",
                "clause_id": "clause:0",
                "participant_eligibility": {
                  "eligible": false,
                  "reason": "SRL_AGENT_IS_NOT_IDENTITY",
                  "source_span_ids": [
                    "p1:b0eccf72b3d1edf969c8f671"
                  ],
                  "ner_evidence": [],
                  "name_token_evidence": []
                }
              },
              {
                "node_id": "p1:a017f65f2618791bc5728c63",
                "node_type": "ENTITY",
                "surface": "input.csv",
                "source_span_ids": [
                  "p1:9d123dd0da21f3490930ff89"
                ],
                "state": "RESOLVED",
                "clause_id": "clause:1",
                "technical_type": "FILE",
                "participant_eligibility": {
                  "eligible": false,
                  "reason": "PROTECTED_TECHNICAL_TYPE_PRECEDES_NER",
                  "source_span_ids": [
                    "p1:9d123dd0da21f3490930ff89"
                  ]
                }
              },
              {
                "node_id": "p1:55751628ba342c5905e06203",
                "node_type": "EVENT",
                "surface": "读取",
                "source_span_ids": [
                  "p1:fd66e7077083782d8fc63cf9"
                ],
                "state": "RESOLVED",
                "modality": "REQUIRED",
                "clause_id": "clause:1"
              },
              {
                "node_id": "p1:fc5bd600086ab6090e519d5c",
                "node_type": "ENTITY",
                "surface": "report.md",
                "source_span_ids": [
                  "p1:816520f3f44f6ecce1fcffe1"
                ],
                "state": "RESOLVED",
                "clause_id": "clause:2",
                "technical_type": "ABSTRACT_DELIVERABLE",
                "participant_eligibility": {
                  "eligible": false,
                  "reason": "PROTECTED_TECHNICAL_TYPE_PRECEDES_NER",
                  "source_span_ids": [
                    "p1:816520f3f44f6ecce1fcffe1"
                  ]
                }
              },
              {
                "node_id": "p1:7be272d3f3a2df10061bef21",
                "node_type": "EVENT",
                "surface": "生成",
                "source_span_ids": [
                  "p1:73e3c5ea188ca1c5d3a01a25"
                ],
                "state": "RESOLVED",
                "modality": "REQUIRED",
                "clause_id": "clause:2"
              },
              {
                "node_id": "p1:5e56145673653f1ee7f21e69",
                "node_type": "ENTITY",
                "surface": "input.csv",
                "source_span_ids": [
                  "p1:55ad616030ab5968a94ded69"
                ],
                "state": "RESOLVED",
                "clause_id": "clause:3",
                "technical_type": "FILE",
                "participant_eligibility": {
                  "eligible": false,
                  "reason": "PROTECTED_TECHNICAL_TYPE_PRECEDES_NER",
                  "source_span_ids": [
                    "p1:55ad616030ab5968a94ded69"
                  ]
                }
              },
              {
                "node_id": "p1:5005d79d390f276a34b7caf4",
                "node_type": "EVENT",
                "surface": "修改",
                "source_span_ids": [
                  "p1:0ac85b43b0dc6a80218e77f0"
                ],
                "state": "RESOLVED",
                "modality": "FORBIDDEN",
                "clause_id": "clause:3"
              },
              {
                "node_id": "p1:ecd17316cc63a98d630af1d8",
                "node_type": "ENTITY",
                "surface": "report.md",
                "source_span_ids": [
                  "p1:128b95de26c3a7705c96510e"
                ],
                "state": "RESOLVED",
                "clause_id": "clause:4",
                "technical_type": "FILE",
                "participant_eligibility": {
                  "eligible": false,
                  "reason": "PROTECTED_TECHNICAL_TYPE_PRECEDES_NER",
                  "source_span_ids": [
                    "p1:128b95de26c3a7705c96510e"
                  ]
                }
              },
              {
                "node_id": "p1:00c60db12ccee968ea34ba91",
                "node_type": "EVENT",
                "surface": "完成",
                "source_span_ids": [
                  "p1:389fc6806e332239f3a0a558"
                ],
                "state": "RESOLVED",
                "modality": "UNSTATED",
                "clause_id": "clause:5"
              },
              {
                "node_id": "p1:3cfba2fb6a90ae4e9f6ecd34",
                "node_type": "ENTITY",
                "surface": "本任务",
                "source_span_ids": [
                  "p1:3dc88c03831e32f9a8fc67ce"
                ],
                "state": "RESOLVED",
                "clause_id": "clause:5",
                "participant_eligibility": {
                  "eligible": false,
                  "reason": "SRL_AGENT_IS_NOT_IDENTITY",
                  "source_span_ids": [
                    "p1:3dc88c03831e32f9a8fc67ce"
                  ],
                  "ner_evidence": [],
                  "name_token_evidence": []
                }
              },
              {
                "node_id": "p1:3c21a1bf090fbc6ec5a038c3",
                "node_type": "EVENT",
                "surface": "生成",
                "source_span_ids": [
                  "p1:c5e695a4d3c696b147d967d9"
                ],
                "state": "RESOLVED",
                "modality": "UNSTATED",
                "clause_id": "clause:4"
              },
              {
                "node_id": "p1:4ccdd8b53cd9e017cbb17dbb",
                "node_type": "EVENT",
                "surface": "负责",
                "source_span_ids": [
                  "p1:2cbc54e36db5ace4bf94cf39"
                ],
                "state": "RESOLVED",
                "modality": "UNSTATED",
                "clause_id": "clause:0"
              },
              {
                "node_id": "p1:a78bc4d47f94e06bd7c43b20",
                "node_type": "EVENT",
                "surface": "请",
                "source_span_ids": [
                  "p1:5843a93c9de7260207fbac4e"
                ],
                "state": "RESOLVED",
                "modality": "UNSTATED",
                "clause_id": "clause:1"
              }
            ],
            "relations": [
              {
                "relation_id": "p1:9a1356179ef6b0a998e369fb",
                "clause_id": "clause:0",
                "relation_type": "AGENT",
                "head_node_id": "p1:23c59e2354e7b39c3fb9b70d",
                "tail_node_id": "p1:0a644412188024b2b0ff4db1",
                "evidence_span_ids": [
                  "p1:b0eccf72b3d1edf969c8f671",
                  "p1:71bb1d16f0709043431028ea",
                  "p1:e157be95c430ae6af88e6a37"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [
                  "clause:0:token:4",
                  "clause:0:token:0"
                ],
                "rule_refs": [
                  "NATIVE_AGENT"
                ]
              },
              {
                "relation_id": "p1:7a1cf1efe8021d18c5f21cc7",
                "clause_id": "clause:0",
                "relation_type": "PATIENT",
                "head_node_id": "p1:23c59e2354e7b39c3fb9b70d",
                "tail_node_id": "p1:13b991f220929572e7a8b1fa",
                "evidence_span_ids": [
                  "p1:b0eccf72b3d1edf969c8f671",
                  "p1:e157be95c430ae6af88e6a37"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [
                  "clause:0:token:4"
                ],
                "rule_refs": [
                  "NATIVE_PATIENT"
                ]
              },
              {
                "relation_id": "p1:89a7f7c1806e1f6bce40b78c",
                "clause_id": "clause:0",
                "relation_type": "SCOPE_MEMBER",
                "head_node_id": "p1:3ddbd3949281cbe0716e59ad",
                "tail_node_id": "p1:13b991f220929572e7a8b1fa",
                "evidence_span_ids": [
                  "p1:571d80d40877f6505adf1d06",
                  "p1:b0eccf72b3d1edf969c8f671",
                  "p1:e157be95c430ae6af88e6a37"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [],
                "rule_refs": [
                  "NATIVE_SCOPE_MEMBER"
                ]
              },
              {
                "relation_id": "p1:0fd472c5ca879d856e495479",
                "clause_id": "clause:1",
                "relation_type": "PATIENT",
                "head_node_id": "p1:55751628ba342c5905e06203",
                "tail_node_id": "p1:a017f65f2618791bc5728c63",
                "evidence_span_ids": [
                  "p1:fd66e7077083782d8fc63cf9",
                  "p1:9d123dd0da21f3490930ff89",
                  "p1:b6f9329b82cfe4bf264e6752"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [
                  "clause:1:token:1"
                ],
                "rule_refs": [
                  "NATIVE_PATIENT"
                ]
              },
              {
                "relation_id": "p1:36ac3c5793dabb687e58d8be",
                "clause_id": "clause:2",
                "relation_type": "RESULT",
                "head_node_id": "p1:7be272d3f3a2df10061bef21",
                "tail_node_id": "p1:fc5bd600086ab6090e519d5c",
                "evidence_span_ids": [
                  "p1:73e3c5ea188ca1c5d3a01a25",
                  "p1:816520f3f44f6ecce1fcffe1",
                  "p1:7f0793aa43172b583c71aea5"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [
                  "clause:2:token:0"
                ],
                "rule_refs": [
                  "NATIVE_RESULT"
                ]
              },
              {
                "relation_id": "p1:f93ea6ea733bc8fc9e674b73",
                "clause_id": "clause:3",
                "relation_type": "FORBIDS",
                "head_node_id": "p1:5005d79d390f276a34b7caf4",
                "tail_node_id": "p1:5e56145673653f1ee7f21e69",
                "evidence_span_ids": [
                  "p1:0ac85b43b0dc6a80218e77f0",
                  "p1:55ad616030ab5968a94ded69",
                  "p1:f33c3a1c29e28002155201ca"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [
                  "clause:3:token:2"
                ],
                "rule_refs": [
                  "NATIVE_FORBIDS"
                ]
              },
              {
                "relation_id": "p1:d394d120378224a6b4da7245",
                "clause_id": "clause:5",
                "relation_type": "AGENT",
                "head_node_id": "p1:00c60db12ccee968ea34ba91",
                "tail_node_id": "p1:3cfba2fb6a90ae4e9f6ecd34",
                "evidence_span_ids": [
                  "p1:389fc6806e332239f3a0a558",
                  "p1:3dc88c03831e32f9a8fc67ce",
                  "p1:a85ebf0b750986ebd6f278f6"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [
                  "clause:5:token:2",
                  "clause:5:token:1"
                ],
                "rule_refs": [
                  "NATIVE_AGENT"
                ]
              },
              {
                "relation_id": "p1:79a08469cd000a3ff52ee6f4",
                "clause_id": "clause:4",
                "relation_type": "AGENT",
                "head_node_id": "p1:3c21a1bf090fbc6ec5a038c3",
                "tail_node_id": "p1:ecd17316cc63a98d630af1d8",
                "evidence_span_ids": [
                  "p1:c5e695a4d3c696b147d967d9",
                  "p1:128b95de26c3a7705c96510e",
                  "p1:16c6c0a6d036213bdc5dc5e7"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [
                  "clause:4:token:2"
                ],
                "rule_refs": [
                  "NATIVE_AGENT"
                ]
              },
              {
                "relation_id": "p1:f763ba315058fb8aea451f0b",
                "clause_id": "clause:1",
                "relation_type": "AGENT",
                "head_node_id": "p1:55751628ba342c5905e06203",
                "tail_node_id": "p1:0a644412188024b2b0ff4db1",
                "evidence_span_ids": [
                  "p1:fd66e7077083782d8fc63cf9",
                  "p1:71bb1d16f0709043431028ea",
                  "p1:b6f9329b82cfe4bf264e6752"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [
                  "clause:1:token:1",
                  "clause:0:token:0"
                ],
                "rule_refs": [
                  "NATIVE_AGENT"
                ]
              },
              {
                "relation_id": "p1:f3a3ec29582ca92036ced2f9",
                "clause_id": "clause:2",
                "relation_type": "AGENT",
                "head_node_id": "p1:7be272d3f3a2df10061bef21",
                "tail_node_id": "p1:0a644412188024b2b0ff4db1",
                "evidence_span_ids": [
                  "p1:73e3c5ea188ca1c5d3a01a25",
                  "p1:71bb1d16f0709043431028ea",
                  "p1:7f0793aa43172b583c71aea5"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [
                  "clause:2:token:0",
                  "clause:0:token:0"
                ],
                "rule_refs": [
                  "NATIVE_AGENT"
                ]
              },
              {
                "relation_id": "p1:ee1f0ad948cdfe14a4c667a6",
                "clause_id": "clause:3",
                "relation_type": "AGENT",
                "head_node_id": "p1:5005d79d390f276a34b7caf4",
                "tail_node_id": "p1:0a644412188024b2b0ff4db1",
                "evidence_span_ids": [
                  "p1:0ac85b43b0dc6a80218e77f0",
                  "p1:71bb1d16f0709043431028ea",
                  "p1:f33c3a1c29e28002155201ca"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [
                  "clause:3:token:2",
                  "clause:0:token:0"
                ],
                "rule_refs": [
                  "NATIVE_AGENT"
                ]
              },
              {
                "relation_id": "p1:30f048f55c1175bd7c206c2d",
                "clause_id": "clause:1",
                "relation_type": "SCOPE_MEMBER",
                "head_node_id": "p1:55751628ba342c5905e06203",
                "tail_node_id": "p1:a017f65f2618791bc5728c63",
                "evidence_span_ids": [
                  "p1:fd66e7077083782d8fc63cf9",
                  "p1:9d123dd0da21f3490930ff89",
                  "p1:b6f9329b82cfe4bf264e6752"
                ],
                "evidence_tier": "STRONG",
                "state": "RESOLVED",
                "model_signal_refs": [
                  "clause:1:token:1"
                ],
                "rule_refs": [
                  "NATIVE_SCOPE_MEMBER"
                ]
              }
            ],
            "set_expressions": [
              {
                "expr_id": "p1:82292b0e875921429a84e3ff",
                "kind": "ITEM",
                "entity_node_id": "p1:13b991f220929572e7a8b1fa",
                "source_span_ids": [
                  "p1:b0eccf72b3d1edf969c8f671"
                ],
                "relation_ids": [
                  "p1:7a1cf1efe8021d18c5f21cc7"
                ]
              },
              {
                "expr_id": "p1:41531131ef88c5f0e156cbc6",
                "kind": "ITEM",
                "entity_node_id": "p1:13b991f220929572e7a8b1fa",
                "source_span_ids": [
                  "p1:b0eccf72b3d1edf969c8f671"
                ],
                "relation_ids": [
                  "p1:89a7f7c1806e1f6bce40b78c"
                ]
              },
              {
                "expr_id": "p1:4ac8dd9472408c314bb27336",
                "kind": "ITEM",
                "entity_node_id": "p1:a017f65f2618791bc5728c63",
                "source_span_ids": [
                  "p1:9d123dd0da21f3490930ff89"
                ],
                "relation_ids": [
                  "p1:0fd472c5ca879d856e495479"
                ]
              },
              {
                "expr_id": "p1:b12999225efa8d7cefc8b8df",
                "kind": "ITEM",
                "entity_node_id": "p1:5e56145673653f1ee7f21e69",
                "source_span_ids": [
                  "p1:55ad616030ab5968a94ded69"
                ],
                "relation_ids": [
                  "p1:f93ea6ea733bc8fc9e674b73"
                ]
              },
              {
                "expr_id": "p1:f9cc48d78faa50dad8627855",
                "kind": "ITEM",
                "entity_node_id": "p1:a017f65f2618791bc5728c63",
                "source_span_ids": [
                  "p1:9d123dd0da21f3490930ff89"
                ],
                "relation_ids": [
                  "p1:30f048f55c1175bd7c206c2d"
                ]
              },
              {
                "expr_id": "p1:f5c4097140b3a14c789d8249",
                "kind": "ITEM",
                "entity_node_id": "p1:fc5bd600086ab6090e519d5c",
                "source_span_ids": [
                  "p1:816520f3f44f6ecce1fcffe1"
                ],
                "relation_ids": [
                  "p1:36ac3c5793dabb687e58d8be"
                ]
              }
            ]
          }
        },
        "declared_behavior": {
          "version": "7P-CLOSURE-008",
          "declarations": [],
          "bindings": [],
          "instantiations": [],
          "executed": false
        },
        "owned_test_contract": {
          "version": "7P-CLOSURE-008",
          "contracts": [],
          "unresolved": []
        },
        "instantiated_input_scope": {
          "decisions": []
        },
        "recipient_fields": {
          "fields": []
        },
        "qualified_identity": {
          "version": "7P-COMPOSITION-013-R2",
          "members": [],
          "protected": [
            {
              "node_id": "p1:a017f65f2618791bc5728c63",
              "source_literal_id": "literal:0",
              "source_span_ids": [
                "p1:9d123dd0da21f3490930ff89",
                "p1:b6f9329b82cfe4bf264e6752"
              ],
              "complete_protected_span": {
                "source_id": "source:37bc331b435432c551f3996cda23568886d94a11588ab75e1a7b75aa3073818c",
                "start": 13,
                "end": 22,
                "quote": "input.csv"
              },
              "semantic_owner_id": "p1:c04a6fcca8a88e2ce3052a12",
              "status": "CERTIFIED",
              "qualified_identity": "p1:d615e35ceaeffedb4a545766",
              "role_relation_ids": [
                "p1:0fd472c5ca879d856e495479",
                "p1:30f048f55c1175bd7c206c2d"
              ],
              "before_after": null,
              "lexical_role_projection": false
            },
            {
              "node_id": "p1:fc5bd600086ab6090e519d5c",
              "source_literal_id": "literal:1",
              "source_span_ids": [
                "p1:816520f3f44f6ecce1fcffe1",
                "p1:7f0793aa43172b583c71aea5"
              ],
              "complete_protected_span": {
                "source_id": "source:37bc331b435432c551f3996cda23568886d94a11588ab75e1a7b75aa3073818c",
                "start": 26,
                "end": 35,
                "quote": "report.md"
              },
              "semantic_owner_id": "p1:c04a6fcca8a88e2ce3052a12",
              "status": "CERTIFIED",
              "qualified_identity": "p1:e372a904338a20cbdfdfcb19",
              "role_relation_ids": [
                "p1:36ac3c5793dabb687e58d8be"
              ],
              "before_after": null,
              "lexical_role_projection": false
            },
            {
              "node_id": "p1:5e56145673653f1ee7f21e69",
              "source_literal_id": "literal:2",
              "source_span_ids": [
                "p1:55ad616030ab5968a94ded69",
                "p1:f33c3a1c29e28002155201ca"
              ],
              "complete_protected_span": {
                "source_id": "source:37bc331b435432c551f3996cda23568886d94a11588ab75e1a7b75aa3073818c",
                "start": 41,
                "end": 50,
                "quote": "input.csv"
              },
              "semantic_owner_id": "p1:c04a6fcca8a88e2ce3052a12",
              "status": "CERTIFIED",
              "qualified_identity": "p1:d615e35ceaeffedb4a545766",
              "role_relation_ids": [
                "p1:f93ea6ea733bc8fc9e674b73"
              ],
              "before_after": null,
              "lexical_role_projection": false
            },
            {
              "node_id": "p1:ecd17316cc63a98d630af1d8",
              "source_literal_id": "literal:3",
              "source_span_ids": [
                "p1:128b95de26c3a7705c96510e",
                "p1:16c6c0a6d036213bdc5dc5e7"
              ],
              "complete_protected_span": {
                "source_id": "source:37bc331b435432c551f3996cda23568886d94a11588ab75e1a7b75aa3073818c",
                "start": 51,
                "end": 60,
                "quote": "report.md"
              },
              "semantic_owner_id": "p1:c04a6fcca8a88e2ce3052a12",
              "status": "CERTIFIED",
              "qualified_identity": "p1:e372a904338a20cbdfdfcb19",
              "role_relation_ids": [],
              "before_after": null,
              "lexical_role_projection": false
            }
          ],
          "references": [],
          "consumed_before": "ELIGIBILITY"
        },
        "explicit_recipient": {
          "version": "7P-COMPOSITION-013-R3",
          "bindings": [],
          "nearest_person_fallback": false
        },
        "source_binding": {
          "version": "7P-COMPOSITION-013-R1",
          "referents": [
            {
              "mention_node_id": "p1:13b991f220929572e7a8b1fa",
              "status": "NOT_DEICTIC",
              "source_span_ids": [
                "p1:b0eccf72b3d1edf969c8f671",
                "p1:e157be95c430ae6af88e6a37"
              ]
            },
            {
              "mention_node_id": "p1:a017f65f2618791bc5728c63",
              "status": "NOT_DEICTIC",
              "source_span_ids": [
                "p1:9d123dd0da21f3490930ff89",
                "p1:b6f9329b82cfe4bf264e6752"
              ]
            },
            {
              "mention_node_id": "p1:5e56145673653f1ee7f21e69",
              "status": "NOT_DEICTIC",
              "source_span_ids": [
                "p1:55ad616030ab5968a94ded69",
                "p1:f33c3a1c29e28002155201ca"
              ]
            }
          ],
          "conditions": [
            {
              "predicate_node_id": "p1:5005d79d390f276a34b7caf4",
              "status": "CERTIFIED_UNCONDITIONAL",
              "prior_condition_expr_id": null,
              "candidate_state_node_ids": [],
              "attachment_paths": [],
              "candidate_evidence": [],
              "source_span_ids": [
                "p1:0ac85b43b0dc6a80218e77f0",
                "p1:f33c3a1c29e28002155201ca"
              ],
              "semantic_owner_id": "p1:c04a6fcca8a88e2ce3052a12"
            }
          ],
          "consumed_before": "ELIGIBILITY",
          "no_nearest_text_selection": true
        },
        "distributive_construction": {
          "version": "7P-COMPOSITION-014-R4",
          "frames": [],
          "consumed_before": "WHOLE_FRAME_CERTIFICATION"
        },
        "whole_composition": {
          "version": "7P-COMPOSITION-013-R4",
          "consumed_before": "ELIGIBILITY",
          "frames": [
            {
              "certificate_id": "p1:7d05497b1b09bf215904f320",
              "status": "CERTIFIED",
              "predicate_node_id": "p1:23c59e2354e7b39c3fb9b70d",
              "semantic_owner_id": "p1:c04a6fcca8a88e2ce3052a12",
              "owner_status": "UNIQUE",
              "predicate_layer": "MAIN",
              "syntactic_layer_id": "p1:0e41aeaeffc8210a3977f2e6",
              "modality": "REQUIRED",
              "argument_relation_ids": [
                "p1:9a1356179ef6b0a998e369fb",
                "p1:7a1cf1efe8021d18c5f21cc7"
              ],
              "participant_role_witnesses": [
                {
                  "relation_id": "p1:9a1356179ef6b0a998e369fb",
                  "node_id": "p1:0a644412188024b2b0ff4db1",
                  "roles": [
                    "PERFORMER"
                  ],
                  "identity_eligible": true
                }
              ],
              "member_node_ids": [],
              "scope_expr_id": "p1:82292b0e875921429a84e3ff",
              "condition_expr_id": null,
              "scope_member_ids": [
                "p1:13b991f220929572e7a8b1fa"
              ],
              "distribution": null,
              "output_owner_ids": [],
              "negative_evidence": [],
              "source_span_ids": [
                "p1:b0eccf72b3d1edf969c8f671",
                "p1:e157be95c430ae6af88e6a37",
                "p1:71bb1d16f0709043431028ea"
              ],
              "structural_path": [
                "document",
                "structure:0",
                "clause:0"
              ],
              "checks": {
                "unique_owner": true,
                "explicit_modality": true,
                "arguments_resolved": true,
                "predicate_provenance": true,
                "argument_provenance": true,
                "required_condition": true,
                "qualified_member_completeness": true,
                "distribution_if_explicit": true
              },
              "reasons": []
            },
            {
              "certificate_id": "p1:5e12a254cac90160dfa5439a",
              "status": "CERTIFIED",
              "predicate_node_id": "p1:55751628ba342c5905e06203",
              "semantic_owner_id": "p1:c04a6fcca8a88e2ce3052a12",
              "owner_status": "UNIQUE",
              "predicate_layer": "MAIN",
              "syntactic_layer_id": "p1:a6da896017ae3ee48122e5fa",
              "modality": "REQUIRED",
              "argument_relation_ids": [
                "p1:0fd472c5ca879d856e495479",
                "p1:f763ba315058fb8aea451f0b"
              ],
              "participant_role_witnesses": [
                {
                  "relation_id": "p1:f763ba315058fb8aea451f0b",
                  "node_id": "p1:0a644412188024b2b0ff4db1",
                  "roles": [
                    "PERFORMER"
                  ],
                  "identity_eligible": true
                }
              ],
              "member_node_ids": [],
              "scope_expr_id": "p1:4ac8dd9472408c314bb27336",
              "condition_expr_id": null,
              "scope_member_ids": [
                "p1:a017f65f2618791bc5728c63"
              ],
              "distribution": null,
              "output_owner_ids": [],
              "negative_evidence": [],
              "source_span_ids": [
                "p1:fd66e7077083782d8fc63cf9",
                "p1:b6f9329b82cfe4bf264e6752",
                "p1:9d123dd0da21f3490930ff89",
                "p1:71bb1d16f0709043431028ea"
              ],
              "structural_path": [
                "document",
                "structure:0",
                "clause:1"
              ],
              "checks": {
                "unique_owner": true,
                "explicit_modality": true,
                "arguments_resolved": true,
                "predicate_provenance": true,
                "argument_provenance": true,
                "required_condition": true,
                "qualified_member_completeness": true,
                "distribution_if_explicit": true
              },
              "reasons": []
            },
            {
              "certificate_id": "p1:abcd83f20b35182b3ec3ebcf",
              "status": "CERTIFIED",
              "predicate_node_id": "p1:7be272d3f3a2df10061bef21",
              "semantic_owner_id": "p1:c04a6fcca8a88e2ce3052a12",
              "owner_status": "UNIQUE",
              "predicate_layer": "MAIN",
              "syntactic_layer_id": "p1:a6da896017ae3ee48122e5fa",
              "modality": "REQUIRED",
              "argument_relation_ids": [
                "p1:36ac3c5793dabb687e58d8be",
                "p1:f3a3ec29582ca92036ced2f9"
              ],
              "participant_role_witnesses": [
                {
                  "relation_id": "p1:f3a3ec29582ca92036ced2f9",
                  "node_id": "p1:0a644412188024b2b0ff4db1",
                  "roles": [
                    "PERFORMER"
                  ],
                  "identity_eligible": true
                }
              ],
              "member_node_ids": [],
              "scope_expr_id": "p1:f5c4097140b3a14c789d8249",
              "condition_expr_id": null,
              "scope_member_ids": [
                "p1:fc5bd600086ab6090e519d5c"
              ],
              "distribution": null,
              "output_owner_ids": [],
              "negative_evidence": [],
              "source_span_ids": [
                "p1:73e3c5ea188ca1c5d3a01a25",
                "p1:7f0793aa43172b583c71aea5",
                "p1:816520f3f44f6ecce1fcffe1",
                "p1:71bb1d16f0709043431028ea"
              ],
              "structural_path": [
                "document",
                "structure:0",
                "clause:2"
              ],
              "checks": {
                "unique_owner": true,
                "explicit_modality": true,
                "arguments_resolved": true,
                "predicate_provenance": true,
                "argument_provenance": true,
                "required_condition": true,
                "qualified_member_completeness": true,
                "distribution_if_explicit": true
              },
              "reasons": []
            },
            {
              "certificate_id": "p1:fa8547165aa7046d24cfbb16",
              "status": "CERTIFIED",
              "predicate_node_id": "p1:5005d79d390f276a34b7caf4",
              "semantic_owner_id": "p1:c04a6fcca8a88e2ce3052a12",
              "owner_status": "UNIQUE",
              "predicate_layer": "MAIN",
              "syntactic_layer_id": "p1:97c9d7b5c58dd5b6ed9a4cd2",
              "modality": "FORBIDDEN",
              "argument_relation_ids": [
                "p1:ee1f0ad948cdfe14a4c667a6"
              ],
              "participant_role_witnesses": [
                {
                  "relation_id": "p1:ee1f0ad948cdfe14a4c667a6",
                  "node_id": "p1:0a644412188024b2b0ff4db1",
                  "roles": [
                    "PERFORMER"
                  ],
                  "identity_eligible": true
                }
              ],
              "member_node_ids": [],
              "scope_expr_id": "p1:b12999225efa8d7cefc8b8df",
              "condition_expr_id": null,
              "scope_member_ids": [
                "p1:5e56145673653f1ee7f21e69"
              ],
              "distribution": null,
              "output_owner_ids": [],
              "negative_evidence": [],
              "source_span_ids": [
                "p1:0ac85b43b0dc6a80218e77f0",
                "p1:f33c3a1c29e28002155201ca",
                "p1:71bb1d16f0709043431028ea"
              ],
              "structural_path": [
                "document",
                "structure:0",
                "clause:3"
              ],
              "checks": {
                "unique_owner": true,
                "explicit_modality": true,
                "arguments_resolved": true,
                "predicate_provenance": true,
                "argument_provenance": true,
                "required_condition": true,
                "qualified_member_completeness": true,
                "distribution_if_explicit": true
              },
              "reasons": []
            },
            {
              "certificate_id": "p1:8a3a9e742861cc2ac0b4d24b",
              "status": "PARTIAL",
              "predicate_node_id": "p1:00c60db12ccee968ea34ba91",
              "semantic_owner_id": "p1:c04a6fcca8a88e2ce3052a12",
              "owner_status": "UNIQUE",
              "predicate_layer": "MAIN",
              "syntactic_layer_id": "p1:e901b62daac62e628f4f901b",
              "modality": "UNSTATED",
              "argument_relation_ids": [
                "p1:d394d120378224a6b4da7245"
              ],
              "participant_role_witnesses": [
                {
                  "relation_id": "p1:d394d120378224a6b4da7245",
                  "node_id": "p1:3cfba2fb6a90ae4e9f6ecd34",
                  "roles": [],
                  "identity_eligible": false
                }
              ],
              "member_node_ids": [],
              "scope_expr_id": null,
              "condition_expr_id": null,
              "scope_member_ids": [],
              "distribution": null,
              "output_owner_ids": [],
              "negative_evidence": [],
              "source_span_ids": [
                "p1:389fc6806e332239f3a0a558",
                "p1:a85ebf0b750986ebd6f278f6",
                "p1:3dc88c03831e32f9a8fc67ce"
              ],
              "structural_path": [
                "document",
                "structure:0",
                "clause:5"
              ],
              "checks": {
                "unique_owner": true,
                "explicit_modality": false,
                "arguments_resolved": true,
                "predicate_provenance": true,
                "argument_provenance": true,
                "required_condition": false,
                "qualified_member_completeness": true,
                "distribution_if_explicit": true
              },
              "reasons": [
                "explicit_modality",
                "required_condition"
              ]
            },
            {
              "certificate_id": "p1:e5683d5d4d737bd38ab573ba",
              "status": "PARTIAL",
              "predicate_node_id": "p1:3c21a1bf090fbc6ec5a038c3",
              "semantic_owner_id": "p1:c04a6fcca8a88e2ce3052a12",
              "owner_status": "UNIQUE",
              "predicate_layer": "MAIN",
              "syntactic_layer_id": "p1:e901b62daac62e628f4f901b",
              "modality": "UNSTATED",
              "argument_relation_ids": [
                "p1:79a08469cd000a3ff52ee6f4"
              ],
              "participant_role_witnesses": [
                {
                  "relation_id": "p1:79a08469cd000a3ff52ee6f4",
                  "node_id": "p1:ecd17316cc63a98d630af1d8",
                  "roles": [],
                  "identity_eligible": false
                }
              ],
              "member_node_ids": [],
              "scope_expr_id": null,
              "condition_expr_id": null,
              "scope_member_ids": [],
              "distribution": null,
              "output_owner_ids": [],
              "negative_evidence": [],
              "source_span_ids": [
                "p1:c5e695a4d3c696b147d967d9",
                "p1:16c6c0a6d036213bdc5dc5e7",
                "p1:128b95de26c3a7705c96510e"
              ],
              "structural_path": [
                "document",
                "structure:0",
                "clause:4"
              ],
              "checks": {
                "unique_owner": true,
                "explicit_modality": false,
                "arguments_resolved": true,
                "predicate_provenance": true,
                "argument_provenance": true,
                "required_condition": true,
                "qualified_member_completeness": true,
                "distribution_if_explicit": true
              },
              "reasons": [
                "explicit_modality"
              ]
            },
            {
              "certificate_id": "p1:2571fcb725867ed0da8d25f1",
              "status": "PARTIAL",
              "predicate_node_id": "p1:4ccdd8b53cd9e017cbb17dbb",
              "semantic_owner_id": "p1:c04a6fcca8a88e2ce3052a12",
              "owner_status": "UNIQUE",
              "predicate_layer": "MAIN",
              "syntactic_layer_id": "p1:0e41aeaeffc8210a3977f2e6",
              "modality": "UNSTATED",
              "argument_relation_ids": [],
              "participant_role_witnesses": [],
              "member_node_ids": [],
              "scope_expr_id": null,
              "condition_expr_id": null,
              "scope_member_ids": [],
              "distribution": null,
              "output_owner_ids": [],
              "negative_evidence": [],
              "source_span_ids": [
                "p1:2cbc54e36db5ace4bf94cf39",
                "p1:e157be95c430ae6af88e6a37"
              ],
              "structural_path": [
                "document",
                "structure:0",
                "clause:0"
              ],
              "checks": {
                "unique_owner": true,
                "explicit_modality": false,
                "arguments_resolved": false,
                "predicate_provenance": true,
                "argument_provenance": true,
                "required_condition": true,
                "qualified_member_completeness": true,
                "distribution_if_explicit": true
              },
              "reasons": [
                "explicit_modality",
                "arguments_resolved"
              ]
            },
            {
              "certificate_id": "p1:b33306999d4384073a44ab28",
              "status": "PARTIAL",
              "predicate_node_id": "p1:a78bc4d47f94e06bd7c43b20",
              "semantic_owner_id": "p1:c04a6fcca8a88e2ce3052a12",
              "owner_status": "UNIQUE",
              "predicate_layer": "MAIN",
              "syntactic_layer_id": "p1:a6da896017ae3ee48122e5fa",
              "modality": "UNSTATED",
              "argument_relation_ids": [],
              "participant_role_witnesses": [],
              "member_node_ids": [],
              "scope_expr_id": null,
              "condition_expr_id": null,
              "scope_member_ids": [],
              "distribution": null,
              "output_owner_ids": [],
              "negative_evidence": [],
              "source_span_ids": [
                "p1:5843a93c9de7260207fbac4e",
                "p1:b6f9329b82cfe4bf264e6752"
              ],
              "structural_path": [
                "document",
                "structure:0",
                "clause:1"
              ],
              "checks": {
                "unique_owner": true,
                "explicit_modality": false,
                "arguments_resolved": false,
                "predicate_provenance": true,
                "argument_provenance": true,
                "required_condition": true,
                "qualified_member_completeness": true,
                "distribution_if_explicit": true
              },
              "reasons": [
                "explicit_modality",
                "arguments_resolved"
              ]
            }
          ]
        },
        "short_direct": {
          "version": "SHORT_DIRECT_016",
          "assignments": [
            {
              "actor_node_id": "p1:664c7119ec8c17c7363d4a2d",
              "state_node_id": "p1:2de8e54fcb2f544ce2f6d95d",
              "target_node_id": "p1:3ddbd3949281cbe0716e59ad",
              "source_span_ids": [
                "p1:e157be95c430ae6af88e6a37"
              ],
              "ner_evidence": {
                "label": "PROPER_NAME_SUBJECT",
                "span": {
                  "start": 0,
                  "end": 2
                },
                "token_id": "clause:0:token:0"
              },
              "structural_path": [
                "document"
              ]
            }
          ],
          "state_bindings": [
            {
              "event_node_id": "p1:00c60db12ccee968ea34ba91",
              "state_node_id": "p1:2b1849abc7e29105eb70b977",
              "object_node_ids": [
                "p1:fc5bd600086ab6090e519d5c"
              ],
              "condition_expr_id": "p1:734876c82818752bf57d56d9",
              "relation_ids": [
                "p1:9a7186b2ce7dc7f94f019028",
                "p1:846306081530b2461ab45f14"
              ],
              "source_span_ids": [
                "p1:a85ebf0b750986ebd6f278f6",
                "p1:16c6c0a6d036213bdc5dc5e7"
              ],
              "rule": "EXPLICIT_SENTENCE_COMPLETION_STATE"
            }
          ],
          "arbitration": [
            {
              "event_node_id": "p1:23c59e2354e7b39c3fb9b70d",
              "relation_ids": [
                "p1:9a1356179ef6b0a998e369fb",
                "p1:7a1cf1efe8021d18c5f21cc7"
              ],
              "reason": "TASK_REFERENCE_IS_ASSIGNMENT_NOT_EXECUTION",
              "source_span_ids": [
                "p1:b0eccf72b3d1edf969c8f671",
                "p1:e157be95c430ae6af88e6a37"
              ]
            },
            {
              "relation_id": "p1:89a7f7c1806e1f6bce40b78c",
              "reason": "ASSIGNMENT_TARGET_NOT_INPUT",
              "source_span_ids": [
                "p1:571d80d40877f6505adf1d06",
                "p1:b0eccf72b3d1edf969c8f671",
                "p1:e157be95c430ae6af88e6a37"
              ]
            },
            {
              "event_node_id": "p1:a78bc4d47f94e06bd7c43b20",
              "relation_ids": [],
              "reason": "POLITE_DIRECTIVE_OPERATOR",
              "source_span_ids": [
                "p1:5843a93c9de7260207fbac4e",
                "p1:b6f9329b82cfe4bf264e6752"
              ]
            },
            {
              "event_node_id": "p1:3c21a1bf090fbc6ec5a038c3",
              "relation_ids": [
                "p1:79a08469cd000a3ff52ee6f4"
              ],
              "reason": "PERFECTIVE_OUTPUT_STATE_NOT_NEW_ACTION",
              "source_span_ids": [
                "p1:c5e695a4d3c696b147d967d9",
                "p1:16c6c0a6d036213bdc5dc5e7"
              ]
            }
          ]
        },
        "short_refinement_content": {
          "version": "SHORT_DIRECT_REFINEMENT_CONTENT_R1",
          "refinements": [],
          "content": [],
          "completion": [],
          "refusals": []
        },
        "unresolved": [],
        "scope_consistency": {
          "status": "PASS",
          "checked_facts": 5,
          "checks": [
            "SCOPE_OBJECT_IN_FACT",
            "SCOPE_RELATION_IN_FACT",
            "SCOPE_RELATION_ENDPOINT_MATCH"
          ],
          "facts": [
            {
              "boundary_fact_id": "p1:25db7909b655b127c94ac52e",
              "fact_type": "DELIVERABLE",
              "state": "RESOLVED",
              "objects": [
                {
                  "node_id": "p1:fc5bd600086ab6090e519d5c",
                  "text": "report.md"
                }
              ],
              "relation_ids": [
                "p1:36ac3c5793dabb687e58d8be",
                "p1:f3a3ec29582ca92036ced2f9"
              ],
              "scope_expr_id": "p1:ec6cf92172ddb7f1685df2f5",
              "scope_objects": [
                {
                  "node_id": "p1:fc5bd600086ab6090e519d5c",
                  "text": "report.md"
                }
              ],
              "structural_path": [
                {
                  "expr_id": "p1:ec6cf92172ddb7f1685df2f5",
                  "kind": "ITEM",
                  "entity_node_id": "p1:fc5bd600086ab6090e519d5c",
                  "source_span_ids": [
                    "p1:816520f3f44f6ecce1fcffe1",
                    "p1:7f0793aa43172b583c71aea5"
                  ],
                  "relation_ids": [
                    "p1:36ac3c5793dabb687e58d8be"
                  ]
                }
              ],
              "errors": [],
              "pass": true
            },
            {
              "boundary_fact_id": "p1:6850d7497fe2fda8ada15473",
              "fact_type": "TASK_OBJECT",
              "state": "RESOLVED",
              "objects": [
                {
                  "node_id": "p1:a017f65f2618791bc5728c63",
                  "text": "input.csv"
                }
              ],
              "relation_ids": [
                "p1:30f048f55c1175bd7c206c2d"
              ],
              "scope_expr_id": "p1:f9cc48d78faa50dad8627855",
              "scope_objects": [
                {
                  "node_id": "p1:a017f65f2618791bc5728c63",
                  "text": "input.csv"
                }
              ],
              "structural_path": [
                {
                  "expr_id": "p1:f9cc48d78faa50dad8627855",
                  "kind": "ITEM",
                  "entity_node_id": "p1:a017f65f2618791bc5728c63",
                  "source_span_ids": [
                    "p1:9d123dd0da21f3490930ff89",
                    "p1:b6f9329b82cfe4bf264e6752"
                  ],
                  "relation_ids": [
                    "p1:30f048f55c1175bd7c206c2d"
                  ]
                }
              ],
              "errors": [],
              "pass": true
            },
            {
              "boundary_fact_id": "p1:a25d81dda7c37a90aef2737f",
              "fact_type": "ACTION",
              "state": "RESOLVED",
              "objects": [
                {
                  "node_id": "p1:a017f65f2618791bc5728c63",
                  "text": "input.csv"
                }
              ],
              "relation_ids": [
                "p1:0fd472c5ca879d856e495479",
                "p1:f763ba315058fb8aea451f0b",
                "p1:30f048f55c1175bd7c206c2d"
              ],
              "scope_expr_id": "p1:4ac8dd9472408c314bb27336",
              "scope_objects": [
                {
                  "node_id": "p1:a017f65f2618791bc5728c63",
                  "text": "input.csv"
                }
              ],
              "structural_path": [
                {
                  "expr_id": "p1:4ac8dd9472408c314bb27336",
                  "kind": "ITEM",
                  "entity_node_id": "p1:a017f65f2618791bc5728c63",
                  "source_span_ids": [
                    "p1:9d123dd0da21f3490930ff89",
                    "p1:b6f9329b82cfe4bf264e6752"
                  ],
                  "relation_ids": [
                    "p1:0fd472c5ca879d856e495479"
                  ]
                }
              ],
              "errors": [],
              "pass": true
            },
            {
              "boundary_fact_id": "p1:d0fc1fc6620b810553765d1b",
              "fact_type": "ACTION",
              "state": "RESOLVED",
              "objects": [
                {
                  "node_id": "p1:fc5bd600086ab6090e519d5c",
                  "text": "report.md"
                }
              ],
              "relation_ids": [
                "p1:36ac3c5793dabb687e58d8be",
                "p1:f3a3ec29582ca92036ced2f9"
              ],
              "scope_expr_id": "p1:ec6cf92172ddb7f1685df2f5",
              "scope_objects": [
                {
                  "node_id": "p1:fc5bd600086ab6090e519d5c",
                  "text": "report.md"
                }
              ],
              "structural_path": [
                {
                  "expr_id": "p1:ec6cf92172ddb7f1685df2f5",
                  "kind": "ITEM",
                  "entity_node_id": "p1:fc5bd600086ab6090e519d5c",
                  "source_span_ids": [
                    "p1:816520f3f44f6ecce1fcffe1",
                    "p1:7f0793aa43172b583c71aea5"
                  ],
                  "relation_ids": [
                    "p1:36ac3c5793dabb687e58d8be"
                  ]
                }
              ],
              "errors": [],
              "pass": true
            },
            {
              "boundary_fact_id": "p1:7906742ddcd0ef3266fba15a",
              "fact_type": "FORBID",
              "state": "RESOLVED",
              "objects": [
                {
                  "node_id": "p1:5e56145673653f1ee7f21e69",
                  "text": "input.csv"
                }
              ],
              "relation_ids": [
                "p1:f93ea6ea733bc8fc9e674b73",
                "p1:ee1f0ad948cdfe14a4c667a6"
              ],
              "scope_expr_id": "p1:b12999225efa8d7cefc8b8df",
              "scope_objects": [
                {
                  "node_id": "p1:5e56145673653f1ee7f21e69",
                  "text": "input.csv"
                }
              ],
              "structural_path": [
                {
                  "expr_id": "p1:b12999225efa8d7cefc8b8df",
                  "kind": "ITEM",
                  "entity_node_id": "p1:5e56145673653f1ee7f21e69",
                  "source_span_ids": [
                    "p1:55ad616030ab5968a94ded69",
                    "p1:f33c3a1c29e28002155201ca"
                  ],
                  "relation_ids": [
                    "p1:f93ea6ea733bc8fc9e674b73"
                  ]
                }
              ],
              "errors": [],
              "pass": true
            }
          ]
        }
      }
    },
    "span_lattice": {
      "source_id": "source:37bc331b435432c551f3996cda23568886d94a11588ab75e1a7b75aa3073818c",
      "candidates": [
        {
          "span_candidate_id": "p1:1c388d1b80a2568156708012",
          "source_span_id": "p1:571d80d40877f6505adf1d06",
          "candidate_type": "DISCOURSE",
          "status": "SELECTED",
          "evidence_tier": "STRONG",
          "provider_refs": [
            "NATIVE_TYPED_SYNTAX"
          ],
          "diagnostic_refs": []
        },
        {
          "span_candidate_id": "p1:208756d9d29537419991e5a3",
          "source_span_id": "p1:b0eccf72b3d1edf969c8f671",
          "candidate_type": "EVENT",
          "status": "SELECTED",
          "evidence_tier": "STRONG",
          "provider_refs": [
            "clause:0:token:4",
            "NATIVE_TYPED_SYNTAX"
          ],
          "diagnostic_refs": []
        },
        {
          "span_candidate_id": "p1:dfa8728eea3e2566c0f9020c",
          "source_span_id": "p1:71bb1d16f0709043431028ea",
          "candidate_type": "ENTITY",
          "status": "SELECTED",
          "evidence_tier": "STRONG",
          "provider_refs": [
            "clause:0:token:0",
            "NATIVE_TYPED_SYNTAX"
          ],
          "diagnostic_refs": []
        },
        {
          "span_candidate_id": "p1:79fc75eebe531d5c7565230f",
          "source_span_id": "p1:b0eccf72b3d1edf969c8f671",
          "candidate_type": "ENTITY",
          "status": "SELECTED",
          "evidence_tier": "STRONG",
          "provider_refs": [
            "NATIVE_TYPED_SYNTAX"
          ],
          "diagnostic_refs": []
        },
        {
          "span_candidate_id": "p1:fd5de1d13f7ce7e405c891e0",
          "source_span_id": "p1:9d123dd0da21f3490930ff89",
          "candidate_type": "ENTITY",
          "status": "SELECTED",
          "evidence_tier": "STRONG",
          "provider_refs": [
            "literal:0",
            "NATIVE_TYPED_SYNTAX"
          ],
          "diagnostic_refs": [],
          "literal_tag": "FILEPATH"
        },
        {
          "span_candidate_id": "p1:59b77956e0d62720a911909e",
          "source_span_id": "p1:fd66e7077083782d8fc63cf9",
          "candidate_type": "EVENT",
          "status": "SELECTED",
          "evidence_tier": "STRONG",
          "provider_refs": [
            "clause:1:token:1",
            "NATIVE_TYPED_SYNTAX"
          ],
          "diagnostic_refs": []
        },
        {
          "span_candidate_id": "p1:4cf3441fea973e2495d38115",
          "source_span_id": "p1:816520f3f44f6ecce1fcffe1",
          "candidate_type": "ENTITY",
          "status": "SELECTED",
          "evidence_tier": "STRONG",
          "provider_refs": [
            "literal:1",
            "NATIVE_TYPED_SYNTAX"
          ],
          "diagnostic_refs": [],
          "literal_tag": "FILEPATH"
        },
        {
          "span_candidate_id": "p1:d51f441771106eae1bbfffa8",
          "source_span_id": "p1:73e3c5ea188ca1c5d3a01a25",
          "candidate_type": "EVENT",
          "status": "SELECTED",
          "evidence_tier": "STRONG",
          "provider_refs": [
            "clause:2:token:0",
            "NATIVE_TYPED_SYNTAX"
          ],
          "diagnostic_refs": []
        },
        {
          "span_candidate_id": "p1:77ca9aaa63a8a4dcafc896f6",
          "source_span_id": "p1:55ad616030ab5968a94ded69",
          "candidate_type": "ENTITY",
          "status": "SELECTED",
          "evidence_tier": "STRONG",
          "provider_refs": [
            "literal:2",
            "NATIVE_TYPED_SYNTAX"
          ],
          "diagnostic_refs": [],
          "literal_tag": "FILEPATH"
        },
        {
          "span_candidate_id": "p1:410e433fc2eef4d829dd1c70",
          "source_span_id": "p1:0ac85b43b0dc6a80218e77f0",
          "candidate_type": "EVENT",
          "status": "SELECTED",
          "evidence_tier": "STRONG",
          "provider_refs": [
            "clause:3:token:2",
            "NATIVE_TYPED_SYNTAX"
          ],
          "diagnostic_refs": []
        },
        {
          "span_candidate_id": "p1:0a4fbc9128652b3d974c3614",
          "source_span_id": "p1:128b95de26c3a7705c96510e",
          "candidate_type": "ENTITY",
          "status": "SELECTED",
          "evidence_tier": "STRONG",
          "provider_refs": [
            "literal:3",
            "NATIVE_TYPED_SYNTAX"
          ],
          "diagnostic_refs": [],
          "literal_tag": "FILEPATH"
        },
        {
          "span_candidate_id": "p1:439387f56981d932a29d2a41",
          "source_span_id": "p1:389fc6806e332239f3a0a558",
          "candidate_type": "EVENT",
          "status": "SELECTED",
          "evidence_tier": "STRONG",
          "provider_refs": [
            "clause:5:token:2",
            "NATIVE_TYPED_SYNTAX"
          ],
          "diagnostic_refs": []
        },
        {
          "span_candidate_id": "p1:cf99caa33f0dd110398d0b22",
          "source_span_id": "p1:3dc88c03831e32f9a8fc67ce",
          "candidate_type": "ENTITY",
          "status": "SELECTED",
          "evidence_tier": "STRONG",
          "provider_refs": [
            "clause:5:token:1",
            "NATIVE_TYPED_SYNTAX"
          ],
          "diagnostic_refs": []
        },
        {
          "span_candidate_id": "p1:dd17a48357c1608df55c5fd8",
          "source_span_id": "p1:c5e695a4d3c696b147d967d9",
          "candidate_type": "EVENT",
          "status": "SELECTED",
          "evidence_tier": "STRONG",
          "provider_refs": [
            "clause:4:token:2",
            "NATIVE_TYPED_SYNTAX"
          ],
          "diagnostic_refs": []
        },
        {
          "span_candidate_id": "p1:c99c87fec5c4a0d23d080aae",
          "source_span_id": "p1:2cbc54e36db5ace4bf94cf39",
          "candidate_type": "EVENT",
          "status": "SELECTED",
          "evidence_tier": "STRONG",
          "provider_refs": [
            "clause:0:token:1",
            "NATIVE_TYPED_SYNTAX"
          ],
          "diagnostic_refs": []
        },
        {
          "span_candidate_id": "p1:cd4dfa2adda38b3b7b09867a",
          "source_span_id": "p1:5843a93c9de7260207fbac4e",
          "candidate_type": "EVENT",
          "status": "SELECTED",
          "evidence_tier": "STRONG",
          "provider_refs": [
            "clause:1:token:0",
            "NATIVE_TYPED_SYNTAX"
          ],
          "diagnostic_refs": []
        },
        {
          "span_candidate_id": "p1:c931f7d2fa853016d8cf4f6a",
          "source_span_id": "p1:e157be95c430ae6af88e6a37",
          "candidate_type": "DISCOURSE",
          "status": "SELECTED",
          "evidence_tier": "STRONG",
          "provider_refs": [
            "EXPLICIT_OWNING_CLAUSE"
          ],
          "diagnostic_refs": []
        },
        {
          "span_candidate_id": "p1:1ac51b0aa22c5c2e18d8354b",
          "source_span_id": "p1:e157be95c430ae6af88e6a37",
          "candidate_type": "DISCOURSE",
          "status": "SELECTED",
          "evidence_tier": "STRONG",
          "provider_refs": [
            "EXPLICIT_OWNING_CLAUSE"
          ],
          "diagnostic_refs": []
        },
        {
          "span_candidate_id": "p1:1e97721075f8b2cf8d71be92",
          "source_span_id": "p1:e157be95c430ae6af88e6a37",
          "candidate_type": "DISCOURSE",
          "status": "SELECTED",
          "evidence_tier": "STRONG",
          "provider_refs": [
            "EXPLICIT_OWNING_CLAUSE"
          ],
          "diagnostic_refs": []
        },
        {
          "span_candidate_id": "p1:b7d066b3d6b96b7527c7d399",
          "source_span_id": "p1:b6f9329b82cfe4bf264e6752",
          "candidate_type": "DISCOURSE",
          "status": "SELECTED",
          "evidence_tier": "STRONG",
          "provider_refs": [
            "EXPLICIT_OWNING_CLAUSE"
          ],
          "diagnostic_refs": []
        },
        {
          "span_candidate_id": "p1:cb022639d16f2617c1301f57",
          "source_span_id": "p1:b6f9329b82cfe4bf264e6752",
          "candidate_type": "DISCOURSE",
          "status": "SELECTED",
          "evidence_tier": "STRONG",
          "provider_refs": [
            "EXPLICIT_OWNING_CLAUSE"
          ],
          "diagnostic_refs": []
        },
        {
          "span_candidate_id": "p1:31b6605152a30f3b87611217",
          "source_span_id": "p1:7f0793aa43172b583c71aea5",
          "candidate_type": "DISCOURSE",
          "status": "SELECTED",
          "evidence_tier": "STRONG",
          "provider_refs": [
            "EXPLICIT_OWNING_CLAUSE"
          ],
          "diagnostic_refs": []
        },
        {
          "span_candidate_id": "p1:beaaec44da38258874dccbba",
          "source_span_id": "p1:7f0793aa43172b583c71aea5",
          "candidate_type": "DISCOURSE",
          "status": "SELECTED",
          "evidence_tier": "STRONG",
          "provider_refs": [
            "EXPLICIT_OWNING_CLAUSE"
          ],
          "diagnostic_refs": []
        },
        {
          "span_candidate_id": "p1:b319ed089efe6d489d225be3",
          "source_span_id": "p1:f33c3a1c29e28002155201ca",
          "candidate_type": "DISCOURSE",
          "status": "SELECTED",
          "evidence_tier": "STRONG",
          "provider_refs": [
            "EXPLICIT_OWNING_CLAUSE"
          ],
          "diagnostic_refs": []
        },
        {
          "span_candidate_id": "p1:7ba98a089fa9612c56c42537",
          "source_span_id": "p1:f33c3a1c29e28002155201ca",
          "candidate_type": "DISCOURSE",
          "status": "SELECTED",
          "evidence_tier": "STRONG",
          "provider_refs": [
            "EXPLICIT_OWNING_CLAUSE"
          ],
          "diagnostic_refs": []
        },
        {
          "span_candidate_id": "p1:4a166adac0be1958b55ce399",
          "source_span_id": "p1:16c6c0a6d036213bdc5dc5e7",
          "candidate_type": "DISCOURSE",
          "status": "SELECTED",
          "evidence_tier": "STRONG",
          "provider_refs": [
            "EXPLICIT_OWNING_CLAUSE"
          ],
          "diagnostic_refs": []
        },
        {
          "span_candidate_id": "p1:50d2550516d640b78be35f54",
          "source_span_id": "p1:a85ebf0b750986ebd6f278f6",
          "candidate_type": "DISCOURSE",
          "status": "SELECTED",
          "evidence_tier": "STRONG",
          "provider_refs": [
            "EXPLICIT_OWNING_CLAUSE"
          ],
          "diagnostic_refs": []
        },
        {
          "span_candidate_id": "p1:f394713ca1cace498dd6764e",
          "source_span_id": "p1:a85ebf0b750986ebd6f278f6",
          "candidate_type": "DISCOURSE",
          "status": "SELECTED",
          "evidence_tier": "STRONG",
          "provider_refs": [
            "EXPLICIT_OWNING_CLAUSE"
          ],
          "diagnostic_refs": []
        },
        {
          "span_candidate_id": "p1:bf0591c9dc865c19d70065bf",
          "source_span_id": "p1:16c6c0a6d036213bdc5dc5e7",
          "candidate_type": "DISCOURSE",
          "status": "SELECTED",
          "evidence_tier": "STRONG",
          "provider_refs": [
            "EXPLICIT_OWNING_CLAUSE"
          ],
          "diagnostic_refs": []
        },
        {
          "span_candidate_id": "p1:3898c10dfe4f7fb8e0ca5ae6",
          "source_span_id": "p1:e157be95c430ae6af88e6a37",
          "candidate_type": "DISCOURSE",
          "status": "SELECTED",
          "evidence_tier": "STRONG",
          "provider_refs": [
            "EXPLICIT_OWNING_CLAUSE"
          ],
          "diagnostic_refs": []
        },
        {
          "span_candidate_id": "p1:ccc750213575e50e7076a378",
          "source_span_id": "p1:b6f9329b82cfe4bf264e6752",
          "candidate_type": "DISCOURSE",
          "status": "SELECTED",
          "evidence_tier": "STRONG",
          "provider_refs": [
            "EXPLICIT_OWNING_CLAUSE"
          ],
          "diagnostic_refs": []
        },
        {
          "span_candidate_id": "p1:9312d4eaba5f8b7364c270ae",
          "source_span_id": "p1:71bb1d16f0709043431028ea",
          "candidate_type": "ENTITY",
          "status": "SELECTED",
          "evidence_tier": "STRONG",
          "provider_refs": [
            "NATIVE_TYPED_SYNTAX"
          ],
          "diagnostic_refs": [],
          "literal_tag": "PERSON"
        },
        {
          "span_candidate_id": "p1:336ae386f96589816ed4e584",
          "source_span_id": "p1:2cbc54e36db5ace4bf94cf39",
          "candidate_type": "STATE",
          "status": "SELECTED",
          "evidence_tier": "STRONG",
          "provider_refs": [
            "NATIVE_TYPED_SYNTAX"
          ],
          "diagnostic_refs": []
        },
        {
          "span_candidate_id": "p1:a4be8c687518396866debda4",
          "source_span_id": "p1:5e3b5ab04595aef88e78c85c",
          "candidate_type": "STATE",
          "status": "SELECTED",
          "evidence_tier": "STRONG",
          "provider_refs": [
            "NATIVE_TYPED_SYNTAX"
          ],
          "diagnostic_refs": []
        },
        {
          "span_candidate_id": "p1:586703912ca02869ed1d19f0",
          "source_span_id": "p1:e157be95c430ae6af88e6a37",
          "candidate_type": "DISCOURSE",
          "status": "SELECTED",
          "evidence_tier": "STRONG",
          "provider_refs": [
            "EXPLICIT_OWNING_CLAUSE"
          ],
          "diagnostic_refs": []
        },
        {
          "span_candidate_id": "p1:e252a4f9214f46431bebd259",
          "source_span_id": "p1:e157be95c430ae6af88e6a37",
          "candidate_type": "DISCOURSE",
          "status": "SELECTED",
          "evidence_tier": "STRONG",
          "provider_refs": [
            "EXPLICIT_OWNING_CLAUSE"
          ],
          "diagnostic_refs": []
        },
        {
          "span_candidate_id": "p1:dbea13331754fe10c5353e95",
          "source_span_id": "p1:16c6c0a6d036213bdc5dc5e7",
          "candidate_type": "DISCOURSE",
          "status": "SELECTED",
          "evidence_tier": "STRONG",
          "provider_refs": [
            "EXPLICIT_OWNING_CLAUSE"
          ],
          "diagnostic_refs": []
        }
      ],
      "edges": []
    },
    "semantic_nodes": [
      {
        "node_id": "p1:3ddbd3949281cbe0716e59ad",
        "node_type": "DISCOURSE",
        "surface": "张宁负责这项整理。请读取 input.csv，生成 report.md。不得修改 input.csv。report.md 已生成后，本任务完成。",
        "normalized": "TASK",
        "span_candidate_ids": [
          "p1:1c388d1b80a2568156708012"
        ],
        "source_span_ids": [
          "p1:571d80d40877f6505adf1d06"
        ],
        "evidence_tier": "STRONG",
        "state": "RESOLVED",
        "metadata": {
          "sense": "TASK",
          "owner": "p1:a23a882789941e922991741b",
          "producer": "NATIVE_FRONTEND",
          "semantic_ownership": {
            "node_id": "p1:3ddbd3949281cbe0716e59ad",
            "status": "UNIQUE",
            "semantic_owner_id": "p1:c04a6fcca8a88e2ce3052a12",
            "owner_category": "CURRENT_TASK_ROOT",
            "predicate_layer": "MAIN",
            "syntactic_layer_id": "p1:edfb0fd1d9c6e2bd7c657938",
            "owning_proposition_id": "DOCUMENT",
            "discourse_domain": "CURRENT_TASK",
            "structural_parent_path": [
              "document"
            ],
            "attachment_path": [
              "document"
            ],
            "owner_output_ids": [],
            "ownership_relation_ids": [],
            "source_span_ids": [
              "p1:571d80d40877f6505adf1d06"
            ],
            "inheritance_override_proof": [
              {
                "rank": 1,
                "rule": "EXPLICIT_STRUCTURE_PATH",
                "structural_path": [
                  "document"
                ],
                "source_span_ids": [
                  "p1:571d80d40877f6505adf1d06"
                ]
              }
            ],
            "negative_ownership_evidence": []
          }
        }
      },
      {
        "node_id": "p1:23c59e2354e7b39c3fb9b70d",
        "node_type": "EVENT",
        "surface": "这项整理",
        "normalized": "SOURCE_EVENT",
        "span_candidate_ids": [
          "p1:208756d9d29537419991e5a3",
          "p1:c931f7d2fa853016d8cf4f6a"
        ],
        "source_span_ids": [
          "p1:b0eccf72b3d1edf969c8f671",
          "p1:e157be95c430ae6af88e6a37"
        ],
        "evidence_tier": "STRONG",
        "state": "RESOLVED",
        "metadata": {
          "sense": "SOURCE_EVENT",
          "token_id": "clause:0:token:4",
          "owner": "clause:0",
          "modality": "REQUIRED",
          "restrict": false,
          "modality_source_span_ids": [],
          "modality_token_ids": [],
          "support_verb_span_id": "p1:2cbc54e36db5ace4bf94cf39",
          "semantic_predicate_span_id": "p1:b0eccf72b3d1edf969c8f671",
          "composition": "SUPPORT_VERB_EVENT",
          "support_chain_span_ids": [
            "p1:2cbc54e36db5ace4bf94cf39"
          ],
          "predicate_owner_token_id": "clause:0:token:4",
          "clause_id": "clause:0",
          "producer": "NATIVE_FRONTEND",
          "completion": false,
          "discourse": {
            "annotation_id": "p1:2e2c6592bde11ad4fdc19e24",
            "structure_id": "structure:0",
            "kind": "CURRENT_TASK",
            "inherited_kind": "CURRENT_TASK",
            "owner_structure_id": "document",
            "structural_path": [
              "document"
            ],
            "source_span": {
              "source_id": "source:37bc331b435432c551f3996cda23568886d94a11588ab75e1a7b75aa3073818c",
              "start": 0,
              "end": 72,
              "quote": "张宁负责这项整理。请读取 input.csv，生成 report.md。不得修改 input.csv。report.md 已生成后，本任务完成。"
            },
            "heading_marker_span": null,
            "domain_id": "p1:fab2fd71e957c1ce4146165d"
          },
          "semantic_ownership": {
            "node_id": "p1:23c59e2354e7b39c3fb9b70d",
            "status": "UNIQUE",
            "semantic_owner_id": "p1:c04a6fcca8a88e2ce3052a12",
            "owner_category": "CURRENT_TASK_ROOT",
            "predicate_layer": "MAIN",
            "syntactic_layer_id": "p1:0e41aeaeffc8210a3977f2e6",
            "owning_proposition_id": "clause:0",
            "discourse_domain": "CURRENT_TASK",
            "structural_parent_path": [
              "document",
              "structure:0"
            ],
            "attachment_path": [
              "document",
              "structure:0",
              "clause:0"
            ],
            "owner_output_ids": [],
            "ownership_relation_ids": [],
            "source_span_ids": [
              "p1:b0eccf72b3d1edf969c8f671",
              "p1:e157be95c430ae6af88e6a37",
              "p1:571d80d40877f6505adf1d06"
            ],
            "inheritance_override_proof": [
              {
                "rank": 1,
                "rule": "EXPLICIT_STRUCTURE_PATH",
                "structural_path": [
                  "document",
                  "structure:0"
                ],
                "source_span_ids": [
                  "p1:571d80d40877f6505adf1d06"
                ]
              }
            ],
            "negative_ownership_evidence": []
          },
          "attachment_path": [
            "clause:0",
            "p1:23c59e2354e7b39c3fb9b70d"
          ],
          "retired_by_short_direct": "TASK_REFERENCE_IS_ASSIGNMENT_NOT_EXECUTION"
        }
      },
      {
        "node_id": "p1:0a644412188024b2b0ff4db1",
        "node_type": "ENTITY",
        "surface": "张宁",
        "normalized": null,
        "span_candidate_ids": [
          "p1:dfa8728eea3e2566c0f9020c",
          "p1:1ac51b0aa22c5c2e18d8354b"
        ],
        "source_span_ids": [
          "p1:71bb1d16f0709043431028ea",
          "p1:e157be95c430ae6af88e6a37"
        ],
        "evidence_tier": "STRONG",
        "state": "RESOLVED",
        "metadata": {
          "token_id": "clause:0:token:0",
          "clause_id": "clause:0",
          "producer": "NATIVE_FRONTEND",
          "literal_tag": "PERSON",
          "participant_roles": [
            "PERFORMER"
          ],
          "discourse": {
            "annotation_id": "p1:2e2c6592bde11ad4fdc19e24",
            "structure_id": "structure:0",
            "kind": "CURRENT_TASK",
            "inherited_kind": "CURRENT_TASK",
            "owner_structure_id": "document",
            "structural_path": [
              "document"
            ],
            "source_span": {
              "source_id": "source:37bc331b435432c551f3996cda23568886d94a11588ab75e1a7b75aa3073818c",
              "start": 0,
              "end": 72,
              "quote": "张宁负责这项整理。请读取 input.csv，生成 report.md。不得修改 input.csv。report.md 已生成后，本任务完成。"
            },
            "heading_marker_span": null,
            "domain_id": "p1:fab2fd71e957c1ce4146165d"
          },
          "participant_eligibility": {
            "eligible": true,
            "reason": "EXPLICIT_TASK_RESPONSIBILITY_AND_NER",
            "source_span_ids": [
              "p1:e157be95c430ae6af88e6a37",
              "p1:71bb1d16f0709043431028ea"
            ]
          },
          "identity_candidate_node_ids": [],
          "semantic_ownership": {
            "node_id": "p1:0a644412188024b2b0ff4db1",
            "status": "UNIQUE",
            "semantic_owner_id": "p1:c04a6fcca8a88e2ce3052a12",
            "owner_category": "CURRENT_TASK_ROOT",
            "predicate_layer": "MAIN",
            "syntactic_layer_id": "p1:0e41aeaeffc8210a3977f2e6",
            "owning_proposition_id": "clause:0",
            "discourse_domain": "CURRENT_TASK",
            "structural_parent_path": [
              "document",
              "structure:0"
            ],
            "attachment_path": [
              "document",
              "structure:0",
              "clause:0"
            ],
            "owner_output_ids": [],
            "ownership_relation_ids": [],
            "source_span_ids": [
              "p1:71bb1d16f0709043431028ea",
              "p1:e157be95c430ae6af88e6a37",
              "p1:571d80d40877f6505adf1d06"
            ],
            "inheritance_override_proof": [
              {
                "rank": 1,
                "rule": "EXPLICIT_STRUCTURE_PATH",
                "structural_path": [
                  "document",
                  "structure:0"
                ],
                "source_span_ids": [
                  "p1:571d80d40877f6505adf1d06"
                ]
              }
            ],
            "negative_ownership_evidence": []
          },
          "attachment_path": [
            "clause:0",
            "p1:0a644412188024b2b0ff4db1"
          ]
        }
      },
      {
        "node_id": "p1:13b991f220929572e7a8b1fa",
        "node_type": "ENTITY",
        "surface": "这项整理",
        "normalized": "EVENT_NOMINAL",
        "span_candidate_ids": [
          "p1:79fc75eebe531d5c7565230f",
          "p1:1e97721075f8b2cf8d71be92"
        ],
        "source_span_ids": [
          "p1:b0eccf72b3d1edf969c8f671",
          "p1:e157be95c430ae6af88e6a37"
        ],
        "evidence_tier": "STRONG",
        "state": "RESOLVED",
        "metadata": {
          "sense": "EVENT_NOMINAL",
          "owner": "p1:23c59e2354e7b39c3fb9b70d",
          "clause_id": "clause:0",
          "producer": "NATIVE_FRONTEND",
          "discourse": {
            "annotation_id": "p1:2e2c6592bde11ad4fdc19e24",
            "structure_id": "structure:0",
            "kind": "CURRENT_TASK",
            "inherited_kind": "CURRENT_TASK",
            "owner_structure_id": "document",
            "structural_path": [
              "document"
            ],
            "source_span": {
              "source_id": "source:37bc331b435432c551f3996cda23568886d94a11588ab75e1a7b75aa3073818c",
              "start": 0,
              "end": 72,
              "quote": "张宁负责这项整理。请读取 input.csv，生成 report.md。不得修改 input.csv。report.md 已生成后，本任务完成。"
            },
            "heading_marker_span": null,
            "domain_id": "p1:fab2fd71e957c1ce4146165d"
          },
          "participant_eligibility": {
            "eligible": false,
            "reason": "SRL_AGENT_IS_NOT_IDENTITY",
            "source_span_ids": [
              "p1:b0eccf72b3d1edf969c8f671",
              "p1:e157be95c430ae6af88e6a37"
            ],
            "ner_evidence": [],
            "name_token_evidence": []
          },
          "semantic_ownership": {
            "node_id": "p1:13b991f220929572e7a8b1fa",
            "status": "UNIQUE",
            "semantic_owner_id": "p1:c04a6fcca8a88e2ce3052a12",
            "owner_category": "CURRENT_TASK_ROOT",
            "predicate_layer": "MAIN",
            "syntactic_layer_id": "p1:0e41aeaeffc8210a3977f2e6",
            "owning_proposition_id": "clause:0",
            "discourse_domain": "CURRENT_TASK",
            "structural_parent_path": [
              "document",
              "structure:0"
            ],
            "attachment_path": [
              "document",
              "structure:0",
              "clause:0"
            ],
            "owner_output_ids": [],
            "ownership_relation_ids": [],
            "source_span_ids": [
              "p1:b0eccf72b3d1edf969c8f671",
              "p1:e157be95c430ae6af88e6a37",
              "p1:571d80d40877f6505adf1d06"
            ],
            "inheritance_override_proof": [
              {
                "rank": 1,
                "rule": "EXPLICIT_STRUCTURE_PATH",
                "structural_path": [
                  "document",
                  "structure:0"
                ],
                "source_span_ids": [
                  "p1:571d80d40877f6505adf1d06"
                ]
              }
            ],
            "negative_ownership_evidence": []
          },
          "attachment_path": [
            "clause:0",
            "p1:13b991f220929572e7a8b1fa"
          ]
        }
      },
      {
        "node_id": "p1:a017f65f2618791bc5728c63",
        "node_type": "ENTITY",
        "surface": "input.csv",
        "normalized": null,
        "span_candidate_ids": [
          "p1:fd5de1d13f7ce7e405c891e0",
          "p1:b7d066b3d6b96b7527c7d399"
        ],
        "source_span_ids": [
          "p1:9d123dd0da21f3490930ff89",
          "p1:b6f9329b82cfe4bf264e6752"
        ],
        "evidence_tier": "STRONG",
        "state": "RESOLVED",
        "metadata": {
          "literal_id": "literal:0",
          "literal_tag": "FILEPATH",
          "clause_id": "clause:1",
          "producer": "NATIVE_FRONTEND",
          "discourse": {
            "annotation_id": "p1:2e2c6592bde11ad4fdc19e24",
            "structure_id": "structure:0",
            "kind": "CURRENT_TASK",
            "inherited_kind": "CURRENT_TASK",
            "owner_structure_id": "document",
            "structural_path": [
              "document"
            ],
            "source_span": {
              "source_id": "source:37bc331b435432c551f3996cda23568886d94a11588ab75e1a7b75aa3073818c",
              "start": 0,
              "end": 72,
              "quote": "张宁负责这项整理。请读取 input.csv，生成 report.md。不得修改 input.csv。report.md 已生成后，本任务完成。"
            },
            "heading_marker_span": null,
            "domain_id": "p1:fab2fd71e957c1ce4146165d"
          },
          "participant_eligibility": {
            "eligible": false,
            "reason": "PROTECTED_TECHNICAL_TYPE_PRECEDES_NER",
            "source_span_ids": [
              "p1:9d123dd0da21f3490930ff89"
            ]
          },
          "artifact_roles": [
            "READ_ONLY_INPUT"
          ],
          "artifact_identity": "p1:2e7f2700d96ceb339e123d8f",
          "role_transition": null,
          "technical_type": "FILE",
          "semantic_ownership": {
            "node_id": "p1:a017f65f2618791bc5728c63",
            "status": "UNIQUE",
            "semantic_owner_id": "p1:c04a6fcca8a88e2ce3052a12",
            "owner_category": "CURRENT_TASK_ROOT",
            "predicate_layer": "MAIN",
            "syntactic_layer_id": "p1:a6da896017ae3ee48122e5fa",
            "owning_proposition_id": "clause:1",
            "discourse_domain": "CURRENT_TASK",
            "structural_parent_path": [
              "document",
              "structure:0"
            ],
            "attachment_path": [
              "document",
              "structure:0",
              "clause:1"
            ],
            "owner_output_ids": [],
            "ownership_relation_ids": [],
            "source_span_ids": [
              "p1:9d123dd0da21f3490930ff89",
              "p1:b6f9329b82cfe4bf264e6752",
              "p1:571d80d40877f6505adf1d06"
            ],
            "inheritance_override_proof": [
              {
                "rank": 1,
                "rule": "EXPLICIT_STRUCTURE_PATH",
                "structural_path": [
                  "document",
                  "structure:0"
                ],
                "source_span_ids": [
                  "p1:571d80d40877f6505adf1d06"
                ]
              }
            ],
            "negative_ownership_evidence": []
          },
          "attachment_path": [
            "clause:1",
            "p1:a017f65f2618791bc5728c63"
          ],
          "qualified_identity": {
            "node_id": "p1:a017f65f2618791bc5728c63",
            "source_literal_id": "literal:0",
            "source_span_ids": [
              "p1:9d123dd0da21f3490930ff89",
              "p1:b6f9329b82cfe4bf264e6752"
            ],
            "complete_protected_span": {
              "source_id": "source:37bc331b435432c551f3996cda23568886d94a11588ab75e1a7b75aa3073818c",
              "start": 13,
              "end": 22,
              "quote": "input.csv"
            },
            "semantic_owner_id": "p1:c04a6fcca8a88e2ce3052a12",
            "status": "CERTIFIED",
            "qualified_identity": "p1:d615e35ceaeffedb4a545766",
            "role_relation_ids": [
              "p1:0fd472c5ca879d856e495479",
              "p1:30f048f55c1175bd7c206c2d"
            ],
            "before_after": null,
            "lexical_role_projection": false
          }
        }
      },
      {
        "node_id": "p1:55751628ba342c5905e06203",
        "node_type": "EVENT",
        "surface": "读取",
        "normalized": "read",
        "span_candidate_ids": [
          "p1:59b77956e0d62720a911909e",
          "p1:cb022639d16f2617c1301f57"
        ],
        "source_span_ids": [
          "p1:fd66e7077083782d8fc63cf9",
          "p1:b6f9329b82cfe4bf264e6752"
        ],
        "evidence_tier": "STRONG",
        "state": "RESOLVED",
        "metadata": {
          "sense": "read",
          "token_id": "clause:1:token:1",
          "owner": "clause:1",
          "modality": "REQUIRED",
          "restrict": false,
          "modality_source_span_ids": [],
          "modality_token_ids": [],
          "clause_id": "clause:1",
          "producer": "NATIVE_FRONTEND",
          "discourse": {
            "annotation_id": "p1:2e2c6592bde11ad4fdc19e24",
            "structure_id": "structure:0",
            "kind": "CURRENT_TASK",
            "inherited_kind": "CURRENT_TASK",
            "owner_structure_id": "document",
            "structural_path": [
              "document"
            ],
            "source_span": {
              "source_id": "source:37bc331b435432c551f3996cda23568886d94a11588ab75e1a7b75aa3073818c",
              "start": 0,
              "end": 72,
              "quote": "张宁负责这项整理。请读取 input.csv，生成 report.md。不得修改 input.csv。report.md 已生成后，本任务完成。"
            },
            "heading_marker_span": null,
            "domain_id": "p1:fab2fd71e957c1ce4146165d"
          },
          "imperative_source_span_id": "p1:fd66e7077083782d8fc63cf9",
          "candidate_argument_frame": "p1:64c6aec94a5fe63d7c8b7516",
          "semantic_ownership": {
            "node_id": "p1:55751628ba342c5905e06203",
            "status": "UNIQUE",
            "semantic_owner_id": "p1:c04a6fcca8a88e2ce3052a12",
            "owner_category": "CURRENT_TASK_ROOT",
            "predicate_layer": "MAIN",
            "syntactic_layer_id": "p1:a6da896017ae3ee48122e5fa",
            "owning_proposition_id": "clause:1",
            "discourse_domain": "CURRENT_TASK",
            "structural_parent_path": [
              "document",
              "structure:0"
            ],
            "attachment_path": [
              "document",
              "structure:0",
              "clause:1"
            ],
            "owner_output_ids": [],
            "ownership_relation_ids": [],
            "source_span_ids": [
              "p1:fd66e7077083782d8fc63cf9",
              "p1:b6f9329b82cfe4bf264e6752",
              "p1:571d80d40877f6505adf1d06"
            ],
            "inheritance_override_proof": [
              {
                "rank": 1,
                "rule": "EXPLICIT_STRUCTURE_PATH",
                "structural_path": [
                  "document",
                  "structure:0"
                ],
                "source_span_ids": [
                  "p1:571d80d40877f6505adf1d06"
                ]
              }
            ],
            "negative_ownership_evidence": []
          },
          "attachment_path": [
            "clause:1",
            "p1:55751628ba342c5905e06203"
          ]
        }
      },
      {
        "node_id": "p1:fc5bd600086ab6090e519d5c",
        "node_type": "ENTITY",
        "surface": "report.md",
        "normalized": null,
        "span_candidate_ids": [
          "p1:4cf3441fea973e2495d38115",
          "p1:31b6605152a30f3b87611217"
        ],
        "source_span_ids": [
          "p1:816520f3f44f6ecce1fcffe1",
          "p1:7f0793aa43172b583c71aea5"
        ],
        "evidence_tier": "STRONG",
        "state": "RESOLVED",
        "metadata": {
          "literal_id": "literal:1",
          "literal_tag": "FILEPATH",
          "clause_id": "clause:2",
          "producer": "NATIVE_FRONTEND",
          "source_aliases": [
            "清单"
          ],
          "discourse": {
            "annotation_id": "p1:2e2c6592bde11ad4fdc19e24",
            "structure_id": "structure:0",
            "kind": "CURRENT_TASK",
            "inherited_kind": "CURRENT_TASK",
            "owner_structure_id": "document",
            "structural_path": [
              "document"
            ],
            "source_span": {
              "source_id": "source:37bc331b435432c551f3996cda23568886d94a11588ab75e1a7b75aa3073818c",
              "start": 0,
              "end": 72,
              "quote": "张宁负责这项整理。请读取 input.csv，生成 report.md。不得修改 input.csv。report.md 已生成后，本任务完成。"
            },
            "heading_marker_span": null,
            "domain_id": "p1:fab2fd71e957c1ce4146165d"
          },
          "participant_eligibility": {
            "eligible": false,
            "reason": "PROTECTED_TECHNICAL_TYPE_PRECEDES_NER",
            "source_span_ids": [
              "p1:816520f3f44f6ecce1fcffe1"
            ]
          },
          "artifact_roles": [
            "GENERATED_OUTPUT"
          ],
          "artifact_identity": "p1:88f78f1a30276b49a87d3d8f",
          "role_transition": null,
          "technical_type": "ABSTRACT_DELIVERABLE",
          "semantic_ownership": {
            "node_id": "p1:fc5bd600086ab6090e519d5c",
            "status": "UNIQUE",
            "semantic_owner_id": "p1:c04a6fcca8a88e2ce3052a12",
            "owner_category": "CURRENT_TASK_ROOT",
            "predicate_layer": "MAIN",
            "syntactic_layer_id": "p1:a6da896017ae3ee48122e5fa",
            "owning_proposition_id": "clause:2",
            "discourse_domain": "CURRENT_TASK",
            "structural_parent_path": [
              "document",
              "structure:0"
            ],
            "attachment_path": [
              "document",
              "structure:0",
              "clause:2"
            ],
            "owner_output_ids": [],
            "ownership_relation_ids": [],
            "source_span_ids": [
              "p1:816520f3f44f6ecce1fcffe1",
              "p1:7f0793aa43172b583c71aea5",
              "p1:571d80d40877f6505adf1d06"
            ],
            "inheritance_override_proof": [
              {
                "rank": 1,
                "rule": "EXPLICIT_STRUCTURE_PATH",
                "structural_path": [
                  "document",
                  "structure:0"
                ],
                "source_span_ids": [
                  "p1:571d80d40877f6505adf1d06"
                ]
              }
            ],
            "negative_ownership_evidence": []
          },
          "attachment_path": [
            "clause:2",
            "p1:fc5bd600086ab6090e519d5c"
          ],
          "qualified_identity": {
            "node_id": "p1:fc5bd600086ab6090e519d5c",
            "source_literal_id": "literal:1",
            "source_span_ids": [
              "p1:816520f3f44f6ecce1fcffe1",
              "p1:7f0793aa43172b583c71aea5"
            ],
            "complete_protected_span": {
              "source_id": "source:37bc331b435432c551f3996cda23568886d94a11588ab75e1a7b75aa3073818c",
              "start": 26,
              "end": 35,
              "quote": "report.md"
            },
            "semantic_owner_id": "p1:c04a6fcca8a88e2ce3052a12",
            "status": "CERTIFIED",
            "qualified_identity": "p1:e372a904338a20cbdfdfcb19",
            "role_relation_ids": [
              "p1:36ac3c5793dabb687e58d8be"
            ],
            "before_after": null,
            "lexical_role_projection": false
          }
        }
      },
      {
        "node_id": "p1:7be272d3f3a2df10061bef21",
        "node_type": "EVENT",
        "surface": "生成",
        "normalized": "generate",
        "span_candidate_ids": [
          "p1:d51f441771106eae1bbfffa8",
          "p1:beaaec44da38258874dccbba"
        ],
        "source_span_ids": [
          "p1:73e3c5ea188ca1c5d3a01a25",
          "p1:7f0793aa43172b583c71aea5"
        ],
        "evidence_tier": "STRONG",
        "state": "RESOLVED",
        "metadata": {
          "sense": "generate",
          "token_id": "clause:2:token:0",
          "owner": "clause:2",
          "modality": "REQUIRED",
          "restrict": false,
          "modality_source_span_ids": [],
          "modality_token_ids": [],
          "clause_id": "clause:2",
          "producer": "NATIVE_FRONTEND",
          "discourse": {
            "annotation_id": "p1:2e2c6592bde11ad4fdc19e24",
            "structure_id": "structure:0",
            "kind": "CURRENT_TASK",
            "inherited_kind": "CURRENT_TASK",
            "owner_structure_id": "document",
            "structural_path": [
              "document"
            ],
            "source_span": {
              "source_id": "source:37bc331b435432c551f3996cda23568886d94a11588ab75e1a7b75aa3073818c",
              "start": 0,
              "end": 72,
              "quote": "张宁负责这项整理。请读取 input.csv，生成 report.md。不得修改 input.csv。report.md 已生成后，本任务完成。"
            },
            "heading_marker_span": null,
            "domain_id": "p1:fab2fd71e957c1ce4146165d"
          },
          "argument_graph": {
            "object_node_ids": [
              "p1:fc5bd600086ab6090e519d5c"
            ],
            "source_span_ids": [
              "p1:816520f3f44f6ecce1fcffe1",
              "p1:73e3c5ea188ca1c5d3a01a25"
            ],
            "scope_expr_id": "p1:f5c4097140b3a14c789d8249",
            "complete": true
          },
          "candidate_argument_frame": "p1:f6b39578d3a554bc8c0cfe7b",
          "semantic_ownership": {
            "node_id": "p1:7be272d3f3a2df10061bef21",
            "status": "UNIQUE",
            "semantic_owner_id": "p1:c04a6fcca8a88e2ce3052a12",
            "owner_category": "CURRENT_TASK_ROOT",
            "predicate_layer": "MAIN",
            "syntactic_layer_id": "p1:a6da896017ae3ee48122e5fa",
            "owning_proposition_id": "clause:2",
            "discourse_domain": "CURRENT_TASK",
            "structural_parent_path": [
              "document",
              "structure:0"
            ],
            "attachment_path": [
              "document",
              "structure:0",
              "clause:2"
            ],
            "owner_output_ids": [],
            "ownership_relation_ids": [],
            "source_span_ids": [
              "p1:73e3c5ea188ca1c5d3a01a25",
              "p1:7f0793aa43172b583c71aea5",
              "p1:571d80d40877f6505adf1d06"
            ],
            "inheritance_override_proof": [
              {
                "rank": 1,
                "rule": "EXPLICIT_STRUCTURE_PATH",
                "structural_path": [
                  "document",
                  "structure:0"
                ],
                "source_span_ids": [
                  "p1:571d80d40877f6505adf1d06"
                ]
              }
            ],
            "negative_ownership_evidence": []
          },
          "attachment_path": [
            "clause:2",
            "p1:7be272d3f3a2df10061bef21"
          ]
        }
      },
      {
        "node_id": "p1:5e56145673653f1ee7f21e69",
        "node_type": "ENTITY",
        "surface": "input.csv",
        "normalized": null,
        "span_candidate_ids": [
          "p1:77ca9aaa63a8a4dcafc896f6",
          "p1:b319ed089efe6d489d225be3"
        ],
        "source_span_ids": [
          "p1:55ad616030ab5968a94ded69",
          "p1:f33c3a1c29e28002155201ca"
        ],
        "evidence_tier": "STRONG",
        "state": "RESOLVED",
        "metadata": {
          "literal_id": "literal:2",
          "literal_tag": "FILEPATH",
          "clause_id": "clause:3",
          "producer": "NATIVE_FRONTEND",
          "discourse": {
            "annotation_id": "p1:2e2c6592bde11ad4fdc19e24",
            "structure_id": "structure:0",
            "kind": "CURRENT_TASK",
            "inherited_kind": "CURRENT_TASK",
            "owner_structure_id": "document",
            "structural_path": [
              "document"
            ],
            "source_span": {
              "source_id": "source:37bc331b435432c551f3996cda23568886d94a11588ab75e1a7b75aa3073818c",
              "start": 0,
              "end": 72,
              "quote": "张宁负责这项整理。请读取 input.csv，生成 report.md。不得修改 input.csv。report.md 已生成后，本任务完成。"
            },
            "heading_marker_span": null,
            "domain_id": "p1:fab2fd71e957c1ce4146165d"
          },
          "participant_eligibility": {
            "eligible": false,
            "reason": "PROTECTED_TECHNICAL_TYPE_PRECEDES_NER",
            "source_span_ids": [
              "p1:55ad616030ab5968a94ded69"
            ]
          },
          "technical_type": "FILE",
          "artifact_identity": "p1:2e7f2700d96ceb339e123d8f",
          "semantic_ownership": {
            "node_id": "p1:5e56145673653f1ee7f21e69",
            "status": "UNIQUE",
            "semantic_owner_id": "p1:c04a6fcca8a88e2ce3052a12",
            "owner_category": "CURRENT_TASK_ROOT",
            "predicate_layer": "MAIN",
            "syntactic_layer_id": "p1:97c9d7b5c58dd5b6ed9a4cd2",
            "owning_proposition_id": "clause:3",
            "discourse_domain": "CURRENT_TASK",
            "structural_parent_path": [
              "document",
              "structure:0"
            ],
            "attachment_path": [
              "document",
              "structure:0",
              "clause:3"
            ],
            "owner_output_ids": [],
            "ownership_relation_ids": [],
            "source_span_ids": [
              "p1:55ad616030ab5968a94ded69",
              "p1:f33c3a1c29e28002155201ca",
              "p1:571d80d40877f6505adf1d06"
            ],
            "inheritance_override_proof": [
              {
                "rank": 1,
                "rule": "EXPLICIT_STRUCTURE_PATH",
                "structural_path": [
                  "document",
                  "structure:0"
                ],
                "source_span_ids": [
                  "p1:571d80d40877f6505adf1d06"
                ]
              }
            ],
            "negative_ownership_evidence": []
          },
          "attachment_path": [
            "clause:3",
            "p1:5e56145673653f1ee7f21e69"
          ],
          "qualified_identity": {
            "node_id": "p1:5e56145673653f1ee7f21e69",
            "source_literal_id": "literal:2",
            "source_span_ids": [
              "p1:55ad616030ab5968a94ded69",
              "p1:f33c3a1c29e28002155201ca"
            ],
            "complete_protected_span": {
              "source_id": "source:37bc331b435432c551f3996cda23568886d94a11588ab75e1a7b75aa3073818c",
              "start": 41,
              "end": 50,
              "quote": "input.csv"
            },
            "semantic_owner_id": "p1:c04a6fcca8a88e2ce3052a12",
            "status": "CERTIFIED",
            "qualified_identity": "p1:d615e35ceaeffedb4a545766",
            "role_relation_ids": [
              "p1:f93ea6ea733bc8fc9e674b73"
            ],
            "before_after": null,
            "lexical_role_projection": false
          }
        }
      },
      {
        "node_id": "p1:5005d79d390f276a34b7caf4",
        "node_type": "EVENT",
        "surface": "修改",
        "normalized": "modify",
        "span_candidate_ids": [
          "p1:410e433fc2eef4d829dd1c70",
          "p1:7ba98a089fa9612c56c42537"
        ],
        "source_span_ids": [
          "p1:0ac85b43b0dc6a80218e77f0",
          "p1:f33c3a1c29e28002155201ca"
        ],
        "evidence_tier": "STRONG",
        "state": "RESOLVED",
        "metadata": {
          "sense": "modify",
          "token_id": "clause:3:token:2",
          "owner": "clause:3",
          "modality": "FORBIDDEN",
          "restrict": false,
          "modality_source_span_ids": [
            "p1:35a039fa3ba0f2d5d34e5280"
          ],
          "modality_token_ids": [
            "clause:3:token:0",
            "clause:3:token:1"
          ],
          "clause_id": "clause:3",
          "producer": "NATIVE_FRONTEND",
          "discourse": {
            "annotation_id": "p1:2e2c6592bde11ad4fdc19e24",
            "structure_id": "structure:0",
            "kind": "CURRENT_TASK",
            "inherited_kind": "CURRENT_TASK",
            "owner_structure_id": "document",
            "structural_path": [
              "document"
            ],
            "source_span": {
              "source_id": "source:37bc331b435432c551f3996cda23568886d94a11588ab75e1a7b75aa3073818c",
              "start": 0,
              "end": 72,
              "quote": "张宁负责这项整理。请读取 input.csv，生成 report.md。不得修改 input.csv。report.md 已生成后，本任务完成。"
            },
            "heading_marker_span": null,
            "domain_id": "p1:fab2fd71e957c1ce4146165d"
          },
          "candidate_argument_frame": "p1:479b3e27bf5d3980c9beaaf1",
          "semantic_ownership": {
            "node_id": "p1:5005d79d390f276a34b7caf4",
            "status": "UNIQUE",
            "semantic_owner_id": "p1:c04a6fcca8a88e2ce3052a12",
            "owner_category": "CURRENT_TASK_ROOT",
            "predicate_layer": "MAIN",
            "syntactic_layer_id": "p1:97c9d7b5c58dd5b6ed9a4cd2",
            "owning_proposition_id": "clause:3",
            "discourse_domain": "CURRENT_TASK",
            "structural_parent_path": [
              "document",
              "structure:0"
            ],
            "attachment_path": [
              "document",
              "structure:0",
              "clause:3"
            ],
            "owner_output_ids": [],
            "ownership_relation_ids": [],
            "source_span_ids": [
              "p1:0ac85b43b0dc6a80218e77f0",
              "p1:f33c3a1c29e28002155201ca",
              "p1:571d80d40877f6505adf1d06"
            ],
            "inheritance_override_proof": [
              {
                "rank": 1,
                "rule": "EXPLICIT_STRUCTURE_PATH",
                "structural_path": [
                  "document",
                  "structure:0"
                ],
                "source_span_ids": [
                  "p1:571d80d40877f6505adf1d06"
                ]
              }
            ],
            "negative_ownership_evidence": []
          },
          "attachment_path": [
            "clause:3",
            "p1:5005d79d390f276a34b7caf4"
          ],
          "condition_binding_certificate": {
            "predicate_node_id": "p1:5005d79d390f276a34b7caf4",
            "status": "CERTIFIED_UNCONDITIONAL",
            "prior_condition_expr_id": null,
            "candidate_state_node_ids": [],
            "attachment_paths": [],
            "candidate_evidence": [],
            "source_span_ids": [
              "p1:0ac85b43b0dc6a80218e77f0",
              "p1:f33c3a1c29e28002155201ca"
            ],
            "semantic_owner_id": "p1:c04a6fcca8a88e2ce3052a12"
          }
        }
      },
      {
        "node_id": "p1:ecd17316cc63a98d630af1d8",
        "node_type": "ENTITY",
        "surface": "report.md",
        "normalized": null,
        "span_candidate_ids": [
          "p1:0a4fbc9128652b3d974c3614",
          "p1:4a166adac0be1958b55ce399"
        ],
        "source_span_ids": [
          "p1:128b95de26c3a7705c96510e",
          "p1:16c6c0a6d036213bdc5dc5e7"
        ],
        "evidence_tier": "STRONG",
        "state": "RESOLVED",
        "metadata": {
          "literal_id": "literal:3",
          "literal_tag": "FILEPATH",
          "clause_id": "clause:4",
          "producer": "NATIVE_FRONTEND",
          "source_aliases": [
            "清单"
          ],
          "discourse": {
            "annotation_id": "p1:2e2c6592bde11ad4fdc19e24",
            "structure_id": "structure:0",
            "kind": "CURRENT_TASK",
            "inherited_kind": "CURRENT_TASK",
            "owner_structure_id": "document",
            "structural_path": [
              "document"
            ],
            "source_span": {
              "source_id": "source:37bc331b435432c551f3996cda23568886d94a11588ab75e1a7b75aa3073818c",
              "start": 0,
              "end": 72,
              "quote": "张宁负责这项整理。请读取 input.csv，生成 report.md。不得修改 input.csv。report.md 已生成后，本任务完成。"
            },
            "heading_marker_span": null,
            "domain_id": "p1:fab2fd71e957c1ce4146165d"
          },
          "participant_eligibility": {
            "eligible": false,
            "reason": "PROTECTED_TECHNICAL_TYPE_PRECEDES_NER",
            "source_span_ids": [
              "p1:128b95de26c3a7705c96510e"
            ]
          },
          "technical_type": "FILE",
          "semantic_ownership": {
            "node_id": "p1:ecd17316cc63a98d630af1d8",
            "status": "UNIQUE",
            "semantic_owner_id": "p1:c04a6fcca8a88e2ce3052a12",
            "owner_category": "CURRENT_TASK_ROOT",
            "predicate_layer": "MAIN",
            "syntactic_layer_id": "p1:e901b62daac62e628f4f901b",
            "owning_proposition_id": "clause:4",
            "discourse_domain": "CURRENT_TASK",
            "structural_parent_path": [
              "document",
              "structure:0"
            ],
            "attachment_path": [
              "document",
              "structure:0",
              "clause:4"
            ],
            "owner_output_ids": [],
            "ownership_relation_ids": [],
            "source_span_ids": [
              "p1:128b95de26c3a7705c96510e",
              "p1:16c6c0a6d036213bdc5dc5e7",
              "p1:571d80d40877f6505adf1d06"
            ],
            "inheritance_override_proof": [
              {
                "rank": 1,
                "rule": "EXPLICIT_STRUCTURE_PATH",
                "structural_path": [
                  "document",
                  "structure:0"
                ],
                "source_span_ids": [
                  "p1:571d80d40877f6505adf1d06"
                ]
              }
            ],
            "negative_ownership_evidence": []
          },
          "attachment_path": [
            "clause:4",
            "p1:ecd17316cc63a98d630af1d8"
          ],
          "qualified_identity": {
            "node_id": "p1:ecd17316cc63a98d630af1d8",
            "source_literal_id": "literal:3",
            "source_span_ids": [
              "p1:128b95de26c3a7705c96510e",
              "p1:16c6c0a6d036213bdc5dc5e7"
            ],
            "complete_protected_span": {
              "source_id": "source:37bc331b435432c551f3996cda23568886d94a11588ab75e1a7b75aa3073818c",
              "start": 51,
              "end": 60,
              "quote": "report.md"
            },
            "semantic_owner_id": "p1:c04a6fcca8a88e2ce3052a12",
            "status": "CERTIFIED",
            "qualified_identity": "p1:e372a904338a20cbdfdfcb19",
            "role_relation_ids": [],
            "before_after": null,
            "lexical_role_projection": false
          },
          "artifact_identity": "p1:88f78f1a30276b49a87d3d8f"
        }
      },
      {
        "node_id": "p1:00c60db12ccee968ea34ba91",
        "node_type": "EVENT",
        "surface": "完成",
        "normalized": "complete",
        "span_candidate_ids": [
          "p1:439387f56981d932a29d2a41",
          "p1:50d2550516d640b78be35f54"
        ],
        "source_span_ids": [
          "p1:389fc6806e332239f3a0a558",
          "p1:a85ebf0b750986ebd6f278f6"
        ],
        "evidence_tier": "STRONG",
        "state": "RESOLVED",
        "metadata": {
          "sense": "complete",
          "token_id": "clause:5:token:2",
          "owner": "clause:5",
          "modality": "REQUIRED",
          "restrict": false,
          "modality_source_span_ids": [],
          "modality_token_ids": [],
          "clause_id": "clause:5",
          "producer": "NATIVE_FRONTEND",
          "completion": true,
          "discourse": {
            "annotation_id": "p1:2e2c6592bde11ad4fdc19e24",
            "structure_id": "structure:0",
            "kind": "CURRENT_TASK",
            "inherited_kind": "CURRENT_TASK",
            "owner_structure_id": "document",
            "structural_path": [
              "document"
            ],
            "source_span": {
              "source_id": "source:37bc331b435432c551f3996cda23568886d94a11588ab75e1a7b75aa3073818c",
              "start": 0,
              "end": 72,
              "quote": "张宁负责这项整理。请读取 input.csv，生成 report.md。不得修改 input.csv。report.md 已生成后，本任务完成。"
            },
            "heading_marker_span": null,
            "domain_id": "p1:fab2fd71e957c1ce4146165d"
          },
          "candidate_argument_frame": "p1:619842fee61654fb4914b208",
          "semantic_ownership": {
            "node_id": "p1:00c60db12ccee968ea34ba91",
            "status": "UNIQUE",
            "semantic_owner_id": "p1:c04a6fcca8a88e2ce3052a12",
            "owner_category": "CURRENT_TASK_ROOT",
            "predicate_layer": "MAIN",
            "syntactic_layer_id": "p1:e901b62daac62e628f4f901b",
            "owning_proposition_id": "clause:5",
            "discourse_domain": "CURRENT_TASK",
            "structural_parent_path": [
              "document",
              "structure:0"
            ],
            "attachment_path": [
              "document",
              "structure:0",
              "clause:5"
            ],
            "owner_output_ids": [],
            "ownership_relation_ids": [],
            "source_span_ids": [
              "p1:389fc6806e332239f3a0a558",
              "p1:a85ebf0b750986ebd6f278f6",
              "p1:571d80d40877f6505adf1d06"
            ],
            "inheritance_override_proof": [
              {
                "rank": 1,
                "rule": "EXPLICIT_STRUCTURE_PATH",
                "structural_path": [
                  "document",
                  "structure:0"
                ],
                "source_span_ids": [
                  "p1:571d80d40877f6505adf1d06"
                ]
              }
            ],
            "negative_ownership_evidence": []
          },
          "attachment_path": [
            "clause:5",
            "p1:00c60db12ccee968ea34ba91"
          ]
        }
      },
      {
        "node_id": "p1:3cfba2fb6a90ae4e9f6ecd34",
        "node_type": "ENTITY",
        "surface": "本任务",
        "normalized": null,
        "span_candidate_ids": [
          "p1:cf99caa33f0dd110398d0b22",
          "p1:f394713ca1cace498dd6764e"
        ],
        "source_span_ids": [
          "p1:3dc88c03831e32f9a8fc67ce",
          "p1:a85ebf0b750986ebd6f278f6"
        ],
        "evidence_tier": "STRONG",
        "state": "RESOLVED",
        "metadata": {
          "token_id": "clause:5:token:1",
          "clause_id": "clause:5",
          "producer": "NATIVE_FRONTEND",
          "discourse": {
            "annotation_id": "p1:2e2c6592bde11ad4fdc19e24",
            "structure_id": "structure:0",
            "kind": "CURRENT_TASK",
            "inherited_kind": "CURRENT_TASK",
            "owner_structure_id": "document",
            "structural_path": [
              "document"
            ],
            "source_span": {
              "source_id": "source:37bc331b435432c551f3996cda23568886d94a11588ab75e1a7b75aa3073818c",
              "start": 0,
              "end": 72,
              "quote": "张宁负责这项整理。请读取 input.csv，生成 report.md。不得修改 input.csv。report.md 已生成后，本任务完成。"
            },
            "heading_marker_span": null,
            "domain_id": "p1:fab2fd71e957c1ce4146165d"
          },
          "participant_eligibility": {
            "eligible": false,
            "reason": "SRL_AGENT_IS_NOT_IDENTITY",
            "source_span_ids": [
              "p1:3dc88c03831e32f9a8fc67ce",
              "p1:a85ebf0b750986ebd6f278f6"
            ],
            "ner_evidence": [],
            "name_token_evidence": []
          },
          "semantic_ownership": {
            "node_id": "p1:3cfba2fb6a90ae4e9f6ecd34",
            "status": "UNIQUE",
            "semantic_owner_id": "p1:c04a6fcca8a88e2ce3052a12",
            "owner_category": "CURRENT_TASK_ROOT",
            "predicate_layer": "MAIN",
            "syntactic_layer_id": "p1:e901b62daac62e628f4f901b",
            "owning_proposition_id": "clause:5",
            "discourse_domain": "CURRENT_TASK",
            "structural_parent_path": [
              "document",
              "structure:0"
            ],
            "attachment_path": [
              "document",
              "structure:0",
              "clause:5"
            ],
            "owner_output_ids": [],
            "ownership_relation_ids": [],
            "source_span_ids": [
              "p1:3dc88c03831e32f9a8fc67ce",
              "p1:a85ebf0b750986ebd6f278f6",
              "p1:571d80d40877f6505adf1d06"
            ],
            "inheritance_override_proof": [
              {
                "rank": 1,
                "rule": "EXPLICIT_STRUCTURE_PATH",
                "structural_path": [
                  "document",
                  "structure:0"
                ],
                "source_span_ids": [
                  "p1:571d80d40877f6505adf1d06"
                ]
              }
            ],
            "negative_ownership_evidence": []
          },
          "attachment_path": [
            "clause:5",
            "p1:3cfba2fb6a90ae4e9f6ecd34"
          ]
        }
      },
      {
        "node_id": "p1:3c21a1bf090fbc6ec5a038c3",
        "node_type": "EVENT",
        "surface": "生成",
        "normalized": "生成",
        "span_candidate_ids": [
          "p1:dd17a48357c1608df55c5fd8",
          "p1:bf0591c9dc865c19d70065bf"
        ],
        "source_span_ids": [
          "p1:c5e695a4d3c696b147d967d9",
          "p1:16c6c0a6d036213bdc5dc5e7"
        ],
        "evidence_tier": "STRONG",
        "state": "RESOLVED",
        "metadata": {
          "sense": "生成",
          "owner": "clause:4",
          "token_id": "clause:4:token:2",
          "modality": "UNSTATED",
          "clause_id": "clause:4",
          "producer": "NATIVE_FRONTEND",
          "discourse": {
            "annotation_id": "p1:2e2c6592bde11ad4fdc19e24",
            "structure_id": "structure:0",
            "kind": "CURRENT_TASK",
            "inherited_kind": "CURRENT_TASK",
            "owner_structure_id": "document",
            "structural_path": [
              "document"
            ],
            "source_span": {
              "source_id": "source:37bc331b435432c551f3996cda23568886d94a11588ab75e1a7b75aa3073818c",
              "start": 0,
              "end": 72,
              "quote": "张宁负责这项整理。请读取 input.csv，生成 report.md。不得修改 input.csv。report.md 已生成后，本任务完成。"
            },
            "heading_marker_span": null,
            "domain_id": "p1:fab2fd71e957c1ce4146165d"
          },
          "candidate_argument_frame": "p1:37d8a67343a6fec44fed2fb7",
          "semantic_ownership": {
            "node_id": "p1:3c21a1bf090fbc6ec5a038c3",
            "status": "UNIQUE",
            "semantic_owner_id": "p1:c04a6fcca8a88e2ce3052a12",
            "owner_category": "CURRENT_TASK_ROOT",
            "predicate_layer": "MAIN",
            "syntactic_layer_id": "p1:e901b62daac62e628f4f901b",
            "owning_proposition_id": "clause:4",
            "discourse_domain": "CURRENT_TASK",
            "structural_parent_path": [
              "document",
              "structure:0"
            ],
            "attachment_path": [
              "document",
              "structure:0",
              "clause:4"
            ],
            "owner_output_ids": [],
            "ownership_relation_ids": [],
            "source_span_ids": [
              "p1:c5e695a4d3c696b147d967d9",
              "p1:16c6c0a6d036213bdc5dc5e7",
              "p1:571d80d40877f6505adf1d06"
            ],
            "inheritance_override_proof": [
              {
                "rank": 1,
                "rule": "EXPLICIT_STRUCTURE_PATH",
                "structural_path": [
                  "document",
                  "structure:0"
                ],
                "source_span_ids": [
                  "p1:571d80d40877f6505adf1d06"
                ]
              }
            ],
            "negative_ownership_evidence": []
          },
          "attachment_path": [
            "clause:4",
            "p1:3c21a1bf090fbc6ec5a038c3"
          ],
          "retired_by_short_direct": "PERFECTIVE_OUTPUT_STATE_NOT_NEW_ACTION"
        }
      },
      {
        "node_id": "p1:4ccdd8b53cd9e017cbb17dbb",
        "node_type": "EVENT",
        "surface": "负责",
        "normalized": "负责",
        "span_candidate_ids": [
          "p1:c99c87fec5c4a0d23d080aae",
          "p1:3898c10dfe4f7fb8e0ca5ae6"
        ],
        "source_span_ids": [
          "p1:2cbc54e36db5ace4bf94cf39",
          "p1:e157be95c430ae6af88e6a37"
        ],
        "evidence_tier": "STRONG",
        "state": "RESOLVED",
        "metadata": {
          "sense": "负责",
          "owner": "clause:0",
          "token_id": "clause:0:token:1",
          "modality": "UNSTATED",
          "discourse": {
            "annotation_id": "p1:2e2c6592bde11ad4fdc19e24",
            "structure_id": "structure:0",
            "kind": "CURRENT_TASK",
            "inherited_kind": "CURRENT_TASK",
            "owner_structure_id": "document",
            "structural_path": [
              "document"
            ],
            "source_span": {
              "source_id": "source:37bc331b435432c551f3996cda23568886d94a11588ab75e1a7b75aa3073818c",
              "start": 0,
              "end": 72,
              "quote": "张宁负责这项整理。请读取 input.csv，生成 report.md。不得修改 input.csv。report.md 已生成后，本任务完成。"
            },
            "heading_marker_span": null,
            "domain_id": "p1:fab2fd71e957c1ce4146165d"
          },
          "candidate_origin": "EMBEDDED_PREDICATE_MATERIALIZATION",
          "candidate_layer": "AUXILIARY_CONTEXT",
          "clause_id": "clause:0",
          "producer": "NATIVE_FRONTEND",
          "candidate_argument_frame": "p1:4f78cb48d8c95d290d501684",
          "semantic_ownership": {
            "node_id": "p1:4ccdd8b53cd9e017cbb17dbb",
            "status": "UNIQUE",
            "semantic_owner_id": "p1:c04a6fcca8a88e2ce3052a12",
            "owner_category": "CURRENT_TASK_ROOT",
            "predicate_layer": "MAIN",
            "syntactic_layer_id": "p1:0e41aeaeffc8210a3977f2e6",
            "owning_proposition_id": "clause:0",
            "discourse_domain": "CURRENT_TASK",
            "structural_parent_path": [
              "document",
              "structure:0"
            ],
            "attachment_path": [
              "document",
              "structure:0",
              "clause:0"
            ],
            "owner_output_ids": [],
            "ownership_relation_ids": [],
            "source_span_ids": [
              "p1:2cbc54e36db5ace4bf94cf39",
              "p1:e157be95c430ae6af88e6a37",
              "p1:571d80d40877f6505adf1d06"
            ],
            "inheritance_override_proof": [
              {
                "rank": 1,
                "rule": "EXPLICIT_STRUCTURE_PATH",
                "structural_path": [
                  "document",
                  "structure:0"
                ],
                "source_span_ids": [
                  "p1:571d80d40877f6505adf1d06"
                ]
              }
            ],
            "negative_ownership_evidence": []
          },
          "attachment_path": [
            "clause:0",
            "p1:4ccdd8b53cd9e017cbb17dbb"
          ]
        }
      },
      {
        "node_id": "p1:a78bc4d47f94e06bd7c43b20",
        "node_type": "EVENT",
        "surface": "请",
        "normalized": "请",
        "span_candidate_ids": [
          "p1:cd4dfa2adda38b3b7b09867a",
          "p1:ccc750213575e50e7076a378"
        ],
        "source_span_ids": [
          "p1:5843a93c9de7260207fbac4e",
          "p1:b6f9329b82cfe4bf264e6752"
        ],
        "evidence_tier": "STRONG",
        "state": "RESOLVED",
        "metadata": {
          "sense": "请",
          "owner": "clause:1",
          "token_id": "clause:1:token:0",
          "modality": "UNSTATED",
          "discourse": {
            "annotation_id": "p1:2e2c6592bde11ad4fdc19e24",
            "structure_id": "structure:0",
            "kind": "CURRENT_TASK",
            "inherited_kind": "CURRENT_TASK",
            "owner_structure_id": "document",
            "structural_path": [
              "document"
            ],
            "source_span": {
              "source_id": "source:37bc331b435432c551f3996cda23568886d94a11588ab75e1a7b75aa3073818c",
              "start": 0,
              "end": 72,
              "quote": "张宁负责这项整理。请读取 input.csv，生成 report.md。不得修改 input.csv。report.md 已生成后，本任务完成。"
            },
            "heading_marker_span": null,
            "domain_id": "p1:fab2fd71e957c1ce4146165d"
          },
          "candidate_origin": "EMBEDDED_PREDICATE_MATERIALIZATION",
          "candidate_layer": "ACTION_CANDIDATE",
          "clause_id": "clause:1",
          "producer": "NATIVE_FRONTEND",
          "candidate_argument_frame": "p1:9f94a520aa63b8c945fa9818",
          "semantic_ownership": {
            "node_id": "p1:a78bc4d47f94e06bd7c43b20",
            "status": "UNIQUE",
            "semantic_owner_id": "p1:c04a6fcca8a88e2ce3052a12",
            "owner_category": "CURRENT_TASK_ROOT",
            "predicate_layer": "MAIN",
            "syntactic_layer_id": "p1:a6da896017ae3ee48122e5fa",
            "owning_proposition_id": "clause:1",
            "discourse_domain": "CURRENT_TASK",
            "structural_parent_path": [
              "document",
              "structure:0"
            ],
            "attachment_path": [
              "document",
              "structure:0",
              "clause:1"
            ],
            "owner_output_ids": [],
            "ownership_relation_ids": [],
            "source_span_ids": [
              "p1:5843a93c9de7260207fbac4e",
              "p1:b6f9329b82cfe4bf264e6752",
              "p1:571d80d40877f6505adf1d06"
            ],
            "inheritance_override_proof": [
              {
                "rank": 1,
                "rule": "EXPLICIT_STRUCTURE_PATH",
                "structural_path": [
                  "document",
                  "structure:0"
                ],
                "source_span_ids": [
                  "p1:571d80d40877f6505adf1d06"
                ]
              }
            ],
            "negative_ownership_evidence": []
          },
          "attachment_path": [
            "clause:1",
            "p1:a78bc4d47f94e06bd7c43b20"
          ],
          "retired_by_short_direct": "POLITE_DIRECTIVE_OPERATOR"
        }
      },
      {
        "node_id": "p1:664c7119ec8c17c7363d4a2d",
        "node_type": "ENTITY",
        "surface": "张宁",
        "normalized": null,
        "span_candidate_ids": [
          "p1:9312d4eaba5f8b7364c270ae",
          "p1:586703912ca02869ed1d19f0"
        ],
        "source_span_ids": [
          "p1:71bb1d16f0709043431028ea",
          "p1:e157be95c430ae6af88e6a37"
        ],
        "evidence_tier": "STRONG",
        "state": "RESOLVED",
        "metadata": {
          "literal_tag": "PERSON",
          "owner": "clause:0",
          "discourse": {
            "annotation_id": "p1:2e2c6592bde11ad4fdc19e24",
            "structure_id": "structure:0",
            "kind": "CURRENT_TASK",
            "inherited_kind": "CURRENT_TASK",
            "owner_structure_id": "document",
            "structural_path": [
              "document"
            ],
            "source_span": {
              "source_id": "source:37bc331b435432c551f3996cda23568886d94a11588ab75e1a7b75aa3073818c",
              "start": 0,
              "end": 72,
              "quote": "张宁负责这项整理。请读取 input.csv，生成 report.md。不得修改 input.csv。report.md 已生成后，本任务完成。"
            },
            "heading_marker_span": null,
            "domain_id": "p1:fab2fd71e957c1ce4146165d"
          },
          "clause_id": "clause:0",
          "producer": "NATIVE_FRONTEND",
          "participant_roles": [
            "PERFORMER"
          ],
          "current_task_assignment": true,
          "participant_eligibility": {
            "eligible": true,
            "reason": "EXPLICIT_TASK_RESPONSIBILITY_AND_NER",
            "source_span_ids": [
              "p1:e157be95c430ae6af88e6a37",
              "p1:71bb1d16f0709043431028ea"
            ]
          },
          "attachment_path": [
            "clause:0",
            "p1:664c7119ec8c17c7363d4a2d"
          ],
          "semantic_ownership": {
            "node_id": "p1:664c7119ec8c17c7363d4a2d",
            "status": "UNIQUE",
            "semantic_owner_id": "p1:c04a6fcca8a88e2ce3052a12",
            "owner_category": "CURRENT_TASK_ROOT",
            "predicate_layer": "MAIN",
            "syntactic_layer_id": "p1:0e41aeaeffc8210a3977f2e6",
            "owning_proposition_id": "clause:0",
            "discourse_domain": "CURRENT_TASK",
            "structural_parent_path": [
              "document",
              "structure:0"
            ],
            "attachment_path": [
              "document",
              "structure:0",
              "clause:0"
            ],
            "owner_output_ids": [],
            "ownership_relation_ids": [],
            "source_span_ids": [
              "p1:71bb1d16f0709043431028ea",
              "p1:e157be95c430ae6af88e6a37",
              "p1:571d80d40877f6505adf1d06"
            ],
            "inheritance_override_proof": [
              {
                "rank": 1,
                "rule": "EXPLICIT_STRUCTURE_PATH",
                "structural_path": [
                  "document",
                  "structure:0"
                ],
                "source_span_ids": [
                  "p1:571d80d40877f6505adf1d06"
                ]
              }
            ],
            "negative_ownership_evidence": []
          }
        }
      },
      {
        "node_id": "p1:2de8e54fcb2f544ce2f6d95d",
        "node_type": "STATE",
        "surface": "负责",
        "normalized": "TASK_ASSIGNMENT",
        "span_candidate_ids": [
          "p1:336ae386f96589816ed4e584",
          "p1:e252a4f9214f46431bebd259"
        ],
        "source_span_ids": [
          "p1:2cbc54e36db5ace4bf94cf39",
          "p1:e157be95c430ae6af88e6a37"
        ],
        "evidence_tier": "STRONG",
        "state": "RESOLVED",
        "metadata": {
          "sense": "TASK_ASSIGNMENT",
          "owner": "clause:0",
          "discourse": {
            "annotation_id": "p1:2e2c6592bde11ad4fdc19e24",
            "structure_id": "structure:0",
            "kind": "CURRENT_TASK",
            "inherited_kind": "CURRENT_TASK",
            "owner_structure_id": "document",
            "structural_path": [
              "document"
            ],
            "source_span": {
              "source_id": "source:37bc331b435432c551f3996cda23568886d94a11588ab75e1a7b75aa3073818c",
              "start": 0,
              "end": 72,
              "quote": "张宁负责这项整理。请读取 input.csv，生成 report.md。不得修改 input.csv。report.md 已生成后，本任务完成。"
            },
            "heading_marker_span": null,
            "domain_id": "p1:fab2fd71e957c1ce4146165d"
          },
          "assignment_target_id": "p1:3ddbd3949281cbe0716e59ad",
          "clause_id": "clause:0",
          "producer": "NATIVE_FRONTEND",
          "attachment_path": [
            "clause:0",
            "p1:2de8e54fcb2f544ce2f6d95d"
          ],
          "semantic_ownership": {
            "node_id": "p1:2de8e54fcb2f544ce2f6d95d",
            "status": "UNIQUE",
            "semantic_owner_id": "p1:c04a6fcca8a88e2ce3052a12",
            "owner_category": "CURRENT_TASK_ROOT",
            "predicate_layer": "MAIN",
            "syntactic_layer_id": "p1:0e41aeaeffc8210a3977f2e6",
            "owning_proposition_id": "clause:0",
            "discourse_domain": "CURRENT_TASK",
            "structural_parent_path": [
              "document",
              "structure:0"
            ],
            "attachment_path": [
              "document",
              "structure:0",
              "clause:0"
            ],
            "owner_output_ids": [],
            "ownership_relation_ids": [],
            "source_span_ids": [
              "p1:2cbc54e36db5ace4bf94cf39",
              "p1:e157be95c430ae6af88e6a37",
              "p1:571d80d40877f6505adf1d06"
            ],
            "inheritance_override_proof": [
              {
                "rank": 1,
                "rule": "EXPLICIT_STRUCTURE_PATH",
                "structural_path": [
                  "document",
                  "structure:0"
                ],
                "source_span_ids": [
                  "p1:571d80d40877f6505adf1d06"
                ]
              }
            ],
            "negative_ownership_evidence": []
          }
        }
      },
      {
        "node_id": "p1:2b1849abc7e29105eb70b977",
        "node_type": "STATE",
        "surface": "report.md 已生成",
        "normalized": "OUTPUT_EXISTS",
        "span_candidate_ids": [
          "p1:a4be8c687518396866debda4",
          "p1:dbea13331754fe10c5353e95"
        ],
        "source_span_ids": [
          "p1:5e3b5ab04595aef88e78c85c",
          "p1:16c6c0a6d036213bdc5dc5e7"
        ],
        "evidence_tier": "STRONG",
        "state": "RESOLVED",
        "metadata": {
          "sense": "OUTPUT_EXISTS",
          "owner": "clause:4",
          "discourse": {
            "annotation_id": "p1:2e2c6592bde11ad4fdc19e24",
            "structure_id": "structure:0",
            "kind": "CURRENT_TASK",
            "inherited_kind": "CURRENT_TASK",
            "owner_structure_id": "document",
            "structural_path": [
              "document"
            ],
            "source_span": {
              "source_id": "source:37bc331b435432c551f3996cda23568886d94a11588ab75e1a7b75aa3073818c",
              "start": 0,
              "end": 72,
              "quote": "张宁负责这项整理。请读取 input.csv，生成 report.md。不得修改 input.csv。report.md 已生成后，本任务完成。"
            },
            "heading_marker_span": null,
            "domain_id": "p1:fab2fd71e957c1ce4146165d"
          },
          "object_node_ids": [
            "p1:fc5bd600086ab6090e519d5c"
          ],
          "polarity": "POSITIVE",
          "perfective_token_id": "clause:4:token:2",
          "clause_id": "clause:4",
          "producer": "NATIVE_FRONTEND",
          "attachment_path": [
            "clause:4",
            "p1:2b1849abc7e29105eb70b977"
          ],
          "semantic_ownership": {
            "node_id": "p1:2b1849abc7e29105eb70b977",
            "status": "UNIQUE",
            "semantic_owner_id": "p1:c04a6fcca8a88e2ce3052a12",
            "owner_category": "CURRENT_TASK_ROOT",
            "predicate_layer": "MAIN",
            "syntactic_layer_id": "p1:e901b62daac62e628f4f901b",
            "owning_proposition_id": "clause:4",
            "discourse_domain": "CURRENT_TASK",
            "structural_parent_path": [
              "document",
              "structure:0"
            ],
            "attachment_path": [
              "document",
              "structure:0",
              "clause:4"
            ],
            "owner_output_ids": [],
            "ownership_relation_ids": [],
            "source_span_ids": [
              "p1:5e3b5ab04595aef88e78c85c",
              "p1:16c6c0a6d036213bdc5dc5e7",
              "p1:571d80d40877f6505adf1d06"
            ],
            "inheritance_override_proof": [
              {
                "rank": 1,
                "rule": "EXPLICIT_STRUCTURE_PATH",
                "structural_path": [
                  "document",
                  "structure:0"
                ],
                "source_span_ids": [
                  "p1:571d80d40877f6505adf1d06"
                ]
              }
            ],
            "negative_ownership_evidence": []
          }
        }
      }
    ],
    "relations": [
      {
        "relation_id": "p1:9a1356179ef6b0a998e369fb",
        "clause_id": "clause:0",
        "relation_type": "AGENT",
        "head_node_id": "p1:23c59e2354e7b39c3fb9b70d",
        "tail_node_id": "p1:0a644412188024b2b0ff4db1",
        "evidence_span_ids": [
          "p1:b0eccf72b3d1edf969c8f671",
          "p1:71bb1d16f0709043431028ea",
          "p1:e157be95c430ae6af88e6a37"
        ],
        "evidence_tier": "STRONG",
        "state": "REJECTED",
        "model_signal_refs": [
          "clause:0:token:4",
          "clause:0:token:0"
        ],
        "rule_refs": [
          "NATIVE_AGENT"
        ]
      },
      {
        "relation_id": "p1:7a1cf1efe8021d18c5f21cc7",
        "clause_id": "clause:0",
        "relation_type": "PATIENT",
        "head_node_id": "p1:23c59e2354e7b39c3fb9b70d",
        "tail_node_id": "p1:13b991f220929572e7a8b1fa",
        "evidence_span_ids": [
          "p1:b0eccf72b3d1edf969c8f671",
          "p1:e157be95c430ae6af88e6a37"
        ],
        "evidence_tier": "STRONG",
        "state": "REJECTED",
        "model_signal_refs": [
          "clause:0:token:4"
        ],
        "rule_refs": [
          "NATIVE_PATIENT"
        ]
      },
      {
        "relation_id": "p1:89a7f7c1806e1f6bce40b78c",
        "clause_id": "clause:0",
        "relation_type": "SCOPE_MEMBER",
        "head_node_id": "p1:3ddbd3949281cbe0716e59ad",
        "tail_node_id": "p1:13b991f220929572e7a8b1fa",
        "evidence_span_ids": [
          "p1:571d80d40877f6505adf1d06",
          "p1:b0eccf72b3d1edf969c8f671",
          "p1:e157be95c430ae6af88e6a37"
        ],
        "evidence_tier": "STRONG",
        "state": "REJECTED",
        "model_signal_refs": [],
        "rule_refs": [
          "NATIVE_SCOPE_MEMBER"
        ]
      },
      {
        "relation_id": "p1:0fd472c5ca879d856e495479",
        "clause_id": "clause:1",
        "relation_type": "PATIENT",
        "head_node_id": "p1:55751628ba342c5905e06203",
        "tail_node_id": "p1:a017f65f2618791bc5728c63",
        "evidence_span_ids": [
          "p1:fd66e7077083782d8fc63cf9",
          "p1:9d123dd0da21f3490930ff89",
          "p1:b6f9329b82cfe4bf264e6752"
        ],
        "evidence_tier": "STRONG",
        "state": "RESOLVED",
        "model_signal_refs": [
          "clause:1:token:1"
        ],
        "rule_refs": [
          "NATIVE_PATIENT"
        ]
      },
      {
        "relation_id": "p1:36ac3c5793dabb687e58d8be",
        "clause_id": "clause:2",
        "relation_type": "RESULT",
        "head_node_id": "p1:7be272d3f3a2df10061bef21",
        "tail_node_id": "p1:fc5bd600086ab6090e519d5c",
        "evidence_span_ids": [
          "p1:73e3c5ea188ca1c5d3a01a25",
          "p1:816520f3f44f6ecce1fcffe1",
          "p1:7f0793aa43172b583c71aea5"
        ],
        "evidence_tier": "STRONG",
        "state": "RESOLVED",
        "model_signal_refs": [
          "clause:2:token:0"
        ],
        "rule_refs": [
          "NATIVE_RESULT"
        ]
      },
      {
        "relation_id": "p1:f93ea6ea733bc8fc9e674b73",
        "clause_id": "clause:3",
        "relation_type": "FORBIDS",
        "head_node_id": "p1:5005d79d390f276a34b7caf4",
        "tail_node_id": "p1:5e56145673653f1ee7f21e69",
        "evidence_span_ids": [
          "p1:0ac85b43b0dc6a80218e77f0",
          "p1:55ad616030ab5968a94ded69",
          "p1:f33c3a1c29e28002155201ca"
        ],
        "evidence_tier": "STRONG",
        "state": "RESOLVED",
        "model_signal_refs": [
          "clause:3:token:2"
        ],
        "rule_refs": [
          "NATIVE_FORBIDS"
        ]
      },
      {
        "relation_id": "p1:d394d120378224a6b4da7245",
        "clause_id": "clause:5",
        "relation_type": "AGENT",
        "head_node_id": "p1:00c60db12ccee968ea34ba91",
        "tail_node_id": "p1:3cfba2fb6a90ae4e9f6ecd34",
        "evidence_span_ids": [
          "p1:389fc6806e332239f3a0a558",
          "p1:3dc88c03831e32f9a8fc67ce",
          "p1:a85ebf0b750986ebd6f278f6"
        ],
        "evidence_tier": "STRONG",
        "state": "RESOLVED",
        "model_signal_refs": [
          "clause:5:token:2",
          "clause:5:token:1"
        ],
        "rule_refs": [
          "NATIVE_AGENT"
        ]
      },
      {
        "relation_id": "p1:79a08469cd000a3ff52ee6f4",
        "clause_id": "clause:4",
        "relation_type": "AGENT",
        "head_node_id": "p1:3c21a1bf090fbc6ec5a038c3",
        "tail_node_id": "p1:ecd17316cc63a98d630af1d8",
        "evidence_span_ids": [
          "p1:c5e695a4d3c696b147d967d9",
          "p1:128b95de26c3a7705c96510e",
          "p1:16c6c0a6d036213bdc5dc5e7"
        ],
        "evidence_tier": "STRONG",
        "state": "REJECTED",
        "model_signal_refs": [
          "clause:4:token:2"
        ],
        "rule_refs": [
          "NATIVE_AGENT"
        ]
      },
      {
        "relation_id": "p1:f763ba315058fb8aea451f0b",
        "clause_id": "clause:1",
        "relation_type": "AGENT",
        "head_node_id": "p1:55751628ba342c5905e06203",
        "tail_node_id": "p1:0a644412188024b2b0ff4db1",
        "evidence_span_ids": [
          "p1:fd66e7077083782d8fc63cf9",
          "p1:71bb1d16f0709043431028ea",
          "p1:b6f9329b82cfe4bf264e6752"
        ],
        "evidence_tier": "STRONG",
        "state": "RESOLVED",
        "model_signal_refs": [
          "clause:1:token:1",
          "clause:0:token:0"
        ],
        "rule_refs": [
          "NATIVE_AGENT"
        ]
      },
      {
        "relation_id": "p1:f3a3ec29582ca92036ced2f9",
        "clause_id": "clause:2",
        "relation_type": "AGENT",
        "head_node_id": "p1:7be272d3f3a2df10061bef21",
        "tail_node_id": "p1:0a644412188024b2b0ff4db1",
        "evidence_span_ids": [
          "p1:73e3c5ea188ca1c5d3a01a25",
          "p1:71bb1d16f0709043431028ea",
          "p1:7f0793aa43172b583c71aea5"
        ],
        "evidence_tier": "STRONG",
        "state": "RESOLVED",
        "model_signal_refs": [
          "clause:2:token:0",
          "clause:0:token:0"
        ],
        "rule_refs": [
          "NATIVE_AGENT"
        ]
      },
      {
        "relation_id": "p1:ee1f0ad948cdfe14a4c667a6",
        "clause_id": "clause:3",
        "relation_type": "AGENT",
        "head_node_id": "p1:5005d79d390f276a34b7caf4",
        "tail_node_id": "p1:0a644412188024b2b0ff4db1",
        "evidence_span_ids": [
          "p1:0ac85b43b0dc6a80218e77f0",
          "p1:71bb1d16f0709043431028ea",
          "p1:f33c3a1c29e28002155201ca"
        ],
        "evidence_tier": "STRONG",
        "state": "RESOLVED",
        "model_signal_refs": [
          "clause:3:token:2",
          "clause:0:token:0"
        ],
        "rule_refs": [
          "NATIVE_AGENT"
        ]
      },
      {
        "relation_id": "p1:30f048f55c1175bd7c206c2d",
        "clause_id": "clause:1",
        "relation_type": "SCOPE_MEMBER",
        "head_node_id": "p1:55751628ba342c5905e06203",
        "tail_node_id": "p1:a017f65f2618791bc5728c63",
        "evidence_span_ids": [
          "p1:fd66e7077083782d8fc63cf9",
          "p1:9d123dd0da21f3490930ff89",
          "p1:b6f9329b82cfe4bf264e6752"
        ],
        "evidence_tier": "STRONG",
        "state": "RESOLVED",
        "model_signal_refs": [
          "clause:1:token:1"
        ],
        "rule_refs": [
          "NATIVE_SCOPE_MEMBER"
        ]
      },
      {
        "relation_id": "p1:be818ec586992582f977e909",
        "clause_id": "clause:0",
        "relation_type": "AGENT",
        "head_node_id": "p1:2de8e54fcb2f544ce2f6d95d",
        "tail_node_id": "p1:664c7119ec8c17c7363d4a2d",
        "evidence_span_ids": [
          "p1:2cbc54e36db5ace4bf94cf39",
          "p1:71bb1d16f0709043431028ea",
          "p1:e157be95c430ae6af88e6a37"
        ],
        "evidence_tier": "STRONG",
        "state": "RESOLVED",
        "model_signal_refs": [],
        "rule_refs": [
          "NATIVE_AGENT",
          "SHORT_DIRECT_SYNTAX"
        ]
      },
      {
        "relation_id": "p1:9a7186b2ce7dc7f94f019028",
        "clause_id": "clause:4",
        "relation_type": "CONJUNCTION",
        "head_node_id": "p1:2b1849abc7e29105eb70b977",
        "tail_node_id": "p1:fc5bd600086ab6090e519d5c",
        "evidence_span_ids": [
          "p1:5e3b5ab04595aef88e78c85c",
          "p1:816520f3f44f6ecce1fcffe1",
          "p1:7f0793aa43172b583c71aea5",
          "p1:16c6c0a6d036213bdc5dc5e7"
        ],
        "evidence_tier": "STRONG",
        "state": "RESOLVED",
        "model_signal_refs": [],
        "rule_refs": [
          "NATIVE_CONJUNCTION",
          "SHORT_DIRECT_SYNTAX"
        ]
      },
      {
        "relation_id": "p1:846306081530b2461ab45f14",
        "clause_id": "clause:5",
        "relation_type": "COMPLETION_OF",
        "head_node_id": "p1:2b1849abc7e29105eb70b977",
        "tail_node_id": "p1:00c60db12ccee968ea34ba91",
        "evidence_span_ids": [
          "p1:5e3b5ab04595aef88e78c85c",
          "p1:389fc6806e332239f3a0a558",
          "p1:a85ebf0b750986ebd6f278f6",
          "p1:16c6c0a6d036213bdc5dc5e7"
        ],
        "evidence_tier": "STRONG",
        "state": "RESOLVED",
        "model_signal_refs": [
          "clause:5:token:2"
        ],
        "rule_refs": [
          "NATIVE_COMPLETION_OF",
          "SHORT_DIRECT_SYNTAX"
        ]
      }
    ],
    "relation_bundles": [
      {
        "bundle_id": "p1:c7ad0e6718c1e4dbb7238f70",
        "clause_ids": [
          "clause:0"
        ],
        "relation_ids": [
          "p1:9a1356179ef6b0a998e369fb",
          "p1:7a1cf1efe8021d18c5f21cc7",
          "p1:89a7f7c1806e1f6bce40b78c",
          "p1:be818ec586992582f977e909"
        ],
        "bundle_state": "RESOLVED",
        "unresolved_refs": []
      },
      {
        "bundle_id": "p1:c7a06645af02d53b2ee943ed",
        "clause_ids": [
          "clause:1"
        ],
        "relation_ids": [
          "p1:0fd472c5ca879d856e495479",
          "p1:f763ba315058fb8aea451f0b",
          "p1:30f048f55c1175bd7c206c2d"
        ],
        "bundle_state": "RESOLVED",
        "unresolved_refs": []
      },
      {
        "bundle_id": "p1:f9b012bff23ca91df0566879",
        "clause_ids": [
          "clause:2"
        ],
        "relation_ids": [
          "p1:36ac3c5793dabb687e58d8be",
          "p1:f3a3ec29582ca92036ced2f9"
        ],
        "bundle_state": "RESOLVED",
        "unresolved_refs": []
      },
      {
        "bundle_id": "p1:189b9b480b87efcad3880c2a",
        "clause_ids": [
          "clause:3"
        ],
        "relation_ids": [
          "p1:f93ea6ea733bc8fc9e674b73",
          "p1:ee1f0ad948cdfe14a4c667a6"
        ],
        "bundle_state": "RESOLVED",
        "unresolved_refs": []
      },
      {
        "bundle_id": "p1:23b122454d9015611db8aa1b",
        "clause_ids": [
          "clause:4"
        ],
        "relation_ids": [
          "p1:79a08469cd000a3ff52ee6f4",
          "p1:9a7186b2ce7dc7f94f019028"
        ],
        "bundle_state": "RESOLVED",
        "unresolved_refs": []
      },
      {
        "bundle_id": "p1:4f57ab522748a19b759b0820",
        "clause_ids": [
          "clause:5"
        ],
        "relation_ids": [
          "p1:d394d120378224a6b4da7245",
          "p1:846306081530b2461ab45f14"
        ],
        "bundle_state": "RESOLVED",
        "unresolved_refs": []
      }
    ],
    "unresolved": [],
    "eligibility_decisions": [
      {
        "eligibility_decision_id": "p1:b44eb5a9e9218085a49d4520",
        "disposition": "BOUNDARY",
        "candidate_relation_ids": [
          "p1:36ac3c5793dabb687e58d8be",
          "p1:f3a3ec29582ca92036ced2f9"
        ],
        "candidate_node_ids": [
          "p1:7be272d3f3a2df10061bef21",
          "p1:fc5bd600086ab6090e519d5c",
          "p1:0a644412188024b2b0ff4db1"
        ],
        "proposed_fact_type": "DELIVERABLE",
        "reason_code": "EXPLICIT_DELIVERABLE",
        "source_span_ids": [
          "p1:73e3c5ea188ca1c5d3a01a25",
          "p1:7f0793aa43172b583c71aea5",
          "p1:816520f3f44f6ecce1fcffe1",
          "p1:71bb1d16f0709043431028ea",
          "p1:e157be95c430ae6af88e6a37"
        ]
      },
      {
        "eligibility_decision_id": "p1:598c3fcb7e54f82ca73630ff",
        "disposition": "BOUNDARY",
        "candidate_relation_ids": [
          "p1:f763ba315058fb8aea451f0b"
        ],
        "candidate_node_ids": [
          "p1:0a644412188024b2b0ff4db1",
          "p1:55751628ba342c5905e06203"
        ],
        "proposed_fact_type": "PARTICIPANT",
        "reason_code": "PARTICIPATION_RELATION",
        "source_span_ids": [
          "p1:71bb1d16f0709043431028ea",
          "p1:e157be95c430ae6af88e6a37",
          "p1:fd66e7077083782d8fc63cf9",
          "p1:b6f9329b82cfe4bf264e6752"
        ]
      },
      {
        "eligibility_decision_id": "p1:20e2a0f291dbc0a9f5854330",
        "disposition": "BOUNDARY",
        "candidate_relation_ids": [
          "p1:f3a3ec29582ca92036ced2f9"
        ],
        "candidate_node_ids": [
          "p1:0a644412188024b2b0ff4db1",
          "p1:7be272d3f3a2df10061bef21"
        ],
        "proposed_fact_type": "PARTICIPANT",
        "reason_code": "PARTICIPATION_RELATION",
        "source_span_ids": [
          "p1:71bb1d16f0709043431028ea",
          "p1:e157be95c430ae6af88e6a37",
          "p1:73e3c5ea188ca1c5d3a01a25",
          "p1:7f0793aa43172b583c71aea5"
        ]
      },
      {
        "eligibility_decision_id": "p1:169edde73f610443fdc66893",
        "disposition": "BOUNDARY",
        "candidate_relation_ids": [
          "p1:ee1f0ad948cdfe14a4c667a6"
        ],
        "candidate_node_ids": [
          "p1:0a644412188024b2b0ff4db1",
          "p1:5005d79d390f276a34b7caf4"
        ],
        "proposed_fact_type": "PARTICIPANT",
        "reason_code": "PARTICIPATION_RELATION",
        "source_span_ids": [
          "p1:71bb1d16f0709043431028ea",
          "p1:e157be95c430ae6af88e6a37",
          "p1:0ac85b43b0dc6a80218e77f0",
          "p1:f33c3a1c29e28002155201ca"
        ]
      },
      {
        "eligibility_decision_id": "p1:67f822d410e84a3321cb8820",
        "disposition": "BOUNDARY",
        "candidate_relation_ids": [
          "p1:30f048f55c1175bd7c206c2d"
        ],
        "candidate_node_ids": [
          "p1:a017f65f2618791bc5728c63",
          "p1:55751628ba342c5905e06203"
        ],
        "proposed_fact_type": "TASK_OBJECT",
        "reason_code": "EXPLICIT_TASK_SCOPE",
        "source_span_ids": [
          "p1:9d123dd0da21f3490930ff89",
          "p1:b6f9329b82cfe4bf264e6752",
          "p1:fd66e7077083782d8fc63cf9"
        ]
      },
      {
        "eligibility_decision_id": "p1:c7ec0f12624379da4dff5302",
        "disposition": "BOUNDARY",
        "candidate_relation_ids": [
          "p1:be818ec586992582f977e909"
        ],
        "candidate_node_ids": [
          "p1:664c7119ec8c17c7363d4a2d",
          "p1:2de8e54fcb2f544ce2f6d95d"
        ],
        "proposed_fact_type": "PARTICIPANT",
        "reason_code": "PARTICIPATION_RELATION",
        "source_span_ids": [
          "p1:71bb1d16f0709043431028ea",
          "p1:e157be95c430ae6af88e6a37",
          "p1:2cbc54e36db5ace4bf94cf39"
        ]
      },
      {
        "eligibility_decision_id": "p1:3bfc3ff113e3f5fd52b90c53",
        "disposition": "AUXILIARY",
        "candidate_relation_ids": [
          "p1:be818ec586992582f977e909"
        ],
        "candidate_node_ids": [
          "p1:2de8e54fcb2f544ce2f6d95d",
          "p1:664c7119ec8c17c7363d4a2d"
        ],
        "proposed_fact_type": "AUX_CONDITION",
        "reason_code": "AUXILIARY_CONDITION",
        "source_span_ids": [
          "p1:2cbc54e36db5ace4bf94cf39",
          "p1:e157be95c430ae6af88e6a37",
          "p1:71bb1d16f0709043431028ea"
        ]
      },
      {
        "eligibility_decision_id": "p1:a1c1a7ea3b1afcc1ac66e181",
        "disposition": "BOUNDARY",
        "candidate_relation_ids": [
          "p1:0fd472c5ca879d856e495479",
          "p1:f763ba315058fb8aea451f0b",
          "p1:30f048f55c1175bd7c206c2d"
        ],
        "candidate_node_ids": [
          "p1:55751628ba342c5905e06203",
          "p1:a017f65f2618791bc5728c63",
          "p1:0a644412188024b2b0ff4db1"
        ],
        "proposed_fact_type": "ACTION",
        "reason_code": "POSITIVE_ACTION_TARGET",
        "source_span_ids": [
          "p1:fd66e7077083782d8fc63cf9",
          "p1:b6f9329b82cfe4bf264e6752",
          "p1:9d123dd0da21f3490930ff89",
          "p1:71bb1d16f0709043431028ea",
          "p1:e157be95c430ae6af88e6a37"
        ]
      },
      {
        "eligibility_decision_id": "p1:20c6751b0e65ecf36bc0244e",
        "disposition": "BOUNDARY",
        "candidate_relation_ids": [
          "p1:36ac3c5793dabb687e58d8be",
          "p1:f3a3ec29582ca92036ced2f9"
        ],
        "candidate_node_ids": [
          "p1:7be272d3f3a2df10061bef21",
          "p1:fc5bd600086ab6090e519d5c",
          "p1:0a644412188024b2b0ff4db1"
        ],
        "proposed_fact_type": "ACTION",
        "reason_code": "POSITIVE_ACTION_TARGET",
        "source_span_ids": [
          "p1:73e3c5ea188ca1c5d3a01a25",
          "p1:7f0793aa43172b583c71aea5",
          "p1:816520f3f44f6ecce1fcffe1",
          "p1:71bb1d16f0709043431028ea",
          "p1:e157be95c430ae6af88e6a37"
        ]
      },
      {
        "eligibility_decision_id": "p1:e84eb5c0ac1d8a838a64e408",
        "disposition": "BOUNDARY",
        "candidate_relation_ids": [
          "p1:f93ea6ea733bc8fc9e674b73",
          "p1:ee1f0ad948cdfe14a4c667a6"
        ],
        "candidate_node_ids": [
          "p1:5005d79d390f276a34b7caf4",
          "p1:5e56145673653f1ee7f21e69",
          "p1:0a644412188024b2b0ff4db1"
        ],
        "proposed_fact_type": "FORBID",
        "reason_code": "FORBIDDEN_OR_RESTRICTED",
        "source_span_ids": [
          "p1:0ac85b43b0dc6a80218e77f0",
          "p1:f33c3a1c29e28002155201ca",
          "p1:55ad616030ab5968a94ded69",
          "p1:71bb1d16f0709043431028ea",
          "p1:e157be95c430ae6af88e6a37"
        ]
      },
      {
        "eligibility_decision_id": "p1:78258d164c6ec4e7fbe251cf",
        "disposition": "AUXILIARY",
        "candidate_relation_ids": [
          "p1:9a7186b2ce7dc7f94f019028",
          "p1:846306081530b2461ab45f14"
        ],
        "candidate_node_ids": [
          "p1:2b1849abc7e29105eb70b977",
          "p1:fc5bd600086ab6090e519d5c",
          "p1:00c60db12ccee968ea34ba91"
        ],
        "proposed_fact_type": "AUX_CONDITION",
        "reason_code": "AUXILIARY_CONDITION",
        "source_span_ids": [
          "p1:5e3b5ab04595aef88e78c85c",
          "p1:16c6c0a6d036213bdc5dc5e7",
          "p1:816520f3f44f6ecce1fcffe1",
          "p1:7f0793aa43172b583c71aea5",
          "p1:389fc6806e332239f3a0a558",
          "p1:a85ebf0b750986ebd6f278f6"
        ]
      },
      {
        "eligibility_decision_id": "p1:119c8d1c48d9ef2d0ef26a59",
        "disposition": "BOUNDARY",
        "candidate_relation_ids": [
          "p1:d394d120378224a6b4da7245",
          "p1:846306081530b2461ab45f14"
        ],
        "candidate_node_ids": [
          "p1:00c60db12ccee968ea34ba91",
          "p1:3cfba2fb6a90ae4e9f6ecd34",
          "p1:2b1849abc7e29105eb70b977"
        ],
        "proposed_fact_type": "COMPLETION",
        "reason_code": "COMPLETION_OR_STOP",
        "source_span_ids": [
          "p1:389fc6806e332239f3a0a558",
          "p1:a85ebf0b750986ebd6f278f6",
          "p1:3dc88c03831e32f9a8fc67ce",
          "p1:5e3b5ab04595aef88e78c85c",
          "p1:16c6c0a6d036213bdc5dc5e7"
        ]
      }
    ],
    "coverage": [
      {
        "coverage_record_id": "p1:e27e4edc016747349edd0031",
        "structure_node_id": "p1:790dc1131030de4e896c7d81",
        "clause_id": "clause:0",
        "source_span_ids": [
          "p1:e157be95c430ae6af88e6a37"
        ],
        "disposition": "BOUNDARY",
        "eligibility_decision_ids": [
          "p1:b44eb5a9e9218085a49d4520",
          "p1:598c3fcb7e54f82ca73630ff",
          "p1:20e2a0f291dbc0a9f5854330",
          "p1:169edde73f610443fdc66893",
          "p1:c7ec0f12624379da4dff5302",
          "p1:3bfc3ff113e3f5fd52b90c53",
          "p1:a1c1a7ea3b1afcc1ac66e181",
          "p1:20c6751b0e65ecf36bc0244e",
          "p1:e84eb5c0ac1d8a838a64e408"
        ],
        "boundary_fact_ids": [
          "p1:25db7909b655b127c94ac52e",
          "p1:3cf8374a471711a39f37828a",
          "p1:0fd728867025bcf62ca6f49c",
          "p1:43017ecf588a9f9b075a09c1",
          "p1:39def642cb34db8d48d1d139",
          "p1:64f42d5c806d9784151671ca",
          "p1:a25d81dda7c37a90aef2737f",
          "p1:d0fc1fc6620b810553765d1b",
          "p1:7906742ddcd0ef3266fba15a"
        ],
        "unresolved_refs": [],
        "reason": "Native clause eligibility and unsupported diagnostics",
        "affected_slots": [
          "O",
          "P",
          "A",
          "B"
        ],
        "impact_kind": "MAY_ADD_ENTRY",
        "impact_evidence": {
          "eligibility_decision_ids": [
            "p1:b44eb5a9e9218085a49d4520",
            "p1:598c3fcb7e54f82ca73630ff",
            "p1:20e2a0f291dbc0a9f5854330",
            "p1:169edde73f610443fdc66893",
            "p1:c7ec0f12624379da4dff5302",
            "p1:3bfc3ff113e3f5fd52b90c53",
            "p1:a1c1a7ea3b1afcc1ac66e181",
            "p1:20c6751b0e65ecf36bc0244e",
            "p1:e84eb5c0ac1d8a838a64e408"
          ],
          "unresolved_refs": [],
          "untyped_source_failure": false
        }
      },
      {
        "coverage_record_id": "p1:94042bf3292f50aa2455bf6c",
        "structure_node_id": "p1:295b34de6a82eb3701ccdf5e",
        "clause_id": "clause:1",
        "source_span_ids": [
          "p1:b6f9329b82cfe4bf264e6752"
        ],
        "disposition": "BOUNDARY",
        "eligibility_decision_ids": [
          "p1:598c3fcb7e54f82ca73630ff",
          "p1:67f822d410e84a3321cb8820",
          "p1:a1c1a7ea3b1afcc1ac66e181"
        ],
        "boundary_fact_ids": [
          "p1:3cf8374a471711a39f37828a",
          "p1:6850d7497fe2fda8ada15473",
          "p1:a25d81dda7c37a90aef2737f"
        ],
        "unresolved_refs": [],
        "reason": "Native clause eligibility and unsupported diagnostics",
        "affected_slots": [
          "P",
          "I",
          "A"
        ],
        "impact_kind": "MAY_ADD_ENTRY",
        "impact_evidence": {
          "eligibility_decision_ids": [
            "p1:598c3fcb7e54f82ca73630ff",
            "p1:67f822d410e84a3321cb8820",
            "p1:a1c1a7ea3b1afcc1ac66e181"
          ],
          "unresolved_refs": [],
          "untyped_source_failure": false
        }
      },
      {
        "coverage_record_id": "p1:e09accc164cbf75e6440b0b3",
        "structure_node_id": "p1:9ef48724620d2f05e7b5a545",
        "clause_id": "clause:2",
        "source_span_ids": [
          "p1:7f0793aa43172b583c71aea5"
        ],
        "disposition": "BOUNDARY",
        "eligibility_decision_ids": [
          "p1:b44eb5a9e9218085a49d4520",
          "p1:20e2a0f291dbc0a9f5854330",
          "p1:20c6751b0e65ecf36bc0244e",
          "p1:78258d164c6ec4e7fbe251cf"
        ],
        "boundary_fact_ids": [
          "p1:25db7909b655b127c94ac52e",
          "p1:0fd728867025bcf62ca6f49c",
          "p1:d0fc1fc6620b810553765d1b",
          "p1:52ff821ef6da4c45252ff5d6"
        ],
        "unresolved_refs": [],
        "reason": "Native clause eligibility and unsupported diagnostics",
        "affected_slots": [
          "O",
          "P",
          "A",
          "C"
        ],
        "impact_kind": "MAY_ADD_ENTRY",
        "impact_evidence": {
          "eligibility_decision_ids": [
            "p1:b44eb5a9e9218085a49d4520",
            "p1:20e2a0f291dbc0a9f5854330",
            "p1:20c6751b0e65ecf36bc0244e",
            "p1:78258d164c6ec4e7fbe251cf"
          ],
          "unresolved_refs": [],
          "untyped_source_failure": false
        }
      },
      {
        "coverage_record_id": "p1:1ce48be4bd6cb91a9cc557cb",
        "structure_node_id": "p1:faf62552282d54f874aaf77f",
        "clause_id": "clause:3",
        "source_span_ids": [
          "p1:f33c3a1c29e28002155201ca"
        ],
        "disposition": "BOUNDARY",
        "eligibility_decision_ids": [
          "p1:169edde73f610443fdc66893",
          "p1:e84eb5c0ac1d8a838a64e408"
        ],
        "boundary_fact_ids": [
          "p1:43017ecf588a9f9b075a09c1",
          "p1:7906742ddcd0ef3266fba15a"
        ],
        "unresolved_refs": [],
        "reason": "Native clause eligibility and unsupported diagnostics",
        "affected_slots": [
          "P",
          "B"
        ],
        "impact_kind": "MAY_ADD_ENTRY",
        "impact_evidence": {
          "eligibility_decision_ids": [
            "p1:169edde73f610443fdc66893",
            "p1:e84eb5c0ac1d8a838a64e408"
          ],
          "unresolved_refs": [],
          "untyped_source_failure": false
        }
      },
      {
        "coverage_record_id": "p1:6649aca1a49550be107881ae",
        "structure_node_id": "p1:a27bebeb10ba2b90cb3f17b3",
        "clause_id": "clause:4",
        "source_span_ids": [
          "p1:16c6c0a6d036213bdc5dc5e7"
        ],
        "disposition": "BOUNDARY",
        "eligibility_decision_ids": [
          "p1:78258d164c6ec4e7fbe251cf",
          "p1:119c8d1c48d9ef2d0ef26a59"
        ],
        "boundary_fact_ids": [
          "p1:52ff821ef6da4c45252ff5d6",
          "p1:53e0b9a627e3ae775dea0130"
        ],
        "unresolved_refs": [],
        "reason": "Native clause eligibility and unsupported diagnostics",
        "affected_slots": [
          "C",
          "A",
          "O"
        ],
        "impact_kind": "MAY_ADD_ENTRY",
        "impact_evidence": {
          "eligibility_decision_ids": [
            "p1:78258d164c6ec4e7fbe251cf",
            "p1:119c8d1c48d9ef2d0ef26a59"
          ],
          "unresolved_refs": [],
          "untyped_source_failure": false
        }
      },
      {
        "coverage_record_id": "p1:0c5dfb22b392b35ef31aa199",
        "structure_node_id": "p1:d27ad35fa88623aacaf7228b",
        "clause_id": "clause:5",
        "source_span_ids": [
          "p1:a85ebf0b750986ebd6f278f6"
        ],
        "disposition": "BOUNDARY",
        "eligibility_decision_ids": [
          "p1:78258d164c6ec4e7fbe251cf",
          "p1:119c8d1c48d9ef2d0ef26a59"
        ],
        "boundary_fact_ids": [
          "p1:52ff821ef6da4c45252ff5d6",
          "p1:53e0b9a627e3ae775dea0130"
        ],
        "unresolved_refs": [],
        "reason": "Native clause eligibility and unsupported diagnostics",
        "affected_slots": [
          "C",
          "A",
          "O"
        ],
        "impact_kind": "MAY_ADD_ENTRY",
        "impact_evidence": {
          "eligibility_decision_ids": [
            "p1:78258d164c6ec4e7fbe251cf",
            "p1:119c8d1c48d9ef2d0ef26a59"
          ],
          "unresolved_refs": [],
          "untyped_source_failure": false
        }
      },
      {
        "coverage_record_id": "p1:170ecd025bb36b5ea8fe1aa1",
        "structure_node_id": "p1:4f9bce20abe7b4131e4edfe1",
        "source_span_ids": [
          "p1:571d80d40877f6505adf1d06"
        ],
        "disposition": "BOUNDARY",
        "eligibility_decision_ids": [
          "p1:b44eb5a9e9218085a49d4520",
          "p1:598c3fcb7e54f82ca73630ff",
          "p1:20e2a0f291dbc0a9f5854330",
          "p1:169edde73f610443fdc66893",
          "p1:c7ec0f12624379da4dff5302",
          "p1:3bfc3ff113e3f5fd52b90c53",
          "p1:a1c1a7ea3b1afcc1ac66e181",
          "p1:20c6751b0e65ecf36bc0244e",
          "p1:e84eb5c0ac1d8a838a64e408",
          "p1:67f822d410e84a3321cb8820",
          "p1:78258d164c6ec4e7fbe251cf",
          "p1:119c8d1c48d9ef2d0ef26a59"
        ],
        "boundary_fact_ids": [
          "p1:25db7909b655b127c94ac52e",
          "p1:3cf8374a471711a39f37828a",
          "p1:0fd728867025bcf62ca6f49c",
          "p1:43017ecf588a9f9b075a09c1",
          "p1:6850d7497fe2fda8ada15473",
          "p1:39def642cb34db8d48d1d139",
          "p1:64f42d5c806d9784151671ca",
          "p1:a25d81dda7c37a90aef2737f",
          "p1:d0fc1fc6620b810553765d1b",
          "p1:7906742ddcd0ef3266fba15a",
          "p1:52ff821ef6da4c45252ff5d6",
          "p1:53e0b9a627e3ae775dea0130"
        ],
        "unresolved_refs": [],
        "reason": "Aggregate child clause decisions; syntax-only gaps retained",
        "affected_slots": [
          "O",
          "P",
          "I",
          "A",
          "B",
          "C"
        ],
        "impact_kind": "MAY_ADD_ENTRY",
        "impact_evidence": {
          "eligibility_decision_ids": [
            "p1:b44eb5a9e9218085a49d4520",
            "p1:598c3fcb7e54f82ca73630ff",
            "p1:20e2a0f291dbc0a9f5854330",
            "p1:169edde73f610443fdc66893",
            "p1:67f822d410e84a3321cb8820",
            "p1:c7ec0f12624379da4dff5302",
            "p1:3bfc3ff113e3f5fd52b90c53",
            "p1:a1c1a7ea3b1afcc1ac66e181",
            "p1:20c6751b0e65ecf36bc0244e",
            "p1:e84eb5c0ac1d8a838a64e408",
            "p1:78258d164c6ec4e7fbe251cf",
            "p1:119c8d1c48d9ef2d0ef26a59"
          ],
          "unresolved_refs": [],
          "untyped_source_failure": false
        }
      }
    ],
    "boundary_ir": {
      "boundary_ir_id": "p1:cbe48b1f7e823bb296fabb73",
      "facts": [
        {
          "boundary_fact_id": "p1:25db7909b655b127c94ac52e",
          "fact_type": "DELIVERABLE",
          "state": "RESOLVED",
          "subject_node_ids": [],
          "object_node_ids": [
            "p1:fc5bd600086ab6090e519d5c"
          ],
          "participant_node_ids": [],
          "node_ids": [
            "p1:7be272d3f3a2df10061bef21",
            "p1:fc5bd600086ab6090e519d5c",
            "p1:0a644412188024b2b0ff4db1"
          ],
          "relation_ids": [
            "p1:36ac3c5793dabb687e58d8be",
            "p1:f3a3ec29582ca92036ced2f9"
          ],
          "source_span_ids": [
            "p1:73e3c5ea188ca1c5d3a01a25",
            "p1:7f0793aa43172b583c71aea5",
            "p1:816520f3f44f6ecce1fcffe1",
            "p1:71bb1d16f0709043431028ea",
            "p1:e157be95c430ae6af88e6a37"
          ],
          "eligibility_decision_id": "p1:b44eb5a9e9218085a49d4520",
          "predicate_node_id": "p1:7be272d3f3a2df10061bef21",
          "scope_expr_id": "p1:ec6cf92172ddb7f1685df2f5"
        },
        {
          "boundary_fact_id": "p1:3cf8374a471711a39f37828a",
          "fact_type": "PARTICIPANT",
          "state": "RESOLVED",
          "subject_node_ids": [],
          "object_node_ids": [],
          "participant_node_ids": [
            "p1:0a644412188024b2b0ff4db1"
          ],
          "node_ids": [
            "p1:0a644412188024b2b0ff4db1",
            "p1:55751628ba342c5905e06203"
          ],
          "relation_ids": [
            "p1:f763ba315058fb8aea451f0b"
          ],
          "source_span_ids": [
            "p1:71bb1d16f0709043431028ea",
            "p1:e157be95c430ae6af88e6a37",
            "p1:fd66e7077083782d8fc63cf9",
            "p1:b6f9329b82cfe4bf264e6752"
          ],
          "eligibility_decision_id": "p1:598c3fcb7e54f82ca73630ff"
        },
        {
          "boundary_fact_id": "p1:0fd728867025bcf62ca6f49c",
          "fact_type": "PARTICIPANT",
          "state": "RESOLVED",
          "subject_node_ids": [],
          "object_node_ids": [],
          "participant_node_ids": [
            "p1:0a644412188024b2b0ff4db1"
          ],
          "node_ids": [
            "p1:0a644412188024b2b0ff4db1",
            "p1:7be272d3f3a2df10061bef21"
          ],
          "relation_ids": [
            "p1:f3a3ec29582ca92036ced2f9"
          ],
          "source_span_ids": [
            "p1:71bb1d16f0709043431028ea",
            "p1:e157be95c430ae6af88e6a37",
            "p1:73e3c5ea188ca1c5d3a01a25",
            "p1:7f0793aa43172b583c71aea5"
          ],
          "eligibility_decision_id": "p1:20e2a0f291dbc0a9f5854330"
        },
        {
          "boundary_fact_id": "p1:43017ecf588a9f9b075a09c1",
          "fact_type": "PARTICIPANT",
          "state": "RESOLVED",
          "subject_node_ids": [],
          "object_node_ids": [],
          "participant_node_ids": [
            "p1:0a644412188024b2b0ff4db1"
          ],
          "node_ids": [
            "p1:0a644412188024b2b0ff4db1",
            "p1:5005d79d390f276a34b7caf4"
          ],
          "relation_ids": [
            "p1:ee1f0ad948cdfe14a4c667a6"
          ],
          "source_span_ids": [
            "p1:71bb1d16f0709043431028ea",
            "p1:e157be95c430ae6af88e6a37",
            "p1:0ac85b43b0dc6a80218e77f0",
            "p1:f33c3a1c29e28002155201ca"
          ],
          "eligibility_decision_id": "p1:169edde73f610443fdc66893"
        },
        {
          "boundary_fact_id": "p1:6850d7497fe2fda8ada15473",
          "fact_type": "TASK_OBJECT",
          "state": "RESOLVED",
          "subject_node_ids": [],
          "object_node_ids": [
            "p1:a017f65f2618791bc5728c63"
          ],
          "participant_node_ids": [],
          "node_ids": [
            "p1:a017f65f2618791bc5728c63",
            "p1:55751628ba342c5905e06203"
          ],
          "relation_ids": [
            "p1:30f048f55c1175bd7c206c2d"
          ],
          "source_span_ids": [
            "p1:9d123dd0da21f3490930ff89",
            "p1:b6f9329b82cfe4bf264e6752",
            "p1:fd66e7077083782d8fc63cf9"
          ],
          "eligibility_decision_id": "p1:67f822d410e84a3321cb8820",
          "scope_expr_id": "p1:f9cc48d78faa50dad8627855"
        },
        {
          "boundary_fact_id": "p1:39def642cb34db8d48d1d139",
          "fact_type": "PARTICIPANT",
          "state": "RESOLVED",
          "subject_node_ids": [],
          "object_node_ids": [],
          "participant_node_ids": [
            "p1:664c7119ec8c17c7363d4a2d"
          ],
          "node_ids": [
            "p1:664c7119ec8c17c7363d4a2d",
            "p1:2de8e54fcb2f544ce2f6d95d"
          ],
          "relation_ids": [
            "p1:be818ec586992582f977e909"
          ],
          "source_span_ids": [
            "p1:71bb1d16f0709043431028ea",
            "p1:e157be95c430ae6af88e6a37",
            "p1:2cbc54e36db5ace4bf94cf39"
          ],
          "eligibility_decision_id": "p1:c7ec0f12624379da4dff5302"
        },
        {
          "boundary_fact_id": "p1:64f42d5c806d9784151671ca",
          "fact_type": "AUX_CONDITION",
          "state": "RESOLVED",
          "subject_node_ids": [],
          "object_node_ids": [],
          "participant_node_ids": [],
          "node_ids": [
            "p1:2de8e54fcb2f544ce2f6d95d",
            "p1:664c7119ec8c17c7363d4a2d"
          ],
          "relation_ids": [
            "p1:be818ec586992582f977e909"
          ],
          "source_span_ids": [
            "p1:2cbc54e36db5ace4bf94cf39",
            "p1:e157be95c430ae6af88e6a37",
            "p1:71bb1d16f0709043431028ea"
          ],
          "eligibility_decision_id": "p1:3bfc3ff113e3f5fd52b90c53"
        },
        {
          "boundary_fact_id": "p1:a25d81dda7c37a90aef2737f",
          "fact_type": "ACTION",
          "state": "RESOLVED",
          "subject_node_ids": [
            "p1:0a644412188024b2b0ff4db1"
          ],
          "object_node_ids": [
            "p1:a017f65f2618791bc5728c63"
          ],
          "participant_node_ids": [],
          "node_ids": [
            "p1:55751628ba342c5905e06203",
            "p1:a017f65f2618791bc5728c63",
            "p1:0a644412188024b2b0ff4db1"
          ],
          "relation_ids": [
            "p1:0fd472c5ca879d856e495479",
            "p1:f763ba315058fb8aea451f0b",
            "p1:30f048f55c1175bd7c206c2d"
          ],
          "source_span_ids": [
            "p1:fd66e7077083782d8fc63cf9",
            "p1:b6f9329b82cfe4bf264e6752",
            "p1:9d123dd0da21f3490930ff89",
            "p1:71bb1d16f0709043431028ea",
            "p1:e157be95c430ae6af88e6a37"
          ],
          "eligibility_decision_id": "p1:a1c1a7ea3b1afcc1ac66e181",
          "predicate_node_id": "p1:55751628ba342c5905e06203",
          "scope_expr_id": "p1:4ac8dd9472408c314bb27336"
        },
        {
          "boundary_fact_id": "p1:d0fc1fc6620b810553765d1b",
          "fact_type": "ACTION",
          "state": "RESOLVED",
          "subject_node_ids": [
            "p1:0a644412188024b2b0ff4db1"
          ],
          "object_node_ids": [
            "p1:fc5bd600086ab6090e519d5c"
          ],
          "participant_node_ids": [],
          "node_ids": [
            "p1:7be272d3f3a2df10061bef21",
            "p1:fc5bd600086ab6090e519d5c",
            "p1:0a644412188024b2b0ff4db1"
          ],
          "relation_ids": [
            "p1:36ac3c5793dabb687e58d8be",
            "p1:f3a3ec29582ca92036ced2f9"
          ],
          "source_span_ids": [
            "p1:73e3c5ea188ca1c5d3a01a25",
            "p1:7f0793aa43172b583c71aea5",
            "p1:816520f3f44f6ecce1fcffe1",
            "p1:71bb1d16f0709043431028ea",
            "p1:e157be95c430ae6af88e6a37"
          ],
          "eligibility_decision_id": "p1:20c6751b0e65ecf36bc0244e",
          "predicate_node_id": "p1:7be272d3f3a2df10061bef21",
          "scope_expr_id": "p1:ec6cf92172ddb7f1685df2f5"
        },
        {
          "boundary_fact_id": "p1:7906742ddcd0ef3266fba15a",
          "fact_type": "FORBID",
          "state": "RESOLVED",
          "subject_node_ids": [
            "p1:0a644412188024b2b0ff4db1"
          ],
          "object_node_ids": [
            "p1:5e56145673653f1ee7f21e69"
          ],
          "participant_node_ids": [],
          "node_ids": [
            "p1:5005d79d390f276a34b7caf4",
            "p1:5e56145673653f1ee7f21e69",
            "p1:0a644412188024b2b0ff4db1"
          ],
          "relation_ids": [
            "p1:f93ea6ea733bc8fc9e674b73",
            "p1:ee1f0ad948cdfe14a4c667a6"
          ],
          "source_span_ids": [
            "p1:0ac85b43b0dc6a80218e77f0",
            "p1:f33c3a1c29e28002155201ca",
            "p1:55ad616030ab5968a94ded69",
            "p1:71bb1d16f0709043431028ea",
            "p1:e157be95c430ae6af88e6a37"
          ],
          "eligibility_decision_id": "p1:e84eb5c0ac1d8a838a64e408",
          "predicate_node_id": "p1:5005d79d390f276a34b7caf4",
          "scope_expr_id": "p1:b12999225efa8d7cefc8b8df"
        },
        {
          "boundary_fact_id": "p1:52ff821ef6da4c45252ff5d6",
          "fact_type": "AUX_CONDITION",
          "state": "RESOLVED",
          "subject_node_ids": [],
          "object_node_ids": [],
          "participant_node_ids": [],
          "node_ids": [
            "p1:2b1849abc7e29105eb70b977",
            "p1:fc5bd600086ab6090e519d5c",
            "p1:00c60db12ccee968ea34ba91"
          ],
          "relation_ids": [
            "p1:9a7186b2ce7dc7f94f019028",
            "p1:846306081530b2461ab45f14"
          ],
          "source_span_ids": [
            "p1:5e3b5ab04595aef88e78c85c",
            "p1:16c6c0a6d036213bdc5dc5e7",
            "p1:816520f3f44f6ecce1fcffe1",
            "p1:7f0793aa43172b583c71aea5",
            "p1:389fc6806e332239f3a0a558",
            "p1:a85ebf0b750986ebd6f278f6"
          ],
          "eligibility_decision_id": "p1:78258d164c6ec4e7fbe251cf"
        },
        {
          "boundary_fact_id": "p1:53e0b9a627e3ae775dea0130",
          "fact_type": "COMPLETION",
          "state": "RESOLVED",
          "subject_node_ids": [
            "p1:3cfba2fb6a90ae4e9f6ecd34"
          ],
          "object_node_ids": [],
          "participant_node_ids": [],
          "node_ids": [
            "p1:00c60db12ccee968ea34ba91",
            "p1:3cfba2fb6a90ae4e9f6ecd34",
            "p1:2b1849abc7e29105eb70b977"
          ],
          "relation_ids": [
            "p1:d394d120378224a6b4da7245",
            "p1:846306081530b2461ab45f14"
          ],
          "source_span_ids": [
            "p1:389fc6806e332239f3a0a558",
            "p1:a85ebf0b750986ebd6f278f6",
            "p1:3dc88c03831e32f9a8fc67ce",
            "p1:5e3b5ab04595aef88e78c85c",
            "p1:16c6c0a6d036213bdc5dc5e7"
          ],
          "eligibility_decision_id": "p1:119c8d1c48d9ef2d0ef26a59",
          "predicate_node_id": "p1:00c60db12ccee968ea34ba91",
          "condition_expr_id": "p1:734876c82818752bf57d56d9"
        }
      ],
      "set_expr_nodes": [
        {
          "expr_id": "p1:82292b0e875921429a84e3ff",
          "kind": "ITEM",
          "entity_node_id": "p1:13b991f220929572e7a8b1fa",
          "source_span_ids": [
            "p1:b0eccf72b3d1edf969c8f671",
            "p1:e157be95c430ae6af88e6a37"
          ],
          "relation_ids": [
            "p1:7a1cf1efe8021d18c5f21cc7"
          ]
        },
        {
          "expr_id": "p1:41531131ef88c5f0e156cbc6",
          "kind": "ITEM",
          "entity_node_id": "p1:13b991f220929572e7a8b1fa",
          "source_span_ids": [
            "p1:b0eccf72b3d1edf969c8f671",
            "p1:e157be95c430ae6af88e6a37"
          ],
          "relation_ids": [
            "p1:89a7f7c1806e1f6bce40b78c"
          ]
        },
        {
          "expr_id": "p1:4ac8dd9472408c314bb27336",
          "kind": "ITEM",
          "entity_node_id": "p1:a017f65f2618791bc5728c63",
          "source_span_ids": [
            "p1:9d123dd0da21f3490930ff89",
            "p1:b6f9329b82cfe4bf264e6752"
          ],
          "relation_ids": [
            "p1:0fd472c5ca879d856e495479"
          ]
        },
        {
          "expr_id": "p1:b12999225efa8d7cefc8b8df",
          "kind": "ITEM",
          "entity_node_id": "p1:5e56145673653f1ee7f21e69",
          "source_span_ids": [
            "p1:55ad616030ab5968a94ded69",
            "p1:f33c3a1c29e28002155201ca"
          ],
          "relation_ids": [
            "p1:f93ea6ea733bc8fc9e674b73"
          ]
        },
        {
          "expr_id": "p1:f9cc48d78faa50dad8627855",
          "kind": "ITEM",
          "entity_node_id": "p1:a017f65f2618791bc5728c63",
          "source_span_ids": [
            "p1:9d123dd0da21f3490930ff89",
            "p1:b6f9329b82cfe4bf264e6752"
          ],
          "relation_ids": [
            "p1:30f048f55c1175bd7c206c2d"
          ]
        },
        {
          "expr_id": "p1:f5c4097140b3a14c789d8249",
          "kind": "ITEM",
          "entity_node_id": "p1:fc5bd600086ab6090e519d5c",
          "source_span_ids": [
            "p1:816520f3f44f6ecce1fcffe1",
            "p1:7f0793aa43172b583c71aea5"
          ],
          "relation_ids": [
            "p1:36ac3c5793dabb687e58d8be"
          ]
        },
        {
          "expr_id": "p1:ec6cf92172ddb7f1685df2f5",
          "kind": "ITEM",
          "entity_node_id": "p1:fc5bd600086ab6090e519d5c",
          "source_span_ids": [
            "p1:816520f3f44f6ecce1fcffe1",
            "p1:7f0793aa43172b583c71aea5"
          ],
          "relation_ids": [
            "p1:36ac3c5793dabb687e58d8be"
          ]
        }
      ],
      "condition_expr_nodes": [
        {
          "expr_id": "p1:734876c82818752bf57d56d9",
          "op": "STATE_REF",
          "state_node_id": "p1:2b1849abc7e29105eb70b977",
          "source_span_ids": [
            "p1:5e3b5ab04595aef88e78c85c",
            "p1:a85ebf0b750986ebd6f278f6"
          ],
          "relation_ids": [
            "p1:9a7186b2ce7dc7f94f019028",
            "p1:846306081530b2461ab45f14"
          ]
        }
      ],
      "quantity_expr_nodes": [],
      "unresolved_refs": [],
      "status": "RESOLVED"
    },
    "canonical_7plus1": {
      "projection_id": "p1:d1f3de73e44f20049e26a3c2",
      "I": {
        "slot": "I",
        "status": "RESOLVED",
        "entries": [
          {
            "canonical_entry_id": "p1:7f5fba8bff8c4bff0d5c3991",
            "slot": "I",
            "boundary_fact_ids": [
              "p1:6850d7497fe2fda8ada15473"
            ],
            "state": "RESOLVED",
            "display_value": "input.csv",
            "source_span_ids": [
              "p1:9d123dd0da21f3490930ff89",
              "p1:b6f9329b82cfe4bf264e6752",
              "p1:fd66e7077083782d8fc63cf9"
            ],
            "scope_expr_id": "p1:f9cc48d78faa50dad8627855"
          }
        ]
      },
      "O": {
        "slot": "O",
        "status": "RESOLVED",
        "entries": [
          {
            "canonical_entry_id": "p1:cf04d876f5ef097de4b6c783",
            "slot": "O",
            "boundary_fact_ids": [
              "p1:25db7909b655b127c94ac52e"
            ],
            "state": "RESOLVED",
            "display_value": "report.md",
            "source_span_ids": [
              "p1:73e3c5ea188ca1c5d3a01a25",
              "p1:7f0793aa43172b583c71aea5",
              "p1:816520f3f44f6ecce1fcffe1",
              "p1:71bb1d16f0709043431028ea",
              "p1:e157be95c430ae6af88e6a37"
            ],
            "scope_expr_id": "p1:ec6cf92172ddb7f1685df2f5"
          }
        ]
      },
      "A": {
        "slot": "A",
        "status": "RESOLVED",
        "entries": [
          {
            "canonical_entry_id": "p1:c8a6b57a409c14be75eb973d",
            "slot": "A",
            "boundary_fact_ids": [
              "p1:a25d81dda7c37a90aef2737f"
            ],
            "state": "RESOLVED",
            "display_value": "REQUIRED 读取 input.csv",
            "source_span_ids": [
              "p1:fd66e7077083782d8fc63cf9",
              "p1:b6f9329b82cfe4bf264e6752",
              "p1:9d123dd0da21f3490930ff89",
              "p1:71bb1d16f0709043431028ea",
              "p1:e157be95c430ae6af88e6a37"
            ],
            "scope_expr_id": "p1:4ac8dd9472408c314bb27336"
          },
          {
            "canonical_entry_id": "p1:decb18557e4b5219f70fd510",
            "slot": "A",
            "boundary_fact_ids": [
              "p1:d0fc1fc6620b810553765d1b"
            ],
            "state": "RESOLVED",
            "display_value": "REQUIRED 生成 report.md",
            "source_span_ids": [
              "p1:73e3c5ea188ca1c5d3a01a25",
              "p1:7f0793aa43172b583c71aea5",
              "p1:816520f3f44f6ecce1fcffe1",
              "p1:71bb1d16f0709043431028ea",
              "p1:e157be95c430ae6af88e6a37"
            ],
            "scope_expr_id": "p1:ec6cf92172ddb7f1685df2f5"
          }
        ]
      },
      "P": {
        "slot": "P",
        "status": "RESOLVED",
        "entries": [
          {
            "canonical_entry_id": "p1:3b4c92007fff290a8b5d221e",
            "slot": "P",
            "boundary_fact_ids": [
              "p1:3cf8374a471711a39f37828a",
              "p1:0fd728867025bcf62ca6f49c",
              "p1:43017ecf588a9f9b075a09c1",
              "p1:39def642cb34db8d48d1d139"
            ],
            "state": "RESOLVED",
            "display_value": "张宁 [PERFORMER]",
            "source_span_ids": [
              "p1:71bb1d16f0709043431028ea",
              "p1:e157be95c430ae6af88e6a37",
              "p1:fd66e7077083782d8fc63cf9",
              "p1:b6f9329b82cfe4bf264e6752",
              "p1:73e3c5ea188ca1c5d3a01a25",
              "p1:7f0793aa43172b583c71aea5",
              "p1:0ac85b43b0dc6a80218e77f0",
              "p1:f33c3a1c29e28002155201ca",
              "p1:2cbc54e36db5ace4bf94cf39"
            ]
          }
        ]
      },
      "R": {
        "slot": "R",
        "status": "ABSENT",
        "entries": []
      },
      "V": {
        "slot": "V",
        "status": "ABSENT",
        "entries": []
      },
      "C": {
        "slot": "C",
        "status": "RESOLVED",
        "entries": [
          {
            "canonical_entry_id": "p1:ccba3886ee97bf7b89a9755f",
            "slot": "C",
            "boundary_fact_ids": [
              "p1:53e0b9a627e3ae775dea0130"
            ],
            "state": "RESOLVED",
            "display_value": "完成",
            "source_span_ids": [
              "p1:389fc6806e332239f3a0a558",
              "p1:a85ebf0b750986ebd6f278f6",
              "p1:3dc88c03831e32f9a8fc67ce",
              "p1:5e3b5ab04595aef88e78c85c",
              "p1:16c6c0a6d036213bdc5dc5e7"
            ],
            "condition_expr_id": "p1:734876c82818752bf57d56d9"
          }
        ]
      },
      "B": {
        "slot": "B",
        "status": "RESOLVED",
        "entries": [
          {
            "canonical_entry_id": "p1:c6eb47bbf77a88b57ae8497f",
            "slot": "B",
            "boundary_fact_ids": [
              "p1:7906742ddcd0ef3266fba15a"
            ],
            "state": "RESOLVED",
            "display_value": "FORBIDDEN 修改 input.csv",
            "source_span_ids": [
              "p1:0ac85b43b0dc6a80218e77f0",
              "p1:f33c3a1c29e28002155201ca",
              "p1:55ad616030ab5968a94ded69",
              "p1:71bb1d16f0709043431028ea",
              "p1:e157be95c430ae6af88e6a37"
            ],
            "scope_expr_id": "p1:b12999225efa8d7cefc8b8df"
          }
        ]
      }
    },
    "proof_dag": {
      "proof_dag_id": "p1:6a82a00bc412f2aecdd9f294",
      "nodes": [
        {
          "kind": "SOURCE_SPAN",
          "id": "p1:7e372bfad514cce36318ed84",
          "source_span_id": "p1:571d80d40877f6505adf1d06"
        },
        {
          "kind": "SOURCE_SPAN",
          "id": "p1:c3b6cb3a76f63f3925239a75",
          "source_span_id": "p1:e157be95c430ae6af88e6a37"
        },
        {
          "kind": "SOURCE_SPAN",
          "id": "p1:6175ffb046705076564863dc",
          "source_span_id": "p1:2cbc54e36db5ace4bf94cf39"
        },
        {
          "kind": "SOURCE_SPAN",
          "id": "p1:55977590f70a7c12259a382a",
          "source_span_id": "p1:b0eccf72b3d1edf969c8f671"
        },
        {
          "kind": "SOURCE_SPAN",
          "id": "p1:9b4390abb54c98490bd3c724",
          "source_span_id": "p1:71bb1d16f0709043431028ea"
        },
        {
          "kind": "SOURCE_SPAN",
          "id": "p1:ed389f091dcf326432af8a2a",
          "source_span_id": "p1:b6f9329b82cfe4bf264e6752"
        },
        {
          "kind": "SOURCE_SPAN",
          "id": "p1:894d48a8c50dc0ccd6882624",
          "source_span_id": "p1:9d123dd0da21f3490930ff89"
        },
        {
          "kind": "SOURCE_SPAN",
          "id": "p1:0493d5294857a5e8d42f6f22",
          "source_span_id": "p1:fd66e7077083782d8fc63cf9"
        },
        {
          "kind": "SOURCE_SPAN",
          "id": "p1:33360384c3546e1f704c2acb",
          "source_span_id": "p1:7f0793aa43172b583c71aea5"
        },
        {
          "kind": "SOURCE_SPAN",
          "id": "p1:fe524ee37aa9766c142d75f4",
          "source_span_id": "p1:816520f3f44f6ecce1fcffe1"
        },
        {
          "kind": "SOURCE_SPAN",
          "id": "p1:3dc2c2ef4f8df2f21417f77a",
          "source_span_id": "p1:73e3c5ea188ca1c5d3a01a25"
        },
        {
          "kind": "SOURCE_SPAN",
          "id": "p1:a6c5f5d19c37d015b6bb2102",
          "source_span_id": "p1:f33c3a1c29e28002155201ca"
        },
        {
          "kind": "SOURCE_SPAN",
          "id": "p1:43dcfc40f8e36a005ddde097",
          "source_span_id": "p1:55ad616030ab5968a94ded69"
        },
        {
          "kind": "SOURCE_SPAN",
          "id": "p1:3d18db48384d479eca12a925",
          "source_span_id": "p1:35a039fa3ba0f2d5d34e5280"
        },
        {
          "kind": "SOURCE_SPAN",
          "id": "p1:8a9ba9ec6e56ee8a092585d3",
          "source_span_id": "p1:0ac85b43b0dc6a80218e77f0"
        },
        {
          "kind": "SOURCE_SPAN",
          "id": "p1:7cee66f687b78b2e1ebbf5c8",
          "source_span_id": "p1:16c6c0a6d036213bdc5dc5e7"
        },
        {
          "kind": "SOURCE_SPAN",
          "id": "p1:52686b79abd389b0db4d6907",
          "source_span_id": "p1:128b95de26c3a7705c96510e"
        },
        {
          "kind": "SOURCE_SPAN",
          "id": "p1:44cb17aa7b308e5b8082e48e",
          "source_span_id": "p1:a85ebf0b750986ebd6f278f6"
        },
        {
          "kind": "SOURCE_SPAN",
          "id": "p1:960746166fa05bcc92eac006",
          "source_span_id": "p1:389fc6806e332239f3a0a558"
        },
        {
          "kind": "SOURCE_SPAN",
          "id": "p1:2b0b40e2f6b235cab301fd6b",
          "source_span_id": "p1:3dc88c03831e32f9a8fc67ce"
        },
        {
          "kind": "SOURCE_SPAN",
          "id": "p1:8beac1c56f1593c4c1b2c6ad",
          "source_span_id": "p1:c5e695a4d3c696b147d967d9"
        },
        {
          "kind": "SOURCE_SPAN",
          "id": "p1:e95891f7ee884400afc8b21b",
          "source_span_id": "p1:5843a93c9de7260207fbac4e"
        },
        {
          "kind": "SOURCE_SPAN",
          "id": "p1:dd1067102f5662f9eae2a7f2",
          "source_span_id": "p1:5e3b5ab04595aef88e78c85c"
        },
        {
          "kind": "SPAN_CANDIDATE",
          "id": "p1:4ef9e9eeec2799d84ed7b684",
          "span_candidate_id": "p1:1c388d1b80a2568156708012"
        },
        {
          "kind": "SPAN_CANDIDATE",
          "id": "p1:42ae5918c23f735659114055",
          "span_candidate_id": "p1:208756d9d29537419991e5a3"
        },
        {
          "kind": "SPAN_CANDIDATE",
          "id": "p1:8ec6032aa76c9518190bf716",
          "span_candidate_id": "p1:dfa8728eea3e2566c0f9020c"
        },
        {
          "kind": "SPAN_CANDIDATE",
          "id": "p1:09bc1a21d4ba5f5f96c9a471",
          "span_candidate_id": "p1:79fc75eebe531d5c7565230f"
        },
        {
          "kind": "SPAN_CANDIDATE",
          "id": "p1:e501b9552befbd62c188a879",
          "span_candidate_id": "p1:fd5de1d13f7ce7e405c891e0"
        },
        {
          "kind": "SPAN_CANDIDATE",
          "id": "p1:ce2461cc388cbf183df0ab58",
          "span_candidate_id": "p1:59b77956e0d62720a911909e"
        },
        {
          "kind": "SPAN_CANDIDATE",
          "id": "p1:c67da2c355abafc3b9ba2191",
          "span_candidate_id": "p1:4cf3441fea973e2495d38115"
        },
        {
          "kind": "SPAN_CANDIDATE",
          "id": "p1:ed9e2568b12f757098180118",
          "span_candidate_id": "p1:d51f441771106eae1bbfffa8"
        },
        {
          "kind": "SPAN_CANDIDATE",
          "id": "p1:e2ec388fc3971496498a7e00",
          "span_candidate_id": "p1:77ca9aaa63a8a4dcafc896f6"
        },
        {
          "kind": "SPAN_CANDIDATE",
          "id": "p1:11e62bb25fbacd5de2f99b16",
          "span_candidate_id": "p1:410e433fc2eef4d829dd1c70"
        },
        {
          "kind": "SPAN_CANDIDATE",
          "id": "p1:b3280db03072765fb7b578c0",
          "span_candidate_id": "p1:0a4fbc9128652b3d974c3614"
        },
        {
          "kind": "SPAN_CANDIDATE",
          "id": "p1:e74fa0b68e6bca76e7407fab",
          "span_candidate_id": "p1:439387f56981d932a29d2a41"
        },
        {
          "kind": "SPAN_CANDIDATE",
          "id": "p1:3017cd866a471dae253fb49f",
          "span_candidate_id": "p1:cf99caa33f0dd110398d0b22"
        },
        {
          "kind": "SPAN_CANDIDATE",
          "id": "p1:505ef012c580f7b479cd7463",
          "span_candidate_id": "p1:dd17a48357c1608df55c5fd8"
        },
        {
          "kind": "SPAN_CANDIDATE",
          "id": "p1:8ab287529ecf121aed6d53c2",
          "span_candidate_id": "p1:c99c87fec5c4a0d23d080aae"
        },
        {
          "kind": "SPAN_CANDIDATE",
          "id": "p1:4c96ff5938c7c7d456764ca4",
          "span_candidate_id": "p1:cd4dfa2adda38b3b7b09867a"
        },
        {
          "kind": "SPAN_CANDIDATE",
          "id": "p1:2e094d610b59d97a0b49183d",
          "span_candidate_id": "p1:c931f7d2fa853016d8cf4f6a"
        },
        {
          "kind": "SPAN_CANDIDATE",
          "id": "p1:b36ca85b210a229ba368e254",
          "span_candidate_id": "p1:1ac51b0aa22c5c2e18d8354b"
        },
        {
          "kind": "SPAN_CANDIDATE",
          "id": "p1:c27a7db0b0d592747b6fb9d7",
          "span_candidate_id": "p1:1e97721075f8b2cf8d71be92"
        },
        {
          "kind": "SPAN_CANDIDATE",
          "id": "p1:023838f54b9967b507c5b1c5",
          "span_candidate_id": "p1:b7d066b3d6b96b7527c7d399"
        },
        {
          "kind": "SPAN_CANDIDATE",
          "id": "p1:8f98279856b6e2a571377e61",
          "span_candidate_id": "p1:cb022639d16f2617c1301f57"
        },
        {
          "kind": "SPAN_CANDIDATE",
          "id": "p1:aae712051e1b75812874a40f",
          "span_candidate_id": "p1:31b6605152a30f3b87611217"
        },
        {
          "kind": "SPAN_CANDIDATE",
          "id": "p1:fae03d5e20f4e7f3a485f43f",
          "span_candidate_id": "p1:beaaec44da38258874dccbba"
        },
        {
          "kind": "SPAN_CANDIDATE",
          "id": "p1:4d435e94f87955cfe8497e5a",
          "span_candidate_id": "p1:b319ed089efe6d489d225be3"
        },
        {
          "kind": "SPAN_CANDIDATE",
          "id": "p1:6c7b1a5aa9a2a230974921f2",
          "span_candidate_id": "p1:7ba98a089fa9612c56c42537"
        },
        {
          "kind": "SPAN_CANDIDATE",
          "id": "p1:881070ab17bf0367dba35c84",
          "span_candidate_id": "p1:4a166adac0be1958b55ce399"
        },
        {
          "kind": "SPAN_CANDIDATE",
          "id": "p1:046b8a38df3cfcad16e0c312",
          "span_candidate_id": "p1:50d2550516d640b78be35f54"
        },
        {
          "kind": "SPAN_CANDIDATE",
          "id": "p1:2eb408529f4d9bdffd872a78",
          "span_candidate_id": "p1:f394713ca1cace498dd6764e"
        },
        {
          "kind": "SPAN_CANDIDATE",
          "id": "p1:ac0edeb25b345e414dce3a48",
          "span_candidate_id": "p1:bf0591c9dc865c19d70065bf"
        },
        {
          "kind": "SPAN_CANDIDATE",
          "id": "p1:414a9e892855dcf9c06d9e31",
          "span_candidate_id": "p1:3898c10dfe4f7fb8e0ca5ae6"
        },
        {
          "kind": "SPAN_CANDIDATE",
          "id": "p1:65bc8806513da33779a62872",
          "span_candidate_id": "p1:ccc750213575e50e7076a378"
        },
        {
          "kind": "SPAN_CANDIDATE",
          "id": "p1:0189c986ee896459572fc98e",
          "span_candidate_id": "p1:9312d4eaba5f8b7364c270ae"
        },
        {
          "kind": "SPAN_CANDIDATE",
          "id": "p1:22ea92bd320654d64156749c",
          "span_candidate_id": "p1:336ae386f96589816ed4e584"
        },
        {
          "kind": "SPAN_CANDIDATE",
          "id": "p1:a5901e2700b99e696b86a3a8",
          "span_candidate_id": "p1:a4be8c687518396866debda4"
        },
        {
          "kind": "SPAN_CANDIDATE",
          "id": "p1:c01a9999396312725d2092ab",
          "span_candidate_id": "p1:586703912ca02869ed1d19f0"
        },
        {
          "kind": "SPAN_CANDIDATE",
          "id": "p1:c45d25cbf168e0d5e4070b18",
          "span_candidate_id": "p1:e252a4f9214f46431bebd259"
        },
        {
          "kind": "SPAN_CANDIDATE",
          "id": "p1:040a49d01fc9cd1d87db0d79",
          "span_candidate_id": "p1:dbea13331754fe10c5353e95"
        },
        {
          "kind": "SEMANTIC_NODE",
          "id": "p1:6c371dbb47a7d5cf587c5776",
          "semantic_node_id": "p1:3ddbd3949281cbe0716e59ad"
        },
        {
          "kind": "SEMANTIC_NODE",
          "id": "p1:bc16151de68fa942bfcc342c",
          "semantic_node_id": "p1:23c59e2354e7b39c3fb9b70d"
        },
        {
          "kind": "SEMANTIC_NODE",
          "id": "p1:ceddb2f202109ab57517e671",
          "semantic_node_id": "p1:0a644412188024b2b0ff4db1"
        },
        {
          "kind": "SEMANTIC_NODE",
          "id": "p1:c6a54e7c69de36ea9a5d48d4",
          "semantic_node_id": "p1:13b991f220929572e7a8b1fa"
        },
        {
          "kind": "SEMANTIC_NODE",
          "id": "p1:f91b4d02f6e068a6d57ccaf1",
          "semantic_node_id": "p1:a017f65f2618791bc5728c63"
        },
        {
          "kind": "SEMANTIC_NODE",
          "id": "p1:c9a37e4949920d8cfcc2212b",
          "semantic_node_id": "p1:55751628ba342c5905e06203"
        },
        {
          "kind": "SEMANTIC_NODE",
          "id": "p1:ba7a9905ff49948b7a24e30f",
          "semantic_node_id": "p1:fc5bd600086ab6090e519d5c"
        },
        {
          "kind": "SEMANTIC_NODE",
          "id": "p1:4c62f36c2c5c24185ab036b6",
          "semantic_node_id": "p1:7be272d3f3a2df10061bef21"
        },
        {
          "kind": "SEMANTIC_NODE",
          "id": "p1:b9190bbdc0a70d11b248e932",
          "semantic_node_id": "p1:5e56145673653f1ee7f21e69"
        },
        {
          "kind": "SEMANTIC_NODE",
          "id": "p1:084bc64901438dc8d566c4aa",
          "semantic_node_id": "p1:5005d79d390f276a34b7caf4"
        },
        {
          "kind": "SEMANTIC_NODE",
          "id": "p1:56d038a0174381935ddf5d8a",
          "semantic_node_id": "p1:ecd17316cc63a98d630af1d8"
        },
        {
          "kind": "SEMANTIC_NODE",
          "id": "p1:b620c1adf22a023e1a24567c",
          "semantic_node_id": "p1:00c60db12ccee968ea34ba91"
        },
        {
          "kind": "SEMANTIC_NODE",
          "id": "p1:c644b053dcd7dec98b1a72b0",
          "semantic_node_id": "p1:3cfba2fb6a90ae4e9f6ecd34"
        },
        {
          "kind": "SEMANTIC_NODE",
          "id": "p1:a611e4a4395a68a5f19208b2",
          "semantic_node_id": "p1:3c21a1bf090fbc6ec5a038c3"
        },
        {
          "kind": "SEMANTIC_NODE",
          "id": "p1:80e6b0a255decef91586ee9d",
          "semantic_node_id": "p1:4ccdd8b53cd9e017cbb17dbb"
        },
        {
          "kind": "SEMANTIC_NODE",
          "id": "p1:0723fb3fb3536159cf93fbd2",
          "semantic_node_id": "p1:a78bc4d47f94e06bd7c43b20"
        },
        {
          "kind": "SEMANTIC_NODE",
          "id": "p1:de94dd01ba3d01514d252ddc",
          "semantic_node_id": "p1:664c7119ec8c17c7363d4a2d"
        },
        {
          "kind": "SEMANTIC_NODE",
          "id": "p1:a4e01b661ae0a5729ee47a0d",
          "semantic_node_id": "p1:2de8e54fcb2f544ce2f6d95d"
        },
        {
          "kind": "SEMANTIC_NODE",
          "id": "p1:a736d9dd4933095d57ca48c7",
          "semantic_node_id": "p1:2b1849abc7e29105eb70b977"
        },
        {
          "kind": "RELATION",
          "id": "p1:0dd7d90f11af8b32e5853e70",
          "relation_id": "p1:9a1356179ef6b0a998e369fb"
        },
        {
          "kind": "RELATION",
          "id": "p1:a1609605176a8dc1ae251ba8",
          "relation_id": "p1:7a1cf1efe8021d18c5f21cc7"
        },
        {
          "kind": "RELATION",
          "id": "p1:9001fad4d64a1a33ef5b6093",
          "relation_id": "p1:89a7f7c1806e1f6bce40b78c"
        },
        {
          "kind": "RELATION",
          "id": "p1:1ef9ab898572fb7cb0775244",
          "relation_id": "p1:0fd472c5ca879d856e495479"
        },
        {
          "kind": "RELATION",
          "id": "p1:772b9dbae27ea10c16853bf4",
          "relation_id": "p1:36ac3c5793dabb687e58d8be"
        },
        {
          "kind": "RELATION",
          "id": "p1:3b88985582086541f1de9cbf",
          "relation_id": "p1:f93ea6ea733bc8fc9e674b73"
        },
        {
          "kind": "RELATION",
          "id": "p1:8533675f43e4affb3633a153",
          "relation_id": "p1:d394d120378224a6b4da7245"
        },
        {
          "kind": "RELATION",
          "id": "p1:468c9b98fe9677e61a93719f",
          "relation_id": "p1:79a08469cd000a3ff52ee6f4"
        },
        {
          "kind": "RELATION",
          "id": "p1:42de2bc285acbcbabdcfa19b",
          "relation_id": "p1:f763ba315058fb8aea451f0b"
        },
        {
          "kind": "RELATION",
          "id": "p1:f6d8a617ff335b47da7cd37a",
          "relation_id": "p1:f3a3ec29582ca92036ced2f9"
        },
        {
          "kind": "RELATION",
          "id": "p1:a93bf92cc54ae598d1827737",
          "relation_id": "p1:ee1f0ad948cdfe14a4c667a6"
        },
        {
          "kind": "RELATION",
          "id": "p1:d28cd089b3c7641de5dceb80",
          "relation_id": "p1:30f048f55c1175bd7c206c2d"
        },
        {
          "kind": "RELATION",
          "id": "p1:477fb0f7f5d41df2df1be479",
          "relation_id": "p1:be818ec586992582f977e909"
        },
        {
          "kind": "RELATION",
          "id": "p1:0e19e8bab459cc08ab0ca466",
          "relation_id": "p1:9a7186b2ce7dc7f94f019028"
        },
        {
          "kind": "RELATION",
          "id": "p1:9243331fcb655dc69392a620",
          "relation_id": "p1:846306081530b2461ab45f14"
        },
        {
          "kind": "BOUNDARY_FACT",
          "id": "p1:bc93019d92af085e0ce93590",
          "boundary_fact_id": "p1:25db7909b655b127c94ac52e"
        },
        {
          "kind": "BOUNDARY_FACT",
          "id": "p1:9bb58b1e794ab3704cadd9c9",
          "boundary_fact_id": "p1:3cf8374a471711a39f37828a"
        },
        {
          "kind": "BOUNDARY_FACT",
          "id": "p1:3e4f67f02291ce40004bf1c8",
          "boundary_fact_id": "p1:0fd728867025bcf62ca6f49c"
        },
        {
          "kind": "BOUNDARY_FACT",
          "id": "p1:37e0469b40f8d6f79bd9a8f3",
          "boundary_fact_id": "p1:43017ecf588a9f9b075a09c1"
        },
        {
          "kind": "BOUNDARY_FACT",
          "id": "p1:88fba17f70996f9df41e7a64",
          "boundary_fact_id": "p1:6850d7497fe2fda8ada15473"
        },
        {
          "kind": "BOUNDARY_FACT",
          "id": "p1:962bd4861b6cd6b8c342eb38",
          "boundary_fact_id": "p1:39def642cb34db8d48d1d139"
        },
        {
          "kind": "BOUNDARY_FACT",
          "id": "p1:c1d226f38a7d41e9780f16db",
          "boundary_fact_id": "p1:64f42d5c806d9784151671ca"
        },
        {
          "kind": "BOUNDARY_FACT",
          "id": "p1:27bfd7a6a5daa6e0277ab2bd",
          "boundary_fact_id": "p1:a25d81dda7c37a90aef2737f"
        },
        {
          "kind": "BOUNDARY_FACT",
          "id": "p1:a97eadef0078adc4169fa8c9",
          "boundary_fact_id": "p1:d0fc1fc6620b810553765d1b"
        },
        {
          "kind": "BOUNDARY_FACT",
          "id": "p1:1437430eaaa6db395a2371ed",
          "boundary_fact_id": "p1:7906742ddcd0ef3266fba15a"
        },
        {
          "kind": "BOUNDARY_FACT",
          "id": "p1:e8695ac4e68ea246b1ef699c",
          "boundary_fact_id": "p1:52ff821ef6da4c45252ff5d6"
        },
        {
          "kind": "BOUNDARY_FACT",
          "id": "p1:9daf1368950c33ab6cf8c71f",
          "boundary_fact_id": "p1:53e0b9a627e3ae775dea0130"
        },
        {
          "kind": "CANONICAL_ENTRY",
          "id": "p1:201c3b20e6a19143a75d63fa",
          "canonical_entry_id": "p1:7f5fba8bff8c4bff0d5c3991"
        },
        {
          "kind": "CANONICAL_ENTRY",
          "id": "p1:7da26f8e690a7c81b4bc6f89",
          "canonical_entry_id": "p1:cf04d876f5ef097de4b6c783"
        },
        {
          "kind": "CANONICAL_ENTRY",
          "id": "p1:25d5f96e2bfe97948bc26377",
          "canonical_entry_id": "p1:c8a6b57a409c14be75eb973d"
        },
        {
          "kind": "CANONICAL_ENTRY",
          "id": "p1:9f306484f3a9d0fe95ba76e7",
          "canonical_entry_id": "p1:decb18557e4b5219f70fd510"
        },
        {
          "kind": "CANONICAL_ENTRY",
          "id": "p1:15e36e27b333cf1b7873a98a",
          "canonical_entry_id": "p1:3b4c92007fff290a8b5d221e"
        },
        {
          "kind": "CANONICAL_ENTRY",
          "id": "p1:e2a6442a64a7d52644ebb5b1",
          "canonical_entry_id": "p1:ccba3886ee97bf7b89a9755f"
        },
        {
          "kind": "CANONICAL_ENTRY",
          "id": "p1:84d1c7950ef1ef39e10404f2",
          "canonical_entry_id": "p1:c6eb47bbf77a88b57ae8497f"
        },
        {
          "kind": "ELIGIBILITY_DECISION",
          "id": "p1:0b997297c753d801a94634f7",
          "eligibility_decision_id": "p1:b44eb5a9e9218085a49d4520"
        },
        {
          "kind": "ELIGIBILITY_DECISION",
          "id": "p1:2f85b975c1a887dc5571c9fa",
          "eligibility_decision_id": "p1:598c3fcb7e54f82ca73630ff"
        },
        {
          "kind": "ELIGIBILITY_DECISION",
          "id": "p1:585b6b22c23ced4208a80143",
          "eligibility_decision_id": "p1:20e2a0f291dbc0a9f5854330"
        },
        {
          "kind": "ELIGIBILITY_DECISION",
          "id": "p1:0f2bacddb05c16751c986f66",
          "eligibility_decision_id": "p1:169edde73f610443fdc66893"
        },
        {
          "kind": "ELIGIBILITY_DECISION",
          "id": "p1:80c70d4955e8d7d2fc755b0d",
          "eligibility_decision_id": "p1:67f822d410e84a3321cb8820"
        },
        {
          "kind": "ELIGIBILITY_DECISION",
          "id": "p1:2f219fe1f7eb0ee52b6734dc",
          "eligibility_decision_id": "p1:c7ec0f12624379da4dff5302"
        },
        {
          "kind": "ELIGIBILITY_DECISION",
          "id": "p1:4d4f5b315a5e2866df00ee6b",
          "eligibility_decision_id": "p1:3bfc3ff113e3f5fd52b90c53"
        },
        {
          "kind": "ELIGIBILITY_DECISION",
          "id": "p1:7687e26042a3b82009f9f422",
          "eligibility_decision_id": "p1:a1c1a7ea3b1afcc1ac66e181"
        },
        {
          "kind": "ELIGIBILITY_DECISION",
          "id": "p1:74c820bfccbd1eb1baaef9c8",
          "eligibility_decision_id": "p1:20c6751b0e65ecf36bc0244e"
        },
        {
          "kind": "ELIGIBILITY_DECISION",
          "id": "p1:7b3be3451566cd6b1894e50d",
          "eligibility_decision_id": "p1:e84eb5c0ac1d8a838a64e408"
        },
        {
          "kind": "ELIGIBILITY_DECISION",
          "id": "p1:a2bb525685718808497ba190",
          "eligibility_decision_id": "p1:78258d164c6ec4e7fbe251cf"
        },
        {
          "kind": "ELIGIBILITY_DECISION",
          "id": "p1:e35da2d5290a9454911a07c8",
          "eligibility_decision_id": "p1:119c8d1c48d9ef2d0ef26a59"
        },
        {
          "kind": "SET_EXPR",
          "id": "p1:414792900e640c1e201120ce",
          "expr_id": "p1:82292b0e875921429a84e3ff"
        },
        {
          "kind": "SET_EXPR",
          "id": "p1:fe426b23fb4e76f2e028bec8",
          "expr_id": "p1:41531131ef88c5f0e156cbc6"
        },
        {
          "kind": "SET_EXPR",
          "id": "p1:310fe08e124110c83d7a25e7",
          "expr_id": "p1:4ac8dd9472408c314bb27336"
        },
        {
          "kind": "SET_EXPR",
          "id": "p1:449d8375dd4f57c93019140b",
          "expr_id": "p1:b12999225efa8d7cefc8b8df"
        },
        {
          "kind": "SET_EXPR",
          "id": "p1:c5ee8bf6a7ea59d6ce738279",
          "expr_id": "p1:f9cc48d78faa50dad8627855"
        },
        {
          "kind": "SET_EXPR",
          "id": "p1:d85359d3749a4c47556e9414",
          "expr_id": "p1:f5c4097140b3a14c789d8249"
        },
        {
          "kind": "SET_EXPR",
          "id": "p1:370d3377b698cb59ff9654bc",
          "expr_id": "p1:ec6cf92172ddb7f1685df2f5"
        },
        {
          "kind": "CONDITION_EXPR",
          "id": "p1:ba50d18e72c4094df644d476",
          "expr_id": "p1:734876c82818752bf57d56d9"
        },
        {
          "kind": "STRUCTURE_NODE",
          "id": "p1:26d614f533c2ca82a34efe2e",
          "structure_node_id": "p1:a23a882789941e922991741b"
        },
        {
          "kind": "STRUCTURE_NODE",
          "id": "p1:ee4d04332b5a183755f03fc6",
          "structure_node_id": "p1:4f9bce20abe7b4131e4edfe1"
        },
        {
          "kind": "STRUCTURE_NODE",
          "id": "p1:2d4ec67e29430e2b45dfc7a9",
          "structure_node_id": "p1:790dc1131030de4e896c7d81"
        },
        {
          "kind": "STRUCTURE_NODE",
          "id": "p1:18373681c9653eb716a16187",
          "structure_node_id": "p1:295b34de6a82eb3701ccdf5e"
        },
        {
          "kind": "STRUCTURE_NODE",
          "id": "p1:7a42b1952ef8c521bab0bc34",
          "structure_node_id": "p1:9ef48724620d2f05e7b5a545"
        },
        {
          "kind": "STRUCTURE_NODE",
          "id": "p1:7319d3e081dae106200be81c",
          "structure_node_id": "p1:faf62552282d54f874aaf77f"
        },
        {
          "kind": "STRUCTURE_NODE",
          "id": "p1:adf9a1ae48f1ca5929c266b7",
          "structure_node_id": "p1:a27bebeb10ba2b90cb3f17b3"
        },
        {
          "kind": "STRUCTURE_NODE",
          "id": "p1:04a3173230bf5569927f5087",
          "structure_node_id": "p1:d27ad35fa88623aacaf7228b"
        },
        {
          "kind": "CLAUSE",
          "id": "p1:01d1c131754e597229d58228",
          "clause_id": "clause:0"
        },
        {
          "kind": "CLAUSE",
          "id": "p1:e9c4919ed75bd291a9ee2c02",
          "clause_id": "clause:1"
        },
        {
          "kind": "CLAUSE",
          "id": "p1:a126f82c3237a895df56255f",
          "clause_id": "clause:2"
        },
        {
          "kind": "CLAUSE",
          "id": "p1:144c6da03e00fa79855fae15",
          "clause_id": "clause:3"
        },
        {
          "kind": "CLAUSE",
          "id": "p1:7d32c5cdf6d7c0f4cefa3516",
          "clause_id": "clause:4"
        },
        {
          "kind": "CLAUSE",
          "id": "p1:f591e8d011050564393938a7",
          "clause_id": "clause:5"
        },
        {
          "kind": "COVERAGE_RECORD",
          "id": "p1:bca5bf7ece8e5aaf5317eade",
          "coverage_record_id": "p1:e27e4edc016747349edd0031"
        },
        {
          "kind": "COVERAGE_RECORD",
          "id": "p1:a29cc6089070db9ba49c556a",
          "coverage_record_id": "p1:94042bf3292f50aa2455bf6c"
        },
        {
          "kind": "COVERAGE_RECORD",
          "id": "p1:909f32b1fa6da57c77e3007f",
          "coverage_record_id": "p1:e09accc164cbf75e6440b0b3"
        },
        {
          "kind": "COVERAGE_RECORD",
          "id": "p1:27e87dcb89f73ec6be072f01",
          "coverage_record_id": "p1:1ce48be4bd6cb91a9cc557cb"
        },
        {
          "kind": "COVERAGE_RECORD",
          "id": "p1:eafa6d3890b6ce6b81e9f0e4",
          "coverage_record_id": "p1:6649aca1a49550be107881ae"
        },
        {
          "kind": "COVERAGE_RECORD",
          "id": "p1:4148c598a99231fe7432a661",
          "coverage_record_id": "p1:0c5dfb22b392b35ef31aa199"
        },
        {
          "kind": "COVERAGE_RECORD",
          "id": "p1:af477e290413f68c5cb471b6",
          "coverage_record_id": "p1:170ecd025bb36b5ea8fe1aa1"
        },
        {
          "kind": "CANONICAL_SLOT_RESULT",
          "id": "p1:21b45f2170a6938c6da97d78",
          "canonical_slot_result_id": "p1:d1f3de73e44f20049e26a3c2:I"
        },
        {
          "kind": "CANONICAL_SLOT_RESULT",
          "id": "p1:7d5f127e4b5ea47e87b395fd",
          "canonical_slot_result_id": "p1:d1f3de73e44f20049e26a3c2:O"
        },
        {
          "kind": "CANONICAL_SLOT_RESULT",
          "id": "p1:274bcb1eb9775d403c5b4ae1",
          "canonical_slot_result_id": "p1:d1f3de73e44f20049e26a3c2:A"
        },
        {
          "kind": "CANONICAL_SLOT_RESULT",
          "id": "p1:11ed29e6464f6965f4ca4452",
          "canonical_slot_result_id": "p1:d1f3de73e44f20049e26a3c2:P"
        },
        {
          "kind": "CANONICAL_SLOT_RESULT",
          "id": "p1:a9880b69f58ca8a8edc286c9",
          "canonical_slot_result_id": "p1:d1f3de73e44f20049e26a3c2:R"
        },
        {
          "kind": "CANONICAL_SLOT_RESULT",
          "id": "p1:b6a5fdff267fbee9f273e76c",
          "canonical_slot_result_id": "p1:d1f3de73e44f20049e26a3c2:V"
        },
        {
          "kind": "CANONICAL_SLOT_RESULT",
          "id": "p1:b0afca2c469720e49ead5426",
          "canonical_slot_result_id": "p1:d1f3de73e44f20049e26a3c2:C"
        },
        {
          "kind": "CANONICAL_SLOT_RESULT",
          "id": "p1:831727cd972fea67a75daf4f",
          "canonical_slot_result_id": "p1:d1f3de73e44f20049e26a3c2:B"
        }
      ],
      "edges": [
        {
          "edge_id": "p1:4418ae501ceb99bf51f1cfd7",
          "edge_type": "EXTRACTED_FROM",
          "from_id": "p1:4ef9e9eeec2799d84ed7b684",
          "to_id": "p1:7e372bfad514cce36318ed84"
        },
        {
          "edge_id": "p1:69bfcb4ef0555e7bee282889",
          "edge_type": "EXTRACTED_FROM",
          "from_id": "p1:42ae5918c23f735659114055",
          "to_id": "p1:55977590f70a7c12259a382a"
        },
        {
          "edge_id": "p1:3447ac3bc992bfee32392013",
          "edge_type": "EXTRACTED_FROM",
          "from_id": "p1:8ec6032aa76c9518190bf716",
          "to_id": "p1:9b4390abb54c98490bd3c724"
        },
        {
          "edge_id": "p1:86755ffef4849d1e0eecf1b9",
          "edge_type": "EXTRACTED_FROM",
          "from_id": "p1:09bc1a21d4ba5f5f96c9a471",
          "to_id": "p1:55977590f70a7c12259a382a"
        },
        {
          "edge_id": "p1:f6d52203b28100b455b3d0b8",
          "edge_type": "EXTRACTED_FROM",
          "from_id": "p1:e501b9552befbd62c188a879",
          "to_id": "p1:894d48a8c50dc0ccd6882624"
        },
        {
          "edge_id": "p1:1fb4917f21a48a50343fba2a",
          "edge_type": "EXTRACTED_FROM",
          "from_id": "p1:ce2461cc388cbf183df0ab58",
          "to_id": "p1:0493d5294857a5e8d42f6f22"
        },
        {
          "edge_id": "p1:8ccc7dea285454202d114394",
          "edge_type": "EXTRACTED_FROM",
          "from_id": "p1:c67da2c355abafc3b9ba2191",
          "to_id": "p1:fe524ee37aa9766c142d75f4"
        },
        {
          "edge_id": "p1:125d56c7f63ddb319a0facd5",
          "edge_type": "EXTRACTED_FROM",
          "from_id": "p1:ed9e2568b12f757098180118",
          "to_id": "p1:3dc2c2ef4f8df2f21417f77a"
        },
        {
          "edge_id": "p1:8155a0309721d045b3c21b30",
          "edge_type": "EXTRACTED_FROM",
          "from_id": "p1:e2ec388fc3971496498a7e00",
          "to_id": "p1:43dcfc40f8e36a005ddde097"
        },
        {
          "edge_id": "p1:34db06bda6fd579343ecd000",
          "edge_type": "EXTRACTED_FROM",
          "from_id": "p1:11e62bb25fbacd5de2f99b16",
          "to_id": "p1:8a9ba9ec6e56ee8a092585d3"
        },
        {
          "edge_id": "p1:a6609fcdbeff45a5a0257ae7",
          "edge_type": "EXTRACTED_FROM",
          "from_id": "p1:b3280db03072765fb7b578c0",
          "to_id": "p1:52686b79abd389b0db4d6907"
        },
        {
          "edge_id": "p1:4f4b68c8df35a7507b655f06",
          "edge_type": "EXTRACTED_FROM",
          "from_id": "p1:e74fa0b68e6bca76e7407fab",
          "to_id": "p1:960746166fa05bcc92eac006"
        },
        {
          "edge_id": "p1:852d470427346aaec25a757d",
          "edge_type": "EXTRACTED_FROM",
          "from_id": "p1:3017cd866a471dae253fb49f",
          "to_id": "p1:2b0b40e2f6b235cab301fd6b"
        },
        {
          "edge_id": "p1:717a7ddff1578a3cb5a2983d",
          "edge_type": "EXTRACTED_FROM",
          "from_id": "p1:505ef012c580f7b479cd7463",
          "to_id": "p1:8beac1c56f1593c4c1b2c6ad"
        },
        {
          "edge_id": "p1:0a108870c54ada9f16006520",
          "edge_type": "EXTRACTED_FROM",
          "from_id": "p1:8ab287529ecf121aed6d53c2",
          "to_id": "p1:6175ffb046705076564863dc"
        },
        {
          "edge_id": "p1:1e636d3f55107a3b5bda5810",
          "edge_type": "EXTRACTED_FROM",
          "from_id": "p1:4c96ff5938c7c7d456764ca4",
          "to_id": "p1:e95891f7ee884400afc8b21b"
        },
        {
          "edge_id": "p1:db635abdd9028bc85e643785",
          "edge_type": "EXTRACTED_FROM",
          "from_id": "p1:2e094d610b59d97a0b49183d",
          "to_id": "p1:c3b6cb3a76f63f3925239a75"
        },
        {
          "edge_id": "p1:7200dd652db96a83c09b5d3c",
          "edge_type": "EXTRACTED_FROM",
          "from_id": "p1:b36ca85b210a229ba368e254",
          "to_id": "p1:c3b6cb3a76f63f3925239a75"
        },
        {
          "edge_id": "p1:14a13fe4379c6fe239432655",
          "edge_type": "EXTRACTED_FROM",
          "from_id": "p1:c27a7db0b0d592747b6fb9d7",
          "to_id": "p1:c3b6cb3a76f63f3925239a75"
        },
        {
          "edge_id": "p1:c5703693120aa3dea2ceb1a0",
          "edge_type": "EXTRACTED_FROM",
          "from_id": "p1:023838f54b9967b507c5b1c5",
          "to_id": "p1:ed389f091dcf326432af8a2a"
        },
        {
          "edge_id": "p1:fd7b5ed10fbb11c49352cbe2",
          "edge_type": "EXTRACTED_FROM",
          "from_id": "p1:8f98279856b6e2a571377e61",
          "to_id": "p1:ed389f091dcf326432af8a2a"
        },
        {
          "edge_id": "p1:db0b43cacdab45b4753efd37",
          "edge_type": "EXTRACTED_FROM",
          "from_id": "p1:aae712051e1b75812874a40f",
          "to_id": "p1:33360384c3546e1f704c2acb"
        },
        {
          "edge_id": "p1:079a3428f184b7134f295bd4",
          "edge_type": "EXTRACTED_FROM",
          "from_id": "p1:fae03d5e20f4e7f3a485f43f",
          "to_id": "p1:33360384c3546e1f704c2acb"
        },
        {
          "edge_id": "p1:b058253f2433240f09b8c3a9",
          "edge_type": "EXTRACTED_FROM",
          "from_id": "p1:4d435e94f87955cfe8497e5a",
          "to_id": "p1:a6c5f5d19c37d015b6bb2102"
        },
        {
          "edge_id": "p1:5e8f97147824d0ecfc16cbbd",
          "edge_type": "EXTRACTED_FROM",
          "from_id": "p1:6c7b1a5aa9a2a230974921f2",
          "to_id": "p1:a6c5f5d19c37d015b6bb2102"
        },
        {
          "edge_id": "p1:a90d080c7f8d39d2aceb93ac",
          "edge_type": "EXTRACTED_FROM",
          "from_id": "p1:881070ab17bf0367dba35c84",
          "to_id": "p1:7cee66f687b78b2e1ebbf5c8"
        },
        {
          "edge_id": "p1:f0a606a80c1c34e8829c00fe",
          "edge_type": "EXTRACTED_FROM",
          "from_id": "p1:046b8a38df3cfcad16e0c312",
          "to_id": "p1:44cb17aa7b308e5b8082e48e"
        },
        {
          "edge_id": "p1:0581ed3efa2db14720e6e47c",
          "edge_type": "EXTRACTED_FROM",
          "from_id": "p1:2eb408529f4d9bdffd872a78",
          "to_id": "p1:44cb17aa7b308e5b8082e48e"
        },
        {
          "edge_id": "p1:c43f0cee52d247e2610bdb50",
          "edge_type": "EXTRACTED_FROM",
          "from_id": "p1:ac0edeb25b345e414dce3a48",
          "to_id": "p1:7cee66f687b78b2e1ebbf5c8"
        },
        {
          "edge_id": "p1:22815ddf2a0c525b3f2d214f",
          "edge_type": "EXTRACTED_FROM",
          "from_id": "p1:414a9e892855dcf9c06d9e31",
          "to_id": "p1:c3b6cb3a76f63f3925239a75"
        },
        {
          "edge_id": "p1:5d445176d20207d2942db338",
          "edge_type": "EXTRACTED_FROM",
          "from_id": "p1:65bc8806513da33779a62872",
          "to_id": "p1:ed389f091dcf326432af8a2a"
        },
        {
          "edge_id": "p1:c2ffc9b70403a950befe4e56",
          "edge_type": "EXTRACTED_FROM",
          "from_id": "p1:0189c986ee896459572fc98e",
          "to_id": "p1:9b4390abb54c98490bd3c724"
        },
        {
          "edge_id": "p1:eef067376ba30d83d5006aab",
          "edge_type": "EXTRACTED_FROM",
          "from_id": "p1:22ea92bd320654d64156749c",
          "to_id": "p1:6175ffb046705076564863dc"
        },
        {
          "edge_id": "p1:f9bf1cd32a4fa073271a00ff",
          "edge_type": "EXTRACTED_FROM",
          "from_id": "p1:a5901e2700b99e696b86a3a8",
          "to_id": "p1:dd1067102f5662f9eae2a7f2"
        },
        {
          "edge_id": "p1:bed8ec27d1d6ae9e7f73509b",
          "edge_type": "EXTRACTED_FROM",
          "from_id": "p1:c01a9999396312725d2092ab",
          "to_id": "p1:c3b6cb3a76f63f3925239a75"
        },
        {
          "edge_id": "p1:0f26c3bdbf6c6426d44fd8db",
          "edge_type": "EXTRACTED_FROM",
          "from_id": "p1:c45d25cbf168e0d5e4070b18",
          "to_id": "p1:c3b6cb3a76f63f3925239a75"
        },
        {
          "edge_id": "p1:0f95312a718d0f9cc5aa75d9",
          "edge_type": "EXTRACTED_FROM",
          "from_id": "p1:040a49d01fc9cd1d87db0d79",
          "to_id": "p1:7cee66f687b78b2e1ebbf5c8"
        },
        {
          "edge_id": "p1:ca6e5607766c6cecaf404e5b",
          "edge_type": "ASSEMBLED_FROM",
          "from_id": "p1:6c371dbb47a7d5cf587c5776",
          "to_id": "p1:4ef9e9eeec2799d84ed7b684"
        },
        {
          "edge_id": "p1:cd7d5a0a4dfa00f8086f7831",
          "edge_type": "ASSEMBLED_FROM",
          "from_id": "p1:bc16151de68fa942bfcc342c",
          "to_id": "p1:42ae5918c23f735659114055"
        },
        {
          "edge_id": "p1:aabf2aae2e3ee4f167963920",
          "edge_type": "ASSEMBLED_FROM",
          "from_id": "p1:bc16151de68fa942bfcc342c",
          "to_id": "p1:2e094d610b59d97a0b49183d"
        },
        {
          "edge_id": "p1:626cf73aafb557e4b00b2e71",
          "edge_type": "ASSEMBLED_FROM",
          "from_id": "p1:ceddb2f202109ab57517e671",
          "to_id": "p1:8ec6032aa76c9518190bf716"
        },
        {
          "edge_id": "p1:a19fcc494cf9ebeef307704f",
          "edge_type": "ASSEMBLED_FROM",
          "from_id": "p1:ceddb2f202109ab57517e671",
          "to_id": "p1:b36ca85b210a229ba368e254"
        },
        {
          "edge_id": "p1:f5dea58de467c81a25686b77",
          "edge_type": "ASSEMBLED_FROM",
          "from_id": "p1:c6a54e7c69de36ea9a5d48d4",
          "to_id": "p1:09bc1a21d4ba5f5f96c9a471"
        },
        {
          "edge_id": "p1:e1b6a77d69fce53ec7b70d6b",
          "edge_type": "ASSEMBLED_FROM",
          "from_id": "p1:c6a54e7c69de36ea9a5d48d4",
          "to_id": "p1:c27a7db0b0d592747b6fb9d7"
        },
        {
          "edge_id": "p1:45027c34426df91161160cb8",
          "edge_type": "ASSEMBLED_FROM",
          "from_id": "p1:f91b4d02f6e068a6d57ccaf1",
          "to_id": "p1:e501b9552befbd62c188a879"
        },
        {
          "edge_id": "p1:daced9a792958ac7f6e9adfa",
          "edge_type": "ASSEMBLED_FROM",
          "from_id": "p1:f91b4d02f6e068a6d57ccaf1",
          "to_id": "p1:023838f54b9967b507c5b1c5"
        },
        {
          "edge_id": "p1:d4a2182a6e70cb41c57d358a",
          "edge_type": "ASSEMBLED_FROM",
          "from_id": "p1:c9a37e4949920d8cfcc2212b",
          "to_id": "p1:ce2461cc388cbf183df0ab58"
        },
        {
          "edge_id": "p1:3fe0854f36e5862b5183e025",
          "edge_type": "ASSEMBLED_FROM",
          "from_id": "p1:c9a37e4949920d8cfcc2212b",
          "to_id": "p1:8f98279856b6e2a571377e61"
        },
        {
          "edge_id": "p1:89cd35f8f5a8db7e61d6512b",
          "edge_type": "ASSEMBLED_FROM",
          "from_id": "p1:ba7a9905ff49948b7a24e30f",
          "to_id": "p1:c67da2c355abafc3b9ba2191"
        },
        {
          "edge_id": "p1:edc8105c3251ad911fa82368",
          "edge_type": "ASSEMBLED_FROM",
          "from_id": "p1:ba7a9905ff49948b7a24e30f",
          "to_id": "p1:aae712051e1b75812874a40f"
        },
        {
          "edge_id": "p1:8b2d19cd1b3573493ee8d275",
          "edge_type": "ASSEMBLED_FROM",
          "from_id": "p1:4c62f36c2c5c24185ab036b6",
          "to_id": "p1:ed9e2568b12f757098180118"
        },
        {
          "edge_id": "p1:9f03d14b4fb6ec402d9bf77e",
          "edge_type": "ASSEMBLED_FROM",
          "from_id": "p1:4c62f36c2c5c24185ab036b6",
          "to_id": "p1:fae03d5e20f4e7f3a485f43f"
        },
        {
          "edge_id": "p1:17c42a5f9537365b78ae3bda",
          "edge_type": "ASSEMBLED_FROM",
          "from_id": "p1:b9190bbdc0a70d11b248e932",
          "to_id": "p1:e2ec388fc3971496498a7e00"
        },
        {
          "edge_id": "p1:39effe8a32f9c09fa355ee96",
          "edge_type": "ASSEMBLED_FROM",
          "from_id": "p1:b9190bbdc0a70d11b248e932",
          "to_id": "p1:4d435e94f87955cfe8497e5a"
        },
        {
          "edge_id": "p1:9f4cb51e960959901be790b6",
          "edge_type": "ASSEMBLED_FROM",
          "from_id": "p1:084bc64901438dc8d566c4aa",
          "to_id": "p1:11e62bb25fbacd5de2f99b16"
        },
        {
          "edge_id": "p1:d400b8def8f1e6f01aeacf80",
          "edge_type": "ASSEMBLED_FROM",
          "from_id": "p1:084bc64901438dc8d566c4aa",
          "to_id": "p1:6c7b1a5aa9a2a230974921f2"
        },
        {
          "edge_id": "p1:10e6de69b228dc7c054b6e02",
          "edge_type": "ASSEMBLED_FROM",
          "from_id": "p1:56d038a0174381935ddf5d8a",
          "to_id": "p1:b3280db03072765fb7b578c0"
        },
        {
          "edge_id": "p1:712158360ccf614a27866bfe",
          "edge_type": "ASSEMBLED_FROM",
          "from_id": "p1:56d038a0174381935ddf5d8a",
          "to_id": "p1:881070ab17bf0367dba35c84"
        },
        {
          "edge_id": "p1:a55aea1bb2b4686924321104",
          "edge_type": "ASSEMBLED_FROM",
          "from_id": "p1:b620c1adf22a023e1a24567c",
          "to_id": "p1:e74fa0b68e6bca76e7407fab"
        },
        {
          "edge_id": "p1:e88b3277c0c928b0b5ce221b",
          "edge_type": "ASSEMBLED_FROM",
          "from_id": "p1:b620c1adf22a023e1a24567c",
          "to_id": "p1:046b8a38df3cfcad16e0c312"
        },
        {
          "edge_id": "p1:b9c1a06c6fa59f5b276c6a96",
          "edge_type": "ASSEMBLED_FROM",
          "from_id": "p1:c644b053dcd7dec98b1a72b0",
          "to_id": "p1:3017cd866a471dae253fb49f"
        },
        {
          "edge_id": "p1:defb80892ebb7975222ddc3f",
          "edge_type": "ASSEMBLED_FROM",
          "from_id": "p1:c644b053dcd7dec98b1a72b0",
          "to_id": "p1:2eb408529f4d9bdffd872a78"
        },
        {
          "edge_id": "p1:2b110ee53b4a3ac3bbe57b84",
          "edge_type": "ASSEMBLED_FROM",
          "from_id": "p1:a611e4a4395a68a5f19208b2",
          "to_id": "p1:505ef012c580f7b479cd7463"
        },
        {
          "edge_id": "p1:e0565be6e1d5bc13aca1f1f0",
          "edge_type": "ASSEMBLED_FROM",
          "from_id": "p1:a611e4a4395a68a5f19208b2",
          "to_id": "p1:ac0edeb25b345e414dce3a48"
        },
        {
          "edge_id": "p1:c61fd45e4275f69156491320",
          "edge_type": "ASSEMBLED_FROM",
          "from_id": "p1:80e6b0a255decef91586ee9d",
          "to_id": "p1:8ab287529ecf121aed6d53c2"
        },
        {
          "edge_id": "p1:9c1cbb86f91a24291ebf72d6",
          "edge_type": "ASSEMBLED_FROM",
          "from_id": "p1:80e6b0a255decef91586ee9d",
          "to_id": "p1:414a9e892855dcf9c06d9e31"
        },
        {
          "edge_id": "p1:3dfad419e4a5b9cc3fa33a20",
          "edge_type": "ASSEMBLED_FROM",
          "from_id": "p1:0723fb3fb3536159cf93fbd2",
          "to_id": "p1:4c96ff5938c7c7d456764ca4"
        },
        {
          "edge_id": "p1:27ce7faa7d33b337c4440694",
          "edge_type": "ASSEMBLED_FROM",
          "from_id": "p1:0723fb3fb3536159cf93fbd2",
          "to_id": "p1:65bc8806513da33779a62872"
        },
        {
          "edge_id": "p1:21b0f17afa82ac714edde6e0",
          "edge_type": "ASSEMBLED_FROM",
          "from_id": "p1:de94dd01ba3d01514d252ddc",
          "to_id": "p1:0189c986ee896459572fc98e"
        },
        {
          "edge_id": "p1:f69631400b25585c61eaf545",
          "edge_type": "ASSEMBLED_FROM",
          "from_id": "p1:de94dd01ba3d01514d252ddc",
          "to_id": "p1:c01a9999396312725d2092ab"
        },
        {
          "edge_id": "p1:3730b75fef1adf5009ffe42f",
          "edge_type": "ASSEMBLED_FROM",
          "from_id": "p1:a4e01b661ae0a5729ee47a0d",
          "to_id": "p1:22ea92bd320654d64156749c"
        },
        {
          "edge_id": "p1:a7a3cd3a75f3d78c35c585e5",
          "edge_type": "ASSEMBLED_FROM",
          "from_id": "p1:a4e01b661ae0a5729ee47a0d",
          "to_id": "p1:c45d25cbf168e0d5e4070b18"
        },
        {
          "edge_id": "p1:f95ad68e1863d4c07e7423ea",
          "edge_type": "ASSEMBLED_FROM",
          "from_id": "p1:a736d9dd4933095d57ca48c7",
          "to_id": "p1:a5901e2700b99e696b86a3a8"
        },
        {
          "edge_id": "p1:641962bec9da1313673a7053",
          "edge_type": "ASSEMBLED_FROM",
          "from_id": "p1:a736d9dd4933095d57ca48c7",
          "to_id": "p1:040a49d01fc9cd1d87db0d79"
        },
        {
          "edge_id": "p1:fdfc2b0f90d9f85d46b71e1f",
          "edge_type": "DECODED_FROM",
          "from_id": "p1:0dd7d90f11af8b32e5853e70",
          "to_id": "p1:bc16151de68fa942bfcc342c"
        },
        {
          "edge_id": "p1:baf58857787e830a65fa8f67",
          "edge_type": "DECODED_FROM",
          "from_id": "p1:0dd7d90f11af8b32e5853e70",
          "to_id": "p1:ceddb2f202109ab57517e671"
        },
        {
          "edge_id": "p1:6e9d1fefede7b391857c9182",
          "edge_type": "DECODED_FROM",
          "from_id": "p1:a1609605176a8dc1ae251ba8",
          "to_id": "p1:bc16151de68fa942bfcc342c"
        },
        {
          "edge_id": "p1:0e7c7d52ad347834b8a3299f",
          "edge_type": "DECODED_FROM",
          "from_id": "p1:a1609605176a8dc1ae251ba8",
          "to_id": "p1:c6a54e7c69de36ea9a5d48d4"
        },
        {
          "edge_id": "p1:b97e8f7db1c6ae1e596bee6a",
          "edge_type": "DECODED_FROM",
          "from_id": "p1:9001fad4d64a1a33ef5b6093",
          "to_id": "p1:6c371dbb47a7d5cf587c5776"
        },
        {
          "edge_id": "p1:d6e27f7b69a6654f0647633e",
          "edge_type": "DECODED_FROM",
          "from_id": "p1:9001fad4d64a1a33ef5b6093",
          "to_id": "p1:c6a54e7c69de36ea9a5d48d4"
        },
        {
          "edge_id": "p1:85c40cb158fda5cb91dae306",
          "edge_type": "DECODED_FROM",
          "from_id": "p1:1ef9ab898572fb7cb0775244",
          "to_id": "p1:c9a37e4949920d8cfcc2212b"
        },
        {
          "edge_id": "p1:32afd511cca93661c3d7d379",
          "edge_type": "DECODED_FROM",
          "from_id": "p1:1ef9ab898572fb7cb0775244",
          "to_id": "p1:f91b4d02f6e068a6d57ccaf1"
        },
        {
          "edge_id": "p1:d0bad4117a1064a80dda3570",
          "edge_type": "DECODED_FROM",
          "from_id": "p1:772b9dbae27ea10c16853bf4",
          "to_id": "p1:4c62f36c2c5c24185ab036b6"
        },
        {
          "edge_id": "p1:455787e817af0896c658d1b4",
          "edge_type": "DECODED_FROM",
          "from_id": "p1:772b9dbae27ea10c16853bf4",
          "to_id": "p1:ba7a9905ff49948b7a24e30f"
        },
        {
          "edge_id": "p1:3ad01aa36ebfc42121395607",
          "edge_type": "DECODED_FROM",
          "from_id": "p1:3b88985582086541f1de9cbf",
          "to_id": "p1:084bc64901438dc8d566c4aa"
        },
        {
          "edge_id": "p1:9dfc3c03f27efa76724da990",
          "edge_type": "DECODED_FROM",
          "from_id": "p1:3b88985582086541f1de9cbf",
          "to_id": "p1:b9190bbdc0a70d11b248e932"
        },
        {
          "edge_id": "p1:ac8380851bdfe3e78e5f992c",
          "edge_type": "DECODED_FROM",
          "from_id": "p1:8533675f43e4affb3633a153",
          "to_id": "p1:b620c1adf22a023e1a24567c"
        },
        {
          "edge_id": "p1:709207b1be3a7088bb545a9b",
          "edge_type": "DECODED_FROM",
          "from_id": "p1:8533675f43e4affb3633a153",
          "to_id": "p1:c644b053dcd7dec98b1a72b0"
        },
        {
          "edge_id": "p1:301e92da79bb11618f7380d8",
          "edge_type": "DECODED_FROM",
          "from_id": "p1:468c9b98fe9677e61a93719f",
          "to_id": "p1:a611e4a4395a68a5f19208b2"
        },
        {
          "edge_id": "p1:967003a28108aa1c4f783c94",
          "edge_type": "DECODED_FROM",
          "from_id": "p1:468c9b98fe9677e61a93719f",
          "to_id": "p1:56d038a0174381935ddf5d8a"
        },
        {
          "edge_id": "p1:1f798fae6c33e03519bff304",
          "edge_type": "DECODED_FROM",
          "from_id": "p1:42de2bc285acbcbabdcfa19b",
          "to_id": "p1:c9a37e4949920d8cfcc2212b"
        },
        {
          "edge_id": "p1:0b68f7adc30e324fa103f9a5",
          "edge_type": "DECODED_FROM",
          "from_id": "p1:42de2bc285acbcbabdcfa19b",
          "to_id": "p1:ceddb2f202109ab57517e671"
        },
        {
          "edge_id": "p1:0ca4c8281ff5ed2c94afe44e",
          "edge_type": "DECODED_FROM",
          "from_id": "p1:f6d8a617ff335b47da7cd37a",
          "to_id": "p1:4c62f36c2c5c24185ab036b6"
        },
        {
          "edge_id": "p1:9d823b4a9f0d2051ee57d3cf",
          "edge_type": "DECODED_FROM",
          "from_id": "p1:f6d8a617ff335b47da7cd37a",
          "to_id": "p1:ceddb2f202109ab57517e671"
        },
        {
          "edge_id": "p1:5b35056c1853b7b3bb3358cf",
          "edge_type": "DECODED_FROM",
          "from_id": "p1:a93bf92cc54ae598d1827737",
          "to_id": "p1:084bc64901438dc8d566c4aa"
        },
        {
          "edge_id": "p1:1631e7ba5bf60eb20c696faf",
          "edge_type": "DECODED_FROM",
          "from_id": "p1:a93bf92cc54ae598d1827737",
          "to_id": "p1:ceddb2f202109ab57517e671"
        },
        {
          "edge_id": "p1:2d1bedd6fa301d171adacf8d",
          "edge_type": "DECODED_FROM",
          "from_id": "p1:d28cd089b3c7641de5dceb80",
          "to_id": "p1:c9a37e4949920d8cfcc2212b"
        },
        {
          "edge_id": "p1:d1b5f3b1138f585604280eee",
          "edge_type": "DECODED_FROM",
          "from_id": "p1:d28cd089b3c7641de5dceb80",
          "to_id": "p1:f91b4d02f6e068a6d57ccaf1"
        },
        {
          "edge_id": "p1:8b68df0e91e7f86709de0afc",
          "edge_type": "DECODED_FROM",
          "from_id": "p1:477fb0f7f5d41df2df1be479",
          "to_id": "p1:a4e01b661ae0a5729ee47a0d"
        },
        {
          "edge_id": "p1:dfb839829348190a2c0b6efa",
          "edge_type": "DECODED_FROM",
          "from_id": "p1:477fb0f7f5d41df2df1be479",
          "to_id": "p1:de94dd01ba3d01514d252ddc"
        },
        {
          "edge_id": "p1:8ca3c4c6ec10f7dc41e628fa",
          "edge_type": "DECODED_FROM",
          "from_id": "p1:0e19e8bab459cc08ab0ca466",
          "to_id": "p1:a736d9dd4933095d57ca48c7"
        },
        {
          "edge_id": "p1:4b80f0b4c47912e51fe0cffc",
          "edge_type": "DECODED_FROM",
          "from_id": "p1:0e19e8bab459cc08ab0ca466",
          "to_id": "p1:ba7a9905ff49948b7a24e30f"
        },
        {
          "edge_id": "p1:a4402e9910b9269576675aa8",
          "edge_type": "DECODED_FROM",
          "from_id": "p1:9243331fcb655dc69392a620",
          "to_id": "p1:a736d9dd4933095d57ca48c7"
        },
        {
          "edge_id": "p1:94c2daa113760b9f0c883d13",
          "edge_type": "DECODED_FROM",
          "from_id": "p1:9243331fcb655dc69392a620",
          "to_id": "p1:b620c1adf22a023e1a24567c"
        },
        {
          "edge_id": "p1:47e0af8f703e66db39ed9f14",
          "edge_type": "EXTRACTED_FROM",
          "from_id": "p1:26d614f533c2ca82a34efe2e",
          "to_id": "p1:7e372bfad514cce36318ed84"
        },
        {
          "edge_id": "p1:ef2349d73ebd6535fdf9878d",
          "edge_type": "EXTRACTED_FROM",
          "from_id": "p1:ee4d04332b5a183755f03fc6",
          "to_id": "p1:7e372bfad514cce36318ed84"
        },
        {
          "edge_id": "p1:e4c93be70c9f54c527208dff",
          "edge_type": "EXTRACTED_FROM",
          "from_id": "p1:2d4ec67e29430e2b45dfc7a9",
          "to_id": "p1:c3b6cb3a76f63f3925239a75"
        },
        {
          "edge_id": "p1:29506f3cf2b6f5eabd5a2838",
          "edge_type": "EXTRACTED_FROM",
          "from_id": "p1:18373681c9653eb716a16187",
          "to_id": "p1:ed389f091dcf326432af8a2a"
        },
        {
          "edge_id": "p1:f91465c0837b6e6895a43beb",
          "edge_type": "EXTRACTED_FROM",
          "from_id": "p1:7a42b1952ef8c521bab0bc34",
          "to_id": "p1:33360384c3546e1f704c2acb"
        },
        {
          "edge_id": "p1:77b441faf3c205aaaf3c262d",
          "edge_type": "EXTRACTED_FROM",
          "from_id": "p1:7319d3e081dae106200be81c",
          "to_id": "p1:a6c5f5d19c37d015b6bb2102"
        },
        {
          "edge_id": "p1:08f6c8ebe443f5c1f4af55c2",
          "edge_type": "EXTRACTED_FROM",
          "from_id": "p1:adf9a1ae48f1ca5929c266b7",
          "to_id": "p1:7cee66f687b78b2e1ebbf5c8"
        },
        {
          "edge_id": "p1:6d89429987551a11052783f1",
          "edge_type": "EXTRACTED_FROM",
          "from_id": "p1:04a3173230bf5569927f5087",
          "to_id": "p1:44cb17aa7b308e5b8082e48e"
        },
        {
          "edge_id": "p1:7a67cbaf5a7d7a6c55fef2e6",
          "edge_type": "ASSEMBLED_FROM",
          "from_id": "p1:01d1c131754e597229d58228",
          "to_id": "p1:2d4ec67e29430e2b45dfc7a9"
        },
        {
          "edge_id": "p1:7406d483649fd7ac9511244c",
          "edge_type": "EXTRACTED_FROM",
          "from_id": "p1:01d1c131754e597229d58228",
          "to_id": "p1:c3b6cb3a76f63f3925239a75"
        },
        {
          "edge_id": "p1:9ff9b7353d3a3363c85346c7",
          "edge_type": "ASSEMBLED_FROM",
          "from_id": "p1:e9c4919ed75bd291a9ee2c02",
          "to_id": "p1:18373681c9653eb716a16187"
        },
        {
          "edge_id": "p1:19ed2863da7615c284b8be3a",
          "edge_type": "EXTRACTED_FROM",
          "from_id": "p1:e9c4919ed75bd291a9ee2c02",
          "to_id": "p1:ed389f091dcf326432af8a2a"
        },
        {
          "edge_id": "p1:8bdfc8f225015d3f283c7c6c",
          "edge_type": "ASSEMBLED_FROM",
          "from_id": "p1:a126f82c3237a895df56255f",
          "to_id": "p1:7a42b1952ef8c521bab0bc34"
        },
        {
          "edge_id": "p1:39c9c6e155d9000de5026ec9",
          "edge_type": "EXTRACTED_FROM",
          "from_id": "p1:a126f82c3237a895df56255f",
          "to_id": "p1:33360384c3546e1f704c2acb"
        },
        {
          "edge_id": "p1:6c831d89e3cce48e7123445c",
          "edge_type": "ASSEMBLED_FROM",
          "from_id": "p1:144c6da03e00fa79855fae15",
          "to_id": "p1:7319d3e081dae106200be81c"
        },
        {
          "edge_id": "p1:7f58b623b47a1861fa77599b",
          "edge_type": "EXTRACTED_FROM",
          "from_id": "p1:144c6da03e00fa79855fae15",
          "to_id": "p1:a6c5f5d19c37d015b6bb2102"
        },
        {
          "edge_id": "p1:be79719946d50fd3fcd68c07",
          "edge_type": "ASSEMBLED_FROM",
          "from_id": "p1:7d32c5cdf6d7c0f4cefa3516",
          "to_id": "p1:adf9a1ae48f1ca5929c266b7"
        },
        {
          "edge_id": "p1:105d060a6e9a07a1cb2afb4b",
          "edge_type": "EXTRACTED_FROM",
          "from_id": "p1:7d32c5cdf6d7c0f4cefa3516",
          "to_id": "p1:7cee66f687b78b2e1ebbf5c8"
        },
        {
          "edge_id": "p1:626db894371ea387e7d7f59f",
          "edge_type": "ASSEMBLED_FROM",
          "from_id": "p1:f591e8d011050564393938a7",
          "to_id": "p1:04a3173230bf5569927f5087"
        },
        {
          "edge_id": "p1:5396bc168976303d8f94eb02",
          "edge_type": "EXTRACTED_FROM",
          "from_id": "p1:f591e8d011050564393938a7",
          "to_id": "p1:44cb17aa7b308e5b8082e48e"
        },
        {
          "edge_id": "p1:254cf14bacedac6e0109e6fd",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:bca5bf7ece8e5aaf5317eade",
          "to_id": "p1:01d1c131754e597229d58228"
        },
        {
          "edge_id": "p1:1c75af8df7e4569d0e45c1b0",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:bca5bf7ece8e5aaf5317eade",
          "to_id": "p1:2d4ec67e29430e2b45dfc7a9"
        },
        {
          "edge_id": "p1:ee1ed304e8ea8ab9874f739a",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:a29cc6089070db9ba49c556a",
          "to_id": "p1:e9c4919ed75bd291a9ee2c02"
        },
        {
          "edge_id": "p1:9949a0afe4e9d6495dd049a3",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:a29cc6089070db9ba49c556a",
          "to_id": "p1:18373681c9653eb716a16187"
        },
        {
          "edge_id": "p1:26afe0d3da8d038bb76eecfe",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:909f32b1fa6da57c77e3007f",
          "to_id": "p1:a126f82c3237a895df56255f"
        },
        {
          "edge_id": "p1:16ff536dfbf25c2798de81dd",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:909f32b1fa6da57c77e3007f",
          "to_id": "p1:7a42b1952ef8c521bab0bc34"
        },
        {
          "edge_id": "p1:cffa9dbb2127925bf16c26ee",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:27e87dcb89f73ec6be072f01",
          "to_id": "p1:144c6da03e00fa79855fae15"
        },
        {
          "edge_id": "p1:896f7e8ddf425f8d990f6a79",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:27e87dcb89f73ec6be072f01",
          "to_id": "p1:7319d3e081dae106200be81c"
        },
        {
          "edge_id": "p1:0ea0bcc4a14c56b71563bff5",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:eafa6d3890b6ce6b81e9f0e4",
          "to_id": "p1:7d32c5cdf6d7c0f4cefa3516"
        },
        {
          "edge_id": "p1:697810dab826a7aecd9ce3b0",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:eafa6d3890b6ce6b81e9f0e4",
          "to_id": "p1:adf9a1ae48f1ca5929c266b7"
        },
        {
          "edge_id": "p1:44592b65c4512e4fd114dbbb",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:4148c598a99231fe7432a661",
          "to_id": "p1:f591e8d011050564393938a7"
        },
        {
          "edge_id": "p1:024ad43204ce9e626af44eff",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:4148c598a99231fe7432a661",
          "to_id": "p1:04a3173230bf5569927f5087"
        },
        {
          "edge_id": "p1:616a5254f3cc3427eb054f3d",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:af477e290413f68c5cb471b6",
          "to_id": "p1:ee4d04332b5a183755f03fc6"
        },
        {
          "edge_id": "p1:dc692c79aae0ca45101f8a20",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:bca5bf7ece8e5aaf5317eade",
          "to_id": "p1:0b997297c753d801a94634f7"
        },
        {
          "edge_id": "p1:6e2f1ce7b6ee2044f6688c06",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:bca5bf7ece8e5aaf5317eade",
          "to_id": "p1:2f85b975c1a887dc5571c9fa"
        },
        {
          "edge_id": "p1:181af55dad9605d6e05c65a8",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:bca5bf7ece8e5aaf5317eade",
          "to_id": "p1:585b6b22c23ced4208a80143"
        },
        {
          "edge_id": "p1:6675d328071e1e8877b7c755",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:bca5bf7ece8e5aaf5317eade",
          "to_id": "p1:0f2bacddb05c16751c986f66"
        },
        {
          "edge_id": "p1:e4c878b1470c7a49ad662c7e",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:bca5bf7ece8e5aaf5317eade",
          "to_id": "p1:2f219fe1f7eb0ee52b6734dc"
        },
        {
          "edge_id": "p1:288eff9e0ca35465a8206de9",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:bca5bf7ece8e5aaf5317eade",
          "to_id": "p1:4d4f5b315a5e2866df00ee6b"
        },
        {
          "edge_id": "p1:59cefc7c4ec561e4dff237a5",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:bca5bf7ece8e5aaf5317eade",
          "to_id": "p1:7687e26042a3b82009f9f422"
        },
        {
          "edge_id": "p1:e30bc43c4f18fa4a51eb4350",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:bca5bf7ece8e5aaf5317eade",
          "to_id": "p1:74c820bfccbd1eb1baaef9c8"
        },
        {
          "edge_id": "p1:cab577edcf9ba7edf3cf2be7",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:bca5bf7ece8e5aaf5317eade",
          "to_id": "p1:7b3be3451566cd6b1894e50d"
        },
        {
          "edge_id": "p1:5cef261f3749af7c40cbc1be",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:a29cc6089070db9ba49c556a",
          "to_id": "p1:2f85b975c1a887dc5571c9fa"
        },
        {
          "edge_id": "p1:35a5447ef22e892a12fc1604",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:a29cc6089070db9ba49c556a",
          "to_id": "p1:80c70d4955e8d7d2fc755b0d"
        },
        {
          "edge_id": "p1:539e4914d04af56b875cd747",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:a29cc6089070db9ba49c556a",
          "to_id": "p1:7687e26042a3b82009f9f422"
        },
        {
          "edge_id": "p1:9290442d1d2c6ebd58fcb7ad",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:909f32b1fa6da57c77e3007f",
          "to_id": "p1:0b997297c753d801a94634f7"
        },
        {
          "edge_id": "p1:e9579a4330df8559697f6ffb",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:909f32b1fa6da57c77e3007f",
          "to_id": "p1:585b6b22c23ced4208a80143"
        },
        {
          "edge_id": "p1:44ac464fa5d1aec8f1b286fb",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:909f32b1fa6da57c77e3007f",
          "to_id": "p1:74c820bfccbd1eb1baaef9c8"
        },
        {
          "edge_id": "p1:04e466b9e9d6a59aa62fbbae",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:909f32b1fa6da57c77e3007f",
          "to_id": "p1:a2bb525685718808497ba190"
        },
        {
          "edge_id": "p1:608f450fb7517c3c57c61712",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:27e87dcb89f73ec6be072f01",
          "to_id": "p1:0f2bacddb05c16751c986f66"
        },
        {
          "edge_id": "p1:14dda8b9c70493f60d5396d2",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:27e87dcb89f73ec6be072f01",
          "to_id": "p1:7b3be3451566cd6b1894e50d"
        },
        {
          "edge_id": "p1:0d6c5772d5ce420b11f1950e",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:eafa6d3890b6ce6b81e9f0e4",
          "to_id": "p1:a2bb525685718808497ba190"
        },
        {
          "edge_id": "p1:2e5c917644dc6d58793c3d3d",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:eafa6d3890b6ce6b81e9f0e4",
          "to_id": "p1:e35da2d5290a9454911a07c8"
        },
        {
          "edge_id": "p1:b6febe68cc0d7ea0543fad7d",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:4148c598a99231fe7432a661",
          "to_id": "p1:a2bb525685718808497ba190"
        },
        {
          "edge_id": "p1:d830c53759cfe3f824089c4c",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:4148c598a99231fe7432a661",
          "to_id": "p1:e35da2d5290a9454911a07c8"
        },
        {
          "edge_id": "p1:fcc30dcc7da7e13d035987f1",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:af477e290413f68c5cb471b6",
          "to_id": "p1:0b997297c753d801a94634f7"
        },
        {
          "edge_id": "p1:f06073e3e771b9e280c25076",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:af477e290413f68c5cb471b6",
          "to_id": "p1:2f85b975c1a887dc5571c9fa"
        },
        {
          "edge_id": "p1:13311cf05ba4eade51c64a3e",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:af477e290413f68c5cb471b6",
          "to_id": "p1:585b6b22c23ced4208a80143"
        },
        {
          "edge_id": "p1:78b5036104e688d1eff04aaa",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:af477e290413f68c5cb471b6",
          "to_id": "p1:0f2bacddb05c16751c986f66"
        },
        {
          "edge_id": "p1:91bcbaa4f404c99a704a3aef",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:af477e290413f68c5cb471b6",
          "to_id": "p1:2f219fe1f7eb0ee52b6734dc"
        },
        {
          "edge_id": "p1:e16c3913f43733285d62961f",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:af477e290413f68c5cb471b6",
          "to_id": "p1:4d4f5b315a5e2866df00ee6b"
        },
        {
          "edge_id": "p1:66c7065095e324a7adabd9ab",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:af477e290413f68c5cb471b6",
          "to_id": "p1:7687e26042a3b82009f9f422"
        },
        {
          "edge_id": "p1:1b6fb831a2a49fb46fa069be",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:af477e290413f68c5cb471b6",
          "to_id": "p1:74c820bfccbd1eb1baaef9c8"
        },
        {
          "edge_id": "p1:0fae8dd539329c998588aeef",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:af477e290413f68c5cb471b6",
          "to_id": "p1:7b3be3451566cd6b1894e50d"
        },
        {
          "edge_id": "p1:d84678a786e4a4dcc4b0c062",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:af477e290413f68c5cb471b6",
          "to_id": "p1:80c70d4955e8d7d2fc755b0d"
        },
        {
          "edge_id": "p1:f3126299e6acb80ac1006dd9",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:af477e290413f68c5cb471b6",
          "to_id": "p1:a2bb525685718808497ba190"
        },
        {
          "edge_id": "p1:45fc0fa2b61d2724c441380e",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:af477e290413f68c5cb471b6",
          "to_id": "p1:e35da2d5290a9454911a07c8"
        },
        {
          "edge_id": "p1:414c43a133853aa8e9e659d7",
          "edge_type": "DECODED_FROM",
          "from_id": "p1:0b997297c753d801a94634f7",
          "to_id": "p1:772b9dbae27ea10c16853bf4"
        },
        {
          "edge_id": "p1:9b3858b101479bdd1dbef939",
          "edge_type": "DECODED_FROM",
          "from_id": "p1:0b997297c753d801a94634f7",
          "to_id": "p1:f6d8a617ff335b47da7cd37a"
        },
        {
          "edge_id": "p1:f5b61823286828ced5555b57",
          "edge_type": "DECODED_FROM",
          "from_id": "p1:0b997297c753d801a94634f7",
          "to_id": "p1:4c62f36c2c5c24185ab036b6"
        },
        {
          "edge_id": "p1:3747b360ad7a0d623262b3f3",
          "edge_type": "DECODED_FROM",
          "from_id": "p1:0b997297c753d801a94634f7",
          "to_id": "p1:ba7a9905ff49948b7a24e30f"
        },
        {
          "edge_id": "p1:a597a7f6f73a1cf87f08b35f",
          "edge_type": "DECODED_FROM",
          "from_id": "p1:0b997297c753d801a94634f7",
          "to_id": "p1:ceddb2f202109ab57517e671"
        },
        {
          "edge_id": "p1:12c37ada06db421026dbafa3",
          "edge_type": "DECODED_FROM",
          "from_id": "p1:2f85b975c1a887dc5571c9fa",
          "to_id": "p1:42de2bc285acbcbabdcfa19b"
        },
        {
          "edge_id": "p1:99859e3f20da6a3139f8f2f6",
          "edge_type": "DECODED_FROM",
          "from_id": "p1:2f85b975c1a887dc5571c9fa",
          "to_id": "p1:ceddb2f202109ab57517e671"
        },
        {
          "edge_id": "p1:358a39221c19919173d722b8",
          "edge_type": "DECODED_FROM",
          "from_id": "p1:2f85b975c1a887dc5571c9fa",
          "to_id": "p1:c9a37e4949920d8cfcc2212b"
        },
        {
          "edge_id": "p1:046602188e9801a91a4a73d2",
          "edge_type": "DECODED_FROM",
          "from_id": "p1:585b6b22c23ced4208a80143",
          "to_id": "p1:f6d8a617ff335b47da7cd37a"
        },
        {
          "edge_id": "p1:60293f02e584cab31ee2f2ec",
          "edge_type": "DECODED_FROM",
          "from_id": "p1:585b6b22c23ced4208a80143",
          "to_id": "p1:ceddb2f202109ab57517e671"
        },
        {
          "edge_id": "p1:3c2c9e731a3b0e865e057e97",
          "edge_type": "DECODED_FROM",
          "from_id": "p1:585b6b22c23ced4208a80143",
          "to_id": "p1:4c62f36c2c5c24185ab036b6"
        },
        {
          "edge_id": "p1:b15466500396a2b2d5a148ce",
          "edge_type": "DECODED_FROM",
          "from_id": "p1:0f2bacddb05c16751c986f66",
          "to_id": "p1:a93bf92cc54ae598d1827737"
        },
        {
          "edge_id": "p1:68b082abfdcebc7b70728f76",
          "edge_type": "DECODED_FROM",
          "from_id": "p1:0f2bacddb05c16751c986f66",
          "to_id": "p1:ceddb2f202109ab57517e671"
        },
        {
          "edge_id": "p1:c15bb9e851a21ba026bdacee",
          "edge_type": "DECODED_FROM",
          "from_id": "p1:0f2bacddb05c16751c986f66",
          "to_id": "p1:084bc64901438dc8d566c4aa"
        },
        {
          "edge_id": "p1:0a60fe04cdbe6f71cd20df82",
          "edge_type": "DECODED_FROM",
          "from_id": "p1:80c70d4955e8d7d2fc755b0d",
          "to_id": "p1:d28cd089b3c7641de5dceb80"
        },
        {
          "edge_id": "p1:ec6e32c68c410c5d2b969cf9",
          "edge_type": "DECODED_FROM",
          "from_id": "p1:80c70d4955e8d7d2fc755b0d",
          "to_id": "p1:f91b4d02f6e068a6d57ccaf1"
        },
        {
          "edge_id": "p1:b36e726437dd62725ee54730",
          "edge_type": "DECODED_FROM",
          "from_id": "p1:80c70d4955e8d7d2fc755b0d",
          "to_id": "p1:c9a37e4949920d8cfcc2212b"
        },
        {
          "edge_id": "p1:1f91a8595b362537b8512ba2",
          "edge_type": "DECODED_FROM",
          "from_id": "p1:2f219fe1f7eb0ee52b6734dc",
          "to_id": "p1:477fb0f7f5d41df2df1be479"
        },
        {
          "edge_id": "p1:ee631c606b7eec0fecfdaa4e",
          "edge_type": "DECODED_FROM",
          "from_id": "p1:2f219fe1f7eb0ee52b6734dc",
          "to_id": "p1:de94dd01ba3d01514d252ddc"
        },
        {
          "edge_id": "p1:a5396ca41e610a736dc50d8c",
          "edge_type": "DECODED_FROM",
          "from_id": "p1:2f219fe1f7eb0ee52b6734dc",
          "to_id": "p1:a4e01b661ae0a5729ee47a0d"
        },
        {
          "edge_id": "p1:e2d88e93749513c014a941f5",
          "edge_type": "DECODED_FROM",
          "from_id": "p1:4d4f5b315a5e2866df00ee6b",
          "to_id": "p1:477fb0f7f5d41df2df1be479"
        },
        {
          "edge_id": "p1:1fef996ebeef90ef73935cca",
          "edge_type": "DECODED_FROM",
          "from_id": "p1:4d4f5b315a5e2866df00ee6b",
          "to_id": "p1:a4e01b661ae0a5729ee47a0d"
        },
        {
          "edge_id": "p1:23132318f928f9630495f595",
          "edge_type": "DECODED_FROM",
          "from_id": "p1:4d4f5b315a5e2866df00ee6b",
          "to_id": "p1:de94dd01ba3d01514d252ddc"
        },
        {
          "edge_id": "p1:8c4c143978ba8483578fb60f",
          "edge_type": "DECODED_FROM",
          "from_id": "p1:7687e26042a3b82009f9f422",
          "to_id": "p1:1ef9ab898572fb7cb0775244"
        },
        {
          "edge_id": "p1:0f1c2daa983b98b8b5a7fd86",
          "edge_type": "DECODED_FROM",
          "from_id": "p1:7687e26042a3b82009f9f422",
          "to_id": "p1:42de2bc285acbcbabdcfa19b"
        },
        {
          "edge_id": "p1:9a4d040e0ac0a3cd35bc2561",
          "edge_type": "DECODED_FROM",
          "from_id": "p1:7687e26042a3b82009f9f422",
          "to_id": "p1:d28cd089b3c7641de5dceb80"
        },
        {
          "edge_id": "p1:a4b08c5f67ff53fd51be4d43",
          "edge_type": "DECODED_FROM",
          "from_id": "p1:7687e26042a3b82009f9f422",
          "to_id": "p1:c9a37e4949920d8cfcc2212b"
        },
        {
          "edge_id": "p1:df8b937cca621b8951a38b97",
          "edge_type": "DECODED_FROM",
          "from_id": "p1:7687e26042a3b82009f9f422",
          "to_id": "p1:f91b4d02f6e068a6d57ccaf1"
        },
        {
          "edge_id": "p1:f5e1435339e6ed4488c5bd1b",
          "edge_type": "DECODED_FROM",
          "from_id": "p1:7687e26042a3b82009f9f422",
          "to_id": "p1:ceddb2f202109ab57517e671"
        },
        {
          "edge_id": "p1:ef8765d7c8916f50993ea403",
          "edge_type": "DECODED_FROM",
          "from_id": "p1:74c820bfccbd1eb1baaef9c8",
          "to_id": "p1:772b9dbae27ea10c16853bf4"
        },
        {
          "edge_id": "p1:87bfdb4092fc294216c9e93e",
          "edge_type": "DECODED_FROM",
          "from_id": "p1:74c820bfccbd1eb1baaef9c8",
          "to_id": "p1:f6d8a617ff335b47da7cd37a"
        },
        {
          "edge_id": "p1:1cea1346d0cb9a99aa39acf9",
          "edge_type": "DECODED_FROM",
          "from_id": "p1:74c820bfccbd1eb1baaef9c8",
          "to_id": "p1:4c62f36c2c5c24185ab036b6"
        },
        {
          "edge_id": "p1:57dd47ab40333d6a72813b43",
          "edge_type": "DECODED_FROM",
          "from_id": "p1:74c820bfccbd1eb1baaef9c8",
          "to_id": "p1:ba7a9905ff49948b7a24e30f"
        },
        {
          "edge_id": "p1:53f317657eee1f6df3e899b8",
          "edge_type": "DECODED_FROM",
          "from_id": "p1:74c820bfccbd1eb1baaef9c8",
          "to_id": "p1:ceddb2f202109ab57517e671"
        },
        {
          "edge_id": "p1:185494c4d86aae0b5d154f80",
          "edge_type": "DECODED_FROM",
          "from_id": "p1:7b3be3451566cd6b1894e50d",
          "to_id": "p1:3b88985582086541f1de9cbf"
        },
        {
          "edge_id": "p1:9226a35a858d75f2b3690e90",
          "edge_type": "DECODED_FROM",
          "from_id": "p1:7b3be3451566cd6b1894e50d",
          "to_id": "p1:a93bf92cc54ae598d1827737"
        },
        {
          "edge_id": "p1:8880d3dfdff93c17c80392c0",
          "edge_type": "DECODED_FROM",
          "from_id": "p1:7b3be3451566cd6b1894e50d",
          "to_id": "p1:084bc64901438dc8d566c4aa"
        },
        {
          "edge_id": "p1:67eac067321ad06023d93513",
          "edge_type": "DECODED_FROM",
          "from_id": "p1:7b3be3451566cd6b1894e50d",
          "to_id": "p1:b9190bbdc0a70d11b248e932"
        },
        {
          "edge_id": "p1:81669e9d89b086edacb895c4",
          "edge_type": "DECODED_FROM",
          "from_id": "p1:7b3be3451566cd6b1894e50d",
          "to_id": "p1:ceddb2f202109ab57517e671"
        },
        {
          "edge_id": "p1:d5650289d5611026d962d6b9",
          "edge_type": "DECODED_FROM",
          "from_id": "p1:a2bb525685718808497ba190",
          "to_id": "p1:0e19e8bab459cc08ab0ca466"
        },
        {
          "edge_id": "p1:9733885049ec832a220ce1fd",
          "edge_type": "DECODED_FROM",
          "from_id": "p1:a2bb525685718808497ba190",
          "to_id": "p1:9243331fcb655dc69392a620"
        },
        {
          "edge_id": "p1:048b5369c26f109c5a7d3884",
          "edge_type": "DECODED_FROM",
          "from_id": "p1:a2bb525685718808497ba190",
          "to_id": "p1:a736d9dd4933095d57ca48c7"
        },
        {
          "edge_id": "p1:75b9ea7b5649a903b8a7e14a",
          "edge_type": "DECODED_FROM",
          "from_id": "p1:a2bb525685718808497ba190",
          "to_id": "p1:ba7a9905ff49948b7a24e30f"
        },
        {
          "edge_id": "p1:30b746965535da169be4cffa",
          "edge_type": "DECODED_FROM",
          "from_id": "p1:a2bb525685718808497ba190",
          "to_id": "p1:b620c1adf22a023e1a24567c"
        },
        {
          "edge_id": "p1:c1b86d65f3c8607da7af5b47",
          "edge_type": "DECODED_FROM",
          "from_id": "p1:e35da2d5290a9454911a07c8",
          "to_id": "p1:8533675f43e4affb3633a153"
        },
        {
          "edge_id": "p1:0dd3eb5a5942e3680d4183aa",
          "edge_type": "DECODED_FROM",
          "from_id": "p1:e35da2d5290a9454911a07c8",
          "to_id": "p1:9243331fcb655dc69392a620"
        },
        {
          "edge_id": "p1:28ad7dab693d0b44140dc368",
          "edge_type": "DECODED_FROM",
          "from_id": "p1:e35da2d5290a9454911a07c8",
          "to_id": "p1:b620c1adf22a023e1a24567c"
        },
        {
          "edge_id": "p1:52bb41de665d3314fc4d7c99",
          "edge_type": "DECODED_FROM",
          "from_id": "p1:e35da2d5290a9454911a07c8",
          "to_id": "p1:c644b053dcd7dec98b1a72b0"
        },
        {
          "edge_id": "p1:c6682043eedf757ec1c45cfe",
          "edge_type": "DECODED_FROM",
          "from_id": "p1:e35da2d5290a9454911a07c8",
          "to_id": "p1:a736d9dd4933095d57ca48c7"
        },
        {
          "edge_id": "p1:81d2c497b3c98993dc076c14",
          "edge_type": "EXTRACTED_FROM",
          "from_id": "p1:414792900e640c1e201120ce",
          "to_id": "p1:55977590f70a7c12259a382a"
        },
        {
          "edge_id": "p1:3ad0794b95ac422d92dd27f7",
          "edge_type": "EXTRACTED_FROM",
          "from_id": "p1:414792900e640c1e201120ce",
          "to_id": "p1:c3b6cb3a76f63f3925239a75"
        },
        {
          "edge_id": "p1:76e78638994f6faff18b209a",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:414792900e640c1e201120ce",
          "to_id": "p1:a1609605176a8dc1ae251ba8"
        },
        {
          "edge_id": "p1:40d07d6b50f8bbdb8f28a359",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:414792900e640c1e201120ce",
          "to_id": "p1:c6a54e7c69de36ea9a5d48d4"
        },
        {
          "edge_id": "p1:34d86e5bdfb60c346c329ec1",
          "edge_type": "EXTRACTED_FROM",
          "from_id": "p1:fe426b23fb4e76f2e028bec8",
          "to_id": "p1:55977590f70a7c12259a382a"
        },
        {
          "edge_id": "p1:0b8ce19dfaa8861b95616914",
          "edge_type": "EXTRACTED_FROM",
          "from_id": "p1:fe426b23fb4e76f2e028bec8",
          "to_id": "p1:c3b6cb3a76f63f3925239a75"
        },
        {
          "edge_id": "p1:857e1c0f6d09c3df68e820e8",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:fe426b23fb4e76f2e028bec8",
          "to_id": "p1:9001fad4d64a1a33ef5b6093"
        },
        {
          "edge_id": "p1:8225b1bf5bc44bbdadba0e7c",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:fe426b23fb4e76f2e028bec8",
          "to_id": "p1:c6a54e7c69de36ea9a5d48d4"
        },
        {
          "edge_id": "p1:69403573278c7e5e2e4ceafc",
          "edge_type": "EXTRACTED_FROM",
          "from_id": "p1:310fe08e124110c83d7a25e7",
          "to_id": "p1:894d48a8c50dc0ccd6882624"
        },
        {
          "edge_id": "p1:fcaa1ac689bf20e1f79dca32",
          "edge_type": "EXTRACTED_FROM",
          "from_id": "p1:310fe08e124110c83d7a25e7",
          "to_id": "p1:ed389f091dcf326432af8a2a"
        },
        {
          "edge_id": "p1:9368ea1f66e8677b1187b804",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:310fe08e124110c83d7a25e7",
          "to_id": "p1:1ef9ab898572fb7cb0775244"
        },
        {
          "edge_id": "p1:853f0faeead39cee94d79b37",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:310fe08e124110c83d7a25e7",
          "to_id": "p1:f91b4d02f6e068a6d57ccaf1"
        },
        {
          "edge_id": "p1:736724b8747ed307acef0437",
          "edge_type": "EXTRACTED_FROM",
          "from_id": "p1:449d8375dd4f57c93019140b",
          "to_id": "p1:43dcfc40f8e36a005ddde097"
        },
        {
          "edge_id": "p1:2286e0a2b2e164a413c9343a",
          "edge_type": "EXTRACTED_FROM",
          "from_id": "p1:449d8375dd4f57c93019140b",
          "to_id": "p1:a6c5f5d19c37d015b6bb2102"
        },
        {
          "edge_id": "p1:5ccfcfe2dc1ce700f2324491",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:449d8375dd4f57c93019140b",
          "to_id": "p1:3b88985582086541f1de9cbf"
        },
        {
          "edge_id": "p1:9a26524fcf431720d44985fe",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:449d8375dd4f57c93019140b",
          "to_id": "p1:b9190bbdc0a70d11b248e932"
        },
        {
          "edge_id": "p1:7cf06299734bb0a5b0430ae1",
          "edge_type": "EXTRACTED_FROM",
          "from_id": "p1:c5ee8bf6a7ea59d6ce738279",
          "to_id": "p1:894d48a8c50dc0ccd6882624"
        },
        {
          "edge_id": "p1:8ddd3866f2c8ba88f78eeff5",
          "edge_type": "EXTRACTED_FROM",
          "from_id": "p1:c5ee8bf6a7ea59d6ce738279",
          "to_id": "p1:ed389f091dcf326432af8a2a"
        },
        {
          "edge_id": "p1:81286d4664251ee9978a5b82",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:c5ee8bf6a7ea59d6ce738279",
          "to_id": "p1:d28cd089b3c7641de5dceb80"
        },
        {
          "edge_id": "p1:f2d65d6c54e3e927885e5327",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:c5ee8bf6a7ea59d6ce738279",
          "to_id": "p1:f91b4d02f6e068a6d57ccaf1"
        },
        {
          "edge_id": "p1:9394c1d28d2ca640eb6c38d1",
          "edge_type": "EXTRACTED_FROM",
          "from_id": "p1:d85359d3749a4c47556e9414",
          "to_id": "p1:fe524ee37aa9766c142d75f4"
        },
        {
          "edge_id": "p1:039fff144613dbb2e2a9bb51",
          "edge_type": "EXTRACTED_FROM",
          "from_id": "p1:d85359d3749a4c47556e9414",
          "to_id": "p1:33360384c3546e1f704c2acb"
        },
        {
          "edge_id": "p1:3b0205d9d777d712854516a7",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:d85359d3749a4c47556e9414",
          "to_id": "p1:772b9dbae27ea10c16853bf4"
        },
        {
          "edge_id": "p1:7bdd3101e99524b96c12be44",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:d85359d3749a4c47556e9414",
          "to_id": "p1:ba7a9905ff49948b7a24e30f"
        },
        {
          "edge_id": "p1:734aeb1cf02d6605defef29b",
          "edge_type": "EXTRACTED_FROM",
          "from_id": "p1:370d3377b698cb59ff9654bc",
          "to_id": "p1:fe524ee37aa9766c142d75f4"
        },
        {
          "edge_id": "p1:68a6d3e1fb5a988eb2449bae",
          "edge_type": "EXTRACTED_FROM",
          "from_id": "p1:370d3377b698cb59ff9654bc",
          "to_id": "p1:33360384c3546e1f704c2acb"
        },
        {
          "edge_id": "p1:8c15470ac5a4dc8a7554a16f",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:370d3377b698cb59ff9654bc",
          "to_id": "p1:772b9dbae27ea10c16853bf4"
        },
        {
          "edge_id": "p1:5e0599c0b1ebd7bc7fb0b93c",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:370d3377b698cb59ff9654bc",
          "to_id": "p1:ba7a9905ff49948b7a24e30f"
        },
        {
          "edge_id": "p1:b47e6fd9c88c487eb8a39b5c",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:bc93019d92af085e0ce93590",
          "to_id": "p1:370d3377b698cb59ff9654bc"
        },
        {
          "edge_id": "p1:ad12466e47238d23e361ae63",
          "edge_type": "DECODED_FROM",
          "from_id": "p1:0b997297c753d801a94634f7",
          "to_id": "p1:370d3377b698cb59ff9654bc"
        },
        {
          "edge_id": "p1:b6500e3066e2768a0c5182a9",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:88fba17f70996f9df41e7a64",
          "to_id": "p1:c5ee8bf6a7ea59d6ce738279"
        },
        {
          "edge_id": "p1:2c8c38dccb38c5d14b2c864c",
          "edge_type": "DECODED_FROM",
          "from_id": "p1:80c70d4955e8d7d2fc755b0d",
          "to_id": "p1:c5ee8bf6a7ea59d6ce738279"
        },
        {
          "edge_id": "p1:0b219d9b3fe8ece3dd6695b4",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:27bfd7a6a5daa6e0277ab2bd",
          "to_id": "p1:310fe08e124110c83d7a25e7"
        },
        {
          "edge_id": "p1:fc8bf003a4cb8e037b33524e",
          "edge_type": "DECODED_FROM",
          "from_id": "p1:7687e26042a3b82009f9f422",
          "to_id": "p1:310fe08e124110c83d7a25e7"
        },
        {
          "edge_id": "p1:213073b5de75fc4cd2c8a82a",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:a97eadef0078adc4169fa8c9",
          "to_id": "p1:370d3377b698cb59ff9654bc"
        },
        {
          "edge_id": "p1:44d229679139aa79f1215274",
          "edge_type": "DECODED_FROM",
          "from_id": "p1:74c820bfccbd1eb1baaef9c8",
          "to_id": "p1:370d3377b698cb59ff9654bc"
        },
        {
          "edge_id": "p1:53a1efafcd7f8ce92f3435ee",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:1437430eaaa6db395a2371ed",
          "to_id": "p1:449d8375dd4f57c93019140b"
        },
        {
          "edge_id": "p1:d46c97226650ca029707f0be",
          "edge_type": "DECODED_FROM",
          "from_id": "p1:7b3be3451566cd6b1894e50d",
          "to_id": "p1:449d8375dd4f57c93019140b"
        },
        {
          "edge_id": "p1:02b0e1cecb026b40a0769e7d",
          "edge_type": "EXTRACTED_FROM",
          "from_id": "p1:ba50d18e72c4094df644d476",
          "to_id": "p1:dd1067102f5662f9eae2a7f2"
        },
        {
          "edge_id": "p1:161fdeca4f71825dfa47a711",
          "edge_type": "EXTRACTED_FROM",
          "from_id": "p1:ba50d18e72c4094df644d476",
          "to_id": "p1:44cb17aa7b308e5b8082e48e"
        },
        {
          "edge_id": "p1:06bd502009736b3af4c33cda",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:ba50d18e72c4094df644d476",
          "to_id": "p1:0e19e8bab459cc08ab0ca466"
        },
        {
          "edge_id": "p1:a1b37142bbbd6be0c71a412e",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:ba50d18e72c4094df644d476",
          "to_id": "p1:9243331fcb655dc69392a620"
        },
        {
          "edge_id": "p1:b5081d18f6964a4e8117eabb",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:ba50d18e72c4094df644d476",
          "to_id": "p1:a736d9dd4933095d57ca48c7"
        },
        {
          "edge_id": "p1:c6ede55d630873b52350fbcd",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:9daf1368950c33ab6cf8c71f",
          "to_id": "p1:ba50d18e72c4094df644d476"
        },
        {
          "edge_id": "p1:fc837b905b39399c1c76e553",
          "edge_type": "DECODED_FROM",
          "from_id": "p1:e35da2d5290a9454911a07c8",
          "to_id": "p1:ba50d18e72c4094df644d476"
        },
        {
          "edge_id": "p1:5957e66ca413e2c56b8cd8e1",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:bc93019d92af085e0ce93590",
          "to_id": "p1:0b997297c753d801a94634f7"
        },
        {
          "edge_id": "p1:6343127010cbffd5aba26a0a",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:bc93019d92af085e0ce93590",
          "to_id": "p1:772b9dbae27ea10c16853bf4"
        },
        {
          "edge_id": "p1:1bf60c9116cffe03c7ca32e2",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:bc93019d92af085e0ce93590",
          "to_id": "p1:f6d8a617ff335b47da7cd37a"
        },
        {
          "edge_id": "p1:2b73b1e6605c84f660e0f912",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:bc93019d92af085e0ce93590",
          "to_id": "p1:4c62f36c2c5c24185ab036b6"
        },
        {
          "edge_id": "p1:7d28312dd020a3859434ab56",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:bc93019d92af085e0ce93590",
          "to_id": "p1:ba7a9905ff49948b7a24e30f"
        },
        {
          "edge_id": "p1:f5cd900dbd7831a65d5700cc",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:bc93019d92af085e0ce93590",
          "to_id": "p1:ceddb2f202109ab57517e671"
        },
        {
          "edge_id": "p1:429701b64398e6fb9452129b",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:9bb58b1e794ab3704cadd9c9",
          "to_id": "p1:2f85b975c1a887dc5571c9fa"
        },
        {
          "edge_id": "p1:f40180cca748e04301b862df",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:9bb58b1e794ab3704cadd9c9",
          "to_id": "p1:42de2bc285acbcbabdcfa19b"
        },
        {
          "edge_id": "p1:faf021b75d75bb88456487b7",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:9bb58b1e794ab3704cadd9c9",
          "to_id": "p1:ceddb2f202109ab57517e671"
        },
        {
          "edge_id": "p1:e006cb4861c6f6d8f026f1a2",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:9bb58b1e794ab3704cadd9c9",
          "to_id": "p1:c9a37e4949920d8cfcc2212b"
        },
        {
          "edge_id": "p1:8247e68effec3575352b6c31",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:3e4f67f02291ce40004bf1c8",
          "to_id": "p1:585b6b22c23ced4208a80143"
        },
        {
          "edge_id": "p1:5c423eac5130755132c20623",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:3e4f67f02291ce40004bf1c8",
          "to_id": "p1:f6d8a617ff335b47da7cd37a"
        },
        {
          "edge_id": "p1:bc57eb5db8504536bdd9ecc1",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:3e4f67f02291ce40004bf1c8",
          "to_id": "p1:ceddb2f202109ab57517e671"
        },
        {
          "edge_id": "p1:18eaa20eda6af4b0900297c6",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:3e4f67f02291ce40004bf1c8",
          "to_id": "p1:4c62f36c2c5c24185ab036b6"
        },
        {
          "edge_id": "p1:fe641dcd4d03a704d286bb0a",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:37e0469b40f8d6f79bd9a8f3",
          "to_id": "p1:0f2bacddb05c16751c986f66"
        },
        {
          "edge_id": "p1:d4ebeef1e816dfa61769bbd2",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:37e0469b40f8d6f79bd9a8f3",
          "to_id": "p1:a93bf92cc54ae598d1827737"
        },
        {
          "edge_id": "p1:dd1d4f8119338794b6b33db8",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:37e0469b40f8d6f79bd9a8f3",
          "to_id": "p1:ceddb2f202109ab57517e671"
        },
        {
          "edge_id": "p1:6bd1d5781e5e3095c075af16",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:37e0469b40f8d6f79bd9a8f3",
          "to_id": "p1:084bc64901438dc8d566c4aa"
        },
        {
          "edge_id": "p1:6b397e5083dde7f4c7047726",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:88fba17f70996f9df41e7a64",
          "to_id": "p1:80c70d4955e8d7d2fc755b0d"
        },
        {
          "edge_id": "p1:9bf789c89e1873dc17bdcef1",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:88fba17f70996f9df41e7a64",
          "to_id": "p1:d28cd089b3c7641de5dceb80"
        },
        {
          "edge_id": "p1:1ce6ec4d69eb18321402f4bb",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:88fba17f70996f9df41e7a64",
          "to_id": "p1:f91b4d02f6e068a6d57ccaf1"
        },
        {
          "edge_id": "p1:44870707d9641e94c91b04ea",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:88fba17f70996f9df41e7a64",
          "to_id": "p1:c9a37e4949920d8cfcc2212b"
        },
        {
          "edge_id": "p1:4781eeadb111ca93ea42c5af",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:962bd4861b6cd6b8c342eb38",
          "to_id": "p1:2f219fe1f7eb0ee52b6734dc"
        },
        {
          "edge_id": "p1:532ab7a0c8a6b633dca08071",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:962bd4861b6cd6b8c342eb38",
          "to_id": "p1:477fb0f7f5d41df2df1be479"
        },
        {
          "edge_id": "p1:eb64cb78b584063c2f0a7956",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:962bd4861b6cd6b8c342eb38",
          "to_id": "p1:de94dd01ba3d01514d252ddc"
        },
        {
          "edge_id": "p1:ed4c7ae7bb59eca47afe24ff",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:962bd4861b6cd6b8c342eb38",
          "to_id": "p1:a4e01b661ae0a5729ee47a0d"
        },
        {
          "edge_id": "p1:4bd4f344d12980cfc6efc27d",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:c1d226f38a7d41e9780f16db",
          "to_id": "p1:4d4f5b315a5e2866df00ee6b"
        },
        {
          "edge_id": "p1:fa12661e9f8af5bff2b52538",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:c1d226f38a7d41e9780f16db",
          "to_id": "p1:477fb0f7f5d41df2df1be479"
        },
        {
          "edge_id": "p1:39d684aec1ba759ef774e71b",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:c1d226f38a7d41e9780f16db",
          "to_id": "p1:a4e01b661ae0a5729ee47a0d"
        },
        {
          "edge_id": "p1:8d56caf6d9a271bb755308a1",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:c1d226f38a7d41e9780f16db",
          "to_id": "p1:de94dd01ba3d01514d252ddc"
        },
        {
          "edge_id": "p1:02adf33948f212cc168c1ce0",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:27bfd7a6a5daa6e0277ab2bd",
          "to_id": "p1:7687e26042a3b82009f9f422"
        },
        {
          "edge_id": "p1:eb376113a4683ad3f64798df",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:27bfd7a6a5daa6e0277ab2bd",
          "to_id": "p1:1ef9ab898572fb7cb0775244"
        },
        {
          "edge_id": "p1:f34e5dadbce6f1c302840a6f",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:27bfd7a6a5daa6e0277ab2bd",
          "to_id": "p1:42de2bc285acbcbabdcfa19b"
        },
        {
          "edge_id": "p1:59b0651af7136c9c2c2ed7aa",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:27bfd7a6a5daa6e0277ab2bd",
          "to_id": "p1:d28cd089b3c7641de5dceb80"
        },
        {
          "edge_id": "p1:c1c5e37f882b9a1c454b856b",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:27bfd7a6a5daa6e0277ab2bd",
          "to_id": "p1:c9a37e4949920d8cfcc2212b"
        },
        {
          "edge_id": "p1:3a1b3044821ba5955f67f2d8",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:27bfd7a6a5daa6e0277ab2bd",
          "to_id": "p1:f91b4d02f6e068a6d57ccaf1"
        },
        {
          "edge_id": "p1:4a17959b6302396d2203606a",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:27bfd7a6a5daa6e0277ab2bd",
          "to_id": "p1:ceddb2f202109ab57517e671"
        },
        {
          "edge_id": "p1:5055223df2ab294a4e527cb6",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:a97eadef0078adc4169fa8c9",
          "to_id": "p1:74c820bfccbd1eb1baaef9c8"
        },
        {
          "edge_id": "p1:315f21be446f956c70ad10e2",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:a97eadef0078adc4169fa8c9",
          "to_id": "p1:772b9dbae27ea10c16853bf4"
        },
        {
          "edge_id": "p1:dcaa0a8dc411b26d9aeec586",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:a97eadef0078adc4169fa8c9",
          "to_id": "p1:f6d8a617ff335b47da7cd37a"
        },
        {
          "edge_id": "p1:e5fe78e535f4ac9dee91c3a3",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:a97eadef0078adc4169fa8c9",
          "to_id": "p1:4c62f36c2c5c24185ab036b6"
        },
        {
          "edge_id": "p1:48c316791224514d2f083e58",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:a97eadef0078adc4169fa8c9",
          "to_id": "p1:ba7a9905ff49948b7a24e30f"
        },
        {
          "edge_id": "p1:a8a80c2a2aa78a65387cedb0",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:a97eadef0078adc4169fa8c9",
          "to_id": "p1:ceddb2f202109ab57517e671"
        },
        {
          "edge_id": "p1:6189a0d90724fe2fef988c3a",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:1437430eaaa6db395a2371ed",
          "to_id": "p1:7b3be3451566cd6b1894e50d"
        },
        {
          "edge_id": "p1:3f04e54a0a01ba0443b28e53",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:1437430eaaa6db395a2371ed",
          "to_id": "p1:3b88985582086541f1de9cbf"
        },
        {
          "edge_id": "p1:c63670bd87a35a3d0f0cf260",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:1437430eaaa6db395a2371ed",
          "to_id": "p1:a93bf92cc54ae598d1827737"
        },
        {
          "edge_id": "p1:cdd524b3b47d1b2c36c4c483",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:1437430eaaa6db395a2371ed",
          "to_id": "p1:084bc64901438dc8d566c4aa"
        },
        {
          "edge_id": "p1:7464a72cd51b1c7d8c7be2c1",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:1437430eaaa6db395a2371ed",
          "to_id": "p1:b9190bbdc0a70d11b248e932"
        },
        {
          "edge_id": "p1:bdf65df55224b078e459087e",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:1437430eaaa6db395a2371ed",
          "to_id": "p1:ceddb2f202109ab57517e671"
        },
        {
          "edge_id": "p1:f77bbcc3c1eb48c6502b8387",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:e8695ac4e68ea246b1ef699c",
          "to_id": "p1:a2bb525685718808497ba190"
        },
        {
          "edge_id": "p1:60b7cf999be4cfff4459086d",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:e8695ac4e68ea246b1ef699c",
          "to_id": "p1:0e19e8bab459cc08ab0ca466"
        },
        {
          "edge_id": "p1:627fde88cb1e9c7742c524b2",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:e8695ac4e68ea246b1ef699c",
          "to_id": "p1:9243331fcb655dc69392a620"
        },
        {
          "edge_id": "p1:554a5bceb888e6043adc4272",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:e8695ac4e68ea246b1ef699c",
          "to_id": "p1:a736d9dd4933095d57ca48c7"
        },
        {
          "edge_id": "p1:f3488f1573b94259ccd7ae4d",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:e8695ac4e68ea246b1ef699c",
          "to_id": "p1:ba7a9905ff49948b7a24e30f"
        },
        {
          "edge_id": "p1:3ee9d36482ea6e6c3e63499a",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:e8695ac4e68ea246b1ef699c",
          "to_id": "p1:b620c1adf22a023e1a24567c"
        },
        {
          "edge_id": "p1:774eb8101a36733de712af68",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:9daf1368950c33ab6cf8c71f",
          "to_id": "p1:e35da2d5290a9454911a07c8"
        },
        {
          "edge_id": "p1:4140748b20bb683e42ec3ef1",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:9daf1368950c33ab6cf8c71f",
          "to_id": "p1:8533675f43e4affb3633a153"
        },
        {
          "edge_id": "p1:4e74365172613bf2b2171c46",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:9daf1368950c33ab6cf8c71f",
          "to_id": "p1:9243331fcb655dc69392a620"
        },
        {
          "edge_id": "p1:6099c4fc91701a3135261c10",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:9daf1368950c33ab6cf8c71f",
          "to_id": "p1:b620c1adf22a023e1a24567c"
        },
        {
          "edge_id": "p1:433f500b5062580ce1cfa65c",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:9daf1368950c33ab6cf8c71f",
          "to_id": "p1:c644b053dcd7dec98b1a72b0"
        },
        {
          "edge_id": "p1:c61a7d48fad28ebcbc82f1eb",
          "edge_type": "COMPILES_FROM",
          "from_id": "p1:9daf1368950c33ab6cf8c71f",
          "to_id": "p1:a736d9dd4933095d57ca48c7"
        },
        {
          "edge_id": "p1:bcdab36ae6ad21cab7a22396",
          "edge_type": "PROJECTS_TO",
          "from_id": "p1:201c3b20e6a19143a75d63fa",
          "to_id": "p1:88fba17f70996f9df41e7a64"
        },
        {
          "edge_id": "p1:a78ab75068f343774e8b27aa",
          "edge_type": "PROJECTS_TO",
          "from_id": "p1:7da26f8e690a7c81b4bc6f89",
          "to_id": "p1:bc93019d92af085e0ce93590"
        },
        {
          "edge_id": "p1:573e54d17045e49002f0e6ce",
          "edge_type": "PROJECTS_TO",
          "from_id": "p1:25d5f96e2bfe97948bc26377",
          "to_id": "p1:27bfd7a6a5daa6e0277ab2bd"
        },
        {
          "edge_id": "p1:8d148a9e58aa6344787159c7",
          "edge_type": "PROJECTS_TO",
          "from_id": "p1:9f306484f3a9d0fe95ba76e7",
          "to_id": "p1:a97eadef0078adc4169fa8c9"
        },
        {
          "edge_id": "p1:6f896115775d3f56d2448c5d",
          "edge_type": "PROJECTS_TO",
          "from_id": "p1:15e36e27b333cf1b7873a98a",
          "to_id": "p1:9bb58b1e794ab3704cadd9c9"
        },
        {
          "edge_id": "p1:2974c5f3170e00931f03871e",
          "edge_type": "PROJECTS_TO",
          "from_id": "p1:15e36e27b333cf1b7873a98a",
          "to_id": "p1:3e4f67f02291ce40004bf1c8"
        },
        {
          "edge_id": "p1:9131b73f4b22651a39ba3f9f",
          "edge_type": "PROJECTS_TO",
          "from_id": "p1:15e36e27b333cf1b7873a98a",
          "to_id": "p1:37e0469b40f8d6f79bd9a8f3"
        },
        {
          "edge_id": "p1:43c8dc85bddbbbf3f1489eac",
          "edge_type": "PROJECTS_TO",
          "from_id": "p1:15e36e27b333cf1b7873a98a",
          "to_id": "p1:962bd4861b6cd6b8c342eb38"
        },
        {
          "edge_id": "p1:557291406a51fce9c374a9bb",
          "edge_type": "PROJECTS_TO",
          "from_id": "p1:e2a6442a64a7d52644ebb5b1",
          "to_id": "p1:9daf1368950c33ab6cf8c71f"
        },
        {
          "edge_id": "p1:ae759d494551772e7774c03a",
          "edge_type": "PROJECTS_TO",
          "from_id": "p1:84d1c7950ef1ef39e10404f2",
          "to_id": "p1:1437430eaaa6db395a2371ed"
        },
        {
          "edge_id": "p1:874c62a61e20c04d3e2fd09b",
          "edge_type": "PROJECTS_TO",
          "from_id": "p1:21b45f2170a6938c6da97d78",
          "to_id": "p1:bca5bf7ece8e5aaf5317eade"
        },
        {
          "edge_id": "p1:47d47346b84f31eea7d1ff9c",
          "edge_type": "PROJECTS_TO",
          "from_id": "p1:21b45f2170a6938c6da97d78",
          "to_id": "p1:a29cc6089070db9ba49c556a"
        },
        {
          "edge_id": "p1:37afb5fcb2b7ada6248e39c7",
          "edge_type": "PROJECTS_TO",
          "from_id": "p1:21b45f2170a6938c6da97d78",
          "to_id": "p1:909f32b1fa6da57c77e3007f"
        },
        {
          "edge_id": "p1:0994110e58bf90b849194d03",
          "edge_type": "PROJECTS_TO",
          "from_id": "p1:21b45f2170a6938c6da97d78",
          "to_id": "p1:27e87dcb89f73ec6be072f01"
        },
        {
          "edge_id": "p1:524a0e35e73499aa3eb53a34",
          "edge_type": "PROJECTS_TO",
          "from_id": "p1:21b45f2170a6938c6da97d78",
          "to_id": "p1:eafa6d3890b6ce6b81e9f0e4"
        },
        {
          "edge_id": "p1:d2e0c2f944e5d6161b23ac83",
          "edge_type": "PROJECTS_TO",
          "from_id": "p1:21b45f2170a6938c6da97d78",
          "to_id": "p1:4148c598a99231fe7432a661"
        },
        {
          "edge_id": "p1:1fedce65d9286296f0a4a609",
          "edge_type": "PROJECTS_TO",
          "from_id": "p1:21b45f2170a6938c6da97d78",
          "to_id": "p1:af477e290413f68c5cb471b6"
        },
        {
          "edge_id": "p1:4bb7c8e549367ce0db001a4a",
          "edge_type": "PROJECTS_TO",
          "from_id": "p1:7d5f127e4b5ea47e87b395fd",
          "to_id": "p1:bca5bf7ece8e5aaf5317eade"
        },
        {
          "edge_id": "p1:36b7fdbbbda6276f1d49a8c1",
          "edge_type": "PROJECTS_TO",
          "from_id": "p1:7d5f127e4b5ea47e87b395fd",
          "to_id": "p1:a29cc6089070db9ba49c556a"
        },
        {
          "edge_id": "p1:9bd0216f527123ff2f35c8e2",
          "edge_type": "PROJECTS_TO",
          "from_id": "p1:7d5f127e4b5ea47e87b395fd",
          "to_id": "p1:909f32b1fa6da57c77e3007f"
        },
        {
          "edge_id": "p1:1f33f79716cf28363035f640",
          "edge_type": "PROJECTS_TO",
          "from_id": "p1:7d5f127e4b5ea47e87b395fd",
          "to_id": "p1:27e87dcb89f73ec6be072f01"
        },
        {
          "edge_id": "p1:44affcbf99d8a10158544275",
          "edge_type": "PROJECTS_TO",
          "from_id": "p1:7d5f127e4b5ea47e87b395fd",
          "to_id": "p1:eafa6d3890b6ce6b81e9f0e4"
        },
        {
          "edge_id": "p1:e72d6bf37d31316995958a22",
          "edge_type": "PROJECTS_TO",
          "from_id": "p1:7d5f127e4b5ea47e87b395fd",
          "to_id": "p1:4148c598a99231fe7432a661"
        },
        {
          "edge_id": "p1:2bb7164824e423de6a8c83f0",
          "edge_type": "PROJECTS_TO",
          "from_id": "p1:7d5f127e4b5ea47e87b395fd",
          "to_id": "p1:af477e290413f68c5cb471b6"
        },
        {
          "edge_id": "p1:fddc655b454f0162973e15e8",
          "edge_type": "PROJECTS_TO",
          "from_id": "p1:274bcb1eb9775d403c5b4ae1",
          "to_id": "p1:bca5bf7ece8e5aaf5317eade"
        },
        {
          "edge_id": "p1:3f7d973be92be532ee68c650",
          "edge_type": "PROJECTS_TO",
          "from_id": "p1:274bcb1eb9775d403c5b4ae1",
          "to_id": "p1:a29cc6089070db9ba49c556a"
        },
        {
          "edge_id": "p1:3028b237e0933c5640bcda97",
          "edge_type": "PROJECTS_TO",
          "from_id": "p1:274bcb1eb9775d403c5b4ae1",
          "to_id": "p1:909f32b1fa6da57c77e3007f"
        },
        {
          "edge_id": "p1:8c18a3fa20da2ad60a4040ca",
          "edge_type": "PROJECTS_TO",
          "from_id": "p1:274bcb1eb9775d403c5b4ae1",
          "to_id": "p1:27e87dcb89f73ec6be072f01"
        },
        {
          "edge_id": "p1:79b012157e951bfe0578f1b6",
          "edge_type": "PROJECTS_TO",
          "from_id": "p1:274bcb1eb9775d403c5b4ae1",
          "to_id": "p1:eafa6d3890b6ce6b81e9f0e4"
        },
        {
          "edge_id": "p1:c25cc92c3ce39d5004627fcd",
          "edge_type": "PROJECTS_TO",
          "from_id": "p1:274bcb1eb9775d403c5b4ae1",
          "to_id": "p1:4148c598a99231fe7432a661"
        },
        {
          "edge_id": "p1:7bb7f01e2d6636194aa126f8",
          "edge_type": "PROJECTS_TO",
          "from_id": "p1:274bcb1eb9775d403c5b4ae1",
          "to_id": "p1:af477e290413f68c5cb471b6"
        },
        {
          "edge_id": "p1:8457e47652d550223a447830",
          "edge_type": "PROJECTS_TO",
          "from_id": "p1:11ed29e6464f6965f4ca4452",
          "to_id": "p1:bca5bf7ece8e5aaf5317eade"
        },
        {
          "edge_id": "p1:edbe16cae3bdc055b8e4be34",
          "edge_type": "PROJECTS_TO",
          "from_id": "p1:11ed29e6464f6965f4ca4452",
          "to_id": "p1:a29cc6089070db9ba49c556a"
        },
        {
          "edge_id": "p1:3a4c49c6cc142517a1f84df4",
          "edge_type": "PROJECTS_TO",
          "from_id": "p1:11ed29e6464f6965f4ca4452",
          "to_id": "p1:909f32b1fa6da57c77e3007f"
        },
        {
          "edge_id": "p1:bf1f1f8020d19f19b7064908",
          "edge_type": "PROJECTS_TO",
          "from_id": "p1:11ed29e6464f6965f4ca4452",
          "to_id": "p1:27e87dcb89f73ec6be072f01"
        },
        {
          "edge_id": "p1:86ea4541aa79db809740e6af",
          "edge_type": "PROJECTS_TO",
          "from_id": "p1:11ed29e6464f6965f4ca4452",
          "to_id": "p1:eafa6d3890b6ce6b81e9f0e4"
        },
        {
          "edge_id": "p1:fc44057289de6d45245a06a5",
          "edge_type": "PROJECTS_TO",
          "from_id": "p1:11ed29e6464f6965f4ca4452",
          "to_id": "p1:4148c598a99231fe7432a661"
        },
        {
          "edge_id": "p1:5d575a6d7582608ce8499332",
          "edge_type": "PROJECTS_TO",
          "from_id": "p1:11ed29e6464f6965f4ca4452",
          "to_id": "p1:af477e290413f68c5cb471b6"
        },
        {
          "edge_id": "p1:19e7c2016fd49a3474f51bb3",
          "edge_type": "PROJECTS_TO",
          "from_id": "p1:a9880b69f58ca8a8edc286c9",
          "to_id": "p1:bca5bf7ece8e5aaf5317eade"
        },
        {
          "edge_id": "p1:e86d8f94648955ca1c188dc0",
          "edge_type": "PROJECTS_TO",
          "from_id": "p1:a9880b69f58ca8a8edc286c9",
          "to_id": "p1:a29cc6089070db9ba49c556a"
        },
        {
          "edge_id": "p1:4b3fa44d9681e5254925e8cb",
          "edge_type": "PROJECTS_TO",
          "from_id": "p1:a9880b69f58ca8a8edc286c9",
          "to_id": "p1:909f32b1fa6da57c77e3007f"
        },
        {
          "edge_id": "p1:b02153fcfd38e4312b24a1f1",
          "edge_type": "PROJECTS_TO",
          "from_id": "p1:a9880b69f58ca8a8edc286c9",
          "to_id": "p1:27e87dcb89f73ec6be072f01"
        },
        {
          "edge_id": "p1:7b8176c6afa58cfaecb75645",
          "edge_type": "PROJECTS_TO",
          "from_id": "p1:a9880b69f58ca8a8edc286c9",
          "to_id": "p1:eafa6d3890b6ce6b81e9f0e4"
        },
        {
          "edge_id": "p1:e1d3c1582b40d41037ade1bb",
          "edge_type": "PROJECTS_TO",
          "from_id": "p1:a9880b69f58ca8a8edc286c9",
          "to_id": "p1:4148c598a99231fe7432a661"
        },
        {
          "edge_id": "p1:6b414631ca8d2347debe82fb",
          "edge_type": "PROJECTS_TO",
          "from_id": "p1:a9880b69f58ca8a8edc286c9",
          "to_id": "p1:af477e290413f68c5cb471b6"
        },
        {
          "edge_id": "p1:ab2c34de236e0422f279af63",
          "edge_type": "PROJECTS_TO",
          "from_id": "p1:b6a5fdff267fbee9f273e76c",
          "to_id": "p1:bca5bf7ece8e5aaf5317eade"
        },
        {
          "edge_id": "p1:42198ac23bb6a210843a3a2c",
          "edge_type": "PROJECTS_TO",
          "from_id": "p1:b6a5fdff267fbee9f273e76c",
          "to_id": "p1:a29cc6089070db9ba49c556a"
        },
        {
          "edge_id": "p1:f5f6d191a24677a683e26d7b",
          "edge_type": "PROJECTS_TO",
          "from_id": "p1:b6a5fdff267fbee9f273e76c",
          "to_id": "p1:909f32b1fa6da57c77e3007f"
        },
        {
          "edge_id": "p1:bc3915fea905aa65b84d4710",
          "edge_type": "PROJECTS_TO",
          "from_id": "p1:b6a5fdff267fbee9f273e76c",
          "to_id": "p1:27e87dcb89f73ec6be072f01"
        },
        {
          "edge_id": "p1:f4f54a6e252e731d9870d3ee",
          "edge_type": "PROJECTS_TO",
          "from_id": "p1:b6a5fdff267fbee9f273e76c",
          "to_id": "p1:eafa6d3890b6ce6b81e9f0e4"
        },
        {
          "edge_id": "p1:c8588a2cbeab74186e017b2e",
          "edge_type": "PROJECTS_TO",
          "from_id": "p1:b6a5fdff267fbee9f273e76c",
          "to_id": "p1:4148c598a99231fe7432a661"
        },
        {
          "edge_id": "p1:8ce9669c755cb56d7278eaa3",
          "edge_type": "PROJECTS_TO",
          "from_id": "p1:b6a5fdff267fbee9f273e76c",
          "to_id": "p1:af477e290413f68c5cb471b6"
        },
        {
          "edge_id": "p1:3c25c83e10d391d990c0b77a",
          "edge_type": "PROJECTS_TO",
          "from_id": "p1:b0afca2c469720e49ead5426",
          "to_id": "p1:bca5bf7ece8e5aaf5317eade"
        },
        {
          "edge_id": "p1:00e6b410e3d0031d177614c6",
          "edge_type": "PROJECTS_TO",
          "from_id": "p1:b0afca2c469720e49ead5426",
          "to_id": "p1:a29cc6089070db9ba49c556a"
        },
        {
          "edge_id": "p1:c5428cb3a7ff9212d381c51d",
          "edge_type": "PROJECTS_TO",
          "from_id": "p1:b0afca2c469720e49ead5426",
          "to_id": "p1:909f32b1fa6da57c77e3007f"
        },
        {
          "edge_id": "p1:74c76c69b8eba0d779713a2e",
          "edge_type": "PROJECTS_TO",
          "from_id": "p1:b0afca2c469720e49ead5426",
          "to_id": "p1:27e87dcb89f73ec6be072f01"
        },
        {
          "edge_id": "p1:f887c9d6f1ae5d8b0569a85f",
          "edge_type": "PROJECTS_TO",
          "from_id": "p1:b0afca2c469720e49ead5426",
          "to_id": "p1:eafa6d3890b6ce6b81e9f0e4"
        },
        {
          "edge_id": "p1:7de18730fba6ef807a03eaf2",
          "edge_type": "PROJECTS_TO",
          "from_id": "p1:b0afca2c469720e49ead5426",
          "to_id": "p1:4148c598a99231fe7432a661"
        },
        {
          "edge_id": "p1:c5bde8f2ee9ee1f5c826b7f0",
          "edge_type": "PROJECTS_TO",
          "from_id": "p1:b0afca2c469720e49ead5426",
          "to_id": "p1:af477e290413f68c5cb471b6"
        },
        {
          "edge_id": "p1:4da55c1b67a68de0c05506cd",
          "edge_type": "PROJECTS_TO",
          "from_id": "p1:831727cd972fea67a75daf4f",
          "to_id": "p1:bca5bf7ece8e5aaf5317eade"
        },
        {
          "edge_id": "p1:c1a6a3923ccaa5ab6082db41",
          "edge_type": "PROJECTS_TO",
          "from_id": "p1:831727cd972fea67a75daf4f",
          "to_id": "p1:a29cc6089070db9ba49c556a"
        },
        {
          "edge_id": "p1:f5e3fe8cc0aa9baa66fe80c2",
          "edge_type": "PROJECTS_TO",
          "from_id": "p1:831727cd972fea67a75daf4f",
          "to_id": "p1:909f32b1fa6da57c77e3007f"
        },
        {
          "edge_id": "p1:f01dea9a5bb87c2924c55b47",
          "edge_type": "PROJECTS_TO",
          "from_id": "p1:831727cd972fea67a75daf4f",
          "to_id": "p1:27e87dcb89f73ec6be072f01"
        },
        {
          "edge_id": "p1:13e385ee8f30288e1f5396cb",
          "edge_type": "PROJECTS_TO",
          "from_id": "p1:831727cd972fea67a75daf4f",
          "to_id": "p1:eafa6d3890b6ce6b81e9f0e4"
        },
        {
          "edge_id": "p1:99785b4adfbdb7b84f885a7f",
          "edge_type": "PROJECTS_TO",
          "from_id": "p1:831727cd972fea67a75daf4f",
          "to_id": "p1:4148c598a99231fe7432a661"
        },
        {
          "edge_id": "p1:abd83690c64ef39352444e4c",
          "edge_type": "PROJECTS_TO",
          "from_id": "p1:831727cd972fea67a75daf4f",
          "to_id": "p1:af477e290413f68c5cb471b6"
        }
      ]
    },
    "diagnostics": [],
    "performance": {
      "model_load_count": 2,
      "nlp_ms": 6788.57189998962
    }
  },
  "source_spans": [
    {
      "span_id": "p1:571d80d40877f6505adf1d06",
      "start": 0,
      "end": 72,
      "text": "张宁负责这项整理。请读取 input.csv，生成 report.md。不得修改 input.csv。report.md 已生成后，本任务完成。"
    },
    {
      "span_id": "p1:e157be95c430ae6af88e6a37",
      "start": 0,
      "end": 8,
      "text": "张宁负责这项整理"
    },
    {
      "span_id": "p1:2cbc54e36db5ace4bf94cf39",
      "start": 2,
      "end": 4,
      "text": "负责"
    },
    {
      "span_id": "p1:b0eccf72b3d1edf969c8f671",
      "start": 4,
      "end": 8,
      "text": "这项整理"
    },
    {
      "span_id": "p1:71bb1d16f0709043431028ea",
      "start": 0,
      "end": 2,
      "text": "张宁"
    },
    {
      "span_id": "p1:b6f9329b82cfe4bf264e6752",
      "start": 9,
      "end": 22,
      "text": "请读取 input.csv"
    },
    {
      "span_id": "p1:9d123dd0da21f3490930ff89",
      "start": 13,
      "end": 22,
      "text": "input.csv"
    },
    {
      "span_id": "p1:fd66e7077083782d8fc63cf9",
      "start": 10,
      "end": 12,
      "text": "读取"
    },
    {
      "span_id": "p1:7f0793aa43172b583c71aea5",
      "start": 23,
      "end": 35,
      "text": "生成 report.md"
    },
    {
      "span_id": "p1:816520f3f44f6ecce1fcffe1",
      "start": 26,
      "end": 35,
      "text": "report.md"
    },
    {
      "span_id": "p1:73e3c5ea188ca1c5d3a01a25",
      "start": 23,
      "end": 25,
      "text": "生成"
    },
    {
      "span_id": "p1:f33c3a1c29e28002155201ca",
      "start": 36,
      "end": 50,
      "text": "不得修改 input.csv"
    },
    {
      "span_id": "p1:55ad616030ab5968a94ded69",
      "start": 41,
      "end": 50,
      "text": "input.csv"
    },
    {
      "span_id": "p1:35a039fa3ba0f2d5d34e5280",
      "start": 36,
      "end": 38,
      "text": "不得"
    },
    {
      "span_id": "p1:0ac85b43b0dc6a80218e77f0",
      "start": 38,
      "end": 40,
      "text": "修改"
    },
    {
      "span_id": "p1:16c6c0a6d036213bdc5dc5e7",
      "start": 51,
      "end": 65,
      "text": "report.md 已生成后"
    },
    {
      "span_id": "p1:128b95de26c3a7705c96510e",
      "start": 51,
      "end": 60,
      "text": "report.md"
    },
    {
      "span_id": "p1:a85ebf0b750986ebd6f278f6",
      "start": 66,
      "end": 71,
      "text": "本任务完成"
    },
    {
      "span_id": "p1:389fc6806e332239f3a0a558",
      "start": 69,
      "end": 71,
      "text": "完成"
    },
    {
      "span_id": "p1:3dc88c03831e32f9a8fc67ce",
      "start": 66,
      "end": 69,
      "text": "本任务"
    },
    {
      "span_id": "p1:c5e695a4d3c696b147d967d9",
      "start": 62,
      "end": 64,
      "text": "生成"
    },
    {
      "span_id": "p1:5843a93c9de7260207fbac4e",
      "start": 9,
      "end": 10,
      "text": "请"
    },
    {
      "span_id": "p1:5e3b5ab04595aef88e78c85c",
      "start": 51,
      "end": 64,
      "text": "report.md 已生成"
    }
  ],
  "stage_availability": {
    "source": "AVAILABLE",
    "structure": "AVAILABLE",
    "nlp_signals": "AVAILABLE",
    "span_lattice": "AVAILABLE",
    "semantic_nodes": "AVAILABLE",
    "relations": "AVAILABLE",
    "relation_bundles": "AVAILABLE",
    "unresolved": "AVAILABLE",
    "eligibility_decisions": "AVAILABLE",
    "coverage": "AVAILABLE",
    "boundary_ir": "AVAILABLE",
    "canonical_7plus1": "AVAILABLE",
    "proof_dag": "AVAILABLE"
  },
  "contract_gate_results": {
    "contract_version": "0.3-p0-closure",
    "status": "PASS",
    "gates": {
      "G1": {
        "status": "PASS",
        "errors": []
      },
      "G2": {
        "status": "PASS",
        "errors": []
      },
      "G3": {
        "status": "PASS",
        "errors": [],
        "nodes": 19
      },
      "G4": {
        "status": "PASS",
        "errors": []
      },
      "G5": {
        "status": "PASS",
        "errors": []
      },
      "G6": {
        "status": "PASS",
        "errors": []
      },
      "G7": {
        "status": "PASS",
        "errors": [],
        "runtime": "AVAILABLE"
      },
      "G8": {
        "status": "PASS",
        "errors": [],
        "direct_raw_nlp_to_slot_edges": 0,
        "scope": "compiler_v03; explicitly isolated legacy output excluded"
      },
      "G9": {
        "status": "PASS",
        "errors": []
      },
      "G10": {
        "status": "PASS",
        "errors": [],
        "availability": {
          "source": "AVAILABLE",
          "structure": "AVAILABLE",
          "nlp_signals": "AVAILABLE",
          "span_lattice": "AVAILABLE",
          "semantic_nodes": "AVAILABLE",
          "relations": "AVAILABLE",
          "relation_bundles": "AVAILABLE",
          "unresolved": "AVAILABLE",
          "eligibility_decisions": "AVAILABLE",
          "coverage": "AVAILABLE",
          "boundary_ir": "AVAILABLE",
          "canonical_7plus1": "AVAILABLE",
          "proof_dag": "AVAILABLE"
        }
      },
      "G11": {
        "status": "PASS",
        "errors": [],
        "orphan_relation_ids": 0,
        "dangling_relation_endpoints": 0
      },
      "G12": {
        "status": "PASS",
        "errors": [],
        "dangling_clause_ids": 0
      },
      "G13": {
        "status": "PASS",
        "errors": [],
        "dangling_eligibility_ids": 0
      },
      "G14": {
        "status": "PASS",
        "errors": [],
        "anonymous_logic_operators": 0
      },
      "G15": {
        "status": "PASS",
        "errors": [],
        "canonical_unknown_fields": 0
      },
      "G16": {
        "status": "PASS",
        "errors": [],
        "unsafe_absent_slots": 0,
        "source_codepoints_accounted": 72,
        "source_accountability_complete": true
      }
    }
  },
  "relation_type_audit": {
    "status": "PASS",
    "illegal_relation_type_signatures": 0,
    "invalid": []
  },
  "native_provenance": {
    "input_stages": [
      "SOURCE",
      "NLP_SIGNALS",
      "TYPED_RECOGNIZERS"
    ],
    "legacy_reverse_projection_edges": 0,
    "direct_raw_nlp_to_slot_edges": 0,
    "LLM": "NOT_USED"
  },
  "first_divergence": null
}
```
