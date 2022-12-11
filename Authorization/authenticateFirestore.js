import { initializeApp, applicationDefault, cert} from "firebase-admin/app";
import { getFirestore, Timestamp, FieldValue} from "firebase-admin/firestore";
import serviceAccount from '../Creds/FirestoreCreds.json' assert {type: 'json'};

export default function authenticateFirestore() {

    initializeApp({
        credential: cert(serviceAccount)
    });

    return getFirestore();
}