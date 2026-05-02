---
title: "Relational Databases & SQL"
slug: "relational-sql"
order: 3
narrationSrc: /audio/series/databases/relational-sql.mp3
contentType: "markdown"
description: "Tables, schemas, joins, and ACID transactions"
audioDurationSec: 182.467
---

## Relational Databases

Data is organized into tables — rows and columns — with a strict schema. Every row in a table is a record; every column is a typed attribute.

## The Power of the Join

Relational databases shine when data is related. A JOIN links two tables by a shared key — letting you query users, orders, and products in a single statement.

## ACID Transactions

Atomicity: all-or-nothing. Consistency: rules always hold. Isolation: concurrent transactions don't interfere. Durability: committed data survives crashes.

## Indexes

Without an index, every query scans every row. A B-tree index pre-sorts a column so lookups are O(log n) instead of O(n). Add indexes on columns you filter and join on.

## Schema Migrations

Schemas must evolve as products grow. Migrations apply changes to column types, new tables, and foreign keys — tracked in version control alongside your code.

## Primary & Foreign Keys

A primary key uniquely identifies each row. A foreign key links a row in one table to a row in another, enforcing referential integrity at the database level.

## When to Use Relational

Complex queries with many joins, strong consistency requirements, transactional workloads like banking or e-commerce, and structured business data with known schemas.
