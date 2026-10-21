# D01 — Canonical 7+1

## I · RESOLVED

- input.csv [RESOLVED]
  - facts: p1:6850d7497fe2fda8ada15473
  - scope: p1:f9cc48d78faa50dad8627855; condition: none; quantity: none
  - evidence: p1:9d123dd0da21f3490930ff89, p1:b6f9329b82cfe4bf264e6752, p1:fd66e7077083782d8fc63cf9

## O · RESOLVED

- report.md [RESOLVED]
  - facts: p1:25db7909b655b127c94ac52e
  - scope: p1:ec6cf92172ddb7f1685df2f5; condition: none; quantity: none
  - evidence: p1:73e3c5ea188ca1c5d3a01a25, p1:7f0793aa43172b583c71aea5, p1:816520f3f44f6ecce1fcffe1, p1:71bb1d16f0709043431028ea, p1:e157be95c430ae6af88e6a37

## A · RESOLVED

- REQUIRED 读取 input.csv [RESOLVED]
  - facts: p1:a25d81dda7c37a90aef2737f
  - scope: p1:4ac8dd9472408c314bb27336; condition: none; quantity: none
  - evidence: p1:fd66e7077083782d8fc63cf9, p1:b6f9329b82cfe4bf264e6752, p1:9d123dd0da21f3490930ff89, p1:71bb1d16f0709043431028ea, p1:e157be95c430ae6af88e6a37
- REQUIRED 生成 report.md [RESOLVED]
  - facts: p1:d0fc1fc6620b810553765d1b
  - scope: p1:ec6cf92172ddb7f1685df2f5; condition: none; quantity: none
  - evidence: p1:73e3c5ea188ca1c5d3a01a25, p1:7f0793aa43172b583c71aea5, p1:816520f3f44f6ecce1fcffe1, p1:71bb1d16f0709043431028ea, p1:e157be95c430ae6af88e6a37

## P · RESOLVED

- 张宁 [PERFORMER] [RESOLVED]
  - facts: p1:3cf8374a471711a39f37828a, p1:0fd728867025bcf62ca6f49c, p1:43017ecf588a9f9b075a09c1, p1:39def642cb34db8d48d1d139
  - scope: none; condition: none; quantity: none
  - evidence: p1:71bb1d16f0709043431028ea, p1:e157be95c430ae6af88e6a37, p1:fd66e7077083782d8fc63cf9, p1:b6f9329b82cfe4bf264e6752, p1:73e3c5ea188ca1c5d3a01a25, p1:7f0793aa43172b583c71aea5, p1:0ac85b43b0dc6a80218e77f0, p1:f33c3a1c29e28002155201ca, p1:2cbc54e36db5ace4bf94cf39

## R · ABSENT

原文未显式定义此维。

## V · ABSENT

原文未显式定义此维。

## C · RESOLVED

- 完成 [RESOLVED]
  - facts: p1:00caae879dc953284721395a
  - scope: none; condition: p1:734876c82818752bf57d56d9; quantity: none
  - evidence: p1:389fc6806e332239f3a0a558, p1:a85ebf0b750986ebd6f278f6, p1:5e3b5ab04595aef88e78c85c, p1:16c6c0a6d036213bdc5dc5e7

## B · RESOLVED

- FORBIDDEN 修改 input.csv [RESOLVED]
  - facts: p1:7906742ddcd0ef3266fba15a
  - scope: p1:b12999225efa8d7cefc8b8df; condition: none; quantity: none
  - evidence: p1:0ac85b43b0dc6a80218e77f0, p1:f33c3a1c29e28002155201ca, p1:55ad616030ab5968a94ded69, p1:71bb1d16f0709043431028ea, p1:e157be95c430ae6af88e6a37
