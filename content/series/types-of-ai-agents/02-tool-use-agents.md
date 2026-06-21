---
title: "Tool-Use Agents"
slug: "tool-use-agents"
order: 2
contentType: "diagram"
diagramId: "toolUseAgent"
description: "LLM-powered agents that reason, call external tools, observe results, and loop — the ReAct pattern in action."
narrationSrc: /audio/series/types-of-ai-agents/tool-use-agents.mp3
audioDurationSec: 51.451
---

## Beyond a Single Prompt

A single LLM call can generate text, but it cannot inspect the live web, run code, or query a database. Tool-use agents solve this by wrapping the model in a loop that lets it reach outside its context window and interact with the real world.

## The ReAct Pattern

ReAct stands for Reasoning and Acting. On each iteration the model produces a thought, decides which tool to invoke, observes the result, and then decides the next step. The loop continues until the task is complete or a stop condition is met.

## What Tools Unlock

With tools the agent can search the web, execute Python, read and write files, call APIs, and query databases. The model shifts from a text generator into an execution engine that can gather and process real-time information.

## Why Structured Tool Calls Matter

Tool calls must be explicit and machine-readable so the runtime can parse, dispatch, and return results reliably. Clear tool schemas also make failures easy to diagnose and retry without ambiguity.

## Where This Pattern Fits Best

ReAct agents work well for research tasks, coding assistance, data analysis, and any workflow with external dependencies and multiple intermediate steps where the right path cannot be determined upfront.
