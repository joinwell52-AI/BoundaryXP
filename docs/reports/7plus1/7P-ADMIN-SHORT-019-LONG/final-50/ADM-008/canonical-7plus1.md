# ADM-008 — actual Canonical 7+1

## I

```json
{
  "slot": "I",
  "status": "RESOLVED",
  "entries": [
    {
      "canonical_entry_id": "p1:072e163ba1d4b4f4b0593993",
      "slot": "I",
      "boundary_fact_ids": [
        "p1:9e085887773a72c463f4bd0d"
      ],
      "state": "RESOLVED",
      "display_value": "certificates.csv",
      "source_span_ids": [
        "p1:613256f45e25715e533aec20",
        "p1:c7b2f8fdaf8b6c6fef4f323e",
        "p1:f25b5320fcfb3c16fb1f68ba"
      ],
      "scope_expr_id": "p1:84913b16af09db5c4c6a9015"
    },
    {
      "canonical_entry_id": "p1:a46a5d23c22220950fca09ff",
      "slot": "I",
      "boundary_fact_ids": [
        "p1:4f5664347471f71ee01bc396"
      ],
      "state": "RESOLVED",
      "display_value": "每张证书的到期时间",
      "source_span_ids": [
        "p1:2735ca18c2cc3f23ee0fceb9",
        "p1:4bb0f144611290a5ffa4e6c5",
        "p1:f25b5320fcfb3c16fb1f68ba"
      ],
      "scope_expr_id": "p1:ad3ae2fb05a2c74472042974"
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
      "canonical_entry_id": "p1:8fb5fbe01f2c439a4644a107",
      "slot": "O",
      "boundary_fact_ids": [
        "p1:d9378110224a2858b9d080a2"
      ],
      "state": "RESOLVED",
      "display_value": "expiry-report.md",
      "source_span_ids": [
        "p1:076dca5da4203ee8556a7469",
        "p1:3ddb7c85c7c006afe20006cc",
        "p1:ec07e0188e9be417462d1c53",
        "p1:f10ddc726e159ee8225af12c",
        "p1:c7b2f8fdaf8b6c6fef4f323e",
        "p1:23c07625020adbe0b9945d5e",
        "p1:1a5bab16ce02da14ca12cd03",
        "p1:ce5b25d27d3c3e8804e986a7",
        "p1:8dc34c4c016f2a1c65e4289e"
      ],
      "scope_expr_id": "p1:cccd857db6abb604f7030569"
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
      "canonical_entry_id": "p1:a569c5bbfa9961ffb36451d5",
      "slot": "A",
      "boundary_fact_ids": [
        "p1:8a296216b30f2d20af82bafd"
      ],
      "state": "RESOLVED",
      "display_value": "REQUIRED 读取 certificates.csv",
      "source_span_ids": [
        "p1:fd5a77c8410051b9eb3f9d3a",
        "p1:c7b2f8fdaf8b6c6fef4f323e",
        "p1:613256f45e25715e533aec20",
        "p1:f10ddc726e159ee8225af12c"
      ],
      "scope_expr_id": "p1:feef653474b48e1df09684cf"
    },
    {
      "canonical_entry_id": "p1:105f3cfda132de7d992c54c0",
      "slot": "A",
      "boundary_fact_ids": [
        "p1:c9391a57f056a5f7a3d873ce"
      ],
      "state": "RESOLVED",
      "display_value": "REQUIRED 检查 每张证书的到期时间",
      "source_span_ids": [
        "p1:e774d5956da53d5e67c07402",
        "p1:4bb0f144611290a5ffa4e6c5",
        "p1:2735ca18c2cc3f23ee0fceb9",
        "p1:f10ddc726e159ee8225af12c",
        "p1:c7b2f8fdaf8b6c6fef4f323e"
      ],
      "scope_expr_id": "p1:bd592bcfcd97420340debab7"
    },
    {
      "canonical_entry_id": "p1:4f52910ba293d70965a41729",
      "slot": "A",
      "boundary_fact_ids": [
        "p1:4b339d7afaedc5cd545af581"
      ],
      "state": "RESOLVED",
      "display_value": "REQUIRED 生成 expiry-report.md",
      "source_span_ids": [
        "p1:076dca5da4203ee8556a7469",
        "p1:3ddb7c85c7c006afe20006cc",
        "p1:ec07e0188e9be417462d1c53",
        "p1:f10ddc726e159ee8225af12c",
        "p1:c7b2f8fdaf8b6c6fef4f323e",
        "p1:ce5b25d27d3c3e8804e986a7",
        "p1:8dc34c4c016f2a1c65e4289e"
      ],
      "scope_expr_id": "p1:b58b186b655cead4b7e3b1eb"
    },
    {
      "canonical_entry_id": "p1:12b22220a8a6b2e78fb94e2c",
      "slot": "A",
      "boundary_fact_ids": [
        "p1:10fe9c63f73ddf956cfb2b13"
      ],
      "state": "RESOLVED",
      "display_value": "REQUIRED 收到 expiry-report.md",
      "source_span_ids": [
        "p1:19061d34cef4c792681cafb1",
        "p1:ce5b25d27d3c3e8804e986a7",
        "p1:ec07e0188e9be417462d1c53",
        "p1:3ddb7c85c7c006afe20006cc",
        "p1:de08f03a181dc43681aff510",
        "p1:08af3b8ac36b65c40350be9e",
        "p1:8dc34c4c016f2a1c65e4289e"
      ],
      "scope_expr_id": "p1:8411ac6f48702e71503dd2e8"
    },
    {
      "canonical_entry_id": "p1:7f26b5719a622d268cc5e4f0",
      "slot": "A",
      "boundary_fact_ids": [
        "p1:e628339b139e9c0d0d48bbc9"
      ],
      "state": "RESOLVED",
      "display_value": "REQUIRED 汇报 expiry-report.md",
      "source_span_ids": [
        "p1:08af3b8ac36b65c40350be9e",
        "p1:ce5b25d27d3c3e8804e986a7",
        "p1:ec07e0188e9be417462d1c53",
        "p1:3ddb7c85c7c006afe20006cc",
        "p1:de08f03a181dc43681aff510",
        "p1:acdfa5df2634f4b262301a2d",
        "p1:9daf32b6ec0ee8e9b6c04866",
        "p1:8dc34c4c016f2a1c65e4289e"
      ],
      "scope_expr_id": "p1:893735cf33ae904ebc3a573a",
      "condition_expr_id": "p1:bad250c8407494374b65248b"
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
      "canonical_entry_id": "p1:a9510aff0b1de8a381e2547b",
      "slot": "P",
      "boundary_fact_ids": [
        "p1:753a70b0b1a687b5ff232bbf",
        "p1:1477cf3a23a2a43dc85299ac",
        "p1:29217d8fcf4f3e4cdaac5e91"
      ],
      "state": "RESOLVED",
      "display_value": "OPS [PERFORMER]",
      "source_span_ids": [
        "p1:f10ddc726e159ee8225af12c",
        "p1:c7b2f8fdaf8b6c6fef4f323e",
        "p1:fd5a77c8410051b9eb3f9d3a",
        "p1:e774d5956da53d5e67c07402",
        "p1:4bb0f144611290a5ffa4e6c5",
        "p1:076dca5da4203ee8556a7469",
        "p1:3ddb7c85c7c006afe20006cc"
      ]
    },
    {
      "canonical_entry_id": "p1:5ba9a808cb7433e380e3a06f",
      "slot": "P",
      "boundary_fact_ids": [
        "p1:8f33197e3f4bc026c49bd4fc",
        "p1:d328602eb1485a419d24eebc"
      ],
      "state": "RESOLVED",
      "display_value": "PM [RECIPIENT,PERFORMER]",
      "source_span_ids": [
        "p1:de08f03a181dc43681aff510",
        "p1:ce5b25d27d3c3e8804e986a7",
        "p1:19061d34cef4c792681cafb1",
        "p1:08af3b8ac36b65c40350be9e",
        "p1:ec07e0188e9be417462d1c53",
        "p1:3ddb7c85c7c006afe20006cc"
      ]
    },
    {
      "canonical_entry_id": "p1:b0d861f76af05a83e9fa6098",
      "slot": "P",
      "boundary_fact_ids": [
        "p1:f57eb588aab1bf9884d6ddfe"
      ],
      "state": "RESOLVED",
      "display_value": "ADMIN [RECIPIENT]",
      "source_span_ids": [
        "p1:acdfa5df2634f4b262301a2d",
        "p1:ce5b25d27d3c3e8804e986a7",
        "p1:08af3b8ac36b65c40350be9e",
        "p1:ec07e0188e9be417462d1c53",
        "p1:3ddb7c85c7c006afe20006cc"
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
      "canonical_entry_id": "p1:ec1b0d9982a459be8ce7444c",
      "slot": "B",
      "boundary_fact_ids": [
        "p1:5d376757b0221324ea3ab9d7"
      ],
      "state": "RESOLVED",
      "display_value": "FORBIDDEN 更换 证书",
      "source_span_ids": [
        "p1:2f6e1b9e906934e09e5fd9d1",
        "p1:a811ad66b3aa4aadcc2181b6",
        "p1:cfc263470c29724fbe3dbd8c"
      ],
      "scope_expr_id": "p1:339629ea90b7e937277e5b53"
    }
  ]
}
```
