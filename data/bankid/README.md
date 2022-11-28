# Test BankID Certificates

This directory contains BankID end-user test certificates, as well as the CA
certificates that form the certificate chain included in the signatures.

If you need more users than the default one you can add those certificates here
and refer to them in the configuration. The same goes if you need to swap out
the CA certificates.

> We can use certificates from the "official" test environment since we aren't
> actually creating real signatures yet. In order to do that we'll need private
> keys along with our certificates, meaning we'll have to generate our own PKI
> from scratch.

| File                  | Description                              |
| --------------------- | ---------------------------------------- |
| customer_ca.crt       | The test BankID customer CA certificate. |
| intermediate_ca.crt   | The test BankID bank CA.                 |
| user-200211242383.crt | An end-user test certificate.            |
