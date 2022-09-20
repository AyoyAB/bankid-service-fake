/**
 * The auth or sign requirements.
 *
 * @typedef Requirement
 * @type {object}
 * @property {string=} cardReader - The optional smart card reader requirement.
 * @property {string[]=} certificatePolicies - The optional certificate policy requirements.
 * @property {string=} issuerCn - The optional issuer common name requirement.
 * @property {boolean=} autoStartTokenRequired - The auto start token requirement.
 * @property {boolean=} allowFingerprint - The allow fingerprint requirement.
 * @property {boolean=} tokenStartRequired - The token start requirement.
 */

/**
 * Parses an auth or sign requirement.
 *
 * @param {any} requirement - The requirement.
 *
 * @returns {Requirement} The parsed requirement.
 */
export function parseRequirement(requirement) {
  if (!requirement) {
    return requirement;
  }

  return {
    cardReader: requirement.cardReader,
    certificatePolicies: requirement.certificatePolicies,
    issuerCn: requirement.issuerCn,
    autoStartTokenRequired: requirement.autoStartTokenRequired,
    allowFingerprint: requirement.allowFingerprint,
    tokenStartRequired: requirement.tokenStartRequired,
  };
}

/**
 * The auth or sign call request format.
 *
 * @typedef AuthSignRequest
 * @type {object}
 * @property {string} endUserIp - The end user ip address.
 * @property {string=} personalNumber - The optional end user personal number.
 * @property {string=} userNonVisibleData - The optional non-visible data.
 * @property {string=} userVisibleData - The optional visible data. Required when signing.
 * @property {string=} userVisibleDataFormat - The optional visible data format.
 * @property {Requirement=} requirement - The optional requirements.
 */

/**
 * Parses an auth or sign JSON request body.
 *
 * @param {any} body - The request body.
 *
 * @returns {AuthSignRequest} The parsed request.
 */
export function parseAuthSignRequest(body) {
  if (!body) {
    return body;
  }

  return {
    endUserIp: body.endUserIp,
    personalNumber: body.personalNumber,
    userNonVisibleData: body.userNonVisibleData,
    userVisibleData: body.userVisibleData,
    userVisibleDataFormat: body.userVisibleDataFormat,
    requirement: parseRequirement(body.requirement),
  };
}

/**
 * The collect of cancel call request format.
 *
 * @typedef CollectCancelRequest
 * @type {object}
 * @property {string} orderRef - The order reference returned by auth or sign.
 */

/**
 * Parses a collect or cancel JSON request body.
 *
 * @param {any} body - The request body.
 *
 * @returns {CollectCancelRequest} The parsed request.
 */
export function parseCollectCancelRequest(body) {
  if (!body) {
    return body;
  }

  return { orderRef: body.orderRef };
}
