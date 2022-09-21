import { randomUUID } from 'node:crypto';
import TTLCache from '@isaacs/ttlcache';

// The maximum size of the individual caches.
const MAX_CACHE_SIZE = 1000;
// The mac cache item lifetime.
const CACHE_TTL_MS = 300000;

// Cache of pending authentications.
const pendingAuths = new TTLCache({ max: MAX_CACHE_SIZE, ttl: CACHE_TTL_MS });

// Cache of pending signatures.
const pendingSigns = new TTLCache({ max: MAX_CACHE_SIZE, ttl: CACHE_TTL_MS });

/**
 * @typedef {import('./response').CollectResponse} CollectResponse
 */

/**
 * Creates a random order reference.
 *
 * @returns {string} A random order reference.
 */
export function createOrderRef() {
  return randomUUID();
}

/**
 * Checks if a pending authentication exists in the cache.
 *
 * @param {string} orderRef - The order reference.
 *
 * @returns {boolean} True if the pending authentication exists.
 */
export function hasPendingAuth(orderRef) {
  return pendingAuths.has(orderRef);
}

/**
 * Gets the responses for a pending authentication from the cache.
 *
 * @param {string} orderRef - The order reference.
 *
 * @returns {CollectResponse[]=} The cached responses or undefined if none were found.
 */
export function getPendingAuth(orderRef) {
  return pendingAuths.get(orderRef);
}

/**
 * Stores the responses for a pending authentication in the cache.
 *
 * @param {string} orderRef - The order reference.
 * @param {CollectResponse[]} responses - The responses to store.
 */
export function setPendingAuth(orderRef, responses) {
  pendingAuths.set(orderRef, responses);
}

/**
 * Deletes the responses for a pending authentication in the cache.
 *
 * @param {string} orderRef - The order reference.
 *
 * @returns {boolean} True if the responses were deleted.
 */
export function deletePendingAuth(orderRef) {
  return pendingAuths.delete(orderRef);
}

/**
 * Checks if a pending signature exists in the cache.
 *
 * @param {string} orderRef - The order reference.
 *
 * @returns {boolean} True if the pending signature exists.
 */
export function hasPendingSign(orderRef) {
  return pendingSigns.has(orderRef);
}

/**
 * Gets the responses for a pending signatures from the cache.
 *
 * @param {string} orderRef - The order reference.
 *
 * @returns {CollectResponse[]=} The cached responses or undefined if none were found.
 */
export function getPendingSign(orderRef) {
  return pendingSigns.get(orderRef);
}

/**
 * Stores the responses for a pending signature in the cache.
 *
 * @param {string} orderRef - The order reference.
 * @param {CollectResponse[]} responses - The responses to store.
 */
export function setPendingSign(orderRef, responses) {
  pendingSigns.set(orderRef, responses);
}

/**
 * Deletes the responses for a pending signature in the cache.
 *
 * @param {string} orderRef - The order reference.
 *
 * @returns {boolean} True if the responses were deleted.
 */
export function deletePendingSign(orderRef) {
  return pendingSigns.delete(orderRef);
}
