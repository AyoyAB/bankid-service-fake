import { randomBytes } from 'node:crypto';

/**
 * Creates the optional usrVisibleData signed data element.
 *
 * @param {AuthSignRequest} req - The auth or sign request.
 *
 * @returns {string} The created element.
 */
export function createUsrVisibleDataElement(req) {
  if (!req.userVisibleData) {
    // If the request doesn't include visible data we can skip this.
    return '';
  }

  // Optionally add a data format indicator.
  let formatString = '';
  if (req.userVisibleDataFormat) {
    formatString = `format="${req.userVisibleDataFormat}" `;
  }

  return `<usrVisibleData charset="UTF-8" ${formatString}visible="wysiwys">${req.userVisibleData}</usrVisibleData>`;
}

/**
 * Creates the usrNonVisibleData signed data element.
 *
 * @param {AuthSignRequest} req - The auth or sign request.
 *
 * @returns {string} The created element.
 */
export function createUsrNonVisibleDataElement(req) {
  if (!req.userNonVisibleData) {
    // If the request doesn't include non-visible data we can skip this.
    return '';
  }

  return `<usrNonVisibleData>${req.userNonVisibleData}</usrNonVisibleData>`;
}

/**
 * Creates the srvInfo signed data element.
 *
 * @param {X509Certificate} cert - The TLS client certificate.
 *
 * @returns {string} The created element.
 */
export function createSrvInfoElement(cert) {
  // We need to get the certificate subject name in the right format.
  const name = cert.subject
    .split(/\r?\n/)
    .reverse()
    .join(',')
    .replace(/^CN=/, 'cn=')
    .replace(',O=', ',o=')
    .replace(',C=', ',c=');

  // Generate a 20 byte random nonce.
  const nonce = randomBytes(20);

  // Extract the display name from the subject.
  const displayName = name.match(/,name=([^,]+),/);

  // Encode the respective elements.
  const encodedName = Buffer.from(name).toString('base64');
  const encodedNonce = Buffer.from(nonce).toString('base64');
  const encodedDisplayName = Buffer.from(displayName[1]).toString('base64');

  return `<srvInfo><name>${encodedName}</name><nonce>${encodedNonce}</nonce><displayName>${encodedDisplayName}</displayName></srvInfo>`;
}

/**
 * Creates the requirement signed data element.
 *
 * @param {Requirement} requirement - The requirement from the request.
 *
 * @returns {string} The created element.
 */
export function createRequirementElement(requirement) {
  // Optionally include an AllowFingerprint element.
  let allowFingerprintElement = '';
  if (requirement.allowFingerprint != undefined) {
    const value = requirement.allowFingerprint ? 'yes' : 'no';

    allowFingerprintElement = `<condition><type>AllowFingerprint</type><value>${value}</value></condition>`;
  }

  // Optionally include a CertificatePolicies element.
  let certificatePoliciesElement = '';
  if (
    requirement.certificatePolicies != undefined &&
    requirement.certificatePolicies.length > 0
  ) {
    certificatePoliciesElement = `<condition><type>CertificatePolicies</type><value>${requirement.certificatePolicies.join()}</value></condition>`;
  }

  // Optionally include an IssuerCn element.
  let issuerCnElement = '';
  if (requirement.issuerCn != undefined) {
    issuerCnElement = `<condition><type>IssuerCn</type><value>${requirement.issuerCn}</value></condition>`;
  }

  // Optionally include a TokenStartRequired element.
  let tokenStartRequiredElement = '';
  if (requirement.tokenStartRequired != undefined) {
    const value = requirement.tokenStartRequired ? 'yes' : 'no';

    tokenStartRequiredElement = `<condition><type>TokenStartRequired</type><value>${value}</value></condition>`;
  }

  return `<requirement>${allowFingerprintElement}${certificatePoliciesElement}${issuerCnElement}${tokenStartRequiredElement}</requirement>`;
}

/**
 * Sample clients.
 */
export const Client = {
  IOS_14_6: {
    type: 'IOS',
    version: '14.6',
    uhi: randomBytes(21).toString('base64'),
    osVersion: '7.28.0',
  },
  OS_X_12_5: {
    type: 'OS_X',
    version: '12.5',
    uhi: randomBytes(21).toString('base64'),
    osVersion:
      'Personal=7.13.0.4&BankID_exe=7.13.0.4&BISP=7.13.0.4&platform=macosx&os_version=12.5&display_version=&uhi=gi9/QWGGDjuUQBi0SEGBtjywtteJ&legacyuhi=gi9/QWGGDjuUQBi0SEGBtjywtteJ&best_before=1667066973&',
  },
};

/**
 * Creates the env signed data element.
 *
 * @param {Client} client - The client.
 * @param {Requirement} requirement - The requirement from the request.
 *
 * @returns {string} The created element.
 */
export function createEnvElement(client, requirement) {
  // Encode the client metadata.
  const encodedType = Buffer.from(client.type).toString('base64');
  const encodedVersion = Buffer.from(client.version).toString('base64');
  const encodedUhi = Buffer.from(client.uhi).toString('base64');

  // Create the requirement element.
  const requirements = createRequirementElement(requirement);

  return `<env><ai><type>${encodedType}</type><deviceInfo>${encodedVersion}</deviceInfo><uhi>${encodedUhi}</uhi><fsib>0</fsib><utb>cs1</utb>${requirements}<uauth>pw</uauth></ai></env>`;
}

/**
 * Creates the clientInfo signed data element.
 *
 * @param {Client} client - The client.
 * @param {Requirement} requirement - The requirement from the request.
 * @param {'Identification' | 'Signing'} funcId - The function that was called.
 *
 * @returns {string} The created element.
 */
export function createClientInfoElement(client, requirement, funcId) {
  // Encode the client metadata.
  const encodedVersion = Buffer.from(client.osVersion).toString('base64');

  // Create the env element.
  const envElement = createEnvElement(client, requirement);

  return `<clientInfo><funcId>${funcId}</funcId><version>${encodedVersion}</version>${envElement}</clientInfo>`;
}

/**
 * Creates the bankIdSignedData signed data element.
 *
 * @param {AuthSignRequest} req - The auth or sign request.
 * @param {X509Certificate} cert - The relying party certificate.
 * @param {'Identification' | 'Signing'} funcId - The function that was called.
 * @param {Client} client - The client.
 *
 * @returns {string} The created element.
 */
export function createBankIdSignedDataElement(req, cert, funcId, client) {
  // Create the top-level signature elements.
  const usrVisibleData = createUsrVisibleDataElement(req);
  const usrNonVisibleData = createUsrNonVisibleDataElement(req);
  const srvInfo = createSrvInfoElement(cert);
  const clientInfo = createClientInfoElement(client, req.requirement, funcId);

  return `<bankIdSignedData xmlns="http://www.bankid.com/signature/v1.0.0/types" Id="bidSignedData">${usrVisibleData}${usrNonVisibleData}${srvInfo}${clientInfo}</bankIdSignedData>`;
}

// TODO: Create the XMLDSIG itself.
