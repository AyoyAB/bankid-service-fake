import { randomBytes } from 'node:crypto';

import { base64Encode } from './base64.js';

/**
 * Creates the Reference element for the bankIdSignedData element.
 *
 * NB: This just returns a random value at present.
 *
 * @returns {string} The created element.
 */
function createSignedDataReferenceElement() {
  // Generate a 32 byte random digest.
  const digest = randomBytes(32);

  const encodedDigest = base64Encode(digest);

  return `<Reference Type="http://www.bankid.com/signature/v1.0.0/types" URI="#bidSignedData"><Transforms><Transform Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315"/></Transforms><DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/><DigestValue>${encodedDigest}</DigestValue></Reference>`;
}

/**
 * Creates the Reference element for the KeyInfo element.
 *
 * NB: This just returns a random value at present.
 *
 * @returns {string} The created element.
 */
function createKeyInfoReferenceElement() {
  // Generate a 32 byte random digest.
  const digest = randomBytes(32);

  const encodedDigest = base64Encode(digest);

  return `<Reference URI="#bidKeyInfo"><Transforms><Transform Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315"/></Transforms><DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/><DigestValue>${encodedDigest}</DigestValue></Reference>`;
}

/**
 * Creates the SignedInfo element.
 *
 * @returns {string} The created element.
 */
export function createSignedInfoElement() {
  const signedDataReferenceElement = createSignedDataReferenceElement();
  const keyInfoReferenceElement = createKeyInfoReferenceElement();

  return `<SignedInfo xmlns="http://www.w3.org/2000/09/xmldsig#"><CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315"/><SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"/>${signedDataReferenceElement}${keyInfoReferenceElement}</SignedInfo>`;
}

/**
 * Creates a SignatureValue element.
 *
 * NB: This just returns a random value at present.
 *
 * @returns {string} The created element.
 */
export function createSignatureValueElement() {
  // Generate a 256 byte random signature.
  const signature = randomBytes(256);

  const encodedSignature = base64Encode(signature);

  return `<SignatureValue>${encodedSignature}</SignatureValue>`;
}

/**
 * Creates a X509Certificate element from the supplied certificate.
 *
 * @param {X509Certificate} cert - The certificate.
 *
 * @returns {string} The created element.
 */
function createX509CertificateElement(cert) {
  // Base64 encode the raw certificate data.
  const encodedCert = cert.raw.toString('base64');

  return `<X509Certificate>${encodedCert}</X509Certificate>`;
}

/**
 * Creates the KeyInfo element from the supplied certificates.
 *
 * The KeyInfo element contains the end-user certificate chain, excluding the
 * root CA. The certificate ordering is preserved, and is expected to be
 * the end-user certificate, the issuing bank's customer CA, and finally the
 * issuing bank's intermediate CA.
 *
 * @param {X509Certificate[]} certs - The certificates to include.
 *
 * @returns {string} The created element.
 */
export function createKeyInfoElement(certs) {
  let certificateElements = '';
  for (const cert of certs) {
    certificateElements += createX509CertificateElement(cert);
  }

  return `<KeyInfo Id="bidKeyInfo" xmlns="http://www.w3.org/2000/09/xmldsig#"><X509Data>${certificateElements}</X509Data></KeyInfo>`;
}

/**
 * Creates the root Signature element.
 *
 * @param {X509Certificate[]} certs - The certificates to include.
 * @param {string} bankIdSignedDataElement - The bankIdSignedData element to include.
 *
 * @returns {string} The created element.
 */
export function createSignatureElement(certs, bankIdSignedDataElement) {
  const signedInfoElement = createSignedInfoElement();
  const signatureValueElement = createSignatureValueElement();
  const keyInfoElement = createKeyInfoElement(certs);

  return `<?xml version="1.0" encoding="UTF-8" standalone="no"?><Signature xmlns="http://www.w3.org/2000/09/xmldsig#">${signedInfoElement}${signatureValueElement}${keyInfoElement}<Object>${bankIdSignedDataElement}</Object></Signature>`;
}
