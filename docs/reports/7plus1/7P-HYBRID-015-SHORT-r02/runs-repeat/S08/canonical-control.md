# Actual Canonical 7+1

```json
{
  "projection_id": "p1:dfac987c7718ac3ec96a262e",
  "I": {
    "slot": "I",
    "status": "PARSER_COVERAGE_FAILURE",
    "entries": [
      {
        "canonical_entry_id": "p1:c04fb6d375d15fb8ae03ff6b",
        "slot": "I",
        "boundary_fact_ids": [
          "p1:054daca141d37f7c3b3d455b"
        ],
        "state": "RESOLVED",
        "display_value": "权限清单",
        "source_span_ids": [
          "p1:77c12d398a4003716506d5d9",
          "p1:598b3d12e0f4124feef6eac1",
          "p1:b7a6a1b8738c69f0c51467e7"
        ],
        "scope_expr_id": "p1:31feed1068e79f23b8a9772b"
      },
      {
        "canonical_entry_id": "p1:d1339de5db58d6137f4e7d11",
        "slot": "I",
        "boundary_fact_ids": [
          "p1:8ecf5635f8e567e5dcdba9ab"
        ],
        "state": "RESOLVED",
        "display_value": "account-list.csv",
        "source_span_ids": [
          "p1:a6198f93681789add5994e03",
          "p1:12ea2960dde7ceb3b05fa223",
          "p1:b7a6a1b8738c69f0c51467e7"
        ],
        "scope_expr_id": "p1:9f0dceaafb30cc64ea06eaa5"
      },
      {
        "canonical_entry_id": "p1:57ddca2acf76092ac5c0c9fc",
        "slot": "I",
        "boundary_fact_ids": [
          "p1:e67343596588125f61d8bc76"
        ],
        "state": "RESOLVED",
        "display_value": "policy-list.csv",
        "source_span_ids": [
          "p1:ff3d9ab3f1134d02c6fc595c",
          "p1:12ea2960dde7ceb3b05fa223",
          "p1:b7a6a1b8738c69f0c51467e7"
        ],
        "scope_expr_id": "p1:be71716420e005bf5fbe95d3"
      },
      {
        "canonical_entry_id": "p1:7beaf326f5e9a2cdf8eefa2b",
        "slot": "I",
        "boundary_fact_ids": [
          "p1:c7c821098640309b414eba7c"
        ],
        "state": "RESOLVED",
        "display_value": "account-list.csv",
        "source_span_ids": [
          "p1:fd714dd17ff90ca4f3a1332a",
          "p1:48a0cb14a2d5e73210e8e4ce",
          "p1:2a2988c82236bdf515207b44"
        ],
        "scope_expr_id": "p1:129f327bba413128c6fbb676"
      },
      {
        "canonical_entry_id": "p1:26bdbd68ecdff257f3ffb71b",
        "slot": "I",
        "boundary_fact_ids": [
          "p1:f5d6a58b6e902270200fc630"
        ],
        "state": "RESOLVED",
        "display_value": "policy-list.csv",
        "source_span_ids": [
          "p1:a6ee43530f8144a46935ce8f",
          "p1:48a0cb14a2d5e73210e8e4ce",
          "p1:2a2988c82236bdf515207b44"
        ],
        "scope_expr_id": "p1:07743b7cd1128cbeecfef5a3"
      }
    ]
  },
  "O": {
    "slot": "O",
    "status": "PARSER_COVERAGE_FAILURE",
    "entries": [
      {
        "canonical_entry_id": "p1:bc68647590bb576c4b036633",
        "slot": "O",
        "boundary_fact_ids": [
          "p1:88dcf7bee6115dd8fb112947"
        ],
        "state": "RESOLVED",
        "display_value": "access-review.md",
        "source_span_ids": [
          "p1:a0c683c2a5e9fadc7d8a2cfc",
          "p1:d06491e087624f9edf1b1ef9",
          "p1:55bfab56faab7c42e4ff41a1"
        ],
        "scope_expr_id": "p1:c634eae1a87153d8a0767ed6"
      }
    ]
  },
  "A": {
    "slot": "A",
    "status": "PARSER_COVERAGE_FAILURE",
    "entries": [
      {
        "canonical_entry_id": "p1:7696b78e2ece822d37ab6cad",
        "slot": "A",
        "boundary_fact_ids": [
          "p1:c52a51906bf420d1607ecbc8"
        ],
        "state": "RESOLVED",
        "display_value": "REQUIRED 核对 权限清单",
        "source_span_ids": [
          "p1:a30e1022c55698c21f383b9d",
          "p1:598b3d12e0f4124feef6eac1",
          "p1:e1274a4247b41ea2a57397a1",
          "p1:77c12d398a4003716506d5d9"
        ],
        "scope_expr_id": "p1:7fccc795094d3060ac5a82b2"
      },
      {
        "canonical_entry_id": "p1:fe846b2d28463917ce1e4dfd",
        "slot": "A",
        "boundary_fact_ids": [
          "p1:c3727f96e27a1919d6655617"
        ],
        "state": "RESOLVED",
        "display_value": "REQUIRED 读取 policy-list.csv、account-list.csv",
        "source_span_ids": [
          "p1:2a2988c82236bdf515207b44",
          "p1:48a0cb14a2d5e73210e8e4ce",
          "p1:5853393b4bc0bc7e9f521d62",
          "p1:a6ee43530f8144a46935ce8f",
          "p1:fd714dd17ff90ca4f3a1332a"
        ],
        "scope_expr_id": "p1:304dd2d065eba175f13924d0"
      },
      {
        "canonical_entry_id": "p1:985367b2ff9171f3c6526bba",
        "slot": "A",
        "boundary_fact_ids": [
          "p1:b053d23baa3bac85c8054fc6"
        ],
        "state": "RESOLVED",
        "display_value": "REQUIRED 生成 access-review.md",
        "source_span_ids": [
          "p1:a0c683c2a5e9fadc7d8a2cfc",
          "p1:d06491e087624f9edf1b1ef9",
          "p1:55bfab56faab7c42e4ff41a1"
        ],
        "scope_expr_id": "p1:ab6d3d4168a7fcb4cb6e0d8a"
      },
      {
        "canonical_entry_id": "p1:36230fae8c6b049bd051040d",
        "slot": "A",
        "boundary_fact_ids": [
          "p1:d3f717246285c8c6e5cd2567"
        ],
        "state": "RESOLVED",
        "display_value": "REQUIRED 包含 差异证据两项内容",
        "source_span_ids": [
          "p1:52c822fca68b74b663785132",
          "p1:ba4a75b9ae55afe62f623b19",
          "p1:ff742f982e18e0a634166e59",
          "p1:5525d195a4e86cf881934f8e"
        ],
        "scope_expr_id": "p1:d96181ae76f214a54c665c9d"
      }
    ]
  },
  "P": {
    "slot": "P",
    "status": "PARSER_COVERAGE_FAILURE",
    "entries": [
      {
        "canonical_entry_id": "p1:adf4512eb411db83a224c43d",
        "slot": "P",
        "boundary_fact_ids": [
          "p1:87a6f8afb11b3d71b35ee4b9",
          "p1:0b0dda5af1b8ea3e7422a9f4",
          "p1:08299fc23bbcea5f9d1d081a"
        ],
        "state": "RESOLVED",
        "display_value": "审阅员郑杉 [PERFORMER]",
        "source_span_ids": [
          "p1:e1274a4247b41ea2a57397a1",
          "p1:598b3d12e0f4124feef6eac1",
          "p1:a30e1022c55698c21f383b9d",
          "p1:5853393b4bc0bc7e9f521d62",
          "p1:48a0cb14a2d5e73210e8e4ce",
          "p1:2a2988c82236bdf515207b44",
          "p1:381ed96ec34907064e0b41d1",
          "p1:d52ce3f7e020474e5653a43a"
        ]
      },
      {
        "canonical_entry_id": "p1:87f71ef3d63736391bb66f8c",
        "slot": "P",
        "boundary_fact_ids": [
          "p1:35a108b0a35674d0b68f1e01"
        ],
        "state": "RESOLVED",
        "display_value": "复核人任舒 [PERFORMER]",
        "source_span_ids": [
          "p1:9e8fcfe09eda0a9a2857cebf",
          "p1:4c71238a59f037c0ca277ea2",
          "p1:b5ba122d01039621b6c8ed18"
        ]
      }
    ]
  },
  "R": {
    "slot": "R",
    "status": "PARSER_COVERAGE_FAILURE",
    "entries": []
  },
  "V": {
    "slot": "V",
    "status": "PARSER_COVERAGE_FAILURE",
    "entries": [
      {
        "canonical_entry_id": "p1:a9121a7b7cff5b232c1c0a58",
        "slot": "V",
        "boundary_fact_ids": [
          "p1:d27ce46ccbac4c08f281e2b9"
        ],
        "state": "RESOLVED",
        "display_value": "v1.6.0",
        "source_span_ids": [
          "p1:d6351c93493ddad6e212190d",
          "p1:7ef1b3b1f7fd7227bc980b02",
          "p1:b7a6a1b8738c69f0c51467e7"
        ]
      },
      {
        "canonical_entry_id": "p1:41ea148e9e0044de4b9b1845",
        "slot": "V",
        "boundary_fact_ids": [
          "p1:c32d77ac7ddf934741521bc3"
        ],
        "state": "RESOLVED",
        "display_value": "ACCESS-STYLE-2",
        "source_span_ids": [
          "p1:a75adf83cbcaa626340dc384",
          "p1:7ef1b3b1f7fd7227bc980b02",
          "p1:b7a6a1b8738c69f0c51467e7"
        ]
      },
      {
        "canonical_entry_id": "p1:48ba68b0610b5b0efbfa4e14",
        "slot": "V",
        "boundary_fact_ids": [
          "p1:7da50dfc0e515b40f536cd24"
        ],
        "state": "RESOLVED",
        "display_value": "v1.6.0",
        "source_span_ids": [
          "p1:d6351c93493ddad6e212190d",
          "p1:7ef1b3b1f7fd7227bc980b02",
          "p1:b7a6a1b8738c69f0c51467e7"
        ]
      }
    ]
  },
  "C": {
    "slot": "C",
    "status": "PARSER_COVERAGE_FAILURE",
    "entries": [
      {
        "canonical_entry_id": "p1:5b9d2b751ea4ec97544f6833",
        "slot": "C",
        "boundary_fact_ids": [
          "p1:deea9aa4a44db6f330d7d8e5"
        ],
        "state": "RESOLVED",
        "display_value": "完成",
        "source_span_ids": [
          "p1:f51f023e1d160301bed5f53e",
          "p1:ccdeda5b090aca30e6a7a732",
          "p1:685ecff6c58054628df362ac",
          "p1:e14eb9648baa8155a33825d8",
          "p1:4c1778592a1b8b61253fb621"
        ],
        "condition_expr_id": "p1:6dd76a8e69db0d4b579c7013"
      }
    ]
  },
  "B": {
    "slot": "B",
    "status": "UNRESOLVED",
    "entries": [
      {
        "canonical_entry_id": "p1:3f90f1d793ab06dcb51bc456",
        "slot": "B",
        "boundary_fact_ids": [
          "p1:71d454d9615874497ac227ae"
        ],
        "state": "RESOLVED",
        "display_value": "FORBIDDEN 包括 历史资料",
        "source_span_ids": [
          "p1:381ed96ec34907064e0b41d1",
          "p1:d52ce3f7e020474e5653a43a",
          "p1:d4f6c57082c4a9c219eddeec",
          "p1:e1274a4247b41ea2a57397a1",
          "p1:598b3d12e0f4124feef6eac1"
        ],
        "scope_expr_id": "p1:254d47291f39c96c86e77996"
      },
      {
        "canonical_entry_id": "p1:1c7b07e734ff16ae419f57b1",
        "slot": "B",
        "boundary_fact_ids": [
          "p1:6b0ff893bebf2e9b6d72ec77"
        ],
        "state": "UNRESOLVED",
        "display_value": "FORBIDDEN 互换",
        "source_span_ids": [
          "p1:945bd5fedd34a1842c1fb352",
          "p1:6488eeba4128f29230074faf"
        ]
      },
      {
        "canonical_entry_id": "p1:2f14eeb8e448d56a16b9ac23",
        "slot": "B",
        "boundary_fact_ids": [
          "p1:2de47cc64604a716decf50fb"
        ],
        "state": "RESOLVED",
        "display_value": "FORBIDDEN 修改 policy-list.csv、account-list.csv",
        "source_span_ids": [
          "p1:30f1a01676c22e0a9a7e11ab",
          "p1:e9ae9ce0eb9cb4b82a1f4ab4",
          "p1:d7ffb0de150740d321f3f23b",
          "p1:3fd00b31bc0075f1a489f261"
        ],
        "scope_expr_id": "p1:2af6d016de7d2a50385f2e56"
      }
    ]
  }
}
```
