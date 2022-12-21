const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

module.exports = {
    authenticateFirestore: function (serviceAccount) {
        initializeApp({
            credential: cert(serviceAccount)
        });

        return getFirestore();
    }
}