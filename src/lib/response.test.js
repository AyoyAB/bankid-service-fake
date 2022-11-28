import { X509Certificate } from 'node:crypto';

import * as response from './response';

// This is a test end-user BankID certificate.
const endUserCertData = `-----BEGIN CERTIFICATE-----
MIIFTjCCAzagAwIBAgIIZ3V5pmVtz5cwDQYJKoZIhvcNAQELBQAweDELMAkGA1UE
BhMCU0UxHTAbBgNVBAoMFFRlc3RiYW5rIEEgQUIgKHB1YmwpMRUwEwYDVQQFEwwx
MTExMTExMTExMTExMzAxBgNVBAMMKlRlc3RiYW5rIEEgQ3VzdG9tZXIgQ0ExIHYx
IGZvciBCYW5rSUQgVGVzdDAeFw0yMjExMjMyMzAwMDBaFw0yMzExMjQyMjU5NTla
MIGvMQswCQYDVQQGEwJTRTEdMBsGA1UECgwUVGVzdGJhbmsgQSBBQiAocHVibCkx
DzANBgNVBAQMBlBlcnNvbjENMAsGA1UEKgwEVGVzdDEVMBMGA1UEBRMMMjAwMjEx
MjQyMzgzMTQwMgYDVQQpDCsoMjIxMTI0IDEyLjE0KSBUZXN0IFBlcnNvbiAtIEJh
bmtJRCBww6UgZmlsMRQwEgYDVQQDDAtUZXN0IFBlcnNvbjCCASIwDQYJKoZIhvcN
AQEBBQADggEPADCCAQoCggEBAMsKwpqy3WwD2dGuqay0W6hH6XwTEX06lOsTD/rk
CeqbYmsggvr2jhA6RlGGQ9ribcvVVrTWRov+OFdAufWVdZiLaCsm3kKkYJDWfG1L
ErskvHuL7hTWhuwZzzVXkojXDDuzwYPK2SrBx0+H0b+WuS+rYDKlNXygCm0XNu6b
GrVBXYX6zf7nOC1EfpJslU2XraO9waLYmTrGZg/txiWoOb+7PRUTITwWE8nHwCcn
I4KAkorbdGr+3hz3CqUW82grOuD6RY4YSSaCnesFedN/8LHoMR/S/EUrs6s4omZ4
ACQdJbzhlA486lsELOMrAHX0ntaWTBVIB4xJ4s/HIBVYV0cCAwEAAaOBozCBoDA7
BggrBgEFBQcBAQQvMC0wKwYIKwYBBQUHMAGGH2h0dHA6Ly90ZXN0LnJldm9jYXRp
b25zdGF0dXMuc2UwEQYDVR0gBAowCDAGBgQqAwQFMA4GA1UdDwEB/wQEAwIGQDAf
BgNVHSMEGDAWgBRgen2nWYOMn6SxF+oNQ0OVQ+aZ/TAdBgNVHQ4EFgQUmToQOOdE
uY/R+BdEpM/hRxcMNF0wDQYJKoZIhvcNAQELBQADggIBAG9nBjNt4C/JI+rVih2v
wYsj9+EpXMwFoIXzpUHS2w6Nb9eXIXvv4i6zmWC7z8ypUdSleRgQyzXo9L/pDlQu
v4MUN7ESHGVqTR+zqiHOhsdKRalcb3qgzyPSEEmzu+5/SqUs17maZz3fo41HvYwL
zju8CIQyxaAZrjFUh0MS+MGh4uLzV634hI21GhnZ21OrDzGSM6Ap+VLs/7Bw4ljz
Acv6lgfU6uC/5UsQIycg/h7fS457WqgbplW/hplEOHfY1cDVJJ4piTnPl9raXV7e
Ej8WM5TSfxb41lC8H1q3N1T9niUv1KOQuz8Fo0qNtnWp0DJs1i0kezeYYTxw5RDI
XLn0Bh5UCQdtKzXgeVdlv11/DGXBJmg2qmmegCuxD9sST4WaVQExRKPY7PRqzA9f
FhzIZJQTRulT3R+IYn9+ART5j26y57E4IKZiGwsnDgDF1bdkl55m92kxzv43/D53
BuzR6tFqT5BsN5q03r7+f1XoiUW3OSSNvlrwycPzkuonQdVIcIARACSWfQVytfj/
WjqGGe82pYmQNvv+IAg9VwtD3h1M9cF2g31/MZms0kOkL1/XksLuVpmGjyy2TcNB
gnW4xOAscGuaPb05lUtlejy7Xmmf7HA4RWu8jmoQdVb88vbNnRlyfjGtZK3VTLGc
soWim8OdJufj42qHkAJ9syBU
-----END CERTIFICATE-----`;

var endUserCert;
beforeAll(async () => {
  endUserCert = certFromPem(endUserCertData);
});

describe('createUserObject', () => {
  test('should correctly parse the end-user certificate', () => {
    const expected = {
      personalNumber: '200211242383',
      name: 'Test Person',
      givenName: 'Test',
      surname: 'Person',
    };

    const actual = response.createUserObject(endUserCert);

    expect(actual).toEqual(expected);
  });
});

describe('createUserObject', () => {
  test('should correctly parse the end-user certificate', () => {
    const expected = {
      personalNumber: '200211242383',
      name: 'Test Person',
      givenName: 'Test',
      surname: 'Person',
    };

    const actual = response.createUserObject(endUserCert);

    expect(actual).toEqual(expected);
  });
});

describe('createCertObject', () => {
  test('should correctly parse the end-user certificate', () => {
    const expected = {
      notBefore: '1669244400000',
      notAfter: '1700866799000',
    };

    const actual = response.createCertObject(endUserCert);

    expect(actual).toEqual(expected);
  });
});

describe('createCompletionData', () => {
  test('should correctly encode the completion data', () => {
    const expected = {
      userInfo: {
        personalNumber: '200211242383',
        name: 'Test Person',
        givenName: 'Test',
        surname: 'Person',
      },
      deviceInfo: {
        ipAddress: '192.168.0.1',
      },
      certInfo: {
        notBefore: '1669244400000',
        notAfter: '1700866799000',
      },
      signature: 'signature',
      ocspResponse: 'ocsp',
    };

    const actual = response.createCompletionData(
      endUserCert,
      '192.168.0.1',
      'signature',
      'ocsp'
    );

    expect(actual).toEqual(expected);
  });
});

// Certificate loading helper.
function certFromPem(pemString) {
  return new X509Certificate(Buffer.from(pemString));
}
