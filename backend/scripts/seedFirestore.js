require('dotenv').config();
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');
const books = require('../data/books.json');
const reviewsData = require('../data/reviews.json');

const resolveCredentialPath = (credentialPath) => {
    if (!credentialPath) {
        return null;
    }

    return path.isAbsolute(credentialPath)
        ? credentialPath
        : path.resolve(__dirname, '..', credentialPath);
};

const getServiceAccountFromFile = () => {
    const credentialPath = resolveCredentialPath(process.env.GOOGLE_APPLICATION_CREDENTIALS);

    if (!credentialPath) {
        return null;
    }

    if (!fs.existsSync(credentialPath)) {
        throw new Error(`Arquivo de credencial Admin nao encontrado em: ${credentialPath}`);
    }

    return JSON.parse(fs.readFileSync(credentialPath, 'utf8'));
};

/* Inicializa Firebase Admin para seed sem depender das regras publicas. */
const initializeAdminApp = () => {
    if (admin.apps.length) {
        return admin.app();
    }

    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

        return admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    }

    const serviceAccountFromFile = getServiceAccountFromFile();

    if (serviceAccountFromFile) {
        return admin.initializeApp({
            credential: admin.credential.cert(serviceAccountFromFile)
        });
    }

    return admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        projectId: process.env.FIREBASE_PROJECT_ID || 'bookwise-ai-7c2c0'
    });
};

const getFirestoreAdmin = () => {
    const adminApp = initializeAdminApp();

    return admin.firestore(adminApp);
};

/* Cria ou atualiza documentos por id fixo em batch. */
const seedCollection = async (db, collectionName, records, getDocumentId) => {
    const batch = db.batch();

    records.forEach((record) => {
        const docId = getDocumentId(record);
        const docRef = db.collection(collectionName).doc(docId);
        batch.set(docRef, record, { merge: true });
    });

    await batch.commit();
};

/* Sincroniza books.json e reviews.json com o Firestore. */
const seedFirestore = async () => {
    const db = getFirestoreAdmin();

    await seedCollection(db, 'books', books, book => String(book.id));
    await seedCollection(db, 'reviews', reviewsData.reviews, review => String(review.id));

    console.log('Firestore populado com livros e reviews iniciais.');
};

if (require.main === module) {
    seedFirestore()
        .then(() => process.exit(0))
        .catch((error) => {
            console.error('Erro ao popular Firestore. Configure FIREBASE_SERVICE_ACCOUNT_KEY ou GOOGLE_APPLICATION_CREDENTIALS com uma credencial de service account.', error.message);
            process.exit(1);
        });
}

module.exports = { seedFirestore };