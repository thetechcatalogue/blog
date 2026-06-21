import type { ArchNode, ArchEdge } from "@/components/InteractiveDiagram";

export interface DiagramData {
  title: string;
  nodes: ArchNode[];
  edges: ArchEdge[];
}

const diagrams: Record<string, DiagramData> = {
  "request-flow": {
    title: "Basic Request Flow — From Client to Database",
    nodes: [
      { id: "client", label: "Client", icon: "💻", x: 300, y: 0, style: "primary",
        description: "The end-user's browser or mobile app. Initiates HTTP/HTTPS requests to your domain. Can be a web browser, mobile app, CLI tool, or third-party API consumer." },
      { id: "cdn", label: "CDN", icon: "🌐", x: 300, y: 100, style: "accent",
        description: "Content Delivery Network (e.g., CloudFront, Akamai). Caches static assets (JS, CSS, images) at edge locations worldwide. Reduces latency by serving content from the nearest PoP (Point of Presence)." },
      { id: "lb", label: "Load Balancer", icon: "⚖️", x: 300, y: 200, style: "accent",
        description: "Distributes incoming traffic across multiple server instances. Uses algorithms like Round Robin, Least Connections, or IP Hash. Performs health checks and removes unhealthy instances. Can terminate TLS/SSL." },
      { id: "srv1", label: "Service A", icon: "⚙️", x: 120, y: 320, style: "secondary",
        description: "Application server instance handling business logic. Stateless — stores no session data locally. Can be auto-scaled horizontally based on CPU/memory/request count. Processes requests, applies business rules, and coordinates with data stores." },
      { id: "srv2", label: "Service B", icon: "⚙️", x: 480, y: 320, style: "secondary",
        description: "Another service instance. In a microservices architecture, this might handle a different domain (e.g., payments vs. users). Can communicate with Service A via REST, gRPC, or async messaging." },
      { id: "cache", label: "Cache", icon: "⚡", x: 60, y: 450, style: "warning",
        description: "In-memory data store (Redis, Memcached). Stores frequently accessed data with sub-millisecond read latency. Cache-aside pattern: check cache → miss → read DB → populate cache. TTL-based expiration prevents stale data." },
      { id: "db", label: "Database", icon: "🗄️", x: 300, y: 450, style: "success",
        description: "Primary persistent storage (PostgreSQL, MySQL, MongoDB). Handles ACID transactions, complex queries, and data durability. Use read replicas for scaling reads. Consider sharding for horizontal write scaling." },
      { id: "queue", label: "Message Queue", icon: "📬", x: 540, y: 450, style: "warning",
        description: "Async messaging system (Kafka, RabbitMQ, SQS). Decouples producers from consumers. Handles background jobs, event-driven workflows, and inter-service communication. Provides retry logic and dead-letter queues." },
    ],
    edges: [
      { source: "client", target: "cdn", label: "HTTPS", animated: true },
      { source: "cdn", target: "lb", label: "Cache miss" },
      { source: "lb", target: "srv1", label: "Route", animated: true },
      { source: "lb", target: "srv2", label: "Route", animated: true },
      { source: "srv1", target: "cache", label: "Read/Write" },
      { source: "srv1", target: "db", label: "Query" },
      { source: "srv2", target: "db", label: "Query" },
      { source: "srv2", target: "queue", label: "Publish" },
      { source: "queue", target: "srv1", label: "Consume" },
    ],
  },

  "event-driven": {
    title: "Event-Driven Architecture — Mediator Topology",
    nodes: [
      { id: "producer1", label: "Order Service", icon: "🛒", x: 0, y: 0, style: "primary",
        description: "Handles order creation, updates, and cancellations. Publishes OrderCreated, OrderUpdated, OrderCancelled events. Owns the Orders table/collection. Validates inventory availability before confirming." },
      { id: "producer2", label: "User Service", icon: "👤", x: 0, y: 150, style: "primary",
        description: "Manages user accounts, profiles, and authentication. Publishes UserRegistered, ProfileUpdated events. Owns user data and handles identity federation (OAuth, SSO)." },
      { id: "mediator", label: "Event Mediator", icon: "🎛️", x: 250, y: 75, style: "accent",
        description: "Central orchestrator that receives all events and routes them to appropriate processors. Unlike a simple broker, the mediator understands workflow steps and can coordinate complex multi-step processes. Example: Saga pattern for distributed transactions." },
      { id: "processor1", label: "Payment Processor", icon: "💳", x: 520, y: 0, style: "success",
        description: "Handles payment processing, refunds, and billing. Subscribes to OrderCreated events. Integrates with Stripe/PayPal. Publishes PaymentCompleted or PaymentFailed events back to the mediator." },
      { id: "processor2", label: "Notification Service", icon: "🔔", x: 520, y: 75, style: "warning",
        description: "Sends emails, push notifications, and SMS. Subscribes to multiple event types. Uses templates for each notification type. Handles delivery retries and provider failover." },
      { id: "processor3", label: "Analytics Service", icon: "📊", x: 520, y: 150, style: "secondary",
        description: "Processes events for business intelligence and reporting. Stores events in a data warehouse (BigQuery, Redshift). Runs aggregations for dashboards. Eventually consistent — doesn't block the main flow." },
    ],
    edges: [
      { source: "producer1", target: "mediator", label: "OrderCreated", animated: true },
      { source: "producer2", target: "mediator", label: "UserRegistered", animated: true },
      { source: "mediator", target: "processor1", label: "Process payment" },
      { source: "mediator", target: "processor2", label: "Send notification" },
      { source: "mediator", target: "processor3", label: "Track event" },
      { source: "processor1", target: "mediator", label: "PaymentResult" },
    ],
  },

  "microservices": {
    title: "Microservices Architecture — API Gateway Pattern",
    nodes: [
      { id: "client", label: "Client Apps", icon: "📱", x: 250, y: 0, style: "primary",
        description: "Web browser, mobile apps, or third-party API consumers. Each may need different data formats or subsets. The API Gateway abstracts the internal service topology from clients." },
      { id: "gateway", label: "API Gateway", icon: "🚪", x: 250, y: 100, style: "accent",
        description: "Single entry point for all client requests (Kong, AWS API Gateway, Nginx). Handles authentication, rate limiting, request routing, response aggregation, and protocol translation. Can implement BFF (Backend for Frontend) pattern." },
      { id: "auth", label: "Auth Service", icon: "🔐", x: 0, y: 220, style: "warning",
        description: "Handles JWT issuance, token refresh, OAuth flows, and RBAC. Validates every request via the API Gateway. Stores credentials securely (bcrypt hashing). Issues short-lived access tokens + long-lived refresh tokens." },
      { id: "users", label: "User Service", icon: "👥", x: 170, y: 220, style: "secondary",
        description: "CRUD operations for user profiles. Owns the users database. Exposes REST/gRPC endpoints. Publishes user lifecycle events. Handles data privacy (GDPR deletion)." },
      { id: "products", label: "Product Service", icon: "📦", x: 330, y: 220, style: "secondary",
        description: "Manages product catalog, pricing, and inventory. Owns the products database. Handles search/filter via Elasticsearch integration. Publishes inventory change events." },
      { id: "orders", label: "Order Service", icon: "🧾", x: 500, y: 220, style: "secondary",
        description: "Processes order lifecycle. Orchestrates saga across Payment, Inventory, and Shipping. Owns the orders database. Implements idempotency keys to prevent duplicate orders." },
      { id: "bus", label: "Event Bus", icon: "📡", x: 250, y: 350, style: "accent",
        description: "Async communication backbone (Kafka, RabbitMQ). Enables loose coupling between services. Supports pub/sub and point-to-point patterns. Provides event replay for new consumer onboarding." },
    ],
    edges: [
      { source: "client", target: "gateway", label: "HTTPS", animated: true },
      { source: "gateway", target: "auth", label: "Verify token" },
      { source: "gateway", target: "users", label: "Route" },
      { source: "gateway", target: "products", label: "Route" },
      { source: "gateway", target: "orders", label: "Route" },
      { source: "users", target: "bus", label: "Events" },
      { source: "products", target: "bus", label: "Events" },
      { source: "orders", target: "bus", label: "Events" },
      { source: "bus", target: "users", label: "Subscribe" },
      { source: "bus", target: "orders", label: "Subscribe" },
    ],
  },

  "a2a-orchestration": {
    title: "A2A Orchestration - Supervisor and Specialist Loop",
    nodes: [
      { id: "user", label: "User", icon: "🧑", x: 260, y: 0, style: "primary", description: "Initiates a multi-step request that requires planning, specialized work, and validation." },
      { id: "supervisor", label: "Supervisor", icon: "🧠", x: 260, y: 110, style: "accent", description: "Owns routing, retries, and final decision-making. Keeps the protocol state machine consistent." },
      { id: "research", label: "Research Agent", icon: "🔎", x: 40, y: 250, style: "secondary", description: "Collects and summarizes evidence from retrieval and web/document sources." },
      { id: "coding", label: "Coding Agent", icon: "💻", x: 260, y: 250, style: "secondary", description: "Implements or modifies code artifacts based on constrained objective and policy context." },
      { id: "analysis", label: "Analysis Agent", icon: "📊", x: 480, y: 250, style: "secondary", description: "Produces structured diagnostics, risk notes, and recommendation tradeoffs." },
      { id: "reviewer", label: "Reviewer", icon: "✅", x: 260, y: 380, style: "success", description: "Validates schema, checks confidence/citations, and flags quality issues before accept." },
      { id: "fallback", label: "Fallback", icon: "🛟", x: 60, y: 500, style: "warning", description: "Deterministic fallback workflow used when retries are exhausted or confidence is low." },
      { id: "output", label: "Final Response", icon: "📦", x: 460, y: 500, style: "primary", description: "Final merged output with trace metadata, validation status, and next-step hint." },
    ],
    edges: [
      { source: "user", target: "supervisor", label: "Objective", animated: true },
      { source: "supervisor", target: "research", label: "Assign" },
      { source: "supervisor", target: "coding", label: "Assign" },
      { source: "supervisor", target: "analysis", label: "Assign" },
      { source: "research", target: "reviewer", label: "Submit" },
      { source: "coding", target: "reviewer", label: "Submit" },
      { source: "analysis", target: "reviewer", label: "Submit" },
      { source: "reviewer", target: "supervisor", label: "Validation" },
      { source: "supervisor", target: "fallback", label: "Retry exhausted" },
      { source: "supervisor", target: "output", label: "Accept" },
      { source: "fallback", target: "output", label: "Safe output" },
    ],
  },

  "vibe-reliability-loop": {
    title: "Reliable AI Coding Loop - From Prompt to Production",
    nodes: [
      { id: "criteria", label: "Acceptance Criteria", icon: "🧾", x: 260, y: 0, style: "primary", description: "Defines behavior, risks, and constraints before generation starts." },
      { id: "gen", label: "AI Generation", icon: "🤖", x: 260, y: 105, style: "accent", description: "Produces implementation draft and test scaffolding from explicit requirements." },
      { id: "static", label: "Static + Type Checks", icon: "🧪", x: 260, y: 210, style: "secondary", description: "Fast deterministic validation for syntax, types, and dependency policy issues." },
      { id: "tests", label: "Tests + Contracts", icon: "🧰", x: 260, y: 315, style: "secondary", description: "Runs unit, integration, and contract tests to confirm expected behavior." },
      { id: "review", label: "Risk Review", icon: "👀", x: 80, y: 430, style: "warning", description: "Risk-based human review with deeper scrutiny on high-blast-radius changes." },
      { id: "canary", label: "Canary Release", icon: "🚦", x: 440, y: 430, style: "success", description: "Progressive rollout with rollback triggers tied to SLO/alert conditions." },
      { id: "monitor", label: "Prod Monitoring", icon: "📈", x: 260, y: 545, style: "accent", description: "Tracks regressions, reliability metrics, and incident-linked defects." },
    ],
    edges: [
      { source: "criteria", target: "gen", label: "Spec", animated: true },
      { source: "gen", target: "static", label: "Draft" },
      { source: "static", target: "tests", label: "Pass checks" },
      { source: "tests", target: "review", label: "Needs approval" },
      { source: "review", target: "canary", label: "Approved" },
      { source: "canary", target: "monitor", label: "Deploy" },
      { source: "monitor", target: "criteria", label: "Feedback", animated: true },
    ],
  },

  "context-assembly-router": {
    title: "Context Assembly Router - Beyond Basic RAG",
    nodes: [
      { id: "intent", label: "User Intent", icon: "🎯", x: 250, y: 0, style: "primary", description: "Current objective and output format constraints from the user request." },
      { id: "policy", label: "Policy Block", icon: "🛡️", x: 40, y: 130, style: "warning", description: "Immutable system policies, safety rules, and action constraints." },
      { id: "retrieval", label: "Retrieved Evidence", icon: "📚", x: 250, y: 130, style: "secondary", description: "Top ranked knowledge chunks with source metadata and citation IDs." },
      { id: "memory", label: "Session Memory", icon: "🧠", x: 460, y: 130, style: "secondary", description: "Filtered user/session context after recency and relevance scoring." },
      { id: "tools", label: "Tool Results", icon: "🔧", x: 250, y: 245, style: "accent", description: "Structured outputs from calculators, APIs, or databases." },
      { id: "router", label: "Context Router", icon: "🧭", x: 250, y: 360, style: "accent", description: "Scores, deduplicates, and budgets context blocks before assembly." },
      { id: "llm", label: "LLM", icon: "🗣️", x: 120, y: 485, style: "primary", description: "Generates response from assembled context and output schema constraints." },
      { id: "validator", label: "Citation Validator", icon: "✔️", x: 380, y: 485, style: "success", description: "Checks claim grounding, citation presence, and policy compliance." },
    ],
    edges: [
      { source: "intent", target: "retrieval", label: "Query" },
      { source: "intent", target: "memory", label: "Select" },
      { source: "intent", target: "tools", label: "Plan" },
      { source: "policy", target: "router", label: "Rules" },
      { source: "retrieval", target: "router", label: "Evidence" },
      { source: "memory", target: "router", label: "History" },
      { source: "tools", target: "router", label: "Outputs" },
      { source: "router", target: "llm", label: "Assembled context", animated: true },
      { source: "llm", target: "validator", label: "Draft response" },
    ],
  },

  "agent-security-redteam-loop": {
    title: "Agent Security Red Team Loop - Attack and Defense",
    nodes: [
      { id: "adversary", label: "Adversarial Input", icon: "⚠️", x: 30, y: 120, style: "warning", description: "Untrusted prompts, files, pages, or encoded payloads designed to bypass safeguards." },
      { id: "planner", label: "Agent Planner", icon: "🧠", x: 240, y: 120, style: "accent", description: "Reasoning layer that can be influenced by malicious context if not protected." },
      { id: "gateway", label: "Tool Gateway", icon: "🚪", x: 450, y: 120, style: "secondary", description: "Enforces allow-lists, argument schemas, and action-level authorization checks." },
      { id: "data", label: "Data Systems", icon: "🗄️", x: 660, y: 120, style: "secondary", description: "Internal systems and stores that require strict tenant and policy boundaries." },
      { id: "output", label: "Response Filter", icon: "🧹", x: 450, y: 280, style: "success", description: "Post-generation scanning for leakage, policy violations, and unsafe action hints." },
      { id: "suite", label: "Red Team Suite", icon: "🧪", x: 240, y: 280, style: "accent", description: "Automated adversarial test harness with regression tracking over releases." },
      { id: "metrics", label: "Security Metrics", icon: "📉", x: 240, y: 430, style: "primary", description: "Injection resilience, unsafe-call block rate, leak rate, and patch latency trends." },
      { id: "policy", label: "Policy Updates", icon: "🔒", x: 450, y: 430, style: "primary", description: "Rapid policy iteration and control hardening based on red-team findings." },
    ],
    edges: [
      { source: "adversary", target: "planner", label: "Injection attempt", animated: true },
      { source: "planner", target: "gateway", label: "Tool request" },
      { source: "gateway", target: "data", label: "Controlled access" },
      { source: "data", target: "output", label: "Results" },
      { source: "planner", target: "output", label: "Response draft" },
      { source: "output", target: "suite", label: "Findings" },
      { source: "suite", target: "metrics", label: "Pass/Fail" },
      { source: "metrics", target: "policy", label: "Gaps" },
      { source: "policy", target: "gateway", label: "Harden controls", animated: true },
      { source: "policy", target: "planner", label: "Updated rules", animated: true },
    ],
  },

  "ai-gateway-llm-apps": {
    title: "AI Gateway Pattern - Control Plane for LLM Apps",
    nodes: [
      { id: "clients", label: "Clients", icon: "💬", x: 260, y: 0, style: "primary", description: "Web apps, mobile clients, internal tools, and API consumers that send prompts and tool requests." },
      { id: "gateway", label: "AI Gateway", icon: "🚪", x: 260, y: 110, style: "accent", description: "Central entry point that authenticates requests, applies policy, enforces budgets, and routes traffic to the right model or tool path." },
      { id: "auth", label: "Auth + Policy", icon: "🛡️", x: 20, y: 250, style: "warning", description: "Validates tenant identity, scopes, model permissions, and action policies before any expensive model call happens." },
      { id: "cache", label: "Prompt Cache", icon: "⚡", x: 180, y: 250, style: "success", description: "Handles exact-match or semantic caching to reduce cost and latency for repeated prompts and stable system contexts." },
      { id: "router", label: "Model Router", icon: "🧭", x: 340, y: 250, style: "accent", description: "Chooses model tier based on task type, latency budget, quality requirement, and fallback rules." },
      { id: "obs", label: "Observability", icon: "📈", x: 500, y: 250, style: "secondary", description: "Captures traces, token usage, latency, cache hit rate, and policy outcomes for debugging and optimization." },
      { id: "small", label: "Fast Model", icon: "🏎️", x: 120, y: 400, style: "secondary", description: "Low-latency, low-cost model for classification, extraction, and lightweight agent steps." },
      { id: "large", label: "Reasoning Model", icon: "🧠", x: 300, y: 400, style: "primary", description: "Higher-cost, higher-quality model reserved for harder reasoning, planning, and long-context tasks." },
      { id: "tools", label: "Tools and Retrieval", icon: "🔧", x: 480, y: 400, style: "secondary", description: "Optional tool, retrieval, and database path coordinated behind the gateway for controlled external actions." },
      { id: "response", label: "Final Response", icon: "📦", x: 260, y: 535, style: "primary", description: "Response returned to the app with trace metadata, cost data, and policy-compliant output shaping." },
    ],
    edges: [
      { source: "clients", target: "gateway", label: "Prompt", animated: true },
      { source: "gateway", target: "auth", label: "Verify" },
      { source: "gateway", target: "cache", label: "Check cache" },
      { source: "gateway", target: "router", label: "Route" },
      { source: "gateway", target: "obs", label: "Trace" },
      { source: "router", target: "small", label: "Fast path" },
      { source: "router", target: "large", label: "Deep path" },
      { source: "router", target: "tools", label: "Tool path" },
      { source: "small", target: "response", label: "Result" },
      { source: "large", target: "response", label: "Result" },
      { source: "tools", target: "response", label: "Result" },
    ],
  },
};

export function getDiagram(name: string): DiagramData | undefined {
  return diagrams[name];
}

export function getAllDiagramNames(): string[] {
  return Object.keys(diagrams);
}
