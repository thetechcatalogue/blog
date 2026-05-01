---
title: "How Requests Travel"
slug: "how-requests-travel"
order: 1
contentType: "markdown"
description: "From browser intent to server response"
---

## A Request Is a Journey

A network request looks instant in code, but the actual path includes DNS resolution, connection setup, transport behavior, routing, application processing, and the return path.

## Client Side Work

Before a request leaves the device, the browser or app may resolve a hostname, reuse or open a connection, attach headers, and prepare payload data.

## Network Path

Routers, load balancers, proxies, CDNs, and firewalls may all touch the request before it reaches the service that will process it.

## Server Side Work

The server parses the request, enforces auth, executes business logic, queries dependencies, and serializes a response back to the client.

## Summary

Every request travels through multiple layers. Performance and reliability problems usually come from the interaction between those layers, not from one line of application code.
