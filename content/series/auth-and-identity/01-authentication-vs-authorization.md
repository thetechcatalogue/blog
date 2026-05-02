---
title: "Authentication vs Authorization"
slug: "authentication-vs-authorization"
order: 1
narrationSrc: /audio/series/auth-and-identity/authentication-vs-authorization.mp3
contentType: "markdown"
description: "Who are you, and what are you allowed to do?"
audioDurationSec: 91.965
---

## Two Questions, Two Systems

Authentication answers identity. Authorization answers permissions. Mixing them together is one of the fastest ways to design a confusing security model.

## Authentication

Authentication proves a subject is who they claim to be. That may rely on passwords, passkeys, sessions, device trust, or identity providers.

## Authorization

Authorization determines access after identity is known. It decides which resources, actions, or scopes are available.

## Why Teams Confuse Them

Because both happen near login, many systems treat them as the same concern. They are not. Identity without permission is incomplete, and permission without trustworthy identity is unsafe.

## Summary

Authentication establishes identity. Authorization enforces allowed actions. Good systems keep those responsibilities distinct.
