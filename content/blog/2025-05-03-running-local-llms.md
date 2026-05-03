---
title: "Running Local LLMs: Ollama, LM Studio, and Beyond"
slug: running-local-llms
date: 2025-05-03
author: Ashish Kumar
tags: [ai, llm, ollama, lm-studio, local-ai, privacy, self-hosted]
description: A practical guide to running large language models locally on your own hardware — covering Ollama, LM Studio, hardware requirements, and when local beats cloud.
---

# Running Local LLMs: Ollama, LM Studio, and Beyond

You don't need an API key to use an LLM. Modern open-weight models run on consumer hardware, giving you AI capabilities with **zero cloud dependency**, **no usage costs**, and **complete data privacy**.

## Why Run Models Locally?

| Reason | Details |
|--------|---------|
| **Privacy** | Your prompts and data never leave your machine |
| **Cost** | No per-token billing — pay once for hardware |
| **Offline access** | Works without an internet connection |
| **No rate limits** | Query as fast as your GPU can handle |
| **Customization** | Fine-tune, quantize, or modify models freely |
| **Latency** | No network round-trip for local applications |

The trade-off: local models are typically smaller and less capable than frontier cloud models (GPT-4o, Claude Opus, Gemini Ultra). But for many tasks — code completion, summarization, data extraction, chat — they are more than sufficient.

## The Tools

### Ollama

The simplest way to run LLMs locally. One command to install, one command to run a model.

```bash
# Install
curl -fsSL https://ollama.com/install.sh | sh

# Run a model
ollama run llama3.1

# Run with a specific size
ollama run llama3.1:70b

# List downloaded models
ollama list

# Serve as an API (OpenAI-compatible)
ollama serve
```

Ollama exposes an **OpenAI-compatible API** at `http://localhost:11434`, so any tool that works with the OpenAI API can point to Ollama instead.

**Best for**: Developers who want a CLI-first, API-first experience. Great for integrating local models into applications, scripts, and agent frameworks.

### LM Studio

A desktop application with a GUI for discovering, downloading, and running models. Built on `llama.cpp` under the hood.

Key features:
- **Model discovery** — Browse and download from Hugging Face directly
- **Chat interface** — Test models interactively
- **Local API server** — OpenAI-compatible endpoint
- **Parameter tuning** — Adjust temperature, top-p, context length through the UI
- **Multi-model** — Load and switch between models easily

**Best for**: Users who prefer a visual interface. Great for exploring and comparing different models.

### llama.cpp

The foundational C++ inference engine that powers both Ollama and LM Studio. Use it directly for maximum control:

```bash
# Build from source
git clone https://github.com/ggerganov/llama.cpp
cd llama.cpp && make -j

# Run a model
./llama-cli -m models/llama-3.1-8b-q4_K_M.gguf -p "Explain TCP/IP in simple terms"
```

**Best for**: Advanced users who need fine-grained control over inference parameters, custom builds, or integration into C/C++ applications.

### vLLM

A high-throughput inference engine optimized for serving models to multiple users. Uses PagedAttention for efficient GPU memory management.

```bash
pip install vllm
vllm serve meta-llama/Llama-3.1-8B-Instruct
```

**Best for**: Serving models to multiple users or applications. Not ideal for single-user desktop use.

## Hardware Requirements

### How Much Do You Need?

The key constraint is **RAM** (or VRAM for GPU inference). A rough rule of thumb for quantized models:

| Model Size | Q4 Quantized | RAM/VRAM Needed | Example Hardware |
|------------|-------------|-----------------|-----------------|
| 1-3B | ~2 GB | 4 GB+ | Any modern laptop |
| 7-8B | ~4-5 GB | 8 GB+ | M1/M2 MacBook, GTX 3060 |
| 13B | ~8 GB | 12 GB+ | M2 Pro, RTX 3080 |
| 34B | ~20 GB | 24 GB+ | M2 Max, RTX 4090 |
| 70B | ~40 GB | 48 GB+ | M2 Ultra, 2x RTX 4090 |

### Apple Silicon Advantage

Apple's M-series chips are excellent for local LLMs because they have **unified memory** — the GPU and CPU share the same RAM pool. A MacBook Pro with 36 GB unified memory can comfortably run 34B-parameter models.

### GPU vs CPU Inference

| | GPU | CPU |
|--|-----|-----|
| **Speed** | 30-100+ tokens/sec | 5-20 tokens/sec |
| **Memory** | Limited to VRAM | Can use all system RAM |
| **Cost** | GPU hardware is expensive | Works on any machine |

For interactive chat, you want at least 10 tokens/second. For batch processing, speed matters less.

## Quantization — Making Models Fit

Full-precision models are huge. A 70B model at FP16 needs ~140 GB. **Quantization** reduces the precision of model weights to make them smaller and faster:

| Format | Bits | Size Reduction | Quality Impact |
|--------|------|---------------|---------------|
| FP16 | 16 | Baseline | None |
| Q8_0 | 8 | ~50% | Negligible |
| Q5_K_M | 5 | ~65% | Very minor |
| Q4_K_M | 4 | ~75% | Minor — sweet spot |
| Q3_K_M | 3 | ~80% | Noticeable on complex tasks |
| Q2_K | 2 | ~85% | Significant degradation |

**Q4_K_M** is the recommended default — best balance of size, speed, and quality.

GGUF is the standard file format for quantized models, used by llama.cpp, Ollama, and LM Studio.

## Popular Open Models Worth Running

| Model | Parameters | Strengths |
|-------|-----------|-----------|
| **Llama 3.1** | 8B, 70B, 405B | Best all-rounder from Meta |
| **Mistral / Mixtral** | 7B, 8x7B | Fast, strong coding and reasoning |
| **Phi-3 / Phi-4** | 3.8B, 14B | Surprisingly capable for their size |
| **Qwen 2.5** | 7B, 72B | Strong multilingual, good at code |
| **DeepSeek Coder** | 6.7B, 33B | Purpose-built for code |
| **Gemma 2** | 9B, 27B | Google's open model, well-rounded |
| **CodeLlama** | 7B, 34B | Code-specialized Llama variant |

## Connecting Local Models to Your Workflow

### Use with VS Code
Point GitHub Copilot or Continue.dev to your local Ollama endpoint for code completion without cloud dependency.

### Use as MCP Server Backend
Run a local model as the LLM behind an agent workflow — combine with MCP servers for a fully offline AI assistant.

### Use in Applications
The OpenAI-compatible API means you can swap `https://api.openai.com` with `http://localhost:11434` in any application using the OpenAI SDK:

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:11434/v1",
    api_key="unused",  # Ollama doesn't need a key
)

response = client.chat.completions.create(
    model="llama3.1",
    messages=[{"role": "user", "content": "Explain DNS in one paragraph"}],
)
print(response.choices[0].message.content)
```

## When to Use Local vs Cloud

| Use Case | Local | Cloud |
|----------|-------|-------|
| Sensitive/private data | Yes | No |
| Offline environments | Yes | No |
| High-volume batch processing | Yes (no cost per token) | Expensive |
| State-of-the-art reasoning | Limited | Yes |
| Quick prototyping | Yes | Yes |
| Production at scale | Consider vLLM | Easier |

## Conclusion

Running LLMs locally is practical, private, and increasingly capable. Ollama makes it dead simple to get started — install it, pull a model, and you're running AI on your own hardware in under five minutes. For most development tasks, an 8B quantized model on a decent laptop is surprisingly effective.

Start with `ollama run llama3.1` and see how far it takes you before reaching for a cloud API.
