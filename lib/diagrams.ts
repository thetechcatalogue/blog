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
};

export function getDiagram(name: string): DiagramData | undefined {
  return diagrams[name];
}

export function getAllDiagramNames(): string[] {
  return Object.keys(diagrams);
}
