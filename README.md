# bankid-service-fake

BankID web service fake intended for use during relying party testing.

## Running

The server can be started locally using the following command:

```sh
$ npm run start

> bankid-service-fake@0.1.0 start
> node source/app.js

Listening on port 3000.
```

> You will need to either generate or provide TLS certificates before the server
> can start. A set of test certificates can be generated using `make certs`.

## Building

A Docker image can be built locally using the following commands.

```sh
$ rm -rf ./packages/

$ docker run --rm -v "${PWD}":/work cgr.dev/chainguard/melange keygen
2022/11/29 13:46:43 generating keypair with a 4096 bit prime, please wait...
2022/11/29 13:46:45 wrote private key to melange.rsa
2022/11/29 13:46:45 wrote public key to melange.rsa.pub

$ docker run --rm --privileged -v "${PWD}":/work cgr.dev/chainguard/melange \
    build melange.yaml --arch amd64,aarch64,armv7 \
    --repository-append packages --signing-key melange.rsa
2022/11/29 13:48:56 building for [amd64 arm/v7 arm64]
...
2022/11/29 13:50:07 melange (bankid-service-fake/armv7): signed index /work/packages/armv7/APKINDEX.tar.gz with key melange.rsa

$ docker run --rm -v ${PWD}:/work cgr.dev/chainguard/apko build \
    --debug apko.yaml bankid-service-fake:test bankid-service-fake.tar \
    -k melange.rsa.pub
Nov 29 13:51:24.581 [INFO] loading config file: apko.yaml
Nov 29 13:51:24.586 [INFO] [arch:aarch64] detected git+ssh://github.com/AyoyAB/bankid-service-fake.git@585212bb0836a02307dd0e804458657c5bd68a6e as VCS URL
Nov 29 13:51:24.586 [INFO] [arch:aarch64] building image 'bankid-service-fake:test'
...
Nov 29 13:52:01.356 [INFO] [arch:aarch64] OCI layer digest: sha256:9d495e5697a3e0d30a3f9b969fff9671902133bc7b05c50dbb26a2b33ef2c1d4
Nov 29 13:52:01.356 [INFO] [arch:aarch64] OCI layer diffID: sha256:7d87f45ed20b11a0ffb3c9074ca6c1a232e6030a00613afc44d0cb5dfb3ea49e
Nov 29 13:52:01.601 [INFO] [arch:aarch64] output OCI image file to bankid-service-fake.tar

$ docker load < bankid-service-fake.tar
7d87f45ed20b: Loading layer  22.01MB/22.01MB
Loaded image: bankid-service-fake:test
```

This image can now be started using the following command:

```sh
$ docker run --rm -p 3000:3000 \
    -v ${PWD}/data:/usr/share/webapps/bankid-service-fake/data \
    bankid-service-fake:test
Listening on port 3000.
```

> You will need to either generate or provide TLS certificates before the server
> can start. A set of test certificates can be generated using `make certs`.

## Testing

A few sample invocations:

```sh
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

```sh
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
