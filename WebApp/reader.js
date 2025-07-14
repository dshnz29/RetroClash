// reader.js - Firebase Real-time Data Reader App
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://test-dfc0e-default-rtdb.firebaseio.com/'
});

const db = admin.database();

console.log('📡 Firebase Real-time Reader App Started!');
console.log('Listening for real-time updates...\n');

// Track connection status
const connectedRef = db.ref('.info/connected');
connectedRef.on('value', (snapshot) => {
    if (snapshot.val() === true) {
        console.log('🟢 Connected to Firebase');
    } else {
        console.log('🔴 Disconnected from Firebase');
    }
});

// Listen for messages
const messagesRef = db.ref('messages');
console.log('👂 Listening for messages...');

messagesRef.on('child_added', (snapshot) => {
    const message = snapshot.val();
    const timestamp = message.timestamp ? new Date(message.timestamp).toLocaleTimeString() : 'Unknown time';
    console.log(`💬 [${timestamp}] New message: "${message.text}"`);
});

messagesRef.on('child_changed', (snapshot) => {
    const message = snapshot.val();
    const timestamp = message.timestamp ? new Date(message.timestamp).toLocaleTimeString() : 'Unknown time';
    console.log(`📝 [${timestamp}] Message updated: "${message.text}"`);
});

messagesRef.on('child_removed', (snapshot) => {
    const message = snapshot.val();
    console.log(`🗑️ Message deleted: "${message.text}"`);
});

// Listen for users
const usersRef = db.ref('users');
console.log('👂 Listening for users...');

usersRef.on('child_added', (snapshot) => {
    const user = snapshot.val();
    const timestamp = user.createdAt ? new Date(user.createdAt).toLocaleTimeString() : 'Unknown time';
    console.log(`👤 [${timestamp}] New user: ${user.name} (${user.email})`);
});

usersRef.on('child_changed', (snapshot) => {
    const user = snapshot.val();
    const timestamp = user.updatedAt ? new Date(user.updatedAt).toLocaleTimeString() : 'Unknown time';
    console.log(`👤 [${timestamp}] User updated: ${user.name} - Age: ${user.age}`);
});

usersRef.on('child_removed', (snapshot) => {
    const user = snapshot.val();
    console.log(`👤 User removed: ${user.name}`);
});

// Listen for products
const productsRef = db.ref('products');
console.log('👂 Listening for products...');

productsRef.on('child_added', (snapshot) => {
    const product = snapshot.val();
    const timestamp = product.createdAt ? new Date(product.createdAt).toLocaleTimeString() : 'Unknown time';
    console.log(`🛍️ [${timestamp}] New product: ${product.name} - ${product.price}`);
});

productsRef.on('child_changed', (snapshot) => {
    const product = snapshot.val();
    console.log(`🛍️ Product updated: ${product.name} - ${product.price} (In Stock: ${product.inStock})`);
});

productsRef.on('child_removed', (snapshot) => {
    const product = snapshot.val();
    console.log(`🛍️ Product removed: ${product.name}`);
});

// Listen for counter changes
const counterRef = db.ref('counter');
console.log('👂 Listening for counter...');

counterRef.on('value', (snapshot) => {
    const count = snapshot.val();
    if (count !== null) {
        console.log(`🔢 Counter updated: ${count}`);
    }
});

// Listen for test data changes
const testRef = db.ref('test');
console.log('👂 Listening for test data...');

testRef.on('value', (snapshot) => {
    const data = snapshot.val();
    if (data) {
        console.log('🧪 Test data update:', data);
    }
});

// Error handling
db.ref().on('error', (error) => {
    console.error('❌ Database error:', error);
});

console.log('✅ All listeners set up successfully!');
console.log('Press Ctrl+C to stop listening\n');

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n👋 Shutting down gracefully...');
    process.exit(0);
});