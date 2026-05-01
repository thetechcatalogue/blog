---
title: "Latency, Timeouts, and Retries"
slug: "latency-timeouts-and-retries"
order: 3
contentType: "markdown"
description: "The operational tradeoffs behind resilient request handling"
---

## Latency Is a Budget

Users experience the total latency of the whole path, not just the server computation time. DNS, TLS, proxy hops, database calls, and third-party APIs all consume the budget.

## Timeouts Are Protection

Without timeouts, systems wait too long for unhealthy dependencies and turn local failures into system-wide congestion.

## Retries Help and Hurt

Retries can recover from transient faults. They can also amplify outages if every caller retries aggressively at the same time.

## Backoff and Idempotency

Safe retry design depends on exponential backoff, jitter, and endpoints that can tolerate duplicate delivery or repeated attempts.

## Summary

Reliable networked systems treat timeouts and retries as architecture concerns, not afterthoughts.
