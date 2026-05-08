---
title: "Hybrid Search and Re-Ranking"
slug: "hybrid-search-and-reranking"
order: 3
narrationSrc: /audio/series/rag-systems-in-practice/hybrid-search-and-reranking.mp3
contentType: "markdown"
description: "Why vector similarity alone is not enough and how better ranking improves grounded answers"
audioDurationSec: 121.791
---

## Vector Search Is Useful But Incomplete

Semantic similarity is strong for concept matching, but it can miss exact identifiers, error codes, field names, product SKUs, and short keyword-heavy queries.

## Why Hybrid Retrieval Wins So Often

Hybrid search combines vector retrieval with lexical signals such as keyword search or BM25. That mix helps the system find both semantically related text and exact string matches.

## Re-Ranking Improves The Final Cut

Initial retrieval is usually optimized for recall. Re-ranking takes a larger candidate set and reorders it with a more expensive relevance model so the final prompt contains the strongest evidence.

## The Practical Pipeline

A common pattern is query embedding, hybrid retrieval for top twenty candidates, re-ranking down to the best few chunks, and then prompt assembly for the model.

## Debugging Retrieval Means Looking At Misses

When answers are weak, inspect what was retrieved but also what was not retrieved. The failure may come from indexing, query phrasing, lexical gaps, or poor rank fusion.

## Summary

Strong RAG systems do not rely on vector search alone. They combine retrieval signals and spend ranking budget where it changes the prompt most.