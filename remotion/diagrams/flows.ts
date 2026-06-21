import type { FlowConfig } from "./types";
import { getEntityColor, getEntityEmojiIcon } from "../designTokens";

type ActorId = FlowConfig["actors"][number]["id"];

const ACTOR_ENTITY_MAP: Record<ActorId, string> = {
  client: "client",
  server: "server",
  db: "database",
  cache: "cache",
  cdn: "http",
  lb: "loadbalancer",
};

const actorColor = (id: ActorId, fallback: string) =>
  getEntityColor(ACTOR_ENTITY_MAP[id], "primary") || fallback;

const actorEmoji = (id: ActorId, fallback: string) =>
  getEntityEmojiIcon(ACTOR_ENTITY_MAP[id], fallback);

// ─────────────────────────────────────────────────────────────────────────────
// HTTP Request Lifecycle
// ─────────────────────────────────────────────────────────────────────────────
export const httpRequestFlow: FlowConfig = {
  title: "HTTP Request Lifecycle",
  subtitle: "What happens when you type a URL in the browser?",
  actors: [
    { id: "client", entityId: ACTOR_ENTITY_MAP.client, label: "Browser",        icon: actorEmoji("client", "🌐"), color: actorColor("client", "#60a5fa") },
    { id: "cdn",    entityId: ACTOR_ENTITY_MAP.cdn,    label: "DNS / CDN",      icon: actorEmoji("cdn",    "🗺️"), color: actorColor("cdn",    "#f59e0b") },
    { id: "lb",     entityId: ACTOR_ENTITY_MAP.lb,     label: "Load Balancer",  icon: actorEmoji("lb",     "⚖️"), color: actorColor("lb",     "#a78bfa") },
    { id: "server", entityId: ACTOR_ENTITY_MAP.server, label: "Server",         icon: actorEmoji("server", "🖥️"), color: actorColor("server", "#34d399") },
    { id: "db",     entityId: ACTOR_ENTITY_MAP.db,     label: "Database",       icon: actorEmoji("db",     "🗄️"), color: actorColor("db",     "#f472b6") },
  ],
  steps: [
    { from: "client", to: "cdn",    label: "DNS Lookup",        sublabel: "Resolve domain → IP address",  color: actorColor("client", "#60a5fa") },
    { from: "cdn",    to: "client", label: "IP Address",        sublabel: "93.184.216.34",                color: actorColor("cdn",    "#f59e0b") },
    { from: "client", to: "lb",     label: "TCP + TLS Handshake", sublabel: "Establish secure connection", color: actorColor("client", "#60a5fa") },
    { from: "lb",     to: "server", label: "Route Request",     sublabel: "Forward to healthy server",    color: actorColor("lb",     "#a78bfa") },
    { from: "server", to: "db",     label: "Query Data",        sublabel: "SELECT * FROM users WHERE ...", color: actorColor("server", "#34d399") },
    { from: "db",     to: "server", label: "Result Set",        sublabel: "200 rows returned",             color: actorColor("db",     "#f472b6") },
    { from: "server", to: "lb",     label: "HTTP Response",     sublabel: "200 OK + JSON body",            color: actorColor("server", "#34d399") },
    { from: "lb",     to: "client", label: "Response",          sublabel: "Render HTML / parse JSON",     color: actorColor("lb",     "#a78bfa") },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// API Auth Flow (JWT)
// ─────────────────────────────────────────────────────────────────────────────
export const apiAuthFlow: FlowConfig = {
  title: "API Authentication Flow",
  subtitle: "JWT-based auth with refresh tokens",
  actors: [
    { id: "client", entityId: ACTOR_ENTITY_MAP.client, label: "Client App",   icon: actorEmoji("client", "📱"), color: actorColor("client", "#60a5fa") },
    { id: "server", entityId: ACTOR_ENTITY_MAP.server, label: "Auth Server",  icon: actorEmoji("server", "🔐"), color: actorColor("server", "#34d399") },
    { id: "db",     entityId: ACTOR_ENTITY_MAP.db,     label: "User DB",      icon: actorEmoji("db",     "🗄️"), color: actorColor("db",     "#f472b6") },
    { id: "cache",  entityId: ACTOR_ENTITY_MAP.cache,  label: "Token Store",  icon: actorEmoji("cache",  "⚡"), color: actorColor("cache",  "#f59e0b") },
  ],
  steps: [
    { from: "client", to: "server", label: "POST /login",          sublabel: "email + password",            color: actorColor("client", "#60a5fa") },
    { from: "server", to: "db",     label: "Verify Credentials",   sublabel: "bcrypt.compare()",            color: actorColor("server", "#34d399") },
    { from: "db",     to: "server", label: "User Found ✓",         sublabel: "user_id: 42",                 color: actorColor("db",     "#f472b6") },
    { from: "server", to: "cache",  label: "Store Refresh Token",  sublabel: "SET token:42 → TTL 7d",       color: actorColor("server", "#34d399") },
    { from: "server", to: "client", label: "JWT + Refresh Token",  sublabel: "access_token expires in 15m", color: actorColor("server", "#34d399") },
    { from: "client", to: "server", label: "GET /api/data",        sublabel: "Authorization: Bearer <jwt>", color: actorColor("client", "#60a5fa") },
    { from: "server", to: "client", label: "200 OK + Data",        sublabel: "Token verified via signature", color: actorColor("server", "#34d399") },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// SQL Query Lifecycle  (used by databases series — episode 3)
// ─────────────────────────────────────────────────────────────────────────────
export const sqlQueryFlow: FlowConfig = {
  title: "SQL Query Lifecycle",
  subtitle: "How a query travels from browser to PostgreSQL and back",
  actors: [
    { id: "client", entityId: ACTOR_ENTITY_MAP.client, label: "Browser",      icon: actorEmoji("client", "🌐"), color: actorColor("client", "#60a5fa") },
    { id: "server", entityId: ACTOR_ENTITY_MAP.server, label: "API Server",   icon: actorEmoji("server", "🖥️"), color: actorColor("server", "#34d399") },
    { id: "cache",  entityId: ACTOR_ENTITY_MAP.cache,  label: "Query Cache",  icon: actorEmoji("cache",  "⚡"), color: actorColor("cache",  "#f59e0b") },
    { id: "db",     entityId: ACTOR_ENTITY_MAP.db,     label: "PostgreSQL",   icon: actorEmoji("db",     "🗄️"), color: actorColor("db",     "#336791") },
  ],
  steps: [
    { from: "client", to: "server", label: "GET /api/users",       sublabel: "HTTP request with auth header",       color: actorColor("client", "#60a5fa") },
    { from: "server", to: "cache",  label: "Cache Lookup",         sublabel: "key: users:list",                     color: actorColor("server", "#34d399") },
    { from: "cache",  to: "server", label: "Cache Miss",           sublabel: "key not found — go to DB",            color: actorColor("cache",  "#f59e0b") },
    { from: "server", to: "db",     label: "SELECT * FROM users",  sublabel: "parameterized prepared statement",    color: actorColor("server", "#34d399") },
    { from: "db",     to: "server", label: "Result Set",           sublabel: "42 rows · 3ms",                       color: actorColor("db",     "#336791") },
    { from: "server", to: "cache",  label: "Cache Store",          sublabel: "SET users:list TTL 60s",              color: actorColor("server", "#34d399") },
    { from: "server", to: "client", label: "200 OK + JSON",        sublabel: "gzip · 42 records",                   color: actorColor("server", "#34d399") },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Incident Triage Flow
// ─────────────────────────────────────────────────────────────────────────────
export const incidentTriageFlow: FlowConfig = {
  title: "Incident Triage Flow",
  subtitle: "How on-call responds from alert to stabilized service",
  actors: [
    { id: "client", entityId: ACTOR_ENTITY_MAP.client, label: "Monitoring",        icon: actorEmoji("client", "📟"), color: actorColor("client", "#60a5fa") },
    { id: "server", entityId: ACTOR_ENTITY_MAP.server, label: "On-Call Engineer",  icon: actorEmoji("server", "🧑‍💻"), color: actorColor("server", "#34d399") },
    { id: "cache", entityId: ACTOR_ENTITY_MAP.cache, label: "Runbook",            icon: actorEmoji("cache", "📘"), color: actorColor("cache", "#f59e0b") },
    { id: "db", entityId: ACTOR_ENTITY_MAP.db, label: "Service",                  icon: actorEmoji("db", "🧩"), color: actorColor("db", "#f472b6") },
  ],
  steps: [
    { from: "client", to: "server", label: "Page Triggered",      sublabel: "Error budget burn-rate alert",        color: actorColor("client", "#60a5fa") },
    { from: "server", to: "cache", label: "Open Runbook",         sublabel: "Check severity and first-response steps", color: actorColor("server", "#34d399") },
    { from: "server", to: "db", label: "Validate User Impact",     sublabel: "Reproduce with customer-facing checks", color: actorColor("server", "#34d399") },
    { from: "db", to: "server", label: "Identify Blast Radius",    sublabel: "One region, one endpoint, one tenant", color: actorColor("db", "#f472b6") },
    { from: "server", to: "db", label: "Apply Mitigation",         sublabel: "Rate-limit, failover, feature-flag off", color: actorColor("server", "#34d399") },
    { from: "db", to: "client", label: "Service Stabilized",       sublabel: "Errors down, latency recovering",        color: actorColor("db", "#f472b6") },
    { from: "server", to: "cache", label: "Record Follow-ups",     sublabel: "Postmortem + action items",             color: actorColor("server", "#34d399") },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Safe Deployment and Rollback Flow
// ─────────────────────────────────────────────────────────────────────────────
export const safeDeploymentRollbackFlow: FlowConfig = {
  title: "Safe Deployment and Rollback",
  subtitle: "Canary release with automated health checks and fast rollback",
  actors: [
    { id: "client", entityId: ACTOR_ENTITY_MAP.client, label: "CI/CD",             icon: actorEmoji("client", "🚀"), color: actorColor("client", "#60a5fa") },
    { id: "lb", entityId: ACTOR_ENTITY_MAP.lb, label: "Traffic Router",            icon: actorEmoji("lb", "⚖️"), color: actorColor("lb", "#a78bfa") },
    { id: "server", entityId: ACTOR_ENTITY_MAP.server, label: "Canary Service",    icon: actorEmoji("server", "🧪"), color: actorColor("server", "#34d399") },
    { id: "db", entityId: ACTOR_ENTITY_MAP.db, label: "Metrics + Logs",            icon: actorEmoji("db", "📊"), color: actorColor("db", "#f472b6") },
  ],
  steps: [
    { from: "client", to: "lb", label: "Start Canary",            sublabel: "Deploy vNext to 5% traffic",              color: actorColor("client", "#60a5fa") },
    { from: "lb", to: "server", label: "Route Sample Traffic",    sublabel: "User sessions to canary",                 color: actorColor("lb", "#a78bfa") },
    { from: "server", to: "db", label: "Emit Health Metrics",     sublabel: "Error rate, latency, saturation",        color: actorColor("server", "#34d399") },
    { from: "db", to: "client", label: "Policy Check",            sublabel: "Compare against SLO guardrails",          color: actorColor("db", "#f472b6") },
    { from: "client", to: "lb", label: "Decision",                sublabel: "Promote to 100% or trigger rollback",    color: actorColor("client", "#60a5fa") },
    { from: "lb", to: "server", label: "Rollback if Needed",      sublabel: "Re-route to stable version",             color: actorColor("lb", "#a78bfa") },
    { from: "server", to: "db", label: "Confirm Recovery",        sublabel: "Metrics return to baseline",             color: actorColor("server", "#34d399") },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// RAG Evaluation and Quality Scoring
// ─────────────────────────────────────────────────────────────────────────────
export const ragEvaluationFlow: FlowConfig = {
  title: "RAG Evaluation and Quality Scoring",
  subtitle: "How test cases, scoring, and review loops improve retrieval quality",
  actors: [
    { id: "client", entityId: ACTOR_ENTITY_MAP.client, label: "Eval Dataset", icon: actorEmoji("client", "🧪"), color: actorColor("client", "#60a5fa") },
    { id: "cdn", entityId: ACTOR_ENTITY_MAP.cdn, label: "Test Harness", icon: actorEmoji("cdn", "🧵"), color: actorColor("cdn", "#f59e0b") },
    { id: "server", entityId: ACTOR_ENTITY_MAP.server, label: "RAG App", icon: actorEmoji("server", "🤖"), color: actorColor("server", "#34d399") },
    { id: "cache", entityId: ACTOR_ENTITY_MAP.cache, label: "Judge Model", icon: actorEmoji("cache", "⚖️"), color: actorColor("cache", "#a78bfa") },
    { id: "db", entityId: ACTOR_ENTITY_MAP.db, label: "Metrics Store", icon: actorEmoji("db", "📊"), color: actorColor("db", "#f472b6") },
    { id: "lb", entityId: ACTOR_ENTITY_MAP.lb, label: "Human Review", icon: actorEmoji("lb", "👀"), color: actorColor("lb", "#fde047") },
  ],
  steps: [
    { from: "client", to: "cdn", label: "Load Test Set", sublabel: "Questions + ground truth answers", color: actorColor("client", "#60a5fa"), appearAt: 60 },
    { from: "cdn", to: "server", label: "Run Query", sublabel: "Retrieval + generation per test case", color: actorColor("cdn", "#f59e0b"), appearAt: 420 },
    { from: "server", to: "cache", label: "Score Output", sublabel: "Groundedness, relevance, completeness", color: actorColor("server", "#34d399"), appearAt: 900 },
    { from: "cache", to: "db", label: "Write Metrics", sublabel: "Pass rate, score histograms, drift", color: actorColor("cache", "#a78bfa"), appearAt: 1200 },
    { from: "db", to: "lb", label: "Surface Outliers", sublabel: "Low scores and disagreements", color: actorColor("db", "#f472b6"), appearAt: 1500 },
    { from: "lb", to: "server", label: "Human Review", sublabel: "Annotate failure modes", color: actorColor("lb", "#fde047"), appearAt: 1800 },
    { from: "server", to: "client", label: "Improve System", sublabel: "Prompt, chunking, retriever, reranker", color: actorColor("server", "#34d399"), appearAt: 2100 },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Context Assembly Flow
// ─────────────────────────────────────────────────────────────────────────────
export const contextAssemblyFlow: FlowConfig = {
  title: "Context Assembly Flow",
  subtitle: "How search, ranking, and prompt building shape the model input",
  actors: [
    { id: "client", entityId: ACTOR_ENTITY_MAP.client, label: "User Query",       icon: actorEmoji("client", "❓"), color: actorColor("client", "#60a5fa") },
    { id: "cdn", entityId: ACTOR_ENTITY_MAP.cdn, label: "Query Rewrite",          icon: actorEmoji("cdn", "✍️"), color: actorColor("cdn", "#f59e0b") },
    { id: "cache", entityId: ACTOR_ENTITY_MAP.cache, label: "Retriever",          icon: actorEmoji("cache", "🔎"), color: actorColor("cache", "#f59e0b") },
    { id: "db", entityId: ACTOR_ENTITY_MAP.db, label: "Knowledge Index",          icon: actorEmoji("db", "🗂️"), color: actorColor("db", "#336791") },
    { id: "lb", entityId: ACTOR_ENTITY_MAP.lb, label: "Ranker",                   icon: actorEmoji("lb", "🏁"), color: actorColor("lb", "#a78bfa") },
    { id: "server", entityId: ACTOR_ENTITY_MAP.server, label: "Prompt Builder",  icon: actorEmoji("server", "🧱"), color: actorColor("server", "#34d399") },
  ],
  steps: [
    { from: "client", to: "cdn", label: "Ask Question",         sublabel: "Raw task or search request",                color: actorColor("client", "#60a5fa") },
    { from: "cdn", to: "cache", label: "Rewrite Query",         sublabel: "Expand intent and key terms",               color: actorColor("cdn", "#f59e0b") },
    { from: "cache", to: "db", label: "Retrieve Candidates",    sublabel: "Vector and keyword search",                color: actorColor("cache", "#f59e0b") },
    { from: "db", to: "lb", label: "Return Chunks",             sublabel: "Candidate passages with metadata",         color: actorColor("db", "#336791") },
    { from: "lb", to: "server", label: "Re-rank Results",       sublabel: "Keep only the strongest evidence",         color: actorColor("lb", "#a78bfa") },
    { from: "server", to: "client", label: "Assemble Context",  sublabel: "Prompt + top chunks + instructions",      color: actorColor("server", "#34d399") },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// WebSocket Connection Lifecycle
// ─────────────────────────────────────────────────────────────────────────────
export const websocketLifecycleFlow: FlowConfig = {
  title: "WebSocket Connection Lifecycle",
  subtitle: "Upgrade, bidirectional messaging, heartbeat, and graceful close",
  actors: [
    { id: "client", entityId: ACTOR_ENTITY_MAP.client, label: "Browser",        icon: actorEmoji("client", "🌐"), color: actorColor("client", "#60a5fa") },
    { id: "lb",     entityId: ACTOR_ENTITY_MAP.lb,     label: "Gateway",        icon: actorEmoji("lb",     "🚪"), color: actorColor("lb",     "#a78bfa") },
    { id: "server", entityId: ACTOR_ENTITY_MAP.server, label: "WS Server",     icon: actorEmoji("server", "📡"), color: actorColor("server", "#34d399") },
    { id: "cache",  entityId: ACTOR_ENTITY_MAP.cache,  label: "Pub/Sub Bus",   icon: actorEmoji("cache",  "📢"), color: actorColor("cache",  "#f59e0b") },
  ],
  steps: [
    { from: "client", to: "lb",     label: "HTTP Upgrade",         sublabel: "Connection: Upgrade, Upgrade: websocket", color: actorColor("client", "#60a5fa") },
    { from: "lb",     to: "server", label: "101 Switching",        sublabel: "Protocol handshake complete",             color: actorColor("lb",     "#a78bfa") },
    { from: "client", to: "server", label: "Subscribe",            sublabel: "{ action: 'join', room: 'lobby' }",       color: actorColor("client", "#60a5fa") },
    { from: "server", to: "cache",  label: "Register Listener",    sublabel: "SUBSCRIBE channel:lobby",                 color: actorColor("server", "#34d399") },
    { from: "cache",  to: "server", label: "Broadcast Event",      sublabel: "New message from another client",         color: actorColor("cache",  "#f59e0b") },
    { from: "server", to: "client", label: "Push to Client",       sublabel: "{ type: 'message', data: '...' }",        color: actorColor("server", "#34d399") },
    { from: "server", to: "client", label: "Ping",                 sublabel: "Heartbeat every 30s",                     color: actorColor("server", "#34d399") },
    { from: "client", to: "server", label: "Pong",                 sublabel: "Connection still alive",                  color: actorColor("client", "#60a5fa") },
    { from: "client", to: "server", label: "Close Frame",          sublabel: "code: 1000, reason: 'user left'",         color: actorColor("client", "#60a5fa") },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// OAuth 2.0 Authorization Code Flow
// ─────────────────────────────────────────────────────────────────────────────
export const oauthCodeFlow: FlowConfig = {
  title: "OAuth 2.0 Authorization Code Flow",
  subtitle: "How third-party login works with PKCE",
  actors: [
    { id: "client", entityId: ACTOR_ENTITY_MAP.client, label: "User Agent",     icon: actorEmoji("client", "👤"), color: actorColor("client", "#60a5fa") },
    { id: "server", entityId: ACTOR_ENTITY_MAP.server, label: "App Backend",   icon: actorEmoji("server", "🖥️"), color: actorColor("server", "#34d399") },
    { id: "cdn",    entityId: ACTOR_ENTITY_MAP.cdn,    label: "Auth Provider",  icon: actorEmoji("cdn",    "🔑"), color: actorColor("cdn",    "#f59e0b") },
    { id: "db",     entityId: ACTOR_ENTITY_MAP.db,     label: "User Store",     icon: actorEmoji("db",     "🗄️"), color: actorColor("db",     "#f472b6") },
  ],
  steps: [
    { from: "client", to: "server", label: "Click 'Sign in'",      sublabel: "Redirect to authorization URL",          color: actorColor("client", "#60a5fa") },
    { from: "server", to: "cdn",    label: "Authorize Request",    sublabel: "client_id + redirect_uri + PKCE challenge", color: actorColor("server", "#34d399") },
    { from: "cdn",    to: "client", label: "Login Prompt",         sublabel: "User enters credentials at provider",    color: actorColor("cdn",    "#f59e0b") },
    { from: "client", to: "cdn",    label: "Grant Consent",        sublabel: "User approves scopes",                   color: actorColor("client", "#60a5fa") },
    { from: "cdn",    to: "server", label: "Auth Code",            sublabel: "Redirect with ?code=abc123",             color: actorColor("cdn",    "#f59e0b") },
    { from: "server", to: "cdn",    label: "Exchange Code",        sublabel: "POST /token with code + PKCE verifier",  color: actorColor("server", "#34d399") },
    { from: "cdn",    to: "server", label: "Access + ID Token",    sublabel: "JWT with user claims",                   color: actorColor("cdn",    "#f59e0b") },
    { from: "server", to: "db",     label: "Upsert User",          sublabel: "Create or update profile from claims",   color: actorColor("server", "#34d399") },
    { from: "server", to: "client", label: "Session Cookie",       sublabel: "Signed, HttpOnly, SameSite=Strict",      color: actorColor("server", "#34d399") },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Event-Driven Order Processing (CQRS + Event Sourcing)
// ─────────────────────────────────────────────────────────────────────────────
export const eventDrivenOrderFlow: FlowConfig = {
  title: "Event-Driven Order Processing",
  subtitle: "CQRS pattern with event sourcing and async projections",
  actors: [
    { id: "client", entityId: ACTOR_ENTITY_MAP.client, label: "API Gateway",     icon: actorEmoji("client", "🚪"), color: actorColor("client", "#60a5fa") },
    { id: "server", entityId: ACTOR_ENTITY_MAP.server, label: "Command Handler", icon: actorEmoji("server", "⚙️"), color: actorColor("server", "#34d399") },
    { id: "db",     entityId: ACTOR_ENTITY_MAP.db,     label: "Event Store",     icon: actorEmoji("db",     "📜"), color: actorColor("db",     "#f472b6") },
    { id: "cache",  entityId: ACTOR_ENTITY_MAP.cache,  label: "Message Broker",  icon: actorEmoji("cache",  "📨"), color: actorColor("cache",  "#f59e0b") },
    { id: "lb",     entityId: ACTOR_ENTITY_MAP.lb,     label: "Read Projection", icon: actorEmoji("lb",     "📋"), color: actorColor("lb",     "#a78bfa") },
    { id: "cdn",    entityId: ACTOR_ENTITY_MAP.cdn,    label: "Notification Svc", icon: actorEmoji("cdn",   "🔔"), color: actorColor("cdn",    "#fde047") },
  ],
  steps: [
    { from: "client", to: "server", label: "PlaceOrder Command",   sublabel: "Validate inventory + payment",           color: actorColor("client", "#60a5fa") },
    { from: "server", to: "db",     label: "Append Event",         sublabel: "OrderPlaced { orderId, items, total }",  color: actorColor("server", "#34d399") },
    { from: "db",     to: "cache",  label: "Publish Event",        sublabel: "Fan-out to subscribed consumers",        color: actorColor("db",     "#f472b6") },
    { from: "cache",  to: "lb",     label: "Update Read Model",    sublabel: "Denormalize into query-optimized view",  color: actorColor("cache",  "#f59e0b") },
    { from: "cache",  to: "cdn",    label: "Trigger Notification", sublabel: "Send confirmation email + push",         color: actorColor("cache",  "#f59e0b") },
    { from: "cache",  to: "server", label: "Reserve Inventory",    sublabel: "Async saga: decrement stock count",      color: actorColor("cache",  "#f59e0b") },
    { from: "server", to: "db",     label: "Append Event",         sublabel: "InventoryReserved { orderId, items }",   color: actorColor("server", "#34d399") },
    { from: "client", to: "lb",     label: "Query Order Status",   sublabel: "GET /orders/123 from read model",        color: actorColor("client", "#60a5fa") },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// ReAct Tool-Use Loop  (used by agent-design-patterns series — episode 2)
// ─────────────────────────────────────────────────────────────────────────────
export const reactToolUseFlow: FlowConfig = {
  title: "ReAct Tool-Use Loop",
  subtitle: "Think → Act → Observe → Repeat until the task is done",
  actors: [
    { id: "client", entityId: ACTOR_ENTITY_MAP.client, label: "User",          icon: actorEmoji("client", "👤"), color: actorColor("client", "#60a5fa") },
    { id: "server", entityId: ACTOR_ENTITY_MAP.server, label: "Agent (LLM)",   icon: actorEmoji("server", "🤖"), color: actorColor("server", "#34d399") },
    { id: "db",     entityId: ACTOR_ENTITY_MAP.db,     label: "Tool / API",    icon: actorEmoji("db",     "🔧"), color: actorColor("db",     "#f472b6") },
    { id: "cache",  entityId: ACTOR_ENTITY_MAP.cache,  label: "Scratchpad",    icon: actorEmoji("cache",  "📝"), color: actorColor("cache",  "#f59e0b") },
  ],
  steps: [
    { from: "client", to: "server", label: "Task Request",         sublabel: "\"Find the top 3 open issues\"",         color: actorColor("client", "#60a5fa") },
    { from: "server", to: "cache",  label: "Think",                sublabel: "I need to list repo issues first",       color: actorColor("server", "#34d399") },
    { from: "server", to: "db",     label: "Act → Call Tool",      sublabel: "github.listIssues({ state: open })",     color: actorColor("server", "#34d399") },
    { from: "db",     to: "server", label: "Observe ← Result",    sublabel: "Returns 12 issues with metadata",        color: actorColor("db",     "#f472b6") },
    { from: "server", to: "cache",  label: "Think Again",          sublabel: "Need to rank by comments + recency",     color: actorColor("server", "#34d399") },
    { from: "server", to: "db",     label: "Act → Call Tool",      sublabel: "github.getIssueDetails(ids)",            color: actorColor("server", "#34d399") },
    { from: "db",     to: "server", label: "Observe ← Details",   sublabel: "Comment counts and timestamps",          color: actorColor("db",     "#f472b6") },
    { from: "server", to: "cache",  label: "Think → Done",         sublabel: "Ranked list ready, format answer",       color: actorColor("server", "#34d399") },
    { from: "server", to: "client", label: "Final Answer",         sublabel: "Top 3 issues with summaries",            color: actorColor("server", "#34d399") },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Planner-Executor Pipeline  (used by agent-design-patterns series — episode 4)
// ─────────────────────────────────────────────────────────────────────────────
export const plannerExecutorFlow: FlowConfig = {
  title: "Planner-Executor Pipeline",
  subtitle: "Separate strategic planning from step-by-step execution",
  actors: [
    { id: "client", entityId: ACTOR_ENTITY_MAP.client, label: "User",           icon: actorEmoji("client", "👤"), color: actorColor("client", "#60a5fa") },
    { id: "server", entityId: ACTOR_ENTITY_MAP.server, label: "Planner",        icon: actorEmoji("server", "📋"), color: actorColor("server", "#34d399") },
    { id: "db",     entityId: ACTOR_ENTITY_MAP.db,     label: "Executor",       icon: actorEmoji("db",     "⚙️"), color: actorColor("db",     "#f472b6") },
    { id: "cache",  entityId: ACTOR_ENTITY_MAP.cache,  label: "Progress Log",   icon: actorEmoji("cache",  "📊"), color: actorColor("cache",  "#f59e0b") },
  ],
  steps: [
    { from: "client", to: "server", label: "Complex Task",         sublabel: "\"Migrate the API from v1 to v2\"",      color: actorColor("client", "#60a5fa") },
    { from: "server", to: "cache",  label: "Generate Plan",        sublabel: "Step 1: audit endpoints, Step 2: …",    color: actorColor("server", "#34d399") },
    { from: "server", to: "db",     label: "Execute Step 1",       sublabel: "Audit existing v1 endpoints",            color: actorColor("server", "#34d399") },
    { from: "db",     to: "cache",  label: "Report Progress",      sublabel: "✓ Step 1 done — 14 endpoints found",    color: actorColor("db",     "#f472b6") },
    { from: "server", to: "db",     label: "Execute Step 2",       sublabel: "Generate v2 schemas",                    color: actorColor("server", "#34d399") },
    { from: "db",     to: "cache",  label: "Report Progress",      sublabel: "✓ Step 2 done — schemas created",       color: actorColor("db",     "#f472b6") },
    { from: "db",     to: "server", label: "Execution Complete",   sublabel: "All steps finished, check results",      color: actorColor("db",     "#f472b6") },
    { from: "server", to: "cache",  label: "Verify Plan",          sublabel: "Cross-check outputs against goals",      color: actorColor("server", "#34d399") },
    { from: "server", to: "client", label: "Deliver Result",       sublabel: "Migration complete — summary + diff",    color: actorColor("server", "#34d399") },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Multi-Agent Handoff  (used by agent-design-patterns series — episode 8)
// ─────────────────────────────────────────────────────────────────────────────
export const multiAgentHandoffFlow: FlowConfig = {
  title: "Multi-Agent Handoff",
  subtitle: "Supervisor routes work to specialist agents and merges results",
  actors: [
    { id: "client", entityId: ACTOR_ENTITY_MAP.client, label: "User",            icon: actorEmoji("client", "👤"), color: actorColor("client", "#60a5fa") },
    { id: "server", entityId: ACTOR_ENTITY_MAP.server, label: "Supervisor",      icon: actorEmoji("server", "🎯"), color: actorColor("server", "#34d399") },
    { id: "db",     entityId: ACTOR_ENTITY_MAP.db,     label: "Code Agent",      icon: actorEmoji("db",     "💻"), color: actorColor("db",     "#f472b6") },
    { id: "cache",  entityId: ACTOR_ENTITY_MAP.cache,  label: "Review Agent",    icon: actorEmoji("cache",  "🔍"), color: actorColor("cache",  "#f59e0b") },
    { id: "lb",     entityId: ACTOR_ENTITY_MAP.lb,     label: "Test Agent",      icon: actorEmoji("lb",     "🧪"), color: actorColor("lb",     "#a78bfa") },
  ],
  steps: [
    { from: "client", to: "server", label: "Feature Request",       sublabel: "\"Add rate limiting to the API\"",       color: actorColor("client", "#60a5fa") },
    { from: "server", to: "db",     label: "Handoff → Code",        sublabel: "Write the rate limiter middleware",      color: actorColor("server", "#34d399") },
    { from: "db",     to: "server", label: "Code Ready",            sublabel: "Returns diff with implementation",       color: actorColor("db",     "#f472b6") },
    { from: "server", to: "cache",  label: "Handoff → Review",      sublabel: "Check code quality and edge cases",      color: actorColor("server", "#34d399") },
    { from: "cache",  to: "server", label: "Review Feedback",       sublabel: "Fix: missing per-IP tracking",           color: actorColor("cache",  "#f59e0b") },
    { from: "server", to: "db",     label: "Handoff → Revise",      sublabel: "Apply reviewer feedback",                color: actorColor("server", "#34d399") },
    { from: "db",     to: "server", label: "Revised Code",          sublabel: "Updated diff with fix",                  color: actorColor("db",     "#f472b6") },
    { from: "server", to: "lb",     label: "Handoff → Test",        sublabel: "Generate and run test suite",            color: actorColor("server", "#34d399") },
    { from: "lb",     to: "server", label: "Tests Pass ✓",          sublabel: "8/8 tests green, coverage 94%",          color: actorColor("lb",     "#a78bfa") },
    { from: "server", to: "client", label: "Deliver Result",        sublabel: "Code + review + tests complete",         color: actorColor("server", "#34d399") },
  ],
};
