---
title: "Queues, Streams, and Async Work"
slug: "queues-streams-and-async-work"
order: 3
narrationSrc: /audio/series/distributed-systems/queues-streams-and-async-work.mp3
contentType: "markdown"
description: "How systems decouple work in time and scale without turning everything into a blocking request"
audioDurationSec: 101.747
---

## Not Every Task Belongs in the Request Path

If user requests wait for email delivery, report generation, cache warming, indexing, billing, and notifications, latency balloons and reliability drops.

## Queues Create Separation in Time

A queue lets one service hand off work and move on. Producers and consumers no longer need to run at the same speed, and brief traffic spikes become manageable.

## Streams Preserve Event History

A stream is more than background work. It keeps an ordered record of events that multiple consumers can read for different purposes such as analytics, projections, or downstream automation.

## Delivery Semantics Matter

At-most-once, at-least-once, and effectively-once handling each change the failure model. The implementation details decide whether your consumers need deduplication, replay, or idempotent writes.

## Async Does Not Mean Simpler

Moving work off the request path reduces user-visible latency, but it adds eventual completion, backlogs, retries, poison messages, and observability challenges.

## Summary

Queues and streams are how distributed systems scale behavior across time. They reduce direct coupling, but they demand discipline around ordering, retries, and correctness.
