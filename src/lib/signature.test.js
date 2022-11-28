import { loadCertFromString } from './cert';
import * as signature from './signature';

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

// This is the "official" test bank customer CA certificate.
const bankCustomerCaCertData = `-----BEGIN CERTIFICATE-----
MIIF3jCCA8agAwIBAgIIFnZVyehmXYwwDQYJKoZIhvcNAQENBQAwbjELMAkGA1UE
BhMCU0UxHTAbBgNVBAoMFFRlc3RiYW5rIEEgQUIgKHB1YmwpMRUwEwYDVQQFEwwx
MTExMTExMTExMTExKTAnBgNVBAMMIFRlc3RiYW5rIEEgQ0EgdjEgZm9yIEJhbmtJ
RCBUZXN0MB4XDTExMDkyMjE0MjExNFoXDTM0MTIwMTE0MjExNFoweDELMAkGA1UE
BhMCU0UxHTAbBgNVBAoMFFRlc3RiYW5rIEEgQUIgKHB1YmwpMRUwEwYDVQQFEwwx
MTExMTExMTExMTExMzAxBgNVBAMMKlRlc3RiYW5rIEEgQ3VzdG9tZXIgQ0ExIHYx
IGZvciBCYW5rSUQgVGVzdDCCAiIwDQYJKoZIhvcNAQEBBQADggIPADCCAgoCggIB
AIW0DPopLEhtawVRwNrE431GVsh/HnWVsXdgOjzUsD7QD30/tfOHROQi9nLuDWkY
1fEUxZ06Yq5LtROoFpkTQ6SRi2RgiUkuCNqMEwsj2eia7KhYRIk/XJkkFp1BvE62
I63vtUzZzS69HAsMNPlfdLU2pIZ2And2QJ2dC0ximmFjY5k5/z7/Nk3JGBbaxLH/
X6zhcNqOpr2Srv9G+lk+Gvy7hQLImNLRV+4G3malHj6QM+wDcRKvT4V+iRdvzP9o
803/g+GL5qiufW6RdT+2lwGifP2d3suL79uGW1HO8qbii/i4HTxDftKdXFslFrXf
R++QUU4B+v6Qyb4rF3qhDfeakgfL8uzftMtTMRlowxIb08jxCehCSaY0CMBHQTS0
LtX1C/VjM6UbbpSa280zSL+xXlS7S727sJB722fzWR3/NSp3MZTbE0QAqMTENY4p
fwc/lXwVn8TvANw1FIxE7ikwIBMFSo6eX2UDDz9ai6dzRrYftI44EtLTv3KV5UDW
cIbsRBvlgBQqquphcuRVv1a6Xo9xeH2+o+Bsr+soumiC6zIFuUuBxB4uqsSqeVQF
kIaepinwhX5CJBZLcORaMZF6I1kGvEDZOVYXOEt9PWg/SsScGM+sf2510Gz0f2om
QjOL5BezdYYKNAwziz9U1Ir1VpvzkJF4SA3W05cmjjKZAgMBAAGjdjB0MB0GA1Ud
DgQWBBRgen2nWYOMn6SxF+oNQ0OVQ+aZ/TAPBgNVHRMBAf8EBTADAQH/MB8GA1Ud
IwQYMBaAFKPyeHkdK0WKyeHKlQnlnm/Oy07FMBEGA1UdIAQKMAgwBgYEKgMEBTAO
BgNVHQ8BAf8EBAMCAQYwDQYJKoZIhvcNAQENBQADggIBADxhyzWSzokyG+hUCp3U
g7QZxbMLK+6IYp+8acRuTSFfr5maH3Mryd87/B2y9K3fW+FXQLpdhVHovKJOAQyv
/t3CA62ZGrzhAXGqCcR9Sn44ecKRJPE9ZJbzalo4wtKRUv04W2ZgFunYTN55TsNn
3bGzcIiAddMq9TMKwIjl6p5i6oIjAmt9/75Qf7qQ/1x20EUdsv+8QPIp1vlB8vAz
Ato+8bZFCRsdMVLRRk96CoS53v4aDYYAMxmsTbgvLqVU5/CNfVEgVeSpFVSz6flb
FMBZd5LOPgli/lRJ7FWewQvrZaKgfJgdmUUvCpi0eD+/KBnsEJLbhdnK/B+iTo4A
6BwoR+9XhOQyNMTB/SDtSYczJ35vFhZfKJ5/0psqXSJH/25wA4pe/34ERzQ1mgla
dt6JOhnWf92Jw5jdw7BFptg7lmIkDyYDU+6RyEsArCibI+28yF5/fCZCuUdwDw9i
Hpoodf1h8t1gfPnnmkcwGTfPg/duUgkFwKY97SzfZgR02hd7xxo5pK79czimMF2G
TFw9SWSnlZK71foY25FzSUHNmuGHhFzG98AFIt0VLwiTj8tJeSjTi41if237vDNv
sept+8/tt80/f45KzPNfWUB06/FGr0wfoYgZp4Pi9RRTXzDafwj7qLduaepRrLcE
UpXWCGruSUylxxChdBTwVzZn
-----END CERTIFICATE-----`;

// This is the "official" test bank intermediate CA certificate.
const bankIntermediateCaCertData = `-----BEGIN CERTIFICATE-----
MIIF0zCCA7ugAwIBAgIIUYmfdtqty80wDQYJKoZIhvcNAQENBQAwbTEkMCIGA1UE
CgwbRmluYW5zaWVsbCBJRC1UZWtuaWsgQklEIEFCMR8wHQYDVQQLDBZCYW5rSUQg
TWVtYmVyIEJhbmtzIENBMSQwIgYDVQQDDBtUZXN0IEJhbmtJRCBSb290IENBIHYx
IFRlc3QwHhcNMTEwOTIyMTQxNTAzWhcNMzQxMjMxMTQwMTMzWjBuMQswCQYDVQQG
EwJTRTEdMBsGA1UECgwUVGVzdGJhbmsgQSBBQiAocHVibCkxFTATBgNVBAUTDDEx
MTExMTExMTExMTEpMCcGA1UEAwwgVGVzdGJhbmsgQSBDQSB2MSBmb3IgQmFua0lE
IFRlc3QwggIiMA0GCSqGSIb3DQEBAQUAA4ICDwAwggIKAoICAQCTqU7uxk5QzbXS
6ArXIGTWNeZXz65bzdgoxb79LvYh/p7kcK25mA2tzGpO3QS1eKJJu84G9UNzm4mM
l6cngnXcjxETYiEqtijrA5mfz865/X6UgOpX7DkouQ8d5eDyhJ49UrDqlrgoVMx3
22kM0SZ4heVeX83e1ISFiyxqZBKxh25yKYEZA4EzIrDj2ti8CRrWPHCTWaIFpcd5
TyMhpUTPn4DzwPhPGWMRNxgOAeP4BSDB7R6az4rox7TPkd2sWG1ODj/0IRPhJS1d
Q1B7QiNHY58RjnNThEQKwdWWMPMKPthSd+GEjL9GDafYxOsIrKFYwlYNBW3C5mbe
3T+3j+Axj6W2HbgmJXPGItLucxY1kPwT9L7u5nIxaROmh1uTwYqr9puGq6soJngg
ES3K4PIhM6kamvnCCPXoqWCCruSEPVgyEZEi0shy+81Qseb1gc9rYgVrEnLBOIyM
qaTtExaFprYbv1f/AwWtjFUi2XiSdN8aMp+kqbi+1tKJUUPLC+Crdu9fFo/8lslS
dew+SnPVFeVz5COKbt6GTE4xcJeRzW5wQ0w7b+rGLWhJvwRJsS5GXvqa3Lg8EyWi
LJswuTFaEwPUDvZBvyFZEZertKgZbRYvezo9/grwyB+morVrLryu9chYEYwE550u
zyKtzXUzygV8FpXe9DpmpOSfGMAURQIDAQABo3YwdDAdBgNVHQ4EFgQUo/J4eR0r
RYrJ4cqVCeWeb87LTsUwDwYDVR0TAQH/BAUwAwEB/zAfBgNVHSMEGDAWgBRK96Nq
CNoIOBcZUyjI2qbWNNhaujARBgNVHSAECjAIMAYGBCoDBAUwDgYDVR0PAQH/BAQD
AgEGMA0GCSqGSIb3DQEBDQUAA4ICAQDP1DoxjEjeyG27xeai+mpxxJoqB1RDVTEY
86RdNyluUKQOIbfKJMmX+DX4vTuUQS3539xzHKwpj6gk+iZVjF1UoJtGp+qurjja
rOh44s++s0yWKiKrJBEloJn8o+YXFT8C7e1WtqJVoaFdDBCvohJyK20PKS7/nUG5
b7J6iq3517Yvjb4D94Lt0dHNSgD2BIIHmNkpSYWgyi1seavhN5AjtfJr4p101u2S
sNcLAr42A5fran9vL29HjaM2MTU8L0OxoIX8lgcpUy9wci7lHQKOiwaOcIKfCC1q
M7lO5z0c4P+o0zT6183xJV3rmw22GGYd40EBqW97oqBK0Ij+Kl5suycZ4J2qK1aV
ciYBZsBNlbtmz/k8HuBxy9WbEePsY/61I50fBLSAkVk/Tea4j+NNHJ1imp7Bo18a
Lo8plb9e2iZeIDzH1u66o0RFYbHdnJD8CnPeBLVgSvEqmBS11fgHr81/tk5lJxcK
ejdsEftzGQxwuHw/pjkjobIkxrroXpa6iXokVyH4be16+f/dDaEkh9Rf8Lh1UEQP
xxpCyISMifH5pL78DKhGnh8Vfi7EesUV1k6Y3eVCFw2CCKWcvXsJb9QqLFsDqIlW
Ph6bBgM4aXfpe0arDrgYRbbx8L6ouhyxAHwjtz9i0lXezWMX5f7QYREMTC5yBPNT
TP2fCNsozQ==
-----END CERTIFICATE-----`;

var endUserCert, bankCustomerCaCert, bankIntermediateCaCert;
beforeAll(async () => {
  endUserCert = loadCertFromString(endUserCertData);
  bankCustomerCaCert = loadCertFromString(bankCustomerCaCertData);
  bankIntermediateCaCert = loadCertFromString(bankIntermediateCaCertData);
});

describe('createSignedInfoElement', () => {
  test('should correctly encode the element', () => {
    // NB: At present we are only creating random digests!
    const regExp =
      /^<SignedInfo xmlns="http:\/\/www.w3.org\/2000\/09\/xmldsig#"><CanonicalizationMethod Algorithm="http:\/\/www.w3.org\/TR\/2001\/REC-xml-c14n-20010315"\/><SignatureMethod Algorithm="http:\/\/www.w3.org\/2001\/04\/xmldsig-more#rsa-sha256"\/><Reference Type="http:\/\/www.bankid.com\/signature\/v1.0.0\/types" URI="#bidSignedData"><Transforms><Transform Algorithm="http:\/\/www.w3.org\/TR\/2001\/REC-xml-c14n-20010315"\/><\/Transforms><DigestMethod Algorithm="http:\/\/www.w3.org\/2001\/04\/xmlenc#sha256"\/><DigestValue>[^<]+<\/DigestValue><\/Reference><Reference URI="#bidKeyInfo"><Transforms><Transform Algorithm="http:\/\/www.w3.org\/TR\/2001\/REC-xml-c14n-20010315"\/><\/Transforms><DigestMethod Algorithm="http:\/\/www.w3.org\/2001\/04\/xmlenc#sha256"\/><DigestValue>[^<]+<\/DigestValue><\/Reference><\/SignedInfo>$/;

    const element = signature.createSignedInfoElement();

    expect(element).toMatch(regExp);
  });
});

describe('createSignatureValueElement', () => {
  test('should correctly encode the element', () => {
    // NB: At present we are only creating random digests!
    const regExp = /^<SignatureValue>[^<]+<\/SignatureValue>$/;

    const element = signature.createSignatureValueElement();

    expect(element).toMatch(regExp);
  });
});

describe('createKeyInfoElement', () => {
  test('should correctly encode a single certificate', () => {
    const encodedEndUserCert = b64enc(endUserCert.raw);

    const element = signature.createKeyInfoElement([endUserCert]);

    expect(element).toBe(
      `<KeyInfo Id="bidKeyInfo" xmlns="http://www.w3.org/2000/09/xmldsig#"><X509Data><X509Certificate>${encodedEndUserCert}</X509Certificate></X509Data></KeyInfo>`
    );
  });

  test('should correctly encode multiple certificates', () => {
    const encodedEndUserCert = b64enc(endUserCert.raw);
    const encodedCustomerCaCert = b64enc(bankCustomerCaCert.raw);
    const encodedIntermediateCaCert = b64enc(bankIntermediateCaCert.raw);

    const certs = [endUserCert, bankCustomerCaCert, bankIntermediateCaCert];

    const element = signature.createKeyInfoElement(certs);

    expect(element).toBe(
      `<KeyInfo Id="bidKeyInfo" xmlns="http://www.w3.org/2000/09/xmldsig#"><X509Data><X509Certificate>${encodedEndUserCert}</X509Certificate><X509Certificate>${encodedCustomerCaCert}</X509Certificate><X509Certificate>${encodedIntermediateCaCert}</X509Certificate></X509Data></KeyInfo>`
    );
  });
});

describe('createSignatureElement', () => {
  test('should correctly encode the element', () => {
    const certs = [endUserCert, bankCustomerCaCert, bankIntermediateCaCert];

    const signedDataElement = '<foo/>';

    const regExp = new RegExp(
      `^<\\?xml version="1.0" encoding="UTF-8" standalone="no"\\?><Signature xmlns="http:\/\/www.w3.org\/2000\/09\/xmldsig#"><SignedInfo xmlns="http:\/\/www.w3.org\/2000\/09\/xmldsig#"><CanonicalizationMethod Algorithm="http:\/\/www.w3.org\/TR\/2001\/REC-xml-c14n-20010315"\/><SignatureMethod Algorithm="http:\/\/www.w3.org\/2001\/04\/xmldsig-more#rsa-sha256"\/><Reference Type="http:\/\/www.bankid.com\/signature\/v1.0.0\/types" URI="#bidSignedData"><Transforms><Transform Algorithm="http:\/\/www.w3.org\/TR\/2001\/REC-xml-c14n-20010315"\/><\/Transforms><DigestMethod Algorithm="http:\/\/www.w3.org\/2001\/04\/xmlenc#sha256"\/><DigestValue>[^<]+<\/DigestValue><\/Reference><Reference URI="#bidKeyInfo"><Transforms><Transform Algorithm="http:\/\/www.w3.org\/TR\/2001\/REC-xml-c14n-20010315"\/><\/Transforms><DigestMethod Algorithm="http:\/\/www.w3.org\/2001\/04\/xmlenc#sha256"\/><DigestValue>[^<]+<\/DigestValue><\/Reference><\/SignedInfo><SignatureValue>[^<]+<\/SignatureValue><KeyInfo Id="bidKeyInfo" xmlns="http:\/\/www.w3.org\/2000\/09\/xmldsig#"><X509Data><X509Certificate>[^<]+<\/X509Certificate><X509Certificate>[^<]+<\/X509Certificate><X509Certificate>[^<]+<\/X509Certificate><\/X509Data><\/KeyInfo><Object><foo\/><\/Object><\/Signature>$`
    );

    const element = signature.createSignatureElement(certs, signedDataElement);

    expect(element).toMatch(regExp);
  });
});

// Base64 encoding helper.
function b64enc(val) {
  return Buffer.from(val).toString('base64');
}
