import firebase from "firebase/app";
import "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCXqQQEThS55FpdLmngSoGOFPW_RGpncFQ",
    authDomain: "social-link-c494c.firebaseapp.com",
    projectId: "social-link-c494c",
    storageBucket: "social-link-c494c.firebasestorage.app",
    messagingSenderId: "131685391389",
    appId: "1:131685391389:web:be7dfaa929beb6868bbaf4",
    measurementId: "G-M7PM7PB8QN",
};

const app = firebase.initializeApp(firebaseConfig);
export const auth = app.auth();
export default app;