/**
 * Design Tokens - Unified Export
 * 
 * Central hub for all design system definitions and utilities.
 * Provides entity tokens, color utilities, and rendering helpers.
 */

export {
  ENTITY_TOKENS,
  type EntityToken,
  type IconSource,
  getEntityToken,
  getEntitiesByCategory,
  listEntityIds,
} from "./entityTokens";

export {
  type ResolvedIcon,
  resolveEntityIcon,
  getEntityEmojiIcon,
  getEntityColor,
  getEntityColors,
  getEntityGradientClass,
  getEntityInlineStyles,
  getStyledEntityLabel,
  getEntityBackgroundClass,
  type EntityBadgeStyle,
  getEntityBadgeStyle,
  getEntitiesForLegend,
  isValidEntityId,
  generateEntityCSSVariables,
  migrateActorToEntityToken,
} from "./entityTokenUtils";
