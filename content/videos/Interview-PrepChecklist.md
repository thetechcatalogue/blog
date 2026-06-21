---
title: Interview Prep Checklist
slug: interview-prep-checklist
description: Architecture and communication checklists for interview scenarios
accentClass: bg-indigo-600 hover:bg-indigo-500
category: engineering
order: 30
narrationSrc: /audio/videos/interview-prep-checklist.mp3
audioDurationSec: 291.945
---

## The Interview Prep Framework

Most engineers study hard but prepare randomly. A structured checklist turns scattered review into a repeatable system that covers fundamentals, coding, system design, and communication.

> **Key Takeaway**: Preparation is not about memorizing answers. It is about building mental models you can apply to any question under pressure.

## Decision Matrix

A decision matrix helps you compare design alternatives visually so you can qualify trade-offs instead of guessing.

| When to Use | When to Skip |
|---|---|
| Comparing patterns, technologies, or frameworks | Only one viable option exists |
| Visualizing relative strengths and weaknesses | Decision is already made |
| Facilitating open discussion about trade-offs | Low-stakes tooling choice |
| Documenting design rationale for reviewers | Prototype or throwaway code |

## Sequence Diagrams

Sequence diagrams are one of the most practical communication tools in architecture interviews.

- Simple and flexible notation that interviewers understand immediately
- Both graphical and text notations exist
- Useful for communication and reasoning about component interactions
- Ample tool support, though whiteboard sketches work fine

## Scenario Walkthrough

Describe step-by-step how the architecture addresses a specific quality attribute scenario. Pick a quality attribute and tell a story about how the system responds.

> A scenario walkthrough is like telling a story about the architecture. Show how the quality attribute is promoted or inhibited by the system, and qualify the design rather than treating it as pass or fail.
> — Software Architecture in Practice

## Preparation Tracks

1. Master OS, networking, and memory fundamentals first
2. Build language-specific coding fluency with daily practice
3. Study major algorithms and solve problems using each one
4. Learn design patterns, SOLID principles, and protocol trade-offs
5. Practice system design problems end-to-end with time limits
6. Review cloud platform basics for your target environment

## General Topics

- OS concepts: processes, threads, scheduling, file systems
- Networking: TCP/IP, DNS, HTTP, TLS, load balancing
- Language-specific coding patterns and idioms
- Memory concepts: stack vs heap, garbage collection, caching
- Virtualization: containers, hypervisors, isolation models

## DSA and Coding

- Major algorithm families: sorting, searching, graphs, dynamic programming
- Practice problems mapped to each algorithm type
- Comparative analysis: time and space complexity trade-offs

## Programming and Application Development

| Fundamentals | Applied Skills |
|---|---|
| OOP concepts and inheritance models | Implementing LRU cache from scratch |
| Design patterns and SOLID principles | Building thread-safe data structures |
| REST, gRPC, SOAP protocol trade-offs | Lock-free programming patterns |
| Error handling and defensive coding | API versioning and contract design |

## System Design

- Databases, servers, caches, and networking layers
- Cloud design patterns: retry, circuit breaker, bulkhead, CQRS
- Protocols used in distributed systems
- Algorithms behind real cloud solutions: consistent hashing, Raft, Paxos
- Kubernetes, VMs, containers, and orchestration
- CI/CD pipelines and deployment strategies
- Security, authentication, and authorization patterns
- Scaling, maintainability, and observability

## Cloud Platform Knowledge

- Azure, AWS, GCP, or your target cloud provider
- Core services: compute, storage, networking, identity
- Managed databases, message queues, and serverless options
- Cost optimization and region selection basics

> **Key Takeaway**: You do not need to know every cloud service. Know the core categories, understand one provider deeply, and be able to reason about trade-offs across providers.
