/**
 * Entity Token Resolution & Rendering Utilities
 * 
 * Helpers for resolving entity icons, colors, and applying tokens in components.
 * Bridges the gap between design system definitions and Remotion/React rendering.
 */

import { EntityToken, ENTITY_TOKENS } from "./entityTokens";
import type { IconSource } from "./entityTokens";

/**
 * Resolved icon information with fallback chain applied
 */
export interface ResolvedIcon {
  source: IconSource;
  name: string;
  isFallback: boolean;
}

/**
 * Resolve an entity's icon with fallback chain
 * Primary → Fallback → Generic emoji
 */
export function resolveEntityIcon(entityId: string): ResolvedIcon {
  const entity = ENTITY_TOKENS[entityId];
  
  if (!entity) {
    return {
      source: "emoji",
      name: "❓",
      isFallback: true,
    };
  }

  // Try primary icon
  if (entity.icon) {
    return {
      source: entity.icon.source,
      name: entity.icon.name,
      isFallback: false,
    };
  }

  // Try fallback icon
  if (entity.fallbackIcon) {
    return {
      source: entity.fallbackIcon.source,
      name: entity.fallbackIcon.name,
      isFallback: true,
    };
  }

  // Last resort: emoji
  return {
    source: "emoji",
    name: "🔧",
    isFallback: true,
  };
}

/**
 * Resolve an entity icon into an emoji for text-only renderers.
 * If no emoji icon is available in token/fallback, returns the provided fallback.
 */
export function getEntityEmojiIcon(entityId: string, fallback = "🔧"): string {
  const entity = ENTITY_TOKENS[entityId];
  if (!entity) return fallback;

  if (entity.icon.source === "emoji") return entity.icon.name;
  if (entity.fallbackIcon?.source === "emoji") return entity.fallbackIcon.name;

  return fallback;
}

/**
 * Get semantic color for an entity
 * Returns the primary color by default, or a specific shade
 */
export function getEntityColor(
  entityId: string,
  shade: "primary" | "secondary" | "dark" = "primary"
): string {
  const entity = ENTITY_TOKENS[entityId];
  if (!entity) return "#6B7280"; // Gray fallback
  return entity.colors[shade];
}

/**
 * Get full color palette for an entity
 */
export function getEntityColors(entityId: string) {
  const entity = ENTITY_TOKENS[entityId];
  if (!entity) {
    return {
      primary: "#6B7280",
      secondary: "#D1D5DB",
      dark: "#374151",
    };
  }
  return entity.colors;
}

/**
 * Generate Tailwind gradient class from entity colors
 * Example: "bg-gradient-to-r from-postgres-700 to-postgres-500"
 */
export function getEntityGradientClass(
  entityId: string,
  direction: "to-r" | "to-b" | "to-tr" = "to-r"
): string {
  const entity = ENTITY_TOKENS[entityId];
  if (!entity) return `bg-gradient-${direction} from-gray-700 to-gray-500`;
  
  // Note: This assumes Tailwind config has dynamic color classes for each entity
  // For now, return a descriptive class name that should be configured in tailwind.config.ts
  return `bg-gradient-${direction} from-${entityId}-700 to-${entityId}-500`;
}

/**
 * Generate inline styles for entity styling
 * Useful for components that can't use Tailwind classes
 */
export function getEntityInlineStyles(entityId: string) {
  const entity = ENTITY_TOKENS[entityId];
  if (!entity) {
    return {
      backgroundColor: "#E5E7EB",
      color: "#374151",
      borderColor: "#9CA3AF",
    };
  }

  return {
    backgroundColor: entity.colors.secondary,
    color: entity.colors.dark,
    borderColor: entity.colors.primary,
  };
}

/**
 * Generate a semantic label with entity styling
 * Returns JSX-ready object with label text and styling
 */
export function getStyledEntityLabel(entityId: string) {
  const entity = ENTITY_TOKENS[entityId];
  if (!entity) {
    return {
      label: "Unknown",
      color: "#6B7280",
      backgroundColor: "#F3F4F6",
    };
  }

  return {
    label: entity.label,
    description: entity.description,
    color: entity.colors.primary,
    backgroundColor: entity.colors.secondary,
    textColor: entity.colors.dark,
  };
}

/**
 * Generate CSS class for entity background
 * Used in Remotion <Div> components with Tailwind
 */
export function getEntityBackgroundClass(
  entityId: string,
  opacity: "10" | "20" | "30" | "50" | "75" | "90" = "10"
): string {
  const entity = ENTITY_TOKENS[entityId];
  if (!entity) return "bg-gray-100";
  
  // Note: Assumes Tailwind config includes opacity variants for each entity
  return `bg-${entityId}-${opacity}`;
}

/**
 * Generate badge HTML/JSX for displaying an entity
 * Returns styling object for rendering
 */
export interface EntityBadgeStyle {
  container: {
    backgroundColor: string;
    borderColor: string;
    color: string;
  };
  text: string;
}

export function getEntityBadgeStyle(entityId: string): EntityBadgeStyle {
  const entity = ENTITY_TOKENS[entityId];
  if (!entity) {
    return {
      container: {
        backgroundColor: "#F3F4F6",
        borderColor: "#D1D5DB",
        color: "#6B7280",
      },
      text: "Unknown",
    };
  }

  return {
    container: {
      backgroundColor: entity.colors.secondary,
      borderColor: entity.colors.primary,
      color: entity.colors.dark,
    },
    text: entity.label,
  };
}

/**
 * Get all entities that could appear in a specific context
 * Useful for building legend/key components
 */
export function getEntitiesForLegend(categoryFilter?: EntityToken["category"]) {
  return Object.values(ENTITY_TOKENS)
    .filter(entity => !categoryFilter || entity.category === categoryFilter)
    .sort((a, b) => a.label.localeCompare(b.label));
}

/**
 * Check if an entity ID is valid
 */
export function isValidEntityId(entityId: string): boolean {
  return entityId in ENTITY_TOKENS;
}

/**
 * Generate a CSS variable map for entity tokens
 * Useful for applying tokens globally in stylesheets
 */
export function generateEntityCSSVariables(): Record<string, string> {
  const vars: Record<string, string> = {};

  Object.entries(ENTITY_TOKENS).forEach(([id, entity]) => {
    vars[`--entity-${id}-primary`] = entity.colors.primary;
    vars[`--entity-${id}-secondary`] = entity.colors.secondary;
    vars[`--entity-${id}-dark`] = entity.colors.dark;
    vars[`--entity-${id}-label`] = entity.label;
  });

  return vars;
}

/**
 * Migrate a hardcoded actor (from flows.ts) to use entity tokens
 * Example input: { name: "Database", color: "#336791", icon: "database-icon" }
 * Example output: { entityId: "postgresql", ... resolved from tokens ... }
 */
export function migrateActorToEntityToken(
  oldActor: { name: string; color?: string }
): string | null {
  // Fuzzy matching to find closest entity
  const lowerName = oldActor.name.toLowerCase();
  
  const exactMatch = Object.entries(ENTITY_TOKENS).find(
    ([, entity]) => entity.label.toLowerCase() === lowerName
  );
  
  if (exactMatch) return exactMatch[0];

  // Fuzzy match on description or category
  const fuzzyMatch = Object.entries(ENTITY_TOKENS).find(
    ([, entity]) =>
      entity.label.toLowerCase().includes(lowerName) ||
      lowerName.includes(entity.label.toLowerCase())
  );

  return fuzzyMatch ? fuzzyMatch[0] : null;
}
