/**
 * Image Utility Functions
 * Pure functions for secure and performant image URL handling
 */

/**
 * Get safe image URL with fallback
 *
 * @param imageUrl - The image URL from API
 * @param fallback - Fallback image path
 * @returns Safe, absolute image URL
 */
export function getSafeImageUrl(imageUrl: string | null | undefined, fallback: string = '/placeholder-product.jpg'): string {
  // Return fallback if no URL provided
  if (!imageUrl || imageUrl === 'null' || imageUrl === 'undefined') {
    return fallback;
  }

  // If already a full URL, return as-is (Next.js will optimize)
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  // If relative path starting with /storage/, convert to full URL
  if (imageUrl.startsWith('/storage/')) {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v2', '') || 'https://hooknhunt-api.test';
    return `${apiBaseUrl}${imageUrl}`;
  }

  // If relative path without leading /, assume it's from storage
  if (!imageUrl.startsWith('/')) {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v2', '') || 'https://hooknhunt-api.test';
    return `${apiBaseUrl}/storage/${imageUrl}`;
  }

  // Return as-is for other cases (absolute local paths)
  return imageUrl;
}

/**
 * Get optimized image props for Next.js Image component
 *
 * @param imageUrl - The image URL from API
 * @param alt - Alt text for accessibility
 * @param fallback - Fallback image path
 * @returns Props for Next.js Image component
 */
export function getOptimizedImageProps(
  imageUrl: string | null | undefined,
  alt: string = 'Product image',
  fallback: string = '/placeholder-product.jpg'
) {
  return {
    src: getSafeImageUrl(imageUrl, fallback),
    alt: alt || 'Product image',
    // Critical images for above-fold content
    loading: 'lazy' as const,
    // Enable Next.js optimization
    unoptimized: false,
  };
}

/**
 * Check if URL is a placeholder image
 *
 * @param imageUrl - The image URL to check
 * @returns True if URL is a placeholder
 */
export function isPlaceholderImage(imageUrl: string | null | undefined): boolean {
  if (!imageUrl) return true;

  const placeholderPatterns = [
    /placeholder\.jpg$/i,
    /placeholder\.png$/i,
    /placeholder\.jpeg$/i,
    /no-image/i,
    /not-found/i,
    /coming-soon/i,
  ];

  return placeholderPatterns.some(pattern => pattern.test(imageUrl));
}

/**
 * Get gallery images array with safe URLs
 *
 * @param galleryImages - Array of gallery image URLs
 * @returns Array of safe image URLs
 */
export function getSafeGalleryImages(galleryImages: (string | { fullUrl?: string; imageUrl?: string })[] | null | undefined): string[] {
  if (!galleryImages || !Array.isArray(galleryImages)) {
    return [];
  }

  return galleryImages
    .map((img) => {
      // Handle both old format {fullUrl} and new format {imageUrl}
      const url = typeof img === 'string' ? img : (img.fullUrl || img.imageUrl || '');
      return getSafeImageUrl(url);
    })
    .filter((url) => url && !isPlaceholderImage(url)); // Filter out placeholders
}

/**
 * Get primary image from gallery
 *
 * @param galleryImages - Array of gallery image URLs
 * @param fallback - Fallback image
 * @returns Primary image URL
 */
export function getPrimaryGalleryImage(
  galleryImages: (string | { fullUrl?: string; imageUrl?: string })[] | null | undefined,
  fallback: string = '/placeholder-product.jpg'
): string {
  const safeGallery = getSafeGalleryImages(galleryImages);
  return safeGallery.length > 0 ? safeGallery[0] : fallback;
}
