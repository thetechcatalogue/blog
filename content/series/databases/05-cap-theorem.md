---
title: "CAP Theorem"
slug: "cap-theorem"
order: 5
contentType: "markdown"
description: "Consistency, Availability, Partition tolerance — pick two"
---

## The CAP Theorem

In a distributed system you can guarantee at most two of three properties: Consistency, Availability, and Partition Tolerance.

## Partition Tolerance is Non-Negotiable

Networks fail. Partitions always happen. Any real distributed database must tolerate partitions — which forces a choice between consistency and availability.

## CP Systems — Consistency + Partition Tolerance

CP databases sacrifice availability during a partition. Every read returns the most recent write or an error. Example: HBase, ZooKeeper, etcd.

## AP Systems — Availability + Partition Tolerance

AP databases stay available during a partition but may return stale data. Nodes resolve conflicts after the partition heals. Example: Cassandra, DynamoDB, CouchDB.

## CA Systems — Theoretical Only

A CA system assumes no partitions — impossible in distributed deployments. Traditional single-node relational databases are effectively CA inside one datacenter.

## PACELC — The Real World Extension

PACELC extends CAP: even without a partition (E), you still trade Latency (L) vs Consistency (C). Most databases make both tradeoffs explicit in their tuning options.

## Design Takeaway

Choose your database with the CAP position in mind. If you need strong consistency, pay with availability. If uptime matters more, tolerate eventual consistency.
