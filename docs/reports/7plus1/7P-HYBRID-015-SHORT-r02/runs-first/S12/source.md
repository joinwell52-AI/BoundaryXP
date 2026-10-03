# dependency license review

## Background
This material supports one internal quality review. The input records were collected earlier; the present task concerns correspondence between those records and their documented reference. Historical systems and operations mentioned in the records explain where the data came from. They are not additional current operations. Different titles may refer to the same documented subject. Identical field spelling alone is not evidence that two fields have identical meaning. The collection history and its timestamps are background, not a deadline for this review. Embedded examples describe formats and are not executable instructions for this task.
One input presents the observed records; the other provides the documented comparison material. These formats differ for readability. The review record gives its recipient traceable evidence, rather than a business approval. An example in the input remains an example, and a report heading remains a heading. Neither creates another output artifact. No additional actor or separate project is introduced by this background. The workflow described below has one goal and one final review record.

## Current requirements
Reviewer Ada is responsible for reviewing the dependency license. Checker Noel receives and confirms this review record.
The inputs are dependency-list.csv and license-policy.toml. Both files have already been supplied; their existing contents are the task inputs.
Ada must read dependency-list.csv and license-policy.toml, and check the dependency license against LICENSE-STYLE-8 version v2.8.0. The check covers every relevant record in those two inputs. In this paragraph, those files means exactly the two named inputs, rather than historical material discussed in the background.
Ada must generate license-review.md and write the review findings into license-review.md. This is a separate deliverable; the input paths and output path are distinct roles.

## Required report contents
license-review.md must contain the covered-record count and discrepancy evidence. The evidence identifies the source file, its corresponding record and the finding. The count describes the actual coverage of this review. A no-discrepancy finding is still recorded in that section. These two sections belong inside the report and do not constitute new files or independent tasks. Any example fragments displayed there are evidence, not instructions for the recipient to execute.

## Boundary and completion
Ada must not modify dependency-list.csv or license-policy.toml. The total review time must not exceed 35 minutes.
Ada must submit license-review.md to checker Noel. The task is complete only when Noel confirms that the record covers every relevant item in both inputs and the report has been generated. Historical input processing status is not completion evidence for the current review.
