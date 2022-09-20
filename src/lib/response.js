import { randomUUID } from 'crypto';

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

// TODO: Add function for creating end-user info from a test BankID.

/**
 * The device information returned in the completion information.
 *
 * @typedef Device
 * @type {object}
 * @property {string} ipAddress - The BankID app ip address.
 */

/**
 * The certificate information returned in the completion information.
 *
 * @typedef Cert
 * @type {object}
 * @property {string} notBefore - The certificate validity start date.
 * @property {string} notAfter -The certificate validity end date.
 */

// TODO: Add function for creating certificate info from a test BankID.

/**
 * The completion information returned with a successful auth or sign.
 *
 * @typedef CompletionData
 * @type {object}
 * @property {User} user - The end user information.
 * @property {Device} device - The device information.
 * @property {Cert} cert - The user certificate information.
 * @property {string} signature - The base64-encoded XML signature.
 * @property {string} ocspResponse - The base64-encoded OCSP response.
 */

// TODO: Add function for creating completion data from a test BankID, an IP address, a signature and an OCSP response.

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
