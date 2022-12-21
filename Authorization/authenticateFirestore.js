const fetch = require('node-fetch');
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

module.exports = {

    authenticateFirestore: async function () {

        const serviceAccount = await (
            await fetch(`/etc/secrets/FirestoreCreds.json`)
        ).json()

        initializeApp({
            credential: cert(serviceAccount)
        });

        return getFirestore();
    }
}