// index.js
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

// Initialize Firebase Admin
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://test-dfc0e-default-rtdb.firebaseio.com/"
});

const db = admin.database();
const ref = db.ref("/esp32/random");

console.log("Listening for changes at /esp32/random...");

ref.on("value", (snapshot) => {
    const data = snapshot.val();
    console.log("Random number updated:", data);
});
