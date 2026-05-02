---
title: "What is a Database?"
slug: "what-is-a-database"
order: 1
narrationSrc: /audio/series/databases/what-is-a-database.mp3
contentType: "markdown"
description: "Storage, retrieval, and why not just use files"
audioDurationSec: 141.129
---

## What is a Database?

A database is an organized collection of structured data with a system for fast retrieval — far beyond what a flat file can offer.

## Why Not Just Use Files?

Files are great for simple storage. But as data grows, you need concurrent access, ACID guarantees, indexing for fast lookups, and relationships between data.

## The Four Core Jobs

Every database must do four things well: store data durably, retrieve it quickly, handle concurrent reads and writes, and survive failures.

## CRUD — The Universal Contract

Create, Read, Update, Delete. Every database exposes these operations — whether through SQL, a REST API, key lookups, or graph traversals.

## Persistence vs In-Memory

Disk-backed databases survive restarts. In-memory databases like Redis trade durability for microsecond latency — often used as a cache layer alongside a persistent store.

## The Query Planner

Behind every database is a query planner — an optimizer that turns your intent into an efficient execution plan across indexes, joins, and scans.

## Summary

A database is not just storage — it is a contract: durability, consistency, isolation, and atomicity. Everything else is a tradeoff layered on top of that contract.
