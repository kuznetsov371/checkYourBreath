const admin = require('firebase-admin');
const credentials = require('../../serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(credentials)
});

const getUID = async (idToken) => {
    await admin.auth().verifyIdToken(idToken)
        .then(async (decodenToken) => {
            const uid = await new Promise((res, rej) => {
                res(decodenToken.uid);
            });
            return uid
        })
        .catch((error) => {
            console.log('Error of decoden token:', error);
        });
}

const sendMessage = async (token, notification, data) => {
    let message = '';
    if (!notification) {
        message = {
            token: token,
            data: data
        };
    }
    if (!data) {
        message = {
            token: token,
            notification: notification
        };
    }
    await admin.messaging().send(message);
}

module.exports = {
    admin,
    getUID,
    sendMessage
};