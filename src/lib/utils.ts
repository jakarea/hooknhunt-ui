/**
 * Utility functions for the application
 */

/**
 * Normalize URLs that may have escaped backslashes from JSON encoding
 * Converts `https:\/\/example.com\/path` to `https://example.com/path`
 *
 * @param url - The URL to normalize
 * @returns The normalized URL with proper forward slashes
 */
export function normalizeUrl(url: string | null | undefined): string {
  if (!url) return '';
  // Replace escaped backslashes with forward slashes
  return url.replace(/\\\//g, '/');
}

/**
 * Safely get a URL from an object with multiple possible field names
 * Handles both camelCase and snake_case, and normalizes the result
 *
 * @param obj - The object to extract URL from
 * @param keys - Array of possible keys to check (in order of priority)
 * @returns The first found URL, normalized, or empty string
 */
export function getUrlFromObject(obj: any, keys: string[]): string {
  if (!obj) return '';

  for (const key of keys) {
    const value = obj[key];
    if (typeof value === 'string' && value.length > 0) {
      return normalizeUrl(value);
    }
    // Also check nested objects (e.g., 'screenshot.fullUrl')
    if (key.includes('.')) {
      const parts = key.split('.');
      let nested = obj;
      for (const part of parts) {
        nested = nested?.[part];
        if (nested === undefined || nested === null) break;
      }
      if (typeof nested === 'string' && nested.length > 0) {
        return normalizeUrl(nested);
      }
    }
  }

  return '';
}
