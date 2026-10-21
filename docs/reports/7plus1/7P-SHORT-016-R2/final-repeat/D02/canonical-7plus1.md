# D02 — Canonical 7+1

## I · RESOLVED

- orders.csv [RESOLVED]
  - facts: p1:72a7c6df3152b0088798b066
  - scope: p1:9bfb052faa083138d36e3a60; condition: none; quantity: none
  - evidence: p1:f0b342dfb53de79eb7fe68a2, p1:95e37cc92958e9fc16e3e7b9, p1:3ba2b632ff375e6b560bd7df

## O · RESOLVED

- summary.md [RESOLVED]
  - facts: p1:cbb56458a8838cdccc906d54
  - scope: p1:1d841bb17d1f7cb95aec3285; condition: none; quantity: none
  - evidence: p1:9fde783bc0586e0a57e7cd80, p1:95e37cc92958e9fc16e3e7b9, p1:3a75f90f9f6559873954006d, p1:729d3607c8271e9acf9194b6, p1:ae8298fb50a1eb2ed760cf32

## A · RESOLVED

- REQUIRED Read orders.csv [RESOLVED]
  - facts: p1:51a81ff8b7643ae7f6fea049
  - scope: p1:c3efc9159d9cf3a847f4bb27; condition: none; quantity: none
  - evidence: p1:3ba2b632ff375e6b560bd7df, p1:95e37cc92958e9fc16e3e7b9, p1:f0b342dfb53de79eb7fe68a2, p1:729d3607c8271e9acf9194b6, p1:ae8298fb50a1eb2ed760cf32
- REQUIRED generate summary.md [RESOLVED]
  - facts: p1:1ea80232bcb287d2d1c6b418
  - scope: p1:1d841bb17d1f7cb95aec3285; condition: none; quantity: none
  - evidence: p1:9fde783bc0586e0a57e7cd80, p1:95e37cc92958e9fc16e3e7b9, p1:3a75f90f9f6559873954006d, p1:729d3607c8271e9acf9194b6, p1:ae8298fb50a1eb2ed760cf32

## P · RESOLVED

- Emma Lee [PERFORMER] [RESOLVED]
  - facts: p1:8b4d4b8920edb6b9118714d8, p1:fb0b4e0800423bd07837b24c, p1:9838d623b8c77921d8355d71, p1:c0921401c3e7d53ac9339fc9
  - scope: none; condition: none; quantity: none
  - evidence: p1:729d3607c8271e9acf9194b6, p1:ae8298fb50a1eb2ed760cf32, p1:6ce2689ebee16385f0c7f65f, p1:3ba2b632ff375e6b560bd7df, p1:95e37cc92958e9fc16e3e7b9, p1:9fde783bc0586e0a57e7cd80, p1:49e1245012e85b225edfa5df, p1:976ea170ce2fbe6fc4f052a3

## R · ABSENT

原文未显式定义此维。

## V · ABSENT

原文未显式定义此维。

## C · RESOLVED

- complete [RESOLVED]
  - facts: p1:317048a4f9427d4a3882315b
  - scope: none; condition: p1:0047e472105963cee5c64f84; quantity: none
  - evidence: p1:f06d3b4cc20d7eabb42b65f1, p1:8688695064640c3beab9f6c9, p1:0f58c888a4f42e4d2b04da87

## B · RESOLVED

- FORBIDDEN modify orders.csv [RESOLVED]
  - facts: p1:6c667779c05fc1d5315c3158
  - scope: p1:0f739a08cee2c84c38f9fb37; condition: none; quantity: none
  - evidence: p1:49e1245012e85b225edfa5df, p1:976ea170ce2fbe6fc4f052a3, p1:8a784586dd77f985a580e345, p1:729d3607c8271e9acf9194b6, p1:ae8298fb50a1eb2ed760cf32
