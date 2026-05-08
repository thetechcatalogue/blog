---
title: "Building a Test Dataset"
slug: "building-a-test-dataset"
order: 2
narrationSrc: /audio/series/ai-evals-and-observability/building-a-test-dataset.mp3
contentType: "markdown"
description: "How to turn real tasks and failures into a dataset that actually reflects production behavior"
audioDurationSec: 97.692
---

## Your Dataset Defines What You Notice

An evaluation set is not just a file of prompts. It defines what quality means for your system.

## Start With Real Usage Patterns

The best datasets come from support tickets, user sessions, QA cases, and failures that already happened in production. Synthetic prompts alone usually miss the messy parts.

## Cover More Than Happy Paths

Include ambiguous requests, missing context, malformed inputs, exact lookups, multi-step tasks, and cases where the correct answer should be a refusal or an explicit "I don't know."

## Label The Outcome You Care About

Some cases need a gold answer. Others need a rubric, expected tool usage, required citations, or a simple pass-fail condition.

## Keep The Dataset Alive

A good eval dataset grows with the system. New regressions, product features, and user behavior should all feed back into the next version.

## Summary

Evaluation quality depends heavily on the realism of the dataset behind it.