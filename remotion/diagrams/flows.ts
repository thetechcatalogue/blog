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
