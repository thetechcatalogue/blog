---
title: "Sessions, Cookies, and JWTs"
slug: "sessions-cookies-and-jwts"
order: 2
narrationSrc: /audio/series/auth-and-identity/sessions-cookies-and-jwts.mp3
contentType: "markdown"
description: "Stateful and stateless approaches for maintaining user identity"
audioDurationSec: 108.585
---

## Sessions vs Tokens

A session keeps identity state on the server. A token pushes signed identity data to the client. Neither is automatically better; each solves a different scaling and operational problem.

## Cookies

Cookies are just transport. They can carry a session identifier or a token. Security depends on flags like HttpOnly, Secure, and SameSite.

## JWTs

JWTs are useful when multiple services need to verify identity without a shared session store. They are less useful when teams start putting excessive mutable state into them.

## Operational Tradeoffs

Sessions simplify revocation. Tokens simplify distributed verification. Refresh strategies, rotation, and expiration policies matter more than the format alone.

## Summary

The right identity transport depends on trust boundaries, scaling model, and revocation needs. Avoid treating JWTs as a universal answer.
