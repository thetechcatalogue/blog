---
title: "RAG Explained: Retrieval-Augmented Generation for Developers"
slug: rag-retrieval-augmented-generation
date: 2025-05-03
author: Ashish Kumar
tags: [ai, rag, llm, vector-database, embeddings, search]
description: A developer's guide to Retrieval-Augmented Generation (RAG) — the architecture, chunking strategies, vector databases, and when to use RAG over fine-tuning.
---

# RAG Explained: Retrieval-Augmented Generation for Developers

Large Language Models know a lot, but they don't know **your** data. They can't answer questions about your internal docs, your latest product specs, or your private codebase. **RAG** (Retrieval-Augmented Generation) solves this by fetching relevant documents at query time and injecting them into the LLM's context.

## The Core Idea

Instead of training the model on your data (expensive, slow, stale), you **retrieve** the right information at runtime and hand it to the model alongside the user's question.

```
User Question
     │
     ▼
┌──────────┐    Query     ┌────────────────┐
│ Embedding│ ────────────►│ Vector Database │
│  Model   │              │ (your docs,    │
└──────────┘              │  chunked &     │
     │                    │  embedded)     │
     │                    └───────┬────────┘
     │                            │
     │                     Top K chunks
     │                            │
     ▼                            ▼
┌──────────────────────────────────────┐
│             LLM Prompt               │
│                                      │
│  System: You are a helpful assistant │
│  Context: [retrieved chunks]         │
│  Question: [user's question]         │
│                                      │
└──────────────────────────────────────┘
     │
     ▼
   Answer (grounded in your data)
```

## Why RAG Instead of Fine-Tuning?

| Aspect | RAG | Fine-Tuning |
|--------|-----|-------------|
| **Data freshness** | Always current — update the index anytime | Stale until you retrain |
| **Cost** | Cheap — just embeddings + vector DB | Expensive — GPU hours for training |
| **Setup time** | Hours | Days to weeks |
| **Hallucination** | Reduced — answers are grounded in retrieved docs | Can still hallucinate confidently |
| **Best for** | Knowledge bases, docs, FAQs | Changing model behavior or style |

Use RAG when you want the model to **know your data**. Use fine-tuning when you want to change **how** the model responds.

## Building a RAG Pipeline

### Step 1: Document Ingestion

Collect your source documents — PDFs, Markdown files, web pages, database records, API responses.

### Step 2: Chunking

Split documents into smaller pieces that fit within the LLM's context window. Chunking strategy matters a lot:

| Strategy | How It Works | Best For |
|----------|-------------|----------|
| **Fixed-size** | Split every N characters/tokens | Simple, predictable |
| **Sentence-based** | Split on sentence boundaries | Prose, articles |
| **Paragraph-based** | Split on paragraph breaks | Structured docs |
| **Semantic** | Use an LLM or embeddings to find natural topic boundaries | Complex documents |
| **Recursive** | Try large chunks first, then split further if too big | General purpose (recommended default) |

**Chunk overlap** (e.g., 10-20% overlap between adjacent chunks) helps preserve context at boundaries.

**Chunk size sweet spot**: 256–1024 tokens per chunk works well for most use cases. Too small and you lose context. Too large and you dilute relevance.

### Step 3: Embedding

Convert each chunk into a vector (a list of numbers) using an embedding model. Similar content produces similar vectors.

Popular embedding models:
- **OpenAI `text-embedding-3-small`** — Good balance of quality and cost
- **Cohere Embed v3** — Strong multilingual support
- **Azure OpenAI Embeddings** — Enterprise-grade with data residency
- **Open-source: `nomic-embed-text`, `bge-large`** — Free, run locally

### Step 4: Store in a Vector Database

Vector databases are optimized for **similarity search** — finding the chunks most similar to a query vector.

| Database | Type | Highlights |
|----------|------|-----------|
| **Azure AI Search** | Managed | Hybrid search (vector + keyword), integrated with Azure |
| **Pinecone** | Managed | Simple API, serverless option |
| **Weaviate** | Open-source / Managed | GraphQL API, multi-modal |
| **Qdrant** | Open-source / Managed | Rust-based, fast |
| **ChromaDB** | Open-source | Lightweight, great for prototyping |
| **pgvector** | Postgres extension | Use your existing Postgres |

### Step 5: Retrieval

When a user asks a question:
1. Embed the question using the same embedding model
2. Search the vector database for the top K most similar chunks
3. Return those chunks as context

### Step 6: Generation

Build the final prompt with the retrieved context and send it to the LLM:

```
You are a helpful assistant. Answer the user's question based ONLY
on the provided context. If the context doesn't contain the answer,
say "I don't know."

Context:
{chunk_1}
{chunk_2}
{chunk_3}

Question: {user_question}
```

## Advanced RAG Patterns

### Hybrid Search
Combine vector similarity search with traditional keyword search (BM25). This catches cases where exact keyword matches matter (error codes, product names, IDs).

### Re-Ranking
After retrieving the top K chunks, use a cross-encoder model to re-rank them by relevance. This significantly improves answer quality.

```
Query → Vector Search (top 20) → Re-Ranker (top 5) → LLM
```

### Query Transformation
Before searching, rephrase the user's question for better retrieval:
- **HyDE** (Hypothetical Document Embedding) — Generate a hypothetical answer, then use it as the search query
- **Multi-query** — Generate 3–5 rephrased versions of the question, search with each, merge results
- **Step-back prompting** — Ask a more general version of the question first

### Contextual Chunking
Add metadata to each chunk — document title, section heading, summary of surrounding content. This helps retrieval even when the chunk itself doesn't contain the exact search terms.

### Agentic RAG
Instead of a single retrieve-then-generate pipeline, an **agent** decides when and what to retrieve. It can:
- Search multiple indexes
- Refine its query if initial results are poor
- Combine information from multiple chunks before generating

## Common Pitfalls

1. **Chunks too small** — The LLM gets fragments without context
2. **Chunks too large** — Relevant info is buried in noise
3. **Wrong embedding model** — Must match the language and domain
4. **No evaluation** — You can't improve what you don't measure
5. **Ignoring keyword search** — Vector search alone misses exact matches
6. **Stuffing too many chunks** — Exceeding the context window or diluting attention

## Evaluation Metrics

| Metric | What It Measures |
|--------|-----------------|
| **Retrieval precision** | Are the retrieved chunks relevant? |
| **Retrieval recall** | Did we find all relevant chunks? |
| **Answer faithfulness** | Is the answer grounded in the retrieved context? |
| **Answer relevance** | Does the answer actually address the question? |

Tools like **Ragas**, **DeepEval**, and **Azure AI Evaluation** can automate these measurements.

## Conclusion

RAG is the most practical way to make LLMs work with your own data. The core pattern is simple — chunk, embed, store, retrieve, generate. The art is in the details: how you chunk, what you embed, how you search, and how you prompt. Start with the basic pipeline, measure your results, then layer in advanced patterns like hybrid search and re-ranking where they help.
