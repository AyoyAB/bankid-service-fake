# Used to generate test certificates.
KEYLEN=2048
DAYS=365

# Make sure to keep both private keys and certificates.
.PRECIOUS: %.key %.crt %.srl

%.key:
	openssl genrsa -out $@ $(KEYLEN)

# Self-signed TLS test client and server CA:s
%/openssl-ext-tls-ca.cnf:
	printf "[req]\ndistinguished_name=dn\nreq_extensions=ext\n[dn]\n[ext]\nsubjectKeyIdentifier=hash\nauthorityKeyIdentifier=keyid:always,issuer:always\nbasicConstraints=CA:true" > $@
%/client-ca.crt: %/client-ca.key %/openssl-ext-tls-ca.cnf
	openssl req -new -key $*/client-ca.key -sha256 -out $@ -subj "/CN=Test TLS Client CA" -x509 -days $(DAYS) -config $*/openssl-ext-tls-ca.cnf -extensions ext
%/server-ca.crt: %/server-ca.key %/openssl-ext-tls-ca.cnf
	openssl req -new -key $*/server-ca.key -sha256 -out $@ -subj "/CN=Test TLS Server CA" -x509 -days $(DAYS) -config $*/openssl-ext-tls-ca.cnf -extensions ext

# Test TLS client certificate.
%/client.csr: %/client.key
	openssl req -new -key $^ -sha256 -out $@ -subj "/C=SE/O=Test Bank A/serialNumber=000000000000/name=BankID Test/CN=RP Test Cert"
%/openssl-ext-tls-client.cnf:
	printf "extendedKeyUsage=clientAuth\nbasicConstraints=CA:false\nsubjectKeyIdentifier=hash\nauthorityKeyIdentifier=keyid,issuer" > $@
%/client.crt: %/client.csr %/openssl-ext-tls-client.cnf %/client-ca.crt
	openssl x509 -req -in $*/client.csr -sha256 -out $@ -days $(DAYS) -CA $*/client-ca.crt -CAkey $*/client-ca.key -CAcreateserial -extfile $*/openssl-ext-tls-client.cnf

# Test TLS server certificate.
%/server.csr: %/server.key
	openssl req -new -key $^ -sha256 -out $@ -subj "/CN=Test TLS Server"
%/openssl-ext-tls-server.cnf:
	printf "subjectAltName=DNS:localhost,DNS:host.docker.internal\nextendedKeyUsage=serverAuth\nbasicConstraints=CA:false\nsubjectKeyIdentifier=hash\nauthorityKeyIdentifier=keyid,issuer" > $@
%/server.crt: %/server.csr %/openssl-ext-tls-server.cnf %/server-ca.crt
	openssl x509 -req -in $*/server.csr -sha256 -out $@ -days $(DAYS) -CA $*/server-ca.crt -CAkey $*/server-ca.key -CAcreateserial -extfile $*/openssl-ext-tls-server.cnf

# A self-signed BankID "Customer CA" that includes the test BankID certificate policies.
%/openssl-ext-bankid-ca.cnf:
	printf "[req]\ndistinguished_name=dn\nreq_extensions=ext\n[dn]\n[ext]\nsubjectKeyIdentifier=hash\nauthorityKeyIdentifier=keyid:always,issuer:always\nbasicConstraints=CA:true\ncertificatePolicies=1.2.3.4.5,1.2.3.4.10,1.2.3.4.25" > $@
%/bankid-ca.crt: %/bankid-ca.key %/openssl-ext-bankid-ca.cnf
	openssl req -new -key $*/bankid-ca.key -sha256 -out $@ -subj "/C=SE/O=Test Bank A/CN=Test Bank A Customer CA" -x509 -days $(DAYS) -config $*/openssl-ext-bankid-ca.cnf -extensions ext

# A combined auth & sign Mobile test BankID issued for the serial number 000000000001.
%/mobile-bankid.csr: %/mobile-bankid.key
	openssl req -new -key $^ -sha256 -out $@ -subj "/C=SE/O=Test Bank A/SN=Alpha, GN=Adam/serialNumber=000000000001/CN=Adam Alpha"
%/openssl-ext-mobile-bankid.cnf:
	printf "subjectKeyIdentifier=hash\nauthorityKeyIdentifier=keyid,issuer\ncertificatePolicies=1.2.3.4.25\nkeyUsage=critical,digitalSignature,nonRepudiation" > $@
%/mobile-bankid.crt: %/mobile-bankid.csr %/openssl-ext-mobile-bankid.cnf %/bankid-ca.crt
	openssl x509 -req -in $*/mobile-bankid.csr -sha256 -out $@ -days $(DAYS) -CA $*/bankid-ca.crt -CAkey $*/bankid-ca.key -extfile $*/openssl-ext-mobile-bankid.cnf -CAcreateserial

# A combined auth & sign file-based test BankID issued for the serial number 000000000002.
%/file-bankid.csr: %/file-bankid.key
	openssl req -new -key $^ -sha256 -out $@ -subj "/C=SE/O=Test Bank A/SN=Bravo, GN=Bertil/serialNumber=000000000002/CN=Bertil Bravo"
%/openssl-ext-file-bankid.cnf:
	printf "subjectKeyIdentifier=hash\nauthorityKeyIdentifier=keyid,issuer\ncertificatePolicies=1.2.3.4.5\nkeyUsage=critical,digitalSignature,nonRepudiation" > $@
%/file-bankid.crt: %/file-bankid.csr %/openssl-ext-file-bankid.cnf %/bankid-ca.crt
	openssl x509 -req -in $*/file-bankid.csr -sha256 -out $@ -days $(DAYS) -CA $*/bankid-ca.crt -CAkey $*/bankid-ca.key -extfile $*/openssl-ext-file-bankid.cnf -CAcreateserial

# A combined auth & sign smart card-based test BankID issued for the serial number 000000000003.
%/card-bankid.csr: %/card-bankid.key
	openssl req -new -key $^ -sha256 -out $@ -subj "/C=SE/O=Test Bank A/SN=Charlie, GN=Cesar/serialNumber=000000000003/CN=Cesar Charlie"
%/openssl-ext-card-bankid.cnf:
	printf "subjectKeyIdentifier=hash\nauthorityKeyIdentifier=keyid,issuer\ncertificatePolicies=1.2.3.4.10\nkeyUsage=critical,digitalSignature,nonRepudiation" > $@
%/card-bankid.crt: %/card-bankid.csr %/openssl-ext-card-bankid.cnf %/bankid-ca.crt
	openssl x509 -req -in $*/card-bankid.csr -sha256 -out $@ -days $(DAYS) -CA $*/bankid-ca.crt -CAkey $*/bankid-ca.key -extfile $*/openssl-ext-card-bankid.cnf -CAcreateserial

.PHONY: certs
certs: data/tls/client-ca.crt data/tls/server-ca.crt data/tls/client.crt data/tls/server.crt
