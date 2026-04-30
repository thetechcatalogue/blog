# Design System: Entity Tokens

## Overview

The Entity Token system provides a **canonical visual language** for all entities, services, and concepts across your Remotion videos. It ensures consistency, maintainability, and scalability.

### Core Principles

1. **Single Source of Truth**: Each entity (PostgreSQL, Redis, Client, Server, etc.) has one canonical definition
2. **Composable**: Mix tokens with your existing component system
3. **Icon Strategy**: Lucide (system concepts) + Simple Icons (brands) + emoji (fallback)
4. **Category-Based**: Organize entities by domain (databases, caches, services, protocols, auth, infrastructure)
5. **Escape Hatch**: Override tokens locally for specific videos when needed

---

## Quick Start

### Basic Usage

```typescript
import { getEntityToken, getEntityColor, resolveEntityIcon } from "@/remotion/designTokens";

// Get entity definition
const postgres = getEntityToken("postgresql");
console.log(postgres.label);  // "PostgreSQL"
console.log(postgres.colors.primary);  // "#336791"

// Resolve icon
const icon = resolveEntityIcon("postgresql");
console.log(icon.source);  // "simple-icon"
console.log(icon.name);    // "postgresql"

// Get color shade
const darkColor = getEntityColor("postgresql", "dark");
console.log(darkColor);  // "#1e3d5c"
```

### In Remotion Components

```typescript
import { Composition, Sequence, Div } from "remotion";
import { getEntityColor, getStyledEntityLabel, resolveEntityIcon } from "@/remotion/designTokens";

export const DatabaseFlow: React.FC = () => {
  const pgColor = getEntityColor("postgresql", "primary");
  const pgLabel = getStyledEntityLabel("postgresql");
  const pgIcon = resolveEntityIcon("postgresql");

  return (
    <Div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: pgColor,
      }}
    >
      <h2 style={{ color: pgLabel.textColor }}>
        {pgIcon.name} {pgLabel.label}
      </h2>
    </Div>
  );
};
```

### In React Components

```typescript
import { getEntityBadgeStyle, getEntitiesForLegend } from "@/remotion/designTokens";

export const EntityBadge: React.FC<{ entityId: string }> = ({ entityId }) => {
  const style = getEntityBadgeStyle(entityId);
  
  return (
    <div
      style={{
        backgroundColor: style.container.backgroundColor,
        color: style.container.color,
        border: `2px solid ${style.container.borderColor}`,
        padding: "8px 12px",
        borderRadius: "6px",
      }}
    >
      {style.text}
    </div>
  );
};

// Generate legend
export const EntityLegend: React.FC<{ category?: EntityToken["category"] }> = ({
  category,
}) => {
  const entities = getEntitiesForLegend(category);
  
  return (
    <div>
      {entities.map(entity => (
        <EntityBadge key={entity.id} entityId={entity.id} />
      ))}
    </div>
  );
};
```

---

## Available Entities

### Databases (4)
- **postgresql**: Open-source relational database (#336791)
- **mysql**: Popular relational database (#00758F)
- **mongodb**: NoSQL document database (#13AA52)
- **elasticsearch**: Search and analytics engine (#005571)

### Caches (2)
- **redis**: In-memory data store (#DC382D)
- **memcached**: Distributed memory caching (#FFD700)

### Services (4)
- **client**: Frontend / User interface (#7C3AED)
- **server**: Backend / Application server (#0EA5E9)
- **api**: Application Programming Interface (#F59E0B)
- **queue**: Asynchronous message broker (#6366F1)

### Infrastructure (1)
- **storage**: File/Object storage system (#64748B)
- **loadbalancer**: Distributes incoming traffic (#14B8A6)

### Protocols (1)
- **http**: HyperText Transfer Protocol (#06B6D4)

### Auth (2)
- **jwt**: JSON Web Token (#8B5CF6)
- **oauth**: Open Authorization protocol (#EC4899)

### System/Generic (2)
- **database**: Generic database concept (#10B981)
- **cache**: Generic caching concept (#F97316)

---

## Integration Patterns

### Pattern 1: Migrate Hardcoded Flows

**Before:**
```typescript
const actors = [
  { name: "Database", color: "#336791", icon: PostgreSQLIcon },
  { name: "Cache", color: "#DC382D", icon: RedisIcon },
];
```

**After:**
```typescript
import { ENTITY_TOKENS } from "@/remotion/designTokens";

const actors = Object.values(ENTITY_TOKENS)
  .filter(e => e.category === "database" || e.category === "cache")
  .map(e => ({ entityId: e.id, ...e }));

// Render using entity properties
actors.forEach(actor => {
  const icon = resolveEntityIcon(actor.entityId);
  const color = getEntityColor(actor.entityId);
  // ... render
});
```

### Pattern 2: Add Custom Overrides Per Video

```typescript
// In your video component file
import { ENTITY_TOKENS, getEntityColor } from "@/remotion/designTokens";

// Local override for a specific video
const VIDEO_OVERRIDES: Partial<Record<string, Partial<EntityToken>>> = {
  postgresql: {
    colors: {
      primary: "#1a4d6d",  // Darker shade for this video's theme
    },
  },
};

export function getVideoEntityColor(entityId: string, shade = "primary"): string {
  const override = VIDEO_OVERRIDES[entityId];
  if (override?.colors?.[shade]) {
    return override.colors[shade];
  }
  return getEntityColor(entityId, shade);
}
```

### Pattern 3: Dynamic Legend for Videos

```typescript
import { getEntitiesForLegend, getEntityBadgeStyle } from "@/remotion/designTokens";

export const VideoLegend: React.FC<{ category: EntityToken["category"] }> = ({
  category,
}) => {
  const entities = getEntitiesForLegend(category);
  
  return (
    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
      {entities.map(entity => {
        const badgeStyle = getEntityBadgeStyle(entity.id);
        return (
          <div
            key={entity.id}
            style={{
              backgroundColor: badgeStyle.container.backgroundColor,
              color: badgeStyle.container.color,
              borderLeft: `4px solid ${badgeStyle.container.borderColor}`,
              padding: "8px 12px",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          >
            {badgeStyle.text}
          </div>
        );
      })}
    </div>
  );
};
```

---

## Adding New Entities

To add a new entity to the design system:

1. **Edit** `entityTokens.ts`
2. **Add entry** to `ENTITY_TOKENS` with complete definition:

```typescript
export const ENTITY_TOKENS: Record<string, EntityToken> = {
  // ... existing
  
  rabbitmq: {
    id: "rabbitmq",
    label: "RabbitMQ",
    description: "Message broker and queuing system",
    icon: {
      source: "simple-icon",
      name: "rabbitmq",
    },
    fallbackIcon: {
      source: "lucide",
      name: "inbox",
    },
    colors: {
      primary: "#FF6600",
      secondary: "#ffb84d",
      dark: "#cc5200",
    },
    category: "service",
  },
};
```

3. **Test** by importing and using:

```typescript
const rabbitmq = getEntityToken("rabbitmq");
console.log(rabbitmq);  // Should work!
```

---

## Icon Resolution

The system resolves icons using a fallback chain:

1. **Primary Icon**: Try the first defined icon
2. **Fallback Icon**: Try the secondary icon if primary unavailable
3. **Generic Emoji**: Last resort

Example:

```typescript
const icon = resolveEntityIcon("postgresql");
// Returns: { source: "simple-icon", name: "postgresql", isFallback: false }

// If Simple Icons library doesn't have "postgresql":
// Returns: { source: "lucide", name: "database", isFallback: true }

// If Lucide doesn't have "database":
// Returns: { source: "emoji", name: "🔧", isFallback: true }
```

---

## Color Palette Strategy

Each entity has **3 color shades**:

- **Primary**: Brand color, used for main elements
- **Secondary**: Lighter tint, used for backgrounds/highlights
- **Dark**: Darker shade, used for text/borders

```typescript
const colors = getEntityColors("postgresql");
// {
//   primary: "#336791",    // Main color
//   secondary: "#5a9bd5",  // Light background
//   dark: "#1e3d5c",       // Dark text
// }
```

### Usage

```typescript
// Icon color
<Icon color={getEntityColor("postgresql", "primary")} />

// Background
<div style={{ backgroundColor: getEntityColor("postgresql", "secondary") }} />

// Text
<p style={{ color: getEntityColor("postgresql", "dark") }} />
```

---

## Next Steps

### Phase 2: Integrate with Flows

Refactor `flows.ts` to use entity tokens instead of hardcoded actor definitions:

```typescript
// src/remotion/flows.ts
import { ENTITY_TOKENS } from "@/remotion/designTokens";

const databaseEntities = getEntitiesByCategory("database");
// Build flow using canonical entity properties
```

### Phase 3: Refactor Custom Videos

Update custom Remotion compositions (ClientServerFlow, AgentArchitecture, etc.) to consume entity tokens:

```typescript
// src/remotion/diagrams/ClientServerFlow.tsx
import { getEntityColor, resolveEntityIcon } from "@/remotion/designTokens";

export const ClientServerFlow: React.FC = () => {
  const clientColor = getEntityColor("client");
  const serverColor = getEntityColor("server");
  // ... use in rendering
};
```

### Phase 4: Tailwind Integration

Add entity colors to `tailwind.config.ts` for Tailwind class generation:

```typescript
// tailwind.config.ts
import { ENTITY_TOKENS } from "@/remotion/designTokens";

const entityColors = Object.fromEntries(
  Object.entries(ENTITY_TOKENS).map(([id, token]) => [
    id,
    {
      "50": lighten(token.colors.secondary, 0.5),
      "100": token.colors.secondary,
      "500": token.colors.primary,
      "700": token.colors.dark,
    },
  ])
);

module.exports = {
  theme: {
    colors: {
      ...entityColors,
    },
  },
};
```

---

## Troubleshooting

### "Icon not found" errors

Check if you're using the correct icon source:
- **simple-icon**: [simpleicons.org](https://simpleicons.org) - search for exact slug
- **lucide**: [lucide.dev](https://lucide.dev) - search for icon name
- **emoji**: Any single emoji character

### Entity not rendering with correct color

Ensure you're calling the right utility:

```typescript
// ❌ Wrong
const color = ENTITY_TOKENS.postgresql.colors.primary;

// ✅ Right
const color = getEntityColor("postgresql", "primary");
```

### Overrides not working

Overrides should be applied before rendering. Example:

```typescript
const getColor = (entityId: string) => {
  const override = VIDEO_OVERRIDES[entityId];
  if (override) return override;
  return getEntityColor(entityId);
};
```

---

## File Structure

```
src/remotion/designTokens/
├── index.ts                    # Central export
├── entityTokens.ts             # Token definitions (20 entities)
├── entityTokenUtils.ts         # Resolution utilities
└── README.md                   # This file
```

---

## Contributing

To add/update entities:

1. Edit `entityTokens.ts`
2. Test with `getEntityToken()`
3. Update this README if adding new categories
4. Lint: `npm run lint`

---

## References

- **Lucide Icons**: https://lucide.dev
- **Simple Icons**: https://simpleicons.org
- **Design Tokens**: https://designtokens.org
- **Remotion Docs**: https://www.remotion.dev

