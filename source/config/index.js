/**
 * @file Holds the configuration settings. This has been placed in a separate
 * folder so that it can be overridden at runtime.
 */

/**
 * BankID clients.
 */
const clients = {
  IOS_14_6: {
    type: 'IOS',
    version: '14.6',
    uhi: 'GI75maOnOYyg0bCbup2JK59oZH6p',
    osVersion: '7.28.0',
  },
  OS_X_12_5: {
    type: 'OS_X',
    version: '12.5',
    uhi: '7ApoZbybFpDz6BGzUo+0A9qXCsxx',
    osVersion:
      'Personal=7.13.0.4&BankID_exe=7.13.0.4&BISP=7.13.0.4&platform=macosx&os_version=12.5&display_version=&uhi=7ApoZbybFpDz6BGzUo+0A9qXCsxx&legacyuhi=7ApoZbybFpDz6BGzUo+0A9qXCsxx&best_before=1667066973&',
  },
};

/**
 * The configuration settings.
 */
const config = {
  /**
   * The log settings.
   */
  logging: {
    // NB: Set this to debug to dump the request and response data to stdout.
    level: 'info',
  },

  /**
   * The TLS settings.
   */
  tls: {
    port: 3000,
    keyFile: 'data/tls/server.key',
    certFile: 'data/tls/server.crt',
    caFile: 'data/tls/client-ca.crt',
  },

  /**
   * The BankID-related settings.
   */
  bankId: {
    /**
     * The chain of certificates to include in the signature in addition to the
     * end-user certificate.
     */
    certChain: [
      'data/bankid/customer-ca.crt',
      'data/bankid/intermediate-ca.crt',
    ],

    /**
     * The user profiles.
     */
    profiles: {
      default: {
        cert: 'data/bankid/user-200211242383.crt',
        ipAddress: '192.168.0.1',
        client: clients.IOS_14_6,
      },
    },
  },
};

export default config;
