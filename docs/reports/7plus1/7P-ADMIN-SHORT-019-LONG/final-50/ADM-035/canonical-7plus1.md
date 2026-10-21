# ADM-035 — actual Canonical 7+1

## I

```json
{
  "slot": "I",
  "status": "RESOLVED",
  "entries": [
    {
      "canonical_entry_id": "p1:d676c1a1cc1ada4e2c65c217",
      "slot": "I",
      "boundary_fact_ids": [
        "p1:16a30754c8294e63f6b27073"
      ],
      "state": "RESOLVED",
      "display_value": "before.json",
      "source_span_ids": [
        "p1:ec1bb0afdd01917810a8855c",
        "p1:7ff2cb740a4b5948301a4b30",
        "p1:7237b1636da43552f4ba368a"
      ],
      "scope_expr_id": "p1:9b3626dea30ee8dbd229e2cf"
    },
    {
      "canonical_entry_id": "p1:2db893fda01f34e70e08b272",
      "slot": "I",
      "boundary_fact_ids": [
        "p1:7c7d476a75ac541ce5313490"
      ],
      "state": "RESOLVED",
      "display_value": "after.json",
      "source_span_ids": [
        "p1:e5004b66eec3ef632aaeba12",
        "p1:7ff2cb740a4b5948301a4b30",
        "p1:7237b1636da43552f4ba368a"
      ],
      "scope_expr_id": "p1:35fca0606084efbb6dc7aa02"
    },
    {
      "canonical_entry_id": "p1:450d8f1c25ef85a730e937f1",
      "slot": "I",
      "boundary_fact_ids": [
        "p1:e028ffdec845c75481f4876e"
      ],
      "state": "RESOLVED",
      "display_value": "失败用例及耗时变化",
      "source_span_ids": [
        "p1:49938a148e8b915aa4e55b07",
        "p1:ea686aee4e89d186bad54481",
        "p1:7237b1636da43552f4ba368a"
      ],
      "scope_expr_id": "p1:41313f08c7cf29f22ff08372"
    }
  ]
}
```

## O

```json
{
  "slot": "O",
  "status": "RESOLVED",
  "entries": [
    {
      "canonical_entry_id": "p1:78a27a6cbadc4e30fb06876d",
      "slot": "O",
      "boundary_fact_ids": [
        "p1:019f6dc3ba6cec5de800c55a"
      ],
      "state": "RESOLVED",
      "display_value": "regression-diff.md",
      "source_span_ids": [
        "p1:1a7499e59dc064a4020be723",
        "p1:6cdf8ea0b019ed14fdcf0af2",
        "p1:c016fc678c0c7a1bbe0b4d73",
        "p1:9bd85f4766d663c18eff15e3",
        "p1:7ff2cb740a4b5948301a4b30",
        "p1:28e87e7c474aa980c995b7c3",
        "p1:bf84f3b5e572611f218ffc41"
      ],
      "scope_expr_id": "p1:6ff05f0de7aba1f2a859f77c"
    }
  ]
}
```

## A

```json
{
  "slot": "A",
  "status": "RESOLVED",
  "entries": [
    {
      "canonical_entry_id": "p1:57b316b13b0488835a24ea13",
      "slot": "A",
      "boundary_fact_ids": [
        "p1:fa3e1d901922e56e60b6d37a"
      ],
      "state": "RESOLVED",
      "display_value": "REQUIRED 读取 before.json、after.json",
      "source_span_ids": [
        "p1:4041c757ab0108b7eaa886cb",
        "p1:7ff2cb740a4b5948301a4b30",
        "p1:ec1bb0afdd01917810a8855c",
        "p1:e5004b66eec3ef632aaeba12",
        "p1:9bd85f4766d663c18eff15e3"
      ],
      "scope_expr_id": "p1:6454fe95c38f6992861356f5"
    },
    {
      "canonical_entry_id": "p1:030accfc798367933658ac75",
      "slot": "A",
      "boundary_fact_ids": [
        "p1:9f93ab90c0bef4b160b5a4e0"
      ],
      "state": "RESOLVED",
      "display_value": "REQUIRED 对比 失败用例及耗时变化",
      "source_span_ids": [
        "p1:bcaeb68c7644418f12d1308f",
        "p1:ea686aee4e89d186bad54481",
        "p1:49938a148e8b915aa4e55b07",
        "p1:9bd85f4766d663c18eff15e3",
        "p1:7ff2cb740a4b5948301a4b30"
      ],
      "scope_expr_id": "p1:56211a9b23b8a576c2950b52"
    },
    {
      "canonical_entry_id": "p1:d2c083875b51c3617be2c220",
      "slot": "A",
      "boundary_fact_ids": [
        "p1:83b2abc2acdc4ffd569bb1e8"
      ],
      "state": "RESOLVED",
      "display_value": "REQUIRED 生成 regression-diff.md",
      "source_span_ids": [
        "p1:1a7499e59dc064a4020be723",
        "p1:6cdf8ea0b019ed14fdcf0af2",
        "p1:c016fc678c0c7a1bbe0b4d73",
        "p1:9bd85f4766d663c18eff15e3",
        "p1:7ff2cb740a4b5948301a4b30"
      ],
      "scope_expr_id": "p1:9ae37a05b204ffa1876eb65b"
    },
    {
      "canonical_entry_id": "p1:1910cff9a62a5df57eda03b5",
      "slot": "A",
      "boundary_fact_ids": [
        "p1:7b12489683a062b293477b20"
      ],
      "state": "RESOLVED",
      "display_value": "REQUIRED 提交 结果",
      "source_span_ids": [
        "p1:466172bca6d6ca30f8f3dbe9",
        "p1:22ad7b6449547457e3df2380",
        "p1:687c1fc8f287a0331ab5ed19",
        "p1:19341fdf7483d077c70ba0a7",
        "p1:ac018ee342d752a71163ab1b"
      ],
      "scope_expr_id": "p1:1a4c789c524dac39bf94f149"
    }
  ]
}
```

## P

```json
{
  "slot": "P",
  "status": "RESOLVED",
  "entries": [
    {
      "canonical_entry_id": "p1:31b34b7f37865458f1d87d51",
      "slot": "P",
      "boundary_fact_ids": [
        "p1:a2fb6b27748f24725838ba09",
        "p1:454048ef7b6a94ef9f1e2883",
        "p1:e62b1b50df1641f90fac3476"
      ],
      "state": "RESOLVED",
      "display_value": "QA [PERFORMER]",
      "source_span_ids": [
        "p1:9bd85f4766d663c18eff15e3",
        "p1:7ff2cb740a4b5948301a4b30",
        "p1:4041c757ab0108b7eaa886cb",
        "p1:bcaeb68c7644418f12d1308f",
        "p1:ea686aee4e89d186bad54481",
        "p1:1a7499e59dc064a4020be723",
        "p1:6cdf8ea0b019ed14fdcf0af2"
      ]
    },
    {
      "canonical_entry_id": "p1:a9d6c212aae90795aaaa9b8b",
      "slot": "P",
      "boundary_fact_ids": [
        "p1:476e99a34ee1ace9ce10688d"
      ],
      "state": "RESOLVED",
      "display_value": "PM [PERFORMER]",
      "source_span_ids": [
        "p1:19341fdf7483d077c70ba0a7",
        "p1:22ad7b6449547457e3df2380",
        "p1:466172bca6d6ca30f8f3dbe9"
      ]
    },
    {
      "canonical_entry_id": "p1:eb45b503ebef4a0c7054175e",
      "slot": "P",
      "boundary_fact_ids": [
        "p1:6b651b6ad457d4c8c32f8e75"
      ],
      "state": "RESOLVED",
      "display_value": "ADMIN [RECIPIENT]",
      "source_span_ids": [
        "p1:ac018ee342d752a71163ab1b",
        "p1:22ad7b6449547457e3df2380",
        "p1:466172bca6d6ca30f8f3dbe9"
      ]
    }
  ]
}
```

## R

```json
{
  "slot": "R",
  "status": "ABSENT",
  "entries": []
}
```

## V

```json
{
  "slot": "V",
  "status": "ABSENT",
  "entries": []
}
```

## C

```json
{
  "slot": "C",
  "status": "ABSENT",
  "entries": []
}
```

## B

```json
{
  "slot": "B",
  "status": "RESOLVED",
  "entries": [
    {
      "canonical_entry_id": "p1:ad19bb8614919ff415939ba3",
      "slot": "B",
      "boundary_fact_ids": [
        "p1:ed7369a1ac02f1cc63d701fa"
      ],
      "state": "RESOLVED",
      "display_value": "FORBIDDEN 修改 Parser、模型、阈值",
      "source_span_ids": [
        "p1:a3c0cd32976cedc66e0f13b3",
        "p1:55a3df16c0383a8e6555e320",
        "p1:056e8adcf601ceae42dca573",
        "p1:738219187d8a24f54467f685",
        "p1:4a901a3146c995df4b534a47"
      ],
      "scope_expr_id": "p1:ea08c4849c08efd01cd425b1"
    }
  ]
}
```
