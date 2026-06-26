(function () {
    "use strict";

    if (window.HomeworkSubmitter) return;

    const FIREBASE_VERSION = "12.15.0";
    let clientPromise = null;

    function assertConfig(settings) {
        const firebaseConfig = settings && settings.firebaseConfig;
        if (!firebaseConfig || !firebaseConfig.apiKey || firebaseConfig.apiKey.includes("YOUR_")) {
            throw new Error("Firebase 설정이 없습니다. shared/homework-firebase-config.js를 실제 Web App 설정값으로 바꿔 주세요.");
        }
        if (!firebaseConfig.projectId || firebaseConfig.projectId.includes("YOUR_")) {
            throw new Error("Firebase projectId 설정이 없습니다.");
        }
    }

    function trimSlashes(value) {
        return String(value || "homeworkAssignments").replace(/^\/+|\/+$/g, "") || "homeworkAssignments";
    }

    async function getClient() {
        if (clientPromise) return clientPromise;

        clientPromise = (async function loadClient() {
            const settings = window.HOMEWORK_FIREBASE_CONFIG || {};
            assertConfig(settings);

            const [appModule, authModule, firestoreModule] = await Promise.all([
                import(`https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-app.js`),
                import(`https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-auth.js`),
                import(`https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-firestore.js`)
            ]);

            const app = appModule.getApps().length
                ? appModule.getApp()
                : appModule.initializeApp(settings.firebaseConfig);
            const auth = authModule.getAuth(app);
            const user = auth.currentUser || (await authModule.signInAnonymously(auth)).user;
            const db = firestoreModule.getFirestore(app);

            return {
                auth,
                db,
                uid: user.uid,
                collectionRoot: trimSlashes(settings.collectionRoot),
                firestore: firestoreModule
            };
        }());

        return clientPromise;
    }

    async function submitHomework(payload) {
        const client = await getClient();
        const assignmentId = String(payload.assignmentId || "").trim();
        const signatureHash = String(payload.signatureHash || "").trim();

        if (!assignmentId || !signatureHash) {
            throw new Error("제출 식별 정보가 부족합니다.");
        }

        const documentId = `${client.uid}_${signatureHash}`;
        const documentRef = client.firestore.doc(
            client.db,
            client.collectionRoot,
            assignmentId,
            "submissions",
            documentId
        );
        const storedPayload = Object.assign({}, payload, {
            anonymousUid: client.uid,
            submittedAt: client.firestore.serverTimestamp()
        });

        await client.firestore.setDoc(documentRef, storedPayload, { merge: true });

        return {
            anonymousUid: client.uid,
            documentId,
            path: `${client.collectionRoot}/${assignmentId}/submissions/${documentId}`
        };
    }

    window.HomeworkSubmitter = {
        submitHomework
    };
}());
