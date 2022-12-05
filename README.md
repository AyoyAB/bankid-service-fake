# bankid-service-fake

BankID web service fake intended for use during relying party testing.

This is designed to be a drop-in replacement for the BankID web service itself
during both interactive and non-interactive testing of relying party software.

It was written in Node.js in order to be easily adapted and extended without
needing to be re-compiled.

> NB: This testing fake doesn't, currently, produce cryptographically valid XM
> Signatures, and only returns canned OCSP responses. Caveat emptor.

## Running

### Locally

The server can be started locally using the following command:

```bash
$ npm run start

> bankid-service-fake@0.1.0 start
> node source/app.js

Listening on port 3000.
```

> You will need to either generate or provide TLS certificates before the server
> can start. A set of test certificates can be generated using `make certs`.

## Building

### Locally

A Docker image can be built locally using a combination of
[melange](https://github.com/chainguard-dev/melange) and
[apko](https://github.com/chainguard-dev/apko).

```bash
$ rm -rf ./packages/

$ docker run --rm -v "${PWD}":/work cgr.dev/chainguard/melange keygen
2022/12/02 06:06:04 generating keypair with a 4096 bit prime, please wait...
2022/12/02 06:06:06 wrote private key to melange.rsa
2022/12/02 06:06:06 wrote public key to melange.rsa.pub

$ docker run --rm --privileged -v "${PWD}":/work cgr.dev/chainguard/melange \
    build melange.yaml --arch amd64,aarch64,armv7 --signing-key melange.rsa
...
2022/12/02 06:06:38 melange: appending signature to index /work/packages/armv7/APKINDEX.tar.gz
2022/12/02 06:06:38 melange: writing signed index to /work/packages/armv7/APKINDEX.tar.gz
2022/12/02 06:06:38 melange: signed index /work/packages/armv7/APKINDEX.tar.gz with key melange.rsa

$ docker run --rm -v ${PWD}:/work \
    -v ${PWD}/packages:/github/workspace/packages cgr.dev/chainguard/apko \
    build --debug apko.yaml ghcr.io/ayoyab/bankid-service-fake:test \
    bankid-service-fake.tar -k melange.rsa.pub
...
Dec  2 06:13:03.637 [INFO] [arch:aarch64] OCI layer digest: sha256:ba70f65eb94bba742ea9c4fc34e0ff23cb75c62930c3f30771b460cf1bc2e654
Dec  2 06:13:03.637 [INFO] [arch:aarch64] OCI layer diffID: sha256:7e08491d3a33d5ef691e6900a9890f19a9f26e154d3a658c2eb8e9a0f6c2d880
Dec  2 06:13:03.637 [WARNING] [arch:aarch64] multiple SBOM formats requested, uploading SBOM with media type: spdx+json
Dec  2 06:13:04.027 [INFO] [arch:aarch64] output OCI image file to bankid-service-fake.tar

$ docker load < bankid-service-fake.tar
7e08491d3a33: Loading layer  22.26MB/22.26MB
Loaded image: ghcr.io/ayoyab/bankid-service-fake:test
```

This image can now be started using the following command:

```bash
$ docker run --rm -p 3000:3000 \
    -v ${PWD}/data:/usr/share/webapps/bankid-service-fake/data \
    ghcr.io/ayoyab/bankid-service-fake:test
Listening on port 3000.
```

> You will need to either generate or provide TLS certificates before the server
> can start. A set of test certificates can be generated using `make certs`.

## Testing

A few sample invocations:

```bash
$ curl --cacert data/tls/server-ca.crt \
       --cert data/tls/client.crt \
       --key data/tls/client.key \
       -X POST \
       -H 'Content-Type: application/json' \
       -d '{"endUserIp":"127.0.0.1"}' \
       https://localhost:3000/rp/v5.1/auth
{"orderRef":"ccc20e2a-5cc6-460c-84cd-ba462e79cf44","autoStartToken":"2ffb8e2f-dc2a-415a-abc7-c49a4c81551b","qrStartToken":"226cb2a8-dcc0-4557-a7b5-c54c43b9d185","qrStartSecret":"3edcc24b-2e75-4201-9c82-360c618ca377"}

$ curl --cacert data/tls/server-ca.crt \
       --cert data/tls/client.crt \
       --key data/tls/client.key \
       -X POST \
       -H 'Content-Type: application/json' \
       -d '{"orderRef":"ccc20e2a-5cc6-460c-84cd-ba462e79cf44"}' \
       https://localhost:3000/rp/v5.1/collect
{"status":"pending","orderRef":"ccc20e2a-5cc6-460c-84cd-ba462e79cf44","hintCode":"outstandingTransaction"}

$ curl --cacert data/tls/server-ca.crt \
       --cert data/tls/client.crt \
       --key data/tls/client.key \
       -X POST \
       -H 'Content-Type: application/json' \
       -d '{"orderRef":"ccc20e2a-5cc6-460c-84cd-ba462e79cf44"}' \
       https://localhost:3000/rp/v5.1/cancel
{}
```

```bash
$ curl --cacert data/tls/server-ca.crt \
       --cert data/tls/client.crt \
       --key data/tls/client.key \
       -X POST \
       -H 'Content-Type: application/json' \
       -d '{"endUserIp":"127.0.0.1","userVisibleData":"Zm9v","userNonVisibleData":"YmFy"}' \
       https://localhost:3000/rp/v5.1/sign
{"orderRef":"be83cc82-94ca-49e2-b1c6-93df96317278","autoStartToken":"f1fe371b-3d7e-4b7b-80f3-3e1f328f8d76","qrStartToken":"a1225554-d049-4720-8c17-91d8f692b771","qrStartSecret":"9b5aa019-6574-4601-84aa-a4b49fac504b"}

$ curl --cacert data/tls/server-ca.crt \
       --cert data/tls/client.crt \
       --key data/tls/client.key \
       -X POST \
       -H 'Content-Type: application/json' \
       -d '{"orderRef":"be83cc82-94ca-49e2-b1c6-93df96317278"}' \
       https://localhost:3000/rp/v5.1/collect
{"status":"pending","orderRef":"be83cc82-94ca-49e2-b1c6-93df96317278","hintCode":"outstandingTransaction"}

$ curl --cacert data/tls/server-ca.crt \
       --cert data/tls/client.crt \
       --key data/tls/client.key \
       -X POST \
       -H 'Content-Type: application/json' \
       -d '{"orderRef":"be83cc82-94ca-49e2-b1c6-93df96317278"}' \
       https://localhost:3000/rp/v5.1/collect
{"status":"pending","orderRef":"be83cc82-94ca-49e2-b1c6-93df96317278","hintCode":"userSign"}

$ curl --cacert data/tls/server-ca.crt \
       --cert data/tls/client.crt \
       --key data/tls/client.key \
       -X POST \
       -H 'Content-Type: application/json' \
       -d '{"orderRef":"be83cc82-94ca-49e2-b1c6-93df96317278"}' \
       https://localhost:3000/rp/v5.1/collect
{"status":"complete","orderRef":"be83cc82-94ca-49e2-b1c6-93df96317278","completionData":{"user":{"personalNumber":"200211242383","name":"Test Person","givenName":"Test","surname":"Person"},"device":{"ipAddress":"192.168.0.1"},"cert":{"notBefore":"1669244400000","notAfter":"1700866799000"},"signature":"{{SIGNATURE}}","ocspResponse":"{{OCSP_RESPONSE}}"}}
```

## Disclaimer

This project is neither affiliated with, authorized by nor endorsed by BankID or
Finansiell ID-Teknik BID AB. The name BankID as well as related names, marks,
emblems and images remain the registered trademarks of their respective owners.
