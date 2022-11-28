/**
 * @file Holds the configuration settings. This has been placed in a separate
 * folder so that it can be overridden at runtime.
 */

/**
 * The configuration settings.
 */
const config = {
  /**
   * The port number to listen on
   */
  port: 3000,

  /**
   * The TLS settings.
   */
  tls: {
    keyFile: 'data/tls/server.key',
    certFile: 'data/tls/server.crt',
    caFile: 'data/tls/client-ca.crt',
  },
};

export default config;
