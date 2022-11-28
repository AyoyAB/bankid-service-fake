import { randomUUID } from 'node:crypto';

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

/**
 * The completion information returned with a successful auth or sign.
 *
 * @typedef CompletionData
 * @type {object}
 * @param {X509Certificate} cert - The end-user certificate.
 * @property {string} ipAddress - The device ip address.
 * @property {string} signature - The base64-encoded XML signature.
 * @property {string} ocspResponse - The base64-encoded OCSP response.
 *
 * @returns {CompletionData} The created object.
 */

export function createCompletionData(cert, ipAddress, signature, ocspResponse) {
  const userInfo = createUserObject(cert);
  const deviceInfo = createDevice(ipAddress);
  const certInfo = createCertObject(cert);

  return {
    userInfo,
    deviceInfo,
    certInfo,
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
 * @param {CompletionData} completionData -  The order completion information.
 *
 * @returns {CollectResponse} The created response.
 */
export function createCompleteCollectResponse(orderRef, completionData) {
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
