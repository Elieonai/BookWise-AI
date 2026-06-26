require("dotenv").config();
const admin = require("firebase-admin");

function getServiceAccountFromEnv() {
    if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
        return null;
    }

    const serviceAccount = JSON.parse(
        process.env.FIREBASE_SERVICE_ACCOUNT_KEY
    );

    if (serviceAccount.private_key) {
        serviceAccount.private_key =
            serviceAccount.private_key.replace(/\n/g, "\n");
    }

    return serviceAccount;
}

const initializeAdminApp = () => {
    if (admin.apps.length) {
        return admin.app();
    }

    const serviceAccount = getServiceAccountFromEnv();

    if (serviceAccount) {
        return admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    }

    return admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        projectId: process.env.FIREBASE_PROJECT_ID
    });
};
