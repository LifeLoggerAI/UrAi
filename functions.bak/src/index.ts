import './enrich.js'; // keep the .js extension for Node ESM runtime

import * as functions from 'firebase-functions';

export const runSeed = functions.https.onRequest(async (_req, res) => {
  res.status(200).send({ ok: true, msg: 'Seed stub running.' });
});
