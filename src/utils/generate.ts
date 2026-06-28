/**
 * Generates a unique string ID.
 * Uses crypto.randomUUID() if available, with a fallback.
 */
export function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  
  // Fallback for older browsers / testing environments
  return 'id-' + Math.random().toString(36).substring(2, 15) + '-' + Date.now().toString(36);
}
