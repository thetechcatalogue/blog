---
title: "Evaluating Grounded Answers"
slug: "evaluating-grounded-answers"
order: 4
narrationSrc: /audio/series/rag-systems-in-practice/evaluating-grounded-answers.mp3
contentType: "markdown"
description: "How to measure retrieval quality, answer faithfulness, and failure patterns instead of guessing"
audioDurationSec: 111.093
---

## You Cannot Improve What You Do Not Measure

RAG quality often looks acceptable in demos and then fails under real user questions. Evaluation is what separates a convincing prototype from a reliable system.

## Measure Retrieval Separately From Generation

Start by checking whether the right chunks were retrieved at all. If they were missing, the generation step never had a fair chance.

## Faithfulness Matters More Than Fluency

A polished answer is not necessarily a grounded answer. The model should stay inside the retrieved evidence, cite the relevant material when possible, and avoid filling gaps with confident guesses.

## Build A Failure Taxonomy

Track recurring failure modes such as wrong chunk selected, correct chunk ranked too low, stale content, missing metadata filters, or answer synthesis that overreaches beyond the evidence.

## Use Real Queries, Not Only Happy Paths

Evaluation sets should include vague questions, ambiguous wording, exact-identifier lookups, multi-hop questions, and adversarial cases where the right answer is not in the index.

## Summary

Good RAG evaluation measures the full chain: retrieval quality, grounding, answer usefulness, and the specific ways the system fails.