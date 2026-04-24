---
title: Software Development Lifecycle
sidebar_position: 2
description: Understanding the SDL and cross-cutting concerns for interviews.
tags: [interviews, fundamentals, patterns]
--- — Software Development Lifecycle

Understanding the software development lifecycle of your product is one of the most essential things you should know. It reflects how deeply you understand your product end-to-end. Many engineers focus only on the code they write and miss the bigger picture.

### Key Stages to Think About

When SDL questions come up in an interview, walk through each stage:

| Stage | What You Need |
|-------|---------------|
| **Plan** | Requirements documents, designs, specifications |
| **Code** | IDE, programming language, platform, collaborative code repository (e.g., Git) |
| **Build** | Build infrastructure — CI systems, artifact registries |
| **Deploy** | Deployment pipeline, infrastructure-as-code, release strategy |
| **Run** | Cloud or on-prem infrastructure to host services |
| **Monitor** | Observability — monitoring, logging, alerting |
| **Dependencies** | Third-party libraries, external services, SLAs |

### Cross-Cutting Concerns

For **every** stage above, consider these four dimensions:

- **Security** — Secure everything: code, dependencies, pipelines, infrastructure
- **Maintainability** — Can the team evolve this over time without pain?
- **Scale** — Will it handle 10x or 100x growth?
- **Reliability** — What happens when something fails?
