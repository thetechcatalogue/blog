---
title: The Basic Toolbox
sidebar_position: 2
description: Building blocks, CAP theorem, and patterns for system design interviews.
tags: [system-design, fundamentals, patterns]
---

Design interviews are about choosing the right solution for the problem at hand based on accepted trade-offs. Most solutions are picked from a box of well-known building blocks. To choose well, you need to know what's in the box.

### Common Building Blocks

These are the categories you'll repeatedly draw from during interviews:

- **Services** — monoliths, microservices, serverless functions
- **Databases** — relational (SQL) vs. document/key-value (NoSQL), read/write throughput
- **Networks** — protocols (TCP, UDP, HTTP, gRPC, WebSocket), DNS, CDNs
- **Caches** — eviction policies, scale, sharding (Redis, Memcached)
- **Languages & Runtimes** — JVM, Node.js, Go, Python — know the trade-offs
- **Protocols** — REST, GraphQL, message queues (Kafka, RabbitMQ)
- **Security** — TLS, OAuth, API keys, encryption at rest
- **Operating Systems** — process management, threading, I/O models
- **Memory Management** — heap vs. stack, garbage collection, memory-mapped I/O
- **Data Structures** — hash maps, trees, tries, bloom filters
- **Messaging** — pub/sub, event streaming, dead-letter queues
- **Algorithms** — consistent hashing, rate limiting, load balancing strategies
- **Integration Patterns** — saga, CQRS, event sourcing, circuit breaker

### CAP Theorem

Always remember the CAP theorem: **Consistency**, **Availability**, and **Partition Tolerance**. In a distributed system you cannot avoid partition tolerance, so you must choose between:

- **CP** — consistency + partition tolerance (e.g., HBase, MongoDB with majority reads)
- **AP** — availability + partition tolerance (e.g., Cassandra, DynamoDB)

CA systems don't exist in practice for distributed deployments.

### Data Ingestion — The Most Common Focus Area

Most interview questions target the data ingestion pipeline. Keep these concerns in mind:

| Concern | Questions to Ask |
|---------|-----------------|
| Request shape | Single, buffered, or batch? |
| Timeouts | What's acceptable latency? What about the slowest 1%? |
| API design | REST? gRPC? WebSocket? |
| Retries | How does the client retry? How do you prevent retry storms? |
| Temporary storage | Where does data land before processing? |
| Deduplication | How do you handle duplicate messages? |
| Scaling | How do you scale a single service horizontally? |
| Database throughput | Read-heavy or write-heavy? Which DB type fits? |
| Processing model | Sync vs. async? Stream processing? |
| Fault tolerance | What happens when a component fails? |
| Error handling | How are errors surfaced and recovered from? |

### Client-Side Patterns

When implementing a client, consider:

1. **Blocking vs. non-blocking** — threads, async/await, event loops
2. **Buffering / batching** — group requests for efficiency (e.g., a logger client)
3. **Timeouts** — set request timeouts (rule of thumb: p99 latency of the target service)
4. **Retries** — beware of retry storms overloading the server
5. **Exponential backoff with jitter** — spread out retries to avoid thundering herd
6. **Circuit breaker** — stop calling a failing service and fail fast
