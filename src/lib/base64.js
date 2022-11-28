/**
 * @file Holds base64 encoding routines.
 */

/**
 * Base64 encodes a string.
 *
 * @param {string} str - The string to encode.
 *
 * @returns {string} The encoded string.
 */
export function base64Encode(str) {
  return Buffer.from(str).toString('base64');
}
