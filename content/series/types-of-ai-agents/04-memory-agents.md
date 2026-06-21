---
title: "Memory-Augmented Agents"
slug: "memory-agents"
order: 4
contentType: "diagram"
diagramId: "memoryAgent"
description: "Agents equipped with short-term working memory and long-term vector stores to reason across conversations and large knowledge bases."
narrationSrc: /audio/series/types-of-ai-agents/memory-agents.mp3
audioDurationSec: 52.848
---

## The Context Window Problem

Every LLM call has a finite context window. For short tasks this is sufficient, but for agents running across multiple turns, large codebases, or extensive knowledge bases, it becomes a hard constraint. Memory systems solve this by storing and selectively retrieving information on demand.

## Two Kinds of Memory

Working memory holds the current conversation history, recent tool outputs, and active intermediate results — everything the agent needs right now. Long-term memory is a vector store of past interactions, documents, and learned facts that can be retrieved by semantic similarity when relevant.

## How Retrieval Works

When the agent receives a new query, it embeds it and searches the vector store for semantically similar chunks. Those chunks are injected into the context window alongside the query, giving the model grounded information without needing to load everything at once.

## Writing Back to Memory

Useful facts discovered during execution can be written back into the long-term store, making the agent progressively more knowledgeable. This is the foundation of systems that learn from every interaction.

## Trade-offs in Memory Design

More memory increases accuracy and context but also retrieval latency and cost. Good memory agents use strategies like recency weighting, importance scoring, and periodic summarization to keep the store clean and fast.
