const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const serviceAccount = require('../Creds/FirestoreCreds.json');

module.exports = {
    authenticateFirestore: function () {
        initializeApp({
            credential: cert(serviceAccount)
        });

        return getFirestore();
    }
}