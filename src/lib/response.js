import { randomUUID } from 'node:crypto';

import { base64Encode } from './base64.js';
import { createSignatureElement } from './signature.js';
import { createBankIdSignedDataElement } from './signed-data.js';

/**
 * The respone returned from an auth or sign call.
 *
 * @typedef AuthSignResponse
 * @type {object}
 * @property {string} orderRef - The order reference. This is used in subsequent collect or cancel calls.
 * @property {string} autoStartToken - Normally used to start the BankID app. Not applicable here.
 * @property {string} qrStartToken - Normally used to start the BankID app. Not applicable here.
 * @property {string} qrStartSecret - Normally used to start the BankID app. Not applicable here.
 */

/**
 * Creates an auth or sign JSON response body with random UUID:s.
 *
 * @param {string} orderRef - The order reference.
 *
 * @returns {AuthSignResponse} The created response.
 */
export function createAuthSignResponse(orderRef) {
  return {
    orderRef,
    autoStartToken: randomUUID(),
    qrStartToken: randomUUID(),
    qrStartSecret: randomUUID(),
  };
}

/**
 * The respone returned from a cancel call is an empty object.
 *
 * @typedef CancelResponse
 * @type {object}
 */

/**
 * Creates a (blank) cancel JSON response body.
 *
 * @returns {CancelResponse} The created response.
 */
export function createCancelResponse() {
  return {};
}

/**
 * The end user information returned in the completion information.
 *
 * @typedef User
 * @type {object}
 * @property {string} personalNumber - The user's Swedish personal number.
 * @property {string} name - The user's name.
 * @property {string} givenName - The user's given name.
 * @property {string} surname - The user's surname.
 */

/**
 * Creates a user object from the supplied end-user certificate.
 *
 * @param {X509Certificate} cert - The end-user certificate.
 *
 * @returns {User} The created object.
 */
export function createUserObject(cert) {
  const subject = cert.subject;
  const personalNumber = subject.match(/^serialNumber=(.*)$/m)[1];
  const name = subject.match(/^CN=(.*)$/m)[1];
  const givenName = subject.match(/^GN=(.*)$/m)[1];
  const surname = subject.match(/^SN=(.*)$/m)[1];

  return {
    personalNumber,
    name,
    givenName,
    surname,
  };
}

/**
 * The device information returned in the completion information.
 *
 * @typedef Device
 * @type {object}
 * @property {string} ipAddress - The BankID app ip address.
 */

/**
 * Creates a device object from the supplied IP address.
 *
 * @param {string} ipAddress - The device IP address.
 *
 * @returns {Device} The created object.
 */
export function createDevice(ipAddress) {
  return {
    ipAddress,
  };
}

/**
 * The certificate information returned in the completion information.
 *
 * @typedef Cert
 * @type {object}
 * @property {string} notBefore - The certificate validity start date.
 * @property {string} notAfter -The certificate validity end date.
 */

/**
 * Creates a cert object from the supplied end-user certificate.
 *
 * @param {X509Certificate} cert - The end-user certificate.
 *
 * @returns {Cert} The created object.
 */
export function createCertObject(cert) {
  const notBefore = Date.parse(cert.validFrom).toString();
  const notAfter = Date.parse(cert.validTo).toString();

  return {
    notBefore,
    notAfter,
  };
}

// We'll just use a canned OCSP response for now.
// NB: We only export the value for our unit tests.
export const cannedOcspResponse =
  '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';

/**
 * The completion information returned with a successful auth or sign.
 *
 * @typedef CompletionData
 * @type {object}
 * @param {X509Certificate} cert - The end-user certificate.
 * @property {string} ipAddress - The device ip address.
 * @property {string} xmlSignature - The XML signature string.
 *
 * @returns {CompletionData} The created object.
 */

export function createCompletionData(cert, ipAddress, xmlSignature) {
  const userInfo = createUserObject(cert);
  const deviceInfo = createDevice(ipAddress);
  const certInfo = createCertObject(cert);
  const signature = base64Encode(xmlSignature);
  const ocspResponse = cannedOcspResponse;

  return {
    user: userInfo,
    device: deviceInfo,
    cert: certInfo,
    signature,
    ocspResponse,
  };
}

/**
 * @typedef {'failed' | 'pending' | 'complete'} Status
 */

/**
 * @typedef {'outstandingTransaction' | 'noClient' | 'started' | 'userSign' | 'expiredTransaction' | 'certificateErr' | 'userCancel' | 'cancelled' | 'startFailed'} HintCode
 */

/**
 * The respone returned from a collect call.
 *
 * @typedef CollectResponse
 * @type {object}
 * @property {string} orderRef - The order reference.
 * @property {Status} status - The order status.
 * @property {HintCode=} hintCode - The optional order status details.
 * @property {CompletionData=} completionData - The optional completion information.
 */

/**
 * Creates a failed collect JSON response body.
 *
 * @param {string} orderRef - The order reference.
 * @param {HintCode} hintCode - The order status details.
 *
 * @returns {CollectResponse} The created response.
 */
export function createFailedCollectResponse(orderRef, hintCode) {
  return { status: 'failed', orderRef, hintCode };
}

/**
 * Creates a pending collect JSON response body.
 *
 * @param {string} orderRef - The order reference.
 * @param {HintCode} hintCode - The order status details.
 *
 * @returns {CollectResponse} The created response.
 */
export function createPendingCollectResponse(orderRef, hintCode) {
  return { status: 'pending', orderRef, hintCode };
}

/**
 * Creates a completed collect JSON response body.
 *
 * @param {string} orderRef - The order reference.
 * @param {AuthSignRequest} req - The auth or sign request.
 * @param {'Identification' | 'Signing'} funcId - The function that was called.
 * @param {X509Certificate[]} caCerts - The CA certificates to include.
 * @param {X509Certificate} clientCert - The relying party certificate.
 * @param {X509Certificate} userCert - The end-user certificate.
 * @param {Client} client - The client.
 * @property {string} ipAddress - The device ip address.
 *
 * @returns {CollectResponse} The created response.
 */
export function createCompleteCollectResponse(
  orderRef,
  req,
  funcId,
  caCerts,
  clientCert,
  userCert,
  client,
  ipAddress
) {
  // Create the inner signed data element.
  const signedData = createBankIdSignedDataElement(
    req,
    clientCert,
    funcId,
    client
  );

  // Create the xml signature.
  const signature = createSignatureElement([userCert, ...caCerts], signedData);

  // Create the completion data.
  const completionData = createCompletionData(userCert, ipAddress, signature);

  return { status: 'complete', orderRef, completionData };
}

/**
 * The error response.
 *
 * @typedef ErrorResponse
 * @type {object}
 * @property {string} errorCode - The error code.
 * @property {string} details - The error details.
 */

/**
 * Creates an error response.
 *
 * @param {string} errorCode - The error code.
 * @param {string} details - The error details.
 *
 * @returns {ErrorResponse} The created response.
 */
export function createErrorResponse(errorCode, details) {
  return { errorCode, details };
}
