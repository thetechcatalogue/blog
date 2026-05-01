---
title: "Protocols and Connection Patterns"
slug: "protocols-and-connection-patterns"
order: 4
contentType: "markdown"
description: "When to use request-response, streaming, pub-sub, and persistent connections"
---

## Protocols Encode Communication Style

HTTP, WebSockets, gRPC, queues, and event streams are not interchangeable. Each protocol family is optimized for different traffic and interaction patterns.

## Request-Response

This is the default pattern for most web apps and APIs. It is simple, observable, and works well when interactions are short and bounded.

## Persistent Connections

WebSockets and similar approaches make sense when the server must push updates continuously or maintain interactive state.

## Messaging and Eventing

Queues and pub-sub systems are better when work can be decoupled in time, scaled asynchronously, or processed by multiple consumers.

## Summary

Pick the communication pattern that matches the user experience and system behavior you need. Protocol selection is a product decision as much as a technical one.
