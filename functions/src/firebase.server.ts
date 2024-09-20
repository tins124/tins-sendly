import * as admin from 'firebase-admin';
const serviceAccount =
  process.env.NODE_ENV === 'production'
    ? // eslint-disable-next-line @typescript-eslint/no-require-imports
      require('../serviceAccount.json')
    : // eslint-disable-next-line @typescript-eslint/no-require-imports
      require('../serviceAccount-staging.json');

if (!serviceAccount) {
  throw new Error('Error: Missing serviceAccount.json file');
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();
db.settings({
  host: 'localhost:8080', // Emulator host and port
  ssl: false, // Disable SSL when connecting to the emulator
});

export default db;
