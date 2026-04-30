---
title: "Choosing the Right Database"
slug: "choosing-the-right-db"
order: 6
contentType: "markdown"
description: "A decision framework for every real-world scenario"
---

## The Right Question to Start With

Don't ask "which database is best?" — ask "what does my data look like, and how will I query it?"

## Access Pattern First

Map out your read and write patterns before choosing a database. Heavy writes and time-ordered data points toward columnar. Complex traversals point toward graph. Simple lookups point toward key-value.

## Consistency vs Availability

If you can tolerate stale reads, you gain availability and horizontal scale. If every read must be fresh, you pay with latency or reduced availability during failures.

## Latency Requirements

Sub-millisecond lookups demand in-memory stores like Redis. Single-digit milliseconds is achievable with well-indexed relational or document databases. Analytical queries often tolerate seconds.

## Scale Dimensions

Relational databases scale vertically by default. NoSQL stores are designed for horizontal scaling across commodity nodes — but you give up joins and referential integrity.

## Polyglot Persistence

Production systems rarely use one database. Use Postgres for transactional data, Redis for caching and sessions, Elasticsearch for full-text search, and S3 for blobs.

## Summary Framework

1. Define your access patterns. 2. Set your consistency needs. 3. Estimate your scale. 4. Match to the database category. 5. Benchmark before committing.
