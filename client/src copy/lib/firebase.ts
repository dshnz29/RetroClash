// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyB7qBosrYxSVwmEPXw7o-f_uQc8wXtErK8",
    authDomain: "retroclash-f7bf0.firebaseapp.com",
    projectId: "retroclash-f7bf0",
    storageBucket: "retroclash-f7bf0.firebasestorage.app",
    messagingSenderId: "946568919179",
    appId: "1:946568919179:web:d0b72d66b400967f23bc8e",
    measurementId: "G-Y22972P1EK",
    databaseURL: "https://retroclash-f7bf0-default-rtdb.firebaseio.com/"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// export const analytics = getAnalytics(app);