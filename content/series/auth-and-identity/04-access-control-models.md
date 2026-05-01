---
title: "Access Control Models"
slug: "access-control-models"
order: 4
contentType: "markdown"
description: "RBAC, ABAC, scopes, and policy-driven authorization"
---

## Authorization Models Encode Policy

Once identity is established, the next question is how permissions are represented. This is where access control models matter.

## RBAC

Role-based access control assigns permissions to roles, then roles to users. It is simple and works well until role sprawl starts to hide real policy intent.

## ABAC

Attribute-based access control evaluates properties such as department, tenant, region, or resource sensitivity. It is flexible, but more complex to reason about.

## Scopes and Claims

API systems often express permissions as scopes or claims inside tokens. That works well for delegated access, but still requires clear policy interpretation at the service boundary.

## Policy Engines

As systems grow, teams often centralize authorization logic in a policy engine or shared service so rules stay consistent across applications.

## Summary

Choose the simplest authorization model that matches your system boundaries. Complexity in policy design compounds quickly.
