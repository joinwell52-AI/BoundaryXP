# Actual Canonical 7+1

```json
{
  "projection_id": "p1:9de93f2336434283ccf61a56",
  "I": {
    "slot": "I",
    "status": "PARSER_COVERAGE_FAILURE",
    "entries": [
      {
        "canonical_entry_id": "p1:55300de22734b215c29e245c",
        "slot": "I",
        "boundary_fact_ids": [
          "p1:b6bc4b8701609d3db6a347c9"
        ],
        "state": "RESOLVED",
        "display_value": "api-index.json",
        "source_span_ids": [
          "p1:d0cb5feaa731fc91e356ac16",
          "p1:7687c1f989b8339cff832aab",
          "p1:09469b3fbca449cbb4db0f8c"
        ],
        "scope_expr_id": "p1:8c8ccbdf327d9460437a196b"
      },
      {
        "canonical_entry_id": "p1:cb81ec99bdf4677b3bdaf3fa",
        "slot": "I",
        "boundary_fact_ids": [
          "p1:3b91a703235c3155e6b0ca25"
        ],
        "state": "RESOLVED",
        "display_value": "annotation-guide.md",
        "source_span_ids": [
          "p1:fda3c959bb272833897cc535",
          "p1:7687c1f989b8339cff832aab",
          "p1:09469b3fbca449cbb4db0f8c"
        ],
        "scope_expr_id": "p1:0f20e79b8aa7d0d4e2c8b872"
      }
    ]
  },
  "O": {
    "slot": "O",
    "status": "PARSER_COVERAGE_FAILURE",
    "entries": [
      {
        "canonical_entry_id": "p1:d157bfcebabf9beaf7da6a24",
        "slot": "O",
        "boundary_fact_ids": [
          "p1:e7b51fbdec083e5b8cc5bb8b"
        ],
        "state": "RESOLVED",
        "display_value": "api-annotation-review.md",
        "source_span_ids": [
          "p1:414fca306610ac7deea0002b",
          "p1:8f20004cd66277016e602c7b",
          "p1:44c23106bd6970df8b0c222d",
          "p1:5d385553bea25b42d9c417b9"
        ],
        "scope_expr_id": "p1:73c64f1c8185ad76377930da"
      },
      {
        "canonical_entry_id": "p1:60974148be40a556d38a51b0",
        "slot": "O",
        "boundary_fact_ids": [
          "p1:57fa03df2718363f2dab983c"
        ],
        "state": "RESOLVED",
        "display_value": "api-annotation-review.md",
        "source_span_ids": [
          "p1:e65c855ed4b35f6325bf3494",
          "p1:8f20004cd66277016e602c7b",
          "p1:38dbef8f7348158eed2a4ed0",
          "p1:bdd3a87321706b238981f323",
          "p1:5d385553bea25b42d9c417b9"
        ],
        "scope_expr_id": "p1:e514cfa811f8f0e65aaa26ee"
      }
    ]
  },
  "A": {
    "slot": "A",
    "status": "UNRESOLVED",
    "entries": [
      {
        "canonical_entry_id": "p1:4556fdcf29837d543fec1d2c",
        "slot": "A",
        "boundary_fact_ids": [
          "p1:4460e1c1e9390bc88ab21f69"
        ],
        "state": "RESOLVED",
        "display_value": "REQUIRED read api-index.json、annotation-guide.md",
        "source_span_ids": [
          "p1:09469b3fbca449cbb4db0f8c",
          "p1:7687c1f989b8339cff832aab",
          "p1:c7560a9a533f63f86efe693e",
          "p1:d0cb5feaa731fc91e356ac16",
          "p1:fda3c959bb272833897cc535"
        ],
        "scope_expr_id": "p1:6071a4940cf12673f8b64cb6"
      },
      {
        "canonical_entry_id": "p1:2a59a221ab88dcc4b42d333e",
        "slot": "A",
        "boundary_fact_ids": [
          "p1:41c7f1c69245c81a97767569"
        ],
        "state": "UNRESOLVED",
        "display_value": "REQUIRED annotation-guide.md",
        "source_span_ids": [
          "p1:fda3c959bb272833897cc535",
          "p1:7687c1f989b8339cff832aab",
          "p1:c7560a9a533f63f86efe693e"
        ]
      },
      {
        "canonical_entry_id": "p1:2f106bdd9c5b9c32830d4419",
        "slot": "A",
        "boundary_fact_ids": [
          "p1:85a493bb3149315642051da8"
        ],
        "state": "UNRESOLVED",
        "display_value": "REQUIRED check the API annotation、ANNOTATION-STYLE-6",
        "source_span_ids": [
          "p1:a300391ce41d7d64f4a37035",
          "p1:eb1cbcda6a69018cde128eba",
          "p1:39f6d26abb2906b48cf8d099",
          "p1:38ed2722f22ce83cf53fef78",
          "p1:c7560a9a533f63f86efe693e",
          "p1:7687c1f989b8339cff832aab"
        ],
        "scope_expr_id": "p1:4e65bb43338581e25d40e821"
      },
      {
        "canonical_entry_id": "p1:90029f0be85c2b20692fc119",
        "slot": "A",
        "boundary_fact_ids": [
          "p1:5fb7c279354d2116da4de42d"
        ],
        "state": "RESOLVED",
        "display_value": "REQUIRED generate api-annotation-review.md",
        "source_span_ids": [
          "p1:414fca306610ac7deea0002b",
          "p1:8f20004cd66277016e602c7b",
          "p1:5d385553bea25b42d9c417b9",
          "p1:44c23106bd6970df8b0c222d"
        ]
      },
      {
        "canonical_entry_id": "p1:0846ea6aefda0a7421c36589",
        "slot": "A",
        "boundary_fact_ids": [
          "p1:efacb7cb3950a0a14a11ea73"
        ],
        "state": "RESOLVED",
        "display_value": "REQUIRED write the review findings、api-annotation-review.md",
        "source_span_ids": [
          "p1:e65c855ed4b35f6325bf3494",
          "p1:8f20004cd66277016e602c7b",
          "p1:bdd3a87321706b238981f323",
          "p1:5d385553bea25b42d9c417b9",
          "p1:38dbef8f7348158eed2a4ed0"
        ],
        "scope_expr_id": "p1:18754f616fb83d4fd5a5f9f3"
      },
      {
        "canonical_entry_id": "p1:ef6c187082be6d8dfacd42de",
        "slot": "A",
        "boundary_fact_ids": [
          "p1:0c69c0f6100c6c79d8936b3d"
        ],
        "state": "RESOLVED",
        "display_value": "REQUIRED contain evidence",
        "source_span_ids": [
          "p1:52676bc360655c68d0d0a2ec",
          "p1:a7da637c112e5cd739185591",
          "p1:46babe4eb56eaf100ae586fe",
          "p1:fd7616a47ef7c8758e7dd184"
        ],
        "scope_expr_id": "p1:27d66cdaddabb833c985219d"
      },
      {
        "canonical_entry_id": "p1:1e2a8dd0d77469e7c2ec575b",
        "slot": "A",
        "boundary_fact_ids": [
          "p1:9a52032d6fed25cbca859d8e"
        ],
        "state": "RESOLVED",
        "display_value": "REQUIRED identifies the source file",
        "source_span_ids": [
          "p1:910275bbf0b5d510daae9732",
          "p1:a7da637c112e5cd739185591",
          "p1:90317f2337d875c677f665f5"
        ],
        "scope_expr_id": "p1:0c11b675228d70787127b01b"
      }
    ]
  },
  "P": {
    "slot": "P",
    "status": "PARSER_COVERAGE_FAILURE",
    "entries": [
      {
        "canonical_entry_id": "p1:dbbd9f21a05858c897f1154a",
        "slot": "P",
        "boundary_fact_ids": [
          "p1:d74e77e74847a018fb7a1501",
          "p1:4ed1c4941a90a44e21033747",
          "p1:f038d728b3538aeabe0fcb0b",
          "p1:44d49d80783c0a73ee5907d2",
          "p1:f4b3d8eaf14fb4ab490f7860",
          "p1:1910f8c7a1dcc408e23bec47",
          "p1:4d2bcd19003dc6f5f81fc37e",
          "p1:740dabc3d5bd4cb19909b1a9",
          "p1:cdc1936250bc32c1107646d1"
        ],
        "state": "RESOLVED",
        "display_value": "Lena [PERFORMER]",
        "source_span_ids": [
          "p1:c7560a9a533f63f86efe693e",
          "p1:7687c1f989b8339cff832aab",
          "p1:09469b3fbca449cbb4db0f8c",
          "p1:5d385553bea25b42d9c417b9",
          "p1:8f20004cd66277016e602c7b",
          "p1:414fca306610ac7deea0002b",
          "p1:bbd4046e7379f38c941a07fb",
          "p1:3e494470edaf1948c67b0907",
          "p1:7085f2cfcac3e93e0b537d54",
          "p1:00300134154e93bdac952eb0",
          "p1:6d199268ccd3bb849cfeda26",
          "p1:ec3d204606d3e2b494848941",
          "p1:fda3c959bb272833897cc535",
          "p1:a300391ce41d7d64f4a37035",
          "p1:eb1cbcda6a69018cde128eba",
          "p1:dfcb4bb83d0ab170478a4944",
          "p1:dd0a4ddf198a5e8a1e06aa25",
          "p1:e65c855ed4b35f6325bf3494",
          "p1:d0c5d04e916c21c6a1a455c3"
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
    "entries": []
  },
  "C": {
    "slot": "C",
    "status": "PARSER_COVERAGE_FAILURE",
    "entries": [
      {
        "canonical_entry_id": "p1:bc57f77943435c60b60a60af",
        "slot": "C",
        "boundary_fact_ids": [
          "p1:bb569660196fb02b5bd0ea57"
        ],
        "state": "RESOLVED",
        "display_value": "complete",
        "source_span_ids": [
          "p1:d0c5d04e916c21c6a1a455c3",
          "p1:6d199268ccd3bb849cfeda26",
          "p1:73ba308c5a735eb30a29d1e6",
          "p1:00300134154e93bdac952eb0"
        ],
        "condition_expr_id": "p1:bf8a110d4546abedb5b09f12"
      }
    ]
  },
  "B": {
    "slot": "B",
    "status": "UNRESOLVED",
    "entries": [
      {
        "canonical_entry_id": "p1:1fb4bf83901dbf77813d861c",
        "slot": "B",
        "boundary_fact_ids": [
          "p1:727fecfef47ede24e377a9ab"
        ],
        "state": "RESOLVED",
        "display_value": "FORBIDDEN constitute new files",
        "source_span_ids": [
          "p1:16a0274b3ff236c055682d1f",
          "p1:34aef465d313b661695f6e58",
          "p1:cd13d409f46d109bb3fcdfa5"
        ],
        "scope_expr_id": "p1:ae03be581f8a1781685a471a"
      },
      {
        "canonical_entry_id": "p1:d572775045529649e3d87737",
        "slot": "B",
        "boundary_fact_ids": [
          "p1:2727a72b7df0c981ee079dff"
        ],
        "state": "UNRESOLVED",
        "display_value": "FORBIDDEN are",
        "source_span_ids": [
          "p1:baa19f021ffff62d90fd961e",
          "p1:34aef465d313b661695f6e58"
        ]
      },
      {
        "canonical_entry_id": "p1:c351a30012d36dbd58bbe58b",
        "slot": "B",
        "boundary_fact_ids": [
          "p1:e44e125367b968ba0c4933d9"
        ],
        "state": "RESOLVED",
        "display_value": "FORBIDDEN modify api-index.json、annotation-guide.md",
        "source_span_ids": [
          "p1:7085f2cfcac3e93e0b537d54",
          "p1:3e494470edaf1948c67b0907",
          "p1:bbd4046e7379f38c941a07fb",
          "p1:67ed22b042838247fad33d68",
          "p1:f30dcbae6d58ceb053986cd3"
        ]
      },
      {
        "canonical_entry_id": "p1:3743a59a8aaf5046d792b124",
        "slot": "B",
        "boundary_fact_ids": [
          "p1:1550586b731261ffbd94d9a4"
        ],
        "state": "RESOLVED",
        "display_value": "FORBIDDEN exceed 50 minutes",
        "source_span_ids": [
          "p1:7f85cbb45d48bf7ca64f6ef9",
          "p1:3e494470edaf1948c67b0907",
          "p1:0a532d8e9c7f2706ec6a7114"
        ],
        "scope_expr_id": "p1:8aa644ebd8760b08eade5f63"
      }
    ]
  }
}
```
