const admin = require("firebase-admin");
const serviceAccount = require("./config/social-link-c494c-firebase-adminsdk-fbsvc-f45e773f21.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "social-link-c494c.firebasestorage.app",
});

const bucket = admin.storage().bucket();
module.exports = { admin, bucket };
