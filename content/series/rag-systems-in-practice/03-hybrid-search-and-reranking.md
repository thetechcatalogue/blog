---
title: "Hybrid Search and Re-Ranking"
slug: "hybrid-search-and-reranking"
order: 3
narrationSrc: /audio/series/rag-systems-in-practice/hybrid-search-and-reranking.mp3
contentType: "markdown"
description: "Why retrieval quality improves when semantic search is combined with better ranking"
audioDurationSec: 97.022
---

## Vector Search Is Useful But Incomplete

Vector search is good for concept matching, but it can miss exact identifiers and short keyword-heavy queries.

## Why Hybrid Retrieval Wins So Often

Hybrid search combines vector retrieval with keyword signals such as BM25. That helps the system find both semantic matches and exact strings.

## Re-Ranking Improves The Final Cut

Initial retrieval is usually optimized for recall. Re-ranking reorders the candidate set so the final prompt contains stronger evidence.

## The Practical Pipeline

A common pattern is query embedding, hybrid retrieval, re-ranking, and then prompt assembly.

## Debugging Retrieval Means Looking At Misses

When answers are weak, inspect what was retrieved and what was missed. Failures often come from indexing, query phrasing, or weak rank fusion.

## Summary

Strong RAG systems combine retrieval signals and spend ranking budget where it matters most.