---
title: "Why Distributed Systems Are Hard"
slug: "why-distributed-systems-are-hard"
order: 1
contentType: "markdown"
description: "Latency, partial failure, and coordination make simple code behave differently at scale"
---

## One Program Becomes Many Conversations

A local program mostly reasons about memory, CPU time, and deterministic control flow. A distributed system turns that into network calls, retries, timeouts, independent processes, and state that may diverge temporarily.

## The Core Difficulty Is Partial Failure

In a single process, a component usually works or crashes. In a distributed system, one node may be slow, another unavailable, a third returning stale data, and a fourth still processing an earlier request.

## Latency Changes Design

Distance adds time. Every cross-service call consumes part of the user experience budget. If a request hops through five services, the total latency becomes the product of those design choices.

## You Lose Global Truth

No machine sees everything instantly. Logs arrive late, caches drift, replicas lag, and two healthy services may disagree for a short period.

## Coordination Is Expensive

The moment multiple machines must agree on ordering, ownership, or state transitions, throughput drops and complexity rises. Consensus is powerful, but it is not free.

## Summary

Distributed systems are hard because they replace local certainty with remote coordination under unreliable conditions. Good architecture starts by accepting that reality instead of hiding it.
