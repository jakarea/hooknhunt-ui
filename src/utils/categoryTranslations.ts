/**
 * Helper functions for category name translations
 */

/**
 * Mapping of category slugs to translation keys
 */
const CATEGORY_KEY_MAP: Record<string, string> = {
  'fishing-rods': 'categoryNames.fishingRods',
  'fishing-reels': 'categoryNames.fishingReels',
  'fishing-rod-and-reel-sets': 'categoryNames.fishingRodAndReelSets',
  'fishing-lines': 'categoryNames.fishingLines',
  'lures-and-baits': 'categoryNames.luresAndBaits',
  'fishing-tackles': 'categoryNames.fishingTackles',
  'fishing-nets': 'categoryNames.fishingNets',
  'accessories': 'categoryNames.accessories',
};

/**
 * Mapping of category names (fallback) to translation keys
 * Used when slug is not available or doesn't match
 */
const CATEGORY_NAME_MAP: Record<string, string> = {
  'Fishing Rods': 'categoryNames.fishingRods',
  'Fishing Reels': 'categoryNames.fishingReels',
  'Fishing Rod & Reel Sets': 'categoryNames.fishingRodAndReelSets',
  'Fishing Lines': 'categoryNames.fishingLines',
  'Lures & Baits': 'categoryNames.luresAndBaits',
  'Fishing Tackles': 'categoryNames.fishingTackles',
  'Fishing Nets': 'categoryNames.fishingNets',
  'Accessories': 'categoryNames.accessories',
};

/**
 * Get the translation key for a category
 * @param category - Category object with name and slug
 * @returns Translation key or the category name as fallback
 */
export function getCategoryTranslationKey(category: { name?: string; slug?: string }): string {
  // Try slug first
  if (category.slug && CATEGORY_KEY_MAP[category.slug]) {
    return CATEGORY_KEY_MAP[category.slug];
  }

  // Fallback to name matching
  if (category.name && CATEGORY_NAME_MAP[category.name]) {
    return CATEGORY_NAME_MAP[category.name];
  }

  // Final fallback to name itself
  return category.name || '';
}
