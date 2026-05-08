---
title: "ReAct and Tool Use"
slug: "react-and-tool-use"
order: 1
narrationSrc: /audio/series/agent-design-patterns/react-and-tool-use.mp3
contentType: "markdown"
description: "Why agents need a think-act-observe loop instead of a single prompt"
audioDurationSec: 108.231
---

## Agents Need A Control Loop

A single prompt can answer a question, but it cannot inspect the world, take an action, see the result, and adapt.

## The ReAct Pattern

ReAct stands for reasoning and acting. The model decides the next step, calls a tool, observes the result, and continues until the task is complete.

## Tool Use Changes What The Model Can Do

With tools, the model can search, run code, query data, edit files, and call APIs. That turns the system from a text generator into an execution loop.

## Why Structured Tool Calls Matter

Tool calls should be explicit and machine-readable. That keeps execution reliable and makes failures easier to debug.

## Where This Pattern Fits Best

ReAct works well for tasks with uncertainty, external dependencies, and multiple intermediate steps.

## Summary

The simplest useful agent pattern is a loop: think, act, observe, and repeat with tools.