/**
 * Entity Design Tokens
 * 
 * Canonical definitions for system entities, databases, services, and concepts.
 * Ensures visual consistency across all videos and components.
 * 
 * Icon Strategy:
 * - Lucide icons for system/generic concepts (system, server, client, API, cache, etc.)
 * - Simple Icons for branded services (PostgreSQL, MySQL, Redis, MongoDB, etc.)
 * - Emoji as semantic fallback (💾, 🗄️, ⚡, etc.)
 * 
 * Color Strategy:
 * - Primary: Entity's canonical brand color
 * - Secondary: Lighter tint for backgrounds/highlights
 * - Dark: Darker shade for text/borders
 */

export type IconSource = "lucide" | "simple-icon" | "emoji";

export interface EntityToken {
  /** Unique identifier for the entity */
  id: string;
  
  /** Display name for UI rendering */
  label: string;
  
  /** Short description for tooltips/legends */
  description: string;
  
  /** Primary icon source and identifier */
  icon: {
    source: IconSource;
    /** Name for lucide/simple-icon, single emoji for emoji source */
    name: string;
  };
  
  /** Semantic fallback icon (lower priority) */
  fallbackIcon?: {
    source: IconSource;
    name: string;
  };
  
  /** Color palette for this entity */
  colors: {
    /** Primary brand color (hex) */
    primary: string;
    /** Lighter tint for backgrounds */
    secondary: string;
    /** Dark shade for text/borders */
    dark: string;
  };
  
  /** Domain category for visual grouping */
  category: "database" | "cache" | "service" | "infrastructure" | "protocol" | "auth" | "system";
}

/**
 * Core entity definitions
 * Covers databases, caches, services, and infrastructure patterns used across videos
 */
export const ENTITY_TOKENS: Record<string, EntityToken> = {
  // Databases
  postgresql: {
    id: "postgresql",
    label: "PostgreSQL",
    description: "Open-source relational database",
    icon: {
      source: "simple-icon",
      name: "postgresql",
    },
    fallbackIcon: {
      source: "lucide",
      name: "database",
    },
    colors: {
      primary: "#336791",    // PostgreSQL blue
      secondary: "#5a9bd5",  // Lighter blue
      dark: "#1e3d5c",       // Dark blue
    },
    category: "database",
  },

  mysql: {
    id: "mysql",
    label: "MySQL",
    description: "Popular relational database",
    icon: {
      source: "simple-icon",
      name: "mysql",
    },
    fallbackIcon: {
      source: "lucide",
      name: "database",
    },
    colors: {
      primary: "#00758F",    // MySQL blue
      secondary: "#4d9db6",  // Lighter blue
      dark: "#003f52",       // Dark blue
    },
    category: "database",
  },

  mongodb: {
    id: "mongodb",
    label: "MongoDB",
    description: "NoSQL document database",
    icon: {
      source: "simple-icon",
      name: "mongodb",
    },
    fallbackIcon: {
      source: "lucide",
      name: "file-json",
    },
    colors: {
      primary: "#13AA52",    // MongoDB green
      secondary: "#5fcf7f",  // Lighter green
      dark: "#0a6b31",       // Dark green
    },
    category: "database",
  },

  elasticsearch: {
    id: "elasticsearch",
    label: "Elasticsearch",
    description: "Search and analytics engine",
    icon: {
      source: "simple-icon",
      name: "elasticsearch",
    },
    fallbackIcon: {
      source: "lucide",
      name: "search",
    },
    colors: {
      primary: "#005571",    // Elastic blue
      secondary: "#4d8fa8",  // Lighter blue
      dark: "#002d3a",       // Dark blue
    },
    category: "database",
  },

  // Caches & In-Memory
  redis: {
    id: "redis",
    label: "Redis",
    description: "In-memory data store",
    icon: {
      source: "simple-icon",
      name: "redis",
    },
    fallbackIcon: {
      source: "lucide",
      name: "zap",
    },
    colors: {
      primary: "#DC382D",    // Redis red
      secondary: "#ed7d78",  // Lighter red
      dark: "#8a1f1a",       // Dark red
    },
    category: "cache",
  },

  memcached: {
    id: "memcached",
    label: "Memcached",
    description: "Distributed memory caching",
    icon: {
      source: "lucide",
      name: "zap",
    },
    fallbackIcon: {
      source: "emoji",
      name: "⚡",
    },
    colors: {
      primary: "#FFD700",    // Gold
      secondary: "#ffe680",  // Lighter gold
      dark: "#b39b00",       // Dark gold
    },
    category: "cache",
  },

  // Services & Infrastructure
  client: {
    id: "client",
    label: "Client",
    description: "Frontend / User interface",
    icon: {
      source: "lucide",
      name: "monitor",
    },
    fallbackIcon: {
      source: "emoji",
      name: "💻",
    },
    colors: {
      primary: "#7C3AED",    // Purple
      secondary: "#a855f7",  // Lighter purple
      dark: "#5b21b6",       // Dark purple
    },
    category: "system",
  },

  server: {
    id: "server",
    label: "Server",
    description: "Backend / Application server",
    icon: {
      source: "lucide",
      name: "server",
    },
    fallbackIcon: {
      source: "emoji",
      name: "🖥️",
    },
    colors: {
      primary: "#0EA5E9",    // Sky blue
      secondary: "#38bdf8",  // Lighter sky
      dark: "#0369a1",       // Dark sky
    },
    category: "system",
  },

  api: {
    id: "api",
    label: "API",
    description: "Application Programming Interface",
    icon: {
      source: "lucide",
      name: "network",
    },
    fallbackIcon: {
      source: "emoji",
      name: "🔌",
    },
    colors: {
      primary: "#F59E0B",    // Amber
      secondary: "#fbbf24",  // Lighter amber
      dark: "#b45309",       // Dark amber
    },
    category: "service",
  },

  database: {
    id: "database",
    label: "Database",
    description: "Generic database concept",
    icon: {
      source: "lucide",
      name: "database",
    },
    fallbackIcon: {
      source: "emoji",
      name: "🗄️",
    },
    colors: {
      primary: "#10B981",    // Emerald
      secondary: "#6EE7B7",  // Lighter emerald
      dark: "#047857",       // Dark emerald
    },
    category: "database",
  },

  cache: {
    id: "cache",
    label: "Cache",
    description: "Generic caching concept",
    icon: {
      source: "lucide",
      name: "zap",
    },
    fallbackIcon: {
      source: "emoji",
      name: "⚡",
    },
    colors: {
      primary: "#F97316",    // Orange
      secondary: "#fb923c",  // Lighter orange
      dark: "#b45309",       // Dark orange
    },
    category: "cache",
  },

  // Protocols & Auth
  http: {
    id: "http",
    label: "HTTP",
    description: "HyperText Transfer Protocol",
    icon: {
      source: "lucide",
      name: "globe",
    },
    fallbackIcon: {
      source: "emoji",
      name: "🌐",
    },
    colors: {
      primary: "#06B6D4",    // Cyan
      secondary: "#22d3ee",  // Lighter cyan
      dark: "#0891b2",       // Dark cyan
    },
    category: "protocol",
  },

  jwt: {
    id: "jwt",
    label: "JWT",
    description: "JSON Web Token",
    icon: {
      source: "lucide",
      name: "key",
    },
    fallbackIcon: {
      source: "emoji",
      name: "🔑",
    },
    colors: {
      primary: "#8B5CF6",    // Violet
      secondary: "#a78bfa",  // Lighter violet
      dark: "#6d28d9",       // Dark violet
    },
    category: "auth",
  },

  oauth: {
    id: "oauth",
    label: "OAuth",
    description: "Open Authorization protocol",
    icon: {
      source: "lucide",
      name: "shield-check",
    },
    fallbackIcon: {
      source: "emoji",
      name: "🛡️",
    },
    colors: {
      primary: "#EC4899",    // Pink
      secondary: "#f472b6",  // Lighter pink
      dark: "#be185d",       // Dark pink
    },
    category: "auth",
  },

  // Patterns & Concepts
  loadbalancer: {
    id: "loadbalancer",
    label: "Load Balancer",
    description: "Distributes incoming traffic",
    icon: {
      source: "lucide",
      name: "distribute",
    },
    fallbackIcon: {
      source: "emoji",
      name: "⚖️",
    },
    colors: {
      primary: "#14B8A6",    // Teal
      secondary: "#2dd4bf",  // Lighter teal
      dark: "#0d9488",       // Dark teal
    },
    category: "infrastructure",
  },

  queue: {
    id: "queue",
    label: "Message Queue",
    description: "Asynchronous message broker",
    icon: {
      source: "lucide",
      name: "inbox",
    },
    fallbackIcon: {
      source: "emoji",
      name: "📬",
    },
    colors: {
      primary: "#6366F1",    // Indigo
      secondary: "#818cf8",  // Lighter indigo
      dark: "#4338ca",       // Dark indigo
    },
    category: "service",
  },

  storage: {
    id: "storage",
    label: "Storage",
    description: "File/Object storage system",
    icon: {
      source: "lucide",
      name: "hard-drive",
    },
    fallbackIcon: {
      source: "emoji",
      name: "💾",
    },
    colors: {
      primary: "#64748B",    // Slate
      secondary: "#94a3b8",  // Lighter slate
      dark: "#334155",       // Dark slate
    },
    category: "infrastructure",
  },
};

/**
 * Get an entity token by ID
 * @param entityId - The entity identifier
 * @returns The entity token or undefined if not found
 */
export function getEntityToken(entityId: string): EntityToken | undefined {
  return ENTITY_TOKENS[entityId];
}

/**
 * Get all entities in a specific category
 * @param category - The entity category
 * @returns Array of entities in that category
 */
export function getEntitiesByCategory(
  category: EntityToken["category"]
): EntityToken[] {
  return Object.values(ENTITY_TOKENS).filter(entity => entity.category === category);
}

/**
 * List all available entity IDs
 * @returns Array of entity IDs
 */
export function listEntityIds(): string[] {
  return Object.keys(ENTITY_TOKENS);
}
