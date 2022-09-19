import { promisified as pem } from 'pem';
import { promises as fs } from 'fs';

async function createPrivateKey(file) {
  let key;

  try {
    key = await fs.readFile(file, { encoding: 'utf-8' });
  } catch (err) {
    console.log(`Generating ${file}...`);
    const res = await pem.createPrivateKey(2048, {});
    key = res.key;
    await fs.writeFile(file, key, 'utf8');
  }

  return key;
}

async function createCACertificate(key, cn, file) {
  let cert;

  try {
    cert = await fs.readFile(file, { encoding: 'utf8' });
  } catch (err) {
    console.log(`Generating ${file}...`);
    const res = await pem.createCertificate({
      days: 3651,
      selfSigned: true,
      clientKey: key,
      commonName: cn,
    });
    cert = res.certificate;
    await fs.writeFile(file, cert, 'utf8');
  }

  return cert;
}

async function createCertificate(key, cn, caKey, caCert, file) {
  let cert;

  try {
    cert = await fs.readFile(file, { encoding: 'utf8' });
  } catch (err) {
    console.log(`Generating ${file}...`);
    const res = await pem.createCertificate({
      days: 3650,
      clientKey: key,
      serviceKey: caKey,
      serviceCertificate: caCert,
      commonName: cn,
    });
    cert = res.certificate;
    await fs.writeFile(file, cert, 'utf8');
  }

  return cert;
}

async function createServerCA() {
  const key = await createPrivateKey('data/server-ca.key');
  const cert = await createCACertificate(
    key,
    'Test Server CA',
    'data/server-ca.crt'
  );

  return { key, cert };
}

async function createServerCertificate(caKey, caCert) {
  const key = await createPrivateKey('data/server.key');
  const cert = await createCertificate(
    key,
    'localhost',
    caKey,
    caCert,
    'data/server.crt'
  );

  return { key, cert };
}

async function createClientCA() {
  const key = await createPrivateKey('data/client-ca.key');
  const cert = await createCACertificate(
    key,
    'Test Client CA',
    'data/client-ca.crt'
  );

  return { key, cert };
}

async function createClientCertificate(caKey, caCert) {
  const key = await createPrivateKey('data/client.key');
  const cert = await createCertificate(
    key,
    'Test Client',
    caKey,
    caCert,
    'data/client.crt'
  );

  return { key, cert };
}

// TODO: BankID CA

// TODO: BankID certs & keys (we need to be able to create these at will!)

const { key: serverCAKey, cert: serverCACert } = await createServerCA();

await createServerCertificate(serverCAKey, serverCACert);

const { key: clientCAKey, cert: clientCACert } = await createClientCA();

await createClientCertificate(clientCAKey, clientCACert);
