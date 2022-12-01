/**
 * @file Holds the dispatcher used to dispatch auth or sign requests to the
 * appropriate scenario. This has been placed in a separate folder so that it
 * can be overridden at runtime.
 */

import createScenario from '../scenarios/index.js';

/**
 * The auth or sign request dispatch function signature.
 *
 * @typedef {function(X509Certificate, AuthSignRequest): AuthSignResponse} Dispatch
 */

/**
 * A Dispatcher holds both an auth and a sign request dispatch function.
 *
 * @typedef Dispatcher
 * @type {object}
 * @property {Dispatch} auth - Auth request dispatch function.
 * @property {Dispatch} sign - Sign request dispatch function.
 */

/**
 * Initializes and returns the request dispatcher.
 *
 * @returns {Dispatcher} The created dispatcher.
 */
export default function create() {
  // The default implementation simply initializes the default scenario here.
  const scenario = createScenario();

  return {
    /**
     * Dispatches auth requests.
     *
     * @param {X509Certificate} clientCert - The relying-party TLS client cert.
     * @param {AuthSignRequest} req - The parsed auth request.
     *
     * @returns {AuthSignResponse} The auth response to send.
     */
    auth: function (clientCert, req) {
      // The default implementation simply calls the default scenario for
      // all received requests.
      return scenario.auth(clientCert, req);
    },

    /**
     * Dispatches sign requests.
     *
     * @param {X509Certificate} clientCert - The relying-party TLS client cert.
     * @param {AuthSignRequest} req - The parsed sign request.
     *
     * @returns {AuthSignResponse} The sign response to send.
     */
    sign: function (clientCert, req) {
      // The default implementation simply calls the default scenario for
      // all received requests.
      return scenario.sign(clientCert, req);
    },
  };
}
