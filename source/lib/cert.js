/**
 * @file Holds certificate loading and parsing code.
 */

import { X509Certificate } from 'node:crypto';
import fs from 'node:fs';

/**
 * Loads a certificate from file.
 *
 * @param {string} file - Path to the file to load.
 *
 * @returns {X509Certificate} The loaded certificate.
 */
export function loadCertFromFile(file) {
  const buf = fs.readFileSync(file, { encoding: 'utf8' });

  return new X509Certificate(buf);
}

/**
 * Loads certificates from an array of files.
 *
 * @param {string[]} files - Paths to the files to load.
 *
 * @returns {X509Certificate[]} The loaded certificates.
 */
export function loadCertsFromFile(files) {
  return files.map((file) => loadCertFromFile(file));
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
