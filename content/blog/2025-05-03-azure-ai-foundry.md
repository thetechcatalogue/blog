---
title: "Building AI Apps with Azure AI Foundry"
slug: azure-ai-foundry
date: 2025-05-03
author: Ashish Kumar
tags: [ai, azure, azure-ai-foundry, llm, agents, model-catalog, evaluation]
description: A developer's guide to Azure AI Foundry — the model catalog, deployments, prompt engineering playground, agent framework, evaluation tools, and building production AI applications.
---

# Building AI Apps with Azure AI Foundry

Azure AI Foundry (formerly Azure AI Studio) is Microsoft's unified platform for building AI applications. It brings together model access, prompt engineering, agent development, evaluation, and deployment into a single experience.

If you're building AI features in production — not just experimenting — Foundry is designed to take you from prototype to deployed application.

## What Azure AI Foundry Offers

```
┌─────────────────────────────────────────────────┐
│              Azure AI Foundry                   │
├────────────┬──────────┬───────────┬─────────────┤
│   Model    │  Prompt  │  Agent    │ Evaluation  │
│  Catalog   │  Flow    │ Framework │  & Tracing  │
├────────────┼──────────┼───────────┼─────────────┤
│  Deploy &  │   Data   │   MCP     │  Monitoring │
│   Scale    │  Assets  │  Support  │  & Logging  │
└────────────┴──────────┴───────────┴─────────────┘
```

## The Model Catalog

Foundry gives you access to hundreds of models from multiple providers — all deployable through the same interface:

| Provider | Notable Models |
|----------|---------------|
| **OpenAI** | GPT-4o, GPT-4o-mini, o3, o4-mini |
| **Microsoft** | Phi-4, Phi-3.5, MAI |
| **Meta** | Llama 3.1, Llama 3.2, Llama 4 |
| **Mistral** | Mistral Large, Mixtral |
| **Cohere** | Command R+, Embed v3 |
| **AI21** | Jamba |

### Deployment Options

| Type | What It Is | Best For |
|------|-----------|----------|
| **Serverless (Pay-per-token)** | No infrastructure to manage, billed per token | Variable workloads, getting started |
| **Managed Compute** | Dedicated VM with a model deployed on it | Predictable high-volume workloads |
| **Global / Data Zone** | Deploy with region or data residency controls | Compliance requirements |

Once deployed, every model is accessible through a unified **OpenAI-compatible API** — same SDK, same code, different model.

```python
from openai import AzureOpenAI

client = AzureOpenAI(
    azure_endpoint="https://your-resource.openai.azure.com",
    api_key="your-key",
    api_version="2025-01-01-preview",
)

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Explain Azure AI Foundry"}],
)
```

## The Prompt Playground

Foundry includes an interactive playground where you can:
- Test prompts against any deployed model
- Compare responses across models side-by-side
- Tune parameters (temperature, top-p, max tokens)
- Add system prompts and few-shot examples
- Upload images for multimodal models
- Save and version your prompts

This is invaluable for **prompt engineering** — iterate on your system prompt until it produces consistent, high-quality outputs before writing any code.

## The Agent Framework

Azure AI Foundry includes the **Microsoft Agent Framework** for building AI agents that can plan, use tools, and complete complex tasks.

### Creating an Agent

```python
from azure.ai.projects import AIProjectClient
from azure.identity import DefaultAzureCredential

client = AIProjectClient(
    credential=DefaultAzureCredential(),
    endpoint="https://your-project.services.ai.azure.com",
)

agent = client.agents.create_agent(
    model="gpt-4o",
    name="research-assistant",
    instructions="You are a research assistant. Search the web and summarize findings.",
    tools=[{"type": "bing_grounding"}],
)
```

### Built-in Tools

| Tool | What It Does |
|------|-------------|
| **Bing Grounding** | Web search with cited results |
| **Code Interpreter** | Run Python code in a sandbox |
| **File Search** | Search across uploaded documents (RAG built-in) |
| **Azure AI Search** | Connect to your search index |
| **Function Calling** | Call your own APIs and functions |
| **MCP Servers** | Connect to any MCP-compatible tool |

### Agent with File Search (Built-in RAG)

Upload your documents and the agent automatically chunks, embeds, and searches them:

```python
# Upload files
file = client.agents.upload_file(file_path="product-docs.pdf", purpose="agents")

# Create a vector store
vector_store = client.agents.create_vector_store(
    name="product-knowledge",
    file_ids=[file.id],
)

# Create agent with file search
agent = client.agents.create_agent(
    model="gpt-4o",
    name="product-expert",
    instructions="Answer questions about our products using the uploaded documentation.",
    tools=[{"type": "file_search"}],
    tool_resources={"file_search": {"vector_store_ids": [vector_store.id]}},
)
```

## Evaluation and Tracing

Building an AI app is easy. Building a **reliable** one requires evaluation.

### Built-in Evaluators

Foundry provides evaluators you can run against your AI application:

| Evaluator | What It Measures |
|-----------|-----------------|
| **Groundedness** | Is the response grounded in the provided context? |
| **Relevance** | Does the response answer the question? |
| **Coherence** | Is the response well-structured and logical? |
| **Fluency** | Is the language natural and readable? |
| **Similarity** | How close is the response to a reference answer? |
| **F1 Score** | Token overlap with ground truth |
| **Violence / Self-harm / Hate** | Safety evaluators |

### Running Evaluations

```python
from azure.ai.evaluation import evaluate, GroundednessEvaluator

groundedness = GroundednessEvaluator(model_config)

results = evaluate(
    data="test-dataset.jsonl",
    evaluators={"groundedness": groundedness},
    evaluator_config={
        "groundedness": {
            "query": "${data.question}",
            "context": "${data.context}",
            "response": "${data.answer}",
        }
    },
)
```

### Tracing

Foundry integrates with **Application Insights** for production tracing. Every LLM call, tool invocation, and agent step is logged with:
- Input/output tokens
- Latency
- Model used
- Cost
- Full prompt and response (configurable)

This lets you debug issues, monitor quality, and optimize costs in production.

## Project Structure

A Foundry project organizes your AI resources:

```
Azure AI Foundry Project
├── Models & Deployments
│   ├── gpt-4o (serverless)
│   ├── phi-4 (managed compute)
│   └── text-embedding-3-small (serverless)
├── Agents
│   ├── research-assistant
│   └── product-expert
├── Data Assets
│   ├── evaluation-dataset.jsonl
│   └── product-docs/
├── Evaluations
│   ├── v1-groundedness-results
│   └── v2-groundedness-results
└── Connected Resources
    ├── Azure AI Search
    ├── Azure Blob Storage
    └── Application Insights
```

## Getting Started

1. **Create an Azure AI Foundry resource** in the Azure portal
2. **Create a project** within the Foundry hub
3. **Deploy a model** from the catalog (start with GPT-4o-mini for cost)
4. **Test in the playground** — iterate on your prompt
5. **Build your app** using the Python SDK
6. **Add evaluation** — create a test dataset and run evaluators
7. **Deploy and monitor** — use tracing to watch production behavior

## When to Use Foundry

| Scenario | Use Foundry? |
|----------|-------------|
| Production AI app with Azure backend | Yes |
| Quick prototype / hackathon | Maybe — playground is great, but overhead of setup |
| Need multiple model providers | Yes — single API for OpenAI, Meta, Mistral |
| Compliance / data residency requirements | Yes — Azure region controls |
| Already using Azure | Definitely |
| Purely local / offline development | No — use Ollama or LM Studio |

## Conclusion

Azure AI Foundry is a comprehensive platform for building production AI applications. The model catalog gives you choice, the agent framework gives you autonomy, and the evaluation tools give you confidence. If you're building AI on Azure, Foundry is the starting point — not just for experimentation, but for the full lifecycle from prompt to production.
