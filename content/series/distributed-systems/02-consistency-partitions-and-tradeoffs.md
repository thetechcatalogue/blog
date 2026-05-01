---
title: "Consistency, Partitions, and Tradeoffs"
slug: "consistency-partitions-and-tradeoffs"
order: 2
contentType: "markdown"
description: "Why correctness, availability, and network behavior have to be balanced explicitly"
---

## Distributed Systems Need a Policy for Disagreement

When the network is healthy, replicas can look synchronized. Under stress, links break, messages arrive late, and systems must decide whether to wait, reject work, or continue with incomplete information.

## Consistency Is About Observation

A consistent system makes state changes appear in a predictable way. The question is not whether consistency matters, but how much delay and coordination you are willing to pay to achieve it.

## Availability Is a User Promise

If a system stays available during a partition, it may need to serve stale or incomplete answers. If it preserves strict coordination, some operations may be denied until agreement is restored.

## Eventual Consistency Is Operationally Realistic

Many systems accept temporary divergence because it keeps the system responsive and scalable. The real work is defining which parts of the product can tolerate that delay.

## Design Begins with Business Semantics

Shopping carts, analytics dashboards, and social feeds can tolerate different levels of staleness than financial ledgers or identity changes.

## Summary

Consistency strategy is a product decision expressed through infrastructure. Strong systems choose tradeoffs intentionally rather than discovering them during incidents.
