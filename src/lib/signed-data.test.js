import { base64Encode } from './base64.js';
import { loadCertFromString } from './cert.js';
import * as signedData from './signed-data.js';

// Test client data.
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

// NB: This is the "official" test certificate from the BankID web site.
const tlsClientCertData = `-----BEGIN CERTIFICATE-----
MIIEyjCCArKgAwIBAgIIMLbIMaRHjMMwDQYJKoZIhvcNAQELBQAwcTELMAkGA1UE
BhMCU0UxHTAbBgNVBAoMFFRlc3RiYW5rIEEgQUIgKHB1YmwpMRUwEwYDVQQFEwwx
MTExMTExMTExMTExLDAqBgNVBAMMI1Rlc3RiYW5rIEEgUlAgQ0EgdjEgZm9yIEJh
bmtJRCBUZXN0MB4XDTIyMDgxNzIyMDAwMFoXDTI0MDgxODIxNTk1OVowcjELMAkG
A1UEBhMCU0UxHTAbBgNVBAoMFFRlc3RiYW5rIEEgQUIgKHB1YmwpMRMwEQYDVQQF
Ewo1NTY2MzA0OTI4MRcwFQYDVQQpDA5UZXN0IGF2IEJhbmtJRDEWMBQGA1UEAwwN
RlAgVGVzdGNlcnQgNDCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAL4L
8ERHNSi7Jph9gj4ah7Ieok5lZHZbNyW1AiJJ1OfeD1lbAzxSidtTu6NfC83zxCjL
q091lHY5G7dpNDt1rN5Y+jQvrtcLc8nUpgqLfEUnbGKzZaHlO97jh6pqO8nj/mal
TrWI70Fr6SO3SxbsgxuwJXlRUAQxI0mPvD1gOd+uymA+EqdYS39ijC2eICHSf7bU
wvmscy8TAyEcT4GYmcjai1vbIjlhemmAv+NKJiSpD+zqvuHGIzBm71/Fd6cTAXqk
HkqTlJsxF2m6eojKCfcm5uAvSTXhVbGM155wmpzLskzkQ0dx6LbRNtA+BDe1MsAA
v8aE2FQ0j31ALgZePY0CAwEAAaNlMGMwEQYDVR0gBAowCDAGBgQqAwQFMA4GA1Ud
DwEB/wQEAwIHgDAfBgNVHSMEGDAWgBTiuVUIvGKgRjldgAxQSpIBy0zvizAdBgNV
HQ4EFgQUoiM2SwR2MdMVjaZz04J9LbOEau8wDQYJKoZIhvcNAQELBQADggIBAGBA
X1IC7mg1blaeqrTW+TtPkF7GvsbsWIh0RgG9DYRtXXofad3bn6kbDrfFXKZzv4JH
ERmJSyLXzMLoiwJB16V8Vz/kHT7AK94ZpLPjedPr2O4U2DGQXu1TwP5nkfgQxTeP
K/XnDVHNsMKqTnc+YNX6mj/UyLnbs8eq/a9uHOBJR30e0OPAdlc2fTbBT2Cui29E
ctcNH4LrcH4au9vO+RpEUm1hqZy3mHrx1p8Six6+qJSERNYIWTID8gklyp8MSyG5
q7dk0WcyvytM1dmVf/q+KriljaZ8x2zLhQRz9vpgnfwJ6Qh3cLVoPItVdQ03WpKW
WAB1NCMMyNcszkLZ9OO3IRz8iyWV/KWGI07ngVuGa7dHuTje6ZjcObBCr2e4uuU+
CLENcretUAv0BtCsOBhQLXZ0qzqrgsVebTRQzm2zTM0yfBpcTtPd3MOMFeMQTHJJ
8QH6twAKeJfY1lUCTXJYy1ZcrKnrNehksST8tk98Km9t5M2X59QZk7mJzzsUbnWr
t+izid7xF7FAgDYj9XJgQHz04a4RjRSw5/6dgexAgvGoeOkG7uUhYd5DEYQCyQyR
Zy69pJN32L0nM2dC2e3NFU5BOBwocoKza3hdtSqqvIkj2kzyeU38uaJUco/Vk3OU
s+sQNZbk5C1pxkLLwzu815tKg77Om4Nwbi+bgDvI
-----END CERTIFICATE-----`;

var tlsClientCert;
beforeAll(async () => {
  tlsClientCert = loadCertFromString(tlsClientCertData);
});

describe('createUsrVisibleDataElement', () => {
  test('Request without visible data should return empty element', () => {
    const request = {};

    const element = signedData.createUsrVisibleDataElement(request);

    expect(element).toBe('');
  });

  test('Request with visible data should return it 1/2', () => {
    const request = {
      userVisibleData: 'data',
    };

    const element = signedData.createUsrVisibleDataElement(request);

    expect(element).toBe(
      '<usrVisibleData charset="UTF-8" visible="wysiwys">data</usrVisibleData>'
    );
  });

  test('Request with visible data should return it 2/2', () => {
    const request = {
      userVisibleData: 'data',
      userVisibleDataFormat: 'format',
    };

    const element = signedData.createUsrVisibleDataElement(request);

    expect(element).toBe(
      '<usrVisibleData charset="UTF-8" format="format" visible="wysiwys">data</usrVisibleData>'
    );
  });
});

describe('createUsrNonVisibleDataElement', () => {
  test('Request without non-visible data should return empty element', () => {
    const request = {};

    const element = signedData.createUsrNonVisibleDataElement(request);

    expect(element).toBe('');
  });

  test('Request with non-visible data should return it', () => {
    const request = {
      userNonVisibleData: 'data',
    };

    const element = signedData.createUsrNonVisibleDataElement(request);

    expect(element).toBe('<usrNonVisibleData>data</usrNonVisibleData>');
  });
});

describe('createSrvInfoElement', () => {
  test('should correctly encode the element', () => {
    const encodedName = base64Encode(
      'cn=FP Testcert 4,name=Test av BankID,serialNumber=5566304928,o=Testbank A AB (publ),c=SE'
    );
    const encodedDisplayName = base64Encode('Test av BankID');
    const regExp = new RegExp(
      `^<srvInfo><name>${encodedName}</name><nonce>[^<]+</nonce><displayName>${encodedDisplayName}</displayName></srvInfo>$`
    );

    const element = signedData.createSrvInfoElement(tlsClientCert);

    expect(element).toMatch(regExp);
  });
});

describe('createRequirementElement', () => {
  test('should correctly encode an empty requirement', () => {
    const requirement = {};

    const element = signedData.createRequirementElement(requirement);

    expect(element).toBe('<requirement></requirement>');
  });

  test('should correctly encode a false allowFingerprint', () => {
    const requirement = {
      allowFingerprint: false,
    };

    const element = signedData.createRequirementElement(requirement);

    expect(element).toBe(
      '<requirement><condition><type>AllowFingerprint</type><value>no</value></condition></requirement>'
    );
  });

  test('should correctly encode a true allowFingerprint', () => {
    const requirement = {
      allowFingerprint: true,
    };

    const element = signedData.createRequirementElement(requirement);

    expect(element).toBe(
      '<requirement><condition><type>AllowFingerprint</type><value>yes</value></condition></requirement>'
    );
  });

  test('should correctly encode an empty policy array', () => {
    const requirement = {
      certificatePolicies: [],
    };

    const element = signedData.createRequirementElement(requirement);

    expect(element).toBe('<requirement></requirement>');
  });

  test('should correctly encode a single-policy array', () => {
    const requirement = {
      certificatePolicies: ['1.2.3.4.5'],
    };

    const element = signedData.createRequirementElement(requirement);

    expect(element).toBe(
      '<requirement><condition><type>CertificatePolicies</type><value>1.2.3.4.5</value></condition></requirement>'
    );
  });

  test('should correctly encode a multi-policy array', () => {
    const requirement = {
      certificatePolicies: ['1.2.3.4.5', '6.7.8.9.0'],
    };

    const element = signedData.createRequirementElement(requirement);

    expect(element).toBe(
      '<requirement><condition><type>CertificatePolicies</type><value>1.2.3.4.5,6.7.8.9.0</value></condition></requirement>'
    );
  });

  test('should correctly encode an issuer CN', () => {
    const requirement = {
      issuerCn: 'issuer',
    };

    const element = signedData.createRequirementElement(requirement);

    expect(element).toBe(
      '<requirement><condition><type>IssuerCn</type><value>issuer</value></condition></requirement>'
    );
  });

  test('should correctly encode a false tokenStartRequired', () => {
    const requirement = {
      tokenStartRequired: false,
    };

    const element = signedData.createRequirementElement(requirement);

    expect(element).toBe(
      '<requirement><condition><type>TokenStartRequired</type><value>no</value></condition></requirement>'
    );
  });

  test('should correctly encode a true tokenStartRequired', () => {
    const requirement = {
      tokenStartRequired: true,
    };

    const element = signedData.createRequirementElement(requirement);

    expect(element).toBe(
      '<requirement><condition><type>TokenStartRequired</type><value>yes</value></condition></requirement>'
    );
  });

  test('should correctly encode multiple requirements', () => {
    const requirement = {
      allowFingerprint: true,
      certificatePolicies: ['1.2.3.4.5'],
    };

    const element = signedData.createRequirementElement(requirement);

    expect(element).toBe(
      '<requirement><condition><type>AllowFingerprint</type><value>yes</value></condition><condition><type>CertificatePolicies</type><value>1.2.3.4.5</value></condition></requirement>'
    );
  });
});

describe('createEnvElement', () => {
  test('should correctly encode a simple mobile request', () => {
    const client = clients.IOS_14_6;
    const requirement = {};

    const encodedType = base64Encode(client.type);
    const encodedVersion = base64Encode(client.version);
    const encodedUhi = base64Encode(client.uhi);

    const element = signedData.createEnvElement(client, requirement);

    expect(element).toBe(
      `<env><ai><type>${encodedType}</type><deviceInfo>${encodedVersion}</deviceInfo><uhi>${encodedUhi}</uhi><fsib>0</fsib><utb>cs1</utb><requirement></requirement><uauth>pw</uauth></ai></env>`
    );
  });

  test('should correctly encode a more complex desktop request', () => {
    const client = clients.OS_X_12_5;
    const requirement = {
      allowFingerprint: true,
      certificatePolicies: ['1.2.3.4.5'],
    };

    const encodedType = base64Encode(client.type);
    const encodedVersion = base64Encode(client.version);
    const encodedUhi = base64Encode(client.uhi);

    const element = signedData.createEnvElement(client, requirement);

    expect(element).toBe(
      `<env><ai><type>${encodedType}</type><deviceInfo>${encodedVersion}</deviceInfo><uhi>${encodedUhi}</uhi><fsib>0</fsib><utb>cs1</utb><requirement><condition><type>AllowFingerprint</type><value>yes</value></condition><condition><type>CertificatePolicies</type><value>1.2.3.4.5</value></condition></requirement><uauth>pw</uauth></ai></env>`
    );
  });
});

describe('createClientInfoElement', () => {
  test('should correctly encode a simple mobile auth request', () => {
    const client = clients.IOS_14_6;
    const requirement = {};
    const funcId = 'Identification';

    const encodedType = base64Encode(client.type);
    const encodedVersion = base64Encode(client.version);
    const encodedUhi = base64Encode(client.uhi);
    const encodedOsVersion = base64Encode(client.osVersion);

    const element = signedData.createClientInfoElement(
      client,
      requirement,
      funcId
    );

    expect(element).toBe(
      `<clientInfo><funcId>${funcId}</funcId><version>${encodedOsVersion}</version><env><ai><type>${encodedType}</type><deviceInfo>${encodedVersion}</deviceInfo><uhi>${encodedUhi}</uhi><fsib>0</fsib><utb>cs1</utb><requirement></requirement><uauth>pw</uauth></ai></env></clientInfo>`
    );
  });

  test('should correctly encode a more complex desktop sign request', () => {
    const client = clients.OS_X_12_5;
    const requirement = {
      allowFingerprint: true,
      certificatePolicies: ['1.2.3.4.5'],
    };
    const funcId = 'Signing';

    const encodedType = base64Encode(client.type);
    const encodedVersion = base64Encode(client.version);
    const encodedUhi = base64Encode(client.uhi);
    const encodedOsVersion = base64Encode(client.osVersion);

    const element = signedData.createClientInfoElement(
      client,
      requirement,
      funcId
    );

    expect(element).toBe(
      `<clientInfo><funcId>${funcId}</funcId><version>${encodedOsVersion}</version><env><ai><type>${encodedType}</type><deviceInfo>${encodedVersion}</deviceInfo><uhi>${encodedUhi}</uhi><fsib>0</fsib><utb>cs1</utb><requirement><condition><type>AllowFingerprint</type><value>yes</value></condition><condition><type>CertificatePolicies</type><value>1.2.3.4.5</value></condition></requirement><uauth>pw</uauth></ai></env></clientInfo>`
    );
  });
});

describe('createBankIdSignedDataElement', () => {
  test('should correctly encode a simple mobile auth request', () => {
    const request = {
      requirement: {},
    };
    const cert = tlsClientCert;
    const funcId = 'Identification';
    const client = clients.IOS_14_6;

    const encodedName = base64Encode(
      'cn=FP Testcert 4,name=Test av BankID,serialNumber=5566304928,o=Testbank A AB (publ),c=SE'
    );
    const encodedDisplayName = base64Encode('Test av BankID');
    const encodedType = base64Encode(client.type);
    const encodedVersion = base64Encode(client.version);
    const encodedUhi = base64Encode(client.uhi);
    const encodedOsVersion = base64Encode(client.osVersion);
    const regExp = new RegExp(
      `^<bankIdSignedData xmlns="http://www.bankid.com/signature/v1.0.0/types" Id="bidSignedData"><srvInfo><name>${encodedName}</name><nonce>[^<]+</nonce><displayName>${encodedDisplayName}</displayName></srvInfo><clientInfo><funcId>${funcId}</funcId><version>${encodedOsVersion}</version><env><ai><type>${encodedType}</type><deviceInfo>${encodedVersion}</deviceInfo><uhi>${encodedUhi}</uhi><fsib>0</fsib><utb>cs1</utb><requirement></requirement><uauth>pw</uauth></ai></env></clientInfo></bankIdSignedData>$`
    );

    const element = signedData.createBankIdSignedDataElement(
      request,
      cert,
      funcId,
      client
    );

    expect(element).toMatch(regExp);
  });

  test('should correctly encode a more complex desktop sign request', () => {
    const request = {
      userVisibleData: 'vis-data',
      userVisibleDataFormat: 'format',
      userNonVisibleData: 'non-vis-data',
      requirement: {
        allowFingerprint: true,
        certificatePolicies: ['1.2.3.4.5'],
      },
    };
    const cert = tlsClientCert;
    const funcId = 'Signing';
    const client = clients.OS_X_12_5;

    const encodedName = base64Encode(
      'cn=FP Testcert 4,name=Test av BankID,serialNumber=5566304928,o=Testbank A AB (publ),c=SE'
    );
    const encodedDisplayName = base64Encode('Test av BankID');
    const encodedType = base64Encode(client.type);
    const encodedVersion = base64Encode(client.version);
    const encodedUhi = base64Encode(client.uhi);
    const encodedOsVersion = base64Encode(client.osVersion);
    const regExp = new RegExp(
      `^<bankIdSignedData xmlns="http://www.bankid.com/signature/v1.0.0/types" Id="bidSignedData"><usrVisibleData charset="UTF-8" format="format" visible="wysiwys">vis-data</usrVisibleData><usrNonVisibleData>non-vis-data</usrNonVisibleData><srvInfo><name>${encodedName}</name><nonce>[^<]+</nonce><displayName>${encodedDisplayName}</displayName></srvInfo><clientInfo><funcId>${funcId}</funcId><version>${encodedOsVersion}</version><env><ai><type>${encodedType}</type><deviceInfo>${encodedVersion}</deviceInfo><uhi>${encodedUhi}</uhi><fsib>0</fsib><utb>cs1</utb><requirement><condition><type>AllowFingerprint</type><value>yes</value></condition><condition><type>CertificatePolicies</type><value>1.2.3.4.5</value></condition></requirement><uauth>pw</uauth></ai></env></clientInfo></bankIdSignedData>$`
    );

    const element = signedData.createBankIdSignedDataElement(
      request,
      cert,
      funcId,
      client
    );

    expect(element).toMatch(regExp);
  });
});
