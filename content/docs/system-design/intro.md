---
title: Understanding System Design Interviews
sidebar_position: 1
description: Fundamentals and interview mindset for system design.
---

Architecture is one of the most used — and most misunderstood — terms in software engineering. A system can contain multiple architectures, and a good architecture always has the flexibility to evolve. There is no single way to define or represent a system; architecture is a *view* that changes over the system's lifetime.

Most cloud architecture and design principles borrow ideas from operating systems and low-level system design: thread pools, retries, caching, and more. It is more useful to understand the **concepts** rather than just the names that frequently appear in developer conversations.

"Enterprise application" doesn't necessarily mean a very large application — it means a system that helps an enterprise be productive and achieve its business goals.

### Why System Design Matters

System design is a crucial aspect of software development that involves designing the architecture and components of a system to meet specific requirements. It encompasses scalability, reliability, performance, and security. By carefully considering these factors, designers can create robust and efficient solutions that handle large amounts of data and user traffic.

A system design for an online retailer like Amazon will look very different from a video streaming service like Netflix or a photo-sharing service like Instagram. But the fundamental considerations — reliability, scale, performance — remain the same across all of them.

### Everything Is Correlated

The performance of a single container can impact the overall latency of your entire cloud. Different engineers will look at different points of latency:

- A **cloud developer or architect** might reach for scaling, load balancing, or caching.
- A **systems engineer** might ask to replace NIC interfaces with higher-bandwidth ones, add cores, or upgrade edge routers.

The key insight: making a system better requires analyzing **every** point of possible improvement.

### What We'll Cover

In this section we explore the fundamentals of system design and dive into strategies and techniques for designing scalable, reliable systems. We'll look at popular design questions, more specific problems, and how to prepare yourself for tackling them.

Individual design choices depend on many factors — no "best" design can be declared based on a few data points. Only after a longer run, with enough analytical data in hand, can a design be evaluated for its particular aspects.

### The Interview Mindset

When you step into a design interview, realize that you are there to **find the solution that is needed**, not to recite a solution you already know.

The only way to achieve this:

1. Understand the problem space
2. Ask clarifying questions instead of making assumptions
3. Define key constraints and boundaries
4. Consider different options
5. Think about key aspects of the design
6. Suggest a solution that works
7. Refine and improve

We'll talk about strategies that help you organize your interview process into a clear, logical flow.
