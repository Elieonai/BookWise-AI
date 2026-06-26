const { initializeApp, getApps } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY || 'AIzaSyDKmOLV8AxrhynRmUQnwpVo7Ulpb-Sa3TI',
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || 'bookwise-ai-7c2c0.firebaseapp.com',
    projectId: process.env.FIREBASE_PROJECT_ID || 'bookwise-ai-7c2c0',
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'bookwise-ai-7c2c0.firebasestorage.app',
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '929125519183',
    appId: process.env.FIREBASE_APP_ID || '1:929125519183:web:59d384e7a2083210123f3a',
    measurementId: process.env.FIREBASE_MEASUREMENT_ID || 'G-P734GMSDKX'
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(app);

module.exports = {
    app,
    db,
    firebaseConfig
};