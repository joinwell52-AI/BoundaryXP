# ADM-043 — actual Canonical 7+1

## I

```json
{
  "slot": "I",
  "status": "ABSENT",
  "entries": []
}
```

## O

```json
{
  "slot": "O",
  "status": "RESOLVED",
  "entries": [
    {
      "canonical_entry_id": "p1:5508eb5d58ba821c49ecfab4",
      "slot": "O",
      "boundary_fact_ids": [
        "p1:6efffe61bf5cf434a82edd46"
      ],
      "state": "RESOLVED",
      "display_value": "release-note.md",
      "source_span_ids": [
        "p1:e4cf4d1faffaf711071beb30",
        "p1:7699b6e857b699cb82b79bc7",
        "p1:91c331752f1190638aa5f8fe",
        "p1:328e86d665edd1b023ea9ec0"
      ],
      "scope_expr_id": "p1:b34370981530a325baff4699"
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
      "canonical_entry_id": "p1:ed058f095c119abcbadf1a16",
      "slot": "A",
      "boundary_fact_ids": [
        "p1:818a4e72215f846bbedfccc1"
      ],
      "state": "RESOLVED",
      "display_value": "REQUIRED 生成 release-note.md",
      "source_span_ids": [
        "p1:e4cf4d1faffaf711071beb30",
        "p1:7699b6e857b699cb82b79bc7",
        "p1:91c331752f1190638aa5f8fe"
      ],
      "scope_expr_id": "p1:20ffedd8dc5f2e11837ca4d9"
    }
  ]
}
```

## P

```json
{
  "slot": "P",
  "status": "ABSENT",
  "entries": []
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
  "status": "RESOLVED",
  "entries": [
    {
      "canonical_entry_id": "p1:2944002f21a8c027446e199d",
      "slot": "C",
      "boundary_fact_ids": [
        "p1:59ec2ecdb18e409baef4286f"
      ],
      "state": "RESOLVED",
      "display_value": "完成",
      "source_span_ids": [
        "p1:37384ecbc0967467eca5da65",
        "p1:aedac717e187d88bff152791",
        "p1:8072f99458796af54c568f41",
        "p1:3e53a1de218b5db690f67f6f",
        "p1:dbdd638bcb346b52f65342a0",
        "p1:91c331752f1190638aa5f8fe",
        "p1:7699b6e857b699cb82b79bc7",
        "p1:bfb29bdbbb924eb62ca8b265",
        "p1:328e86d665edd1b023ea9ec0",
        "p1:1afb043cbc33532e5d7d449c"
      ],
      "condition_expr_id": "p1:980e1e4b58aebc5e4167102a"
    }
  ]
}
```

## B

```json
{
  "slot": "B",
  "status": "RESOLVED",
  "entries": [
    {
      "canonical_entry_id": "p1:ff10ee950f7ab890fe03293a",
      "slot": "B",
      "boundary_fact_ids": [
        "p1:3ac742b3e0e6d861d616c649"
      ],
      "state": "RESOLVED",
      "display_value": "FORBIDDEN 执行 回滚",
      "source_span_ids": [
        "p1:b48d345389c5fce294630234",
        "p1:55302f5d3172481d00dd88cb",
        "p1:b1fd2a877a0e98d3ab802e30"
      ],
      "scope_expr_id": "p1:6c1861ca218af49d3c5bb691"
    },
    {
      "canonical_entry_id": "p1:9def6f1a78fefa4cfe69d400",
      "slot": "B",
      "boundary_fact_ids": [
        "p1:aa3983eaa087e949b70c294a"
      ],
      "state": "RESOLVED",
      "display_value": "FORBIDDEN 修改 release.yaml",
      "source_span_ids": [
        "p1:11d3ad8d949ca1a0a49a7563",
        "p1:ad4d449a43ec0f210b43a231",
        "p1:78ee1c73753fe852bb67c33f"
      ],
      "scope_expr_id": "p1:2ef109bfa5adfaf31301fe36"
    }
  ]
}
```
