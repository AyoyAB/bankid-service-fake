import { X509Certificate } from 'node:crypto';
import fs from 'node:fs/promises';

/**
 * @file Holds certificate loading and parsing code.
 */

/**
 * Loads a certificate from file.
 *
 * @param {string} file - Path to the file to load.
 *
 * @returns {X509Certificate} The loaded certificate.
 */
export async function loadCertFromFile(file) {
  const buf = await fs.readFile(file, { encoding: 'utf8' });

  return new X509Certificate(buf);
}

/**
 * Loads a certificate from a PEM string.
 *
 * @param {string} str - Certificate PEM string to parse.
 *
 * @returns {X509Certificate} The loaded certificate.
 */
export function loadCertFromString(str) {
  return new X509Certificate(Buffer.from(str));
}
