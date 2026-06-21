---
title: "Reflex Agents"
slug: "reflex-agents"
order: 1
contentType: "diagram"
diagramId: "reflexAgent"
description: "The simplest agents — map every perceived input to an action through a fixed set of rules, with no memory or planning."
narrationSrc: /audio/series/types-of-ai-agents/reflex-agents.mp3
audioDurationSec: 27.674
---

## What Is a Reflex Agent

A reflex agent is the simplest class of intelligent agent. It perceives the current state of its environment through sensors and immediately maps that perception to an action through a set of condition-action rules. There is no history, no memory, and no forward planning involved.

## The Perception-Action Loop

Every cycle, the agent reads environmental signals, passes them through a rule engine, and fires an actuator. The loop runs continuously. The same input will always produce the same output, making these agents predictable and easy to reason about.

## Where Reflex Agents Work Well

Reflex agents excel in fully observable, deterministic environments where the right action depends only on the current percept. Thermostats, spam filters, traffic lights, and simple game bots are all reflex agents at their core.

## The Fundamental Limitation

Because reflex agents have no memory, they cannot handle situations that require knowing what happened previously. They also cannot plan ahead or adapt to changing conditions beyond what their rule set explicitly covers.
