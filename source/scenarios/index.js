/**
 * @file Holds the default scenario used to handle auth and sign requests. This
 * has been placed in a separate folder so that it can be overridden at runtime.
 */

import config from '../config/index.js';
import {
  createOrderRef,
  setPendingAuth,
  setPendingSign,
} from '../lib/cache.js';
import { loadCertFromFile, loadCertsFromFile } from '../lib/cert.js';
import {
  createPendingCollectResponse,
  createCompleteCollectResponse,
  createAuthSignResponse,
} from '../lib/response.js';

/**
 * The auth or sign call handler function signature.
 *
 * @typedef {function(X509Certificate, AuthSignRequest): AuthSignResponse} Handler
 */

/**
 * A Scenario holds both an auth and a sign handler function.
 *
 * @typedef Scenario
 * @type {object}
 * @property {Handler} auth - Auth request handler function.
 * @property {Handler} sign - Sign request handler function.
 */

/**
 * Initializes and returns the default scenario.
 *
 * @returns {Scenario} The created scenario.
 */
export default function create() {
  // Load and cache the CA certificate chain.
  const caCerts = loadCertsFromFile(config.bankId.certChain);

  // Use the default profile.
  const profile = config.bankId.profiles.default;

  // Load and cache the end-user cert.
  const userCert = loadCertFromFile(profile.cert);

  return {
    /**
     * Handles auth requests.
     *
     * @param {X509Certificate} clientCert - The relying-party TLS client cert.
     * @param {AuthSignRequest} req - The parsed auth request.
     *
     * @returns {AuthSignResponse} The auth response to send.
     */
    auth: function (clientCert, req) {
      // Generate a new order reference for this authentication.
      const orderRef = createOrderRef();

      // Create the collect responses to return.
      const collectResponses = [
        // TODO: Repeat these for as long as required.
        createPendingCollectResponse(orderRef, 'outstandingTransaction'),
        // TODO: Repeat these for as long as required.
        createPendingCollectResponse(orderRef, 'userSign'),
        // Finally, return a completed authentication.
        createCompleteCollectResponse(
          orderRef,
          req,
          'Identification',
          caCerts,
          clientCert,
          userCert,
          profile.client,
          profile.ipAddress
        ),
      ];

      // Store the pending collect responses in the cache.
      setPendingAuth(orderRef, collectResponses);

      // Create the response from the order reference.
      return createAuthSignResponse(orderRef);
    },

    /**
     * Handles sign requests.
     *
     * @param {X509Certificate} clientCert - The relying-party TLS client cert.
     * @param {AuthSignRequest} req - The parsed sign request.
     *
     * @returns {AuthSignResponse} The sign response to send.
     */
    sign: function (clientCert, req) {
      // Generate a new order reference for this authentication.
      const orderRef = createOrderRef();

      // Create the collect responses to return.
      const collectResponses = [
        // TODO: Repeat these for as long as required.
        createPendingCollectResponse(orderRef, 'outstandingTransaction'),
        // TODO: Repeat these for as long as required.
        createPendingCollectResponse(orderRef, 'userSign'),
        // Finally, return a completed signature.
        createCompleteCollectResponse(
          orderRef,
          req,
          'Signing',
          caCerts,
          clientCert,
          userCert,
          profile.client,
          profile.ipAddress
        ),
      ];

      // Store the pending collect responses in the cache.
      setPendingSign(orderRef, collectResponses);

      // Create the response from the order reference.
      return createAuthSignResponse(orderRef);
    },
  };
}
