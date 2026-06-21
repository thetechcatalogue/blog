---
title: "Planning Agents"
slug: "planning-agents"
order: 3
contentType: "diagram"
diagramId: "planningAgent"
description: "Agents that decompose a high-level goal into an ordered sequence of sub-tasks before executing a single step."
narrationSrc: /audio/series/types-of-ai-agents/planning-agents.mp3
audioDurationSec: 46.480
---

## The Problem With Pure Reactive Loops

ReAct agents work well for shallow tasks but can get lost in complex, multi-stage work. Each step is chosen greedily without a view of the whole problem, which leads to redundant actions and dead ends on longer horizons.

## Planner and Executor

Planning agents separate two concerns. A planner receives the goal, reasons about the full scope of work, and outputs a structured plan — an ordered list of sub-tasks with dependencies. An executor then works through the plan step by step, calling tools and producing outputs.

## Why Decomposition Helps

When the planner decides upfront what steps are needed, the executor can focus on reliable execution rather than strategy. Steps can be parallelized, retried in isolation, or handed off to specialized agents.

## The Replanning Trap

Rigid plans fail when the environment changes mid-execution. Better planning agents check intermediate results and replan when a step fails or reveals that the original decomposition was wrong. This adds robustness without sacrificing structure.

## When to Use Planning Agents

Planning agents shine on complex document generation, long-form research, software projects with multiple files, and any task where the outcome depends on completing prerequisites in the right order.
