---
title: "Planner Executor"
slug: "planner-executor"
order: 2
narrationSrc: /audio/series/agent-design-patterns/planner-executor.mp3
contentType: "markdown"
description: "Separate strategic planning from step-by-step execution when tasks get larger"
audioDurationSec: 85.574
---

## Planning And Doing Are Different Jobs

As tasks get larger, one model loop often becomes messy. It tries to invent the plan and execute every step at the same time.

## The Planner Executor Split

One component creates a task plan. Another component executes the steps, checks progress, and reports back. This separation makes the workflow easier to control.

## Why Teams Use It

The plan becomes visible, reviewable, and easier to revise. Execution can stay focused on one concrete step at a time.

## The Main Tradeoff

Bad plans still create bad outcomes. The pattern improves structure, but only if the planner stays grounded in the real task and the executor can handle deviations.

## Good Use Cases

This pattern fits coding tasks, research workflows, migration tasks, and any job where progress needs to be staged.

## Summary

Planner executor is useful when you need explicit structure, controllable progress, and less drift during long tasks.