## ADMIN → PM
Task ID: ROOT-DEMO

Summarize only these two public product statements: A, "view reports in a local browser"; B, "support multiple subtasks with the same role".
Deliver summary-a.md and summary-b.md in the demo workspace for PM review. DEV-01 owns A and DEV-02 owns B. Stop after writing each assigned file.
Do not deploy, delete files, search the network, access production or change 58618.
No budget, storage threshold or deadline is specified; do not invent one.

## PM → DEV (1/2)
Task ID: DEV-01
Parent Task ID: ROOT-DEMO

Use only statement A to write demo/summary-a.md for PM review, then stop.
Inherit the parent restrictions. Do not modify summary-b.md.

## PM → DEV (2/2)
Task ID: DEV-02
Parent Task ID: ROOT-DEMO

Use only statement B to write demo/summary-b.md for PM review, then stop.
Inherit the parent restrictions. Do not modify summary-a.md.
