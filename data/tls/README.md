# Test TLS Certificates

Run `make certificates` in the top directory to generate the contents for test
purposes. Alternatively, provide your own versions of the following files:

| File          | Description                               |
| ------------- | ----------------------------------------- |
| client-ca.crt | Used to validate TLS client certificates. |
| server.crt    | The TLS server certificate.               |
| server.key    | The TLS server private key.               |
