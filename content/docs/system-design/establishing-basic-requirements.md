---
title: Establishing Basic Requirements
sidebar_position: 3
tags: [system-design, basic-design]
description: Techniques for organizing your interview and establishing requirements.
---

At every moment in an interview you will need to make a choice. To make good choices, adopt techniques that organize your interview into logical sections.

### The Flow

1. Understand the Problem
2. Ask Clarifying Questions
3. Define Key Constraints and Boundaries
4. Understand the User and Consumer
5. Suggest a Solution That Works
6. Refine or Improve

### Decision Matrix

A decision matrix is a visual comparison of how alternatives stack up against each other. Use it to qualify design alternatives so a decision can be made.

**When to use:**
- Compare patterns, technologies, or frameworks
- Visualize relative strengths and weaknesses
- Focus attention on essential factors
- Facilitate open discussion about trade-offs

### Scenario Walkthrough

Describe step-by-step how the architecture addresses a specific quality attribute scenario. Walkthroughs are most applicable early in the life of a system, before its behavior can be observed directly.

A scenario walkthrough is like telling a story about the architecture. Pick a quality attribute scenario and describe what the system would do in response to the stimulus.

**Benefits:**
- Assess the architecture design early, even while it's still on paper
- Identify different concerns in the architecture
- Reason about how the architecture will respond to stimuli
- Qualify the design — walkthroughs are not strict pass/fail

### Distribution Strategy

This is the most impactful strategy — and the one most often misunderstood. Many engineers jump to distributing by class, then bolt on load balancing after the fact.

Remote calls are expensive compared to local calls. If you base your distribution strategy on individual classes, you'll end up with too many remote calls and awkward, coarse-grained interfaces.

#### The Better Approach: Clustering

In most cases, put all the classes into a **single process** and run multiple copies on different nodes:

- Each process uses **local calls** internally (fast)
- You keep **fine-grained interfaces** for better maintainability
- You scale horizontally by adding more copies of the process
