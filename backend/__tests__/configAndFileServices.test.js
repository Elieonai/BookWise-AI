describe('firebase config', () => {
    const originalEnv = process.env;

    afterEach(() => {
        jest.resetModules();
        jest.dontMock('firebase/app');
        jest.dontMock('firebase/firestore');
        process.env = originalEnv;
    });

    test('initializes a new Firebase app with env values', () => {
        process.env = {
            ...originalEnv,
            FIREBASE_API_KEY: 'env-api-key',
            FIREBASE_AUTH_DOMAIN: 'env-auth-domain',
            FIREBASE_PROJECT_ID: 'env-project',
            FIREBASE_STORAGE_BUCKET: 'env-bucket',
            FIREBASE_MESSAGING_SENDER_ID: 'env-sender',
            FIREBASE_APP_ID: 'env-app',
            FIREBASE_MEASUREMENT_ID: 'env-measurement'
        };
        const initializeApp = jest.fn(() => ({ name: 'new-app' }));
        const getApps = jest.fn(() => []);
        const getFirestore = jest.fn(() => ({ name: 'db' }));

        jest.doMock('firebase/app', () => ({ initializeApp, getApps }));
        jest.doMock('firebase/firestore', () => ({ getFirestore }));

        jest.isolateModules(() => {
            const firebase = require('../src/config/firebase');

            expect(initializeApp).toHaveBeenCalledWith({
                apiKey: 'env-api-key',
                authDomain: 'env-auth-domain',
                projectId: 'env-project',
                storageBucket: 'env-bucket',
                messagingSenderId: 'env-sender',
                appId: 'env-app',
                measurementId: 'env-measurement'
            });
            expect(firebase.app).toEqual({ name: 'new-app' });
            expect(firebase.db).toEqual({ name: 'db' });
        });
    });

    test('reuses existing Firebase app and default config values', () => {
        process.env = {};
        const initializeApp = jest.fn();
        const existingApp = { name: 'existing-app' };
        const getApps = jest.fn(() => [existingApp]);
        const getFirestore = jest.fn(() => ({ name: 'db' }));

        jest.doMock('firebase/app', () => ({ initializeApp, getApps }));
        jest.doMock('firebase/firestore', () => ({ getFirestore }));

        jest.isolateModules(() => {
            const firebase = require('../src/config/firebase');

            expect(initializeApp).not.toHaveBeenCalled();
            expect(firebase.app).toBe(existingApp);
            expect(firebase.firebaseConfig.projectId).toBe('bookwise-ai-7c2c0');
        });
    });
});

describe('file based legacy services', () => {
    afterEach(() => {
        jest.resetModules();
        jest.dontMock('fs');
    });

    test('bookFileService reads books JSON', () => {
        const readFileSync = jest.fn(() => '[{"id":1,"titulo":"Livro"}]');

        jest.doMock('fs', () => ({ readFileSync }));

        jest.isolateModules(() => {
            const { readBooks } = require('../src/services/bookFileService');

            expect(readBooks()).toEqual([{ id: 1, titulo: 'Livro' }]);
            expect(readFileSync).toHaveBeenCalledWith(expect.stringContaining('books.json'), 'utf-8');
        });
    });

    test('fileService reads and writes reviews JSON', () => {
        const readFileSync = jest.fn(() => '{"reviews":[{"id":1}]}');
        const writeFileSync = jest.fn();

        jest.doMock('fs', () => ({ readFileSync, writeFileSync }));

        jest.isolateModules(() => {
            const { readReviews, writeReviews } = require('../src/services/fileService');

            expect(readReviews()).toEqual([{ id: 1 }]);
            writeReviews([{ id: 2 }]);
            expect(writeFileSync).toHaveBeenCalledWith(
                expect.stringContaining('reviews.json'),
                JSON.stringify({ reviews: [{ id: 2 }] }, null, 2),
                'utf-8'
            );
        });
    });
});
