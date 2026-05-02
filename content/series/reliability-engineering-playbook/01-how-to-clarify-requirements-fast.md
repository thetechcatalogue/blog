---
title: "SLOs, SLIs, and Error Budgets"
slug: "slos-slis-and-error-budgets"
order: 1
narrationSrc: /audio/series/reliability-engineering-playbook/slos-slis-and-error-budgets.mp3
contentType: "markdown"
description: "How to set measurable reliability targets without guessing"
---

## Reliability Starts with a Promise

An SLO is a promise to users about service behavior, such as availability, latency, or correctness. Without that promise, reliability work becomes opinion-driven.

## SLI Is the Measurement Layer

SLIs are the concrete metrics that represent user experience: successful request ratio, p95 latency, or job completion time. Pick metrics users actually feel.

## Error Budget Creates Balance

If your SLO is 99.9% availability, your monthly error budget is the allowed downtime window. Teams can spend that budget on risk-taking, deployments, and experiments.

## Burn Rate Shows Risk Early

Burn rate compares current error consumption to expected pace. A high burn rate means you are on track to exhaust budget quickly and should trigger intervention.

## Alert on User Harm, Not Infrastructure Noise

Reliability alerts should map to violated SLOs, not every CPU spike. This reduces alert fatigue and keeps on-call attention on meaningful incidents.

## Summary

SLOs define the target, SLIs measure reality, and error budgets govern decision-making. Together they create a practical reliability operating system.
