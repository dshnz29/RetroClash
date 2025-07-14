// Firebase Realtime Database Test App
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
// Replace with your service account key path
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://test-dfc0e-default-rtdb.firebaseio.com/' // Replace with your database URL
});

const db = admin.database();

// Test functions
async function testFirebaseOperations() {
    console.log('🔥 Starting Firebase Realtime Database Tests...\n');

    try {
        // 1. Write data
        console.log('1. Writing data...');
        const usersRef = db.ref('users');
        await usersRef.push({
            name: 'John Doe',
            email: 'john@example.com',
            age: 30,
            createdAt: admin.database.ServerValue.TIMESTAMP
        });
        console.log('✅ Data written successfully\n');

        // 2. Read all data
        console.log('2. Reading all users...');
        const snapshot = await usersRef.once('value');
        const users = snapshot.val();
        console.log('Users data:', users);
        console.log('✅ Data read successfully\n');

        // 3. Update data
        console.log('3. Updating user data...');
        const userKeys = Object.keys(users);
        if (userKeys.length > 0) {
            const firstUserKey = userKeys[0];
            await usersRef.child(firstUserKey).update({
                age: 31,
                updatedAt: admin.database.ServerValue.TIMESTAMP
            });
            console.log('✅ Data updated successfully\n');
        }

        // 4. Query data
        console.log('4. Querying users with age > 25...');
        const querySnapshot = await usersRef.orderByChild('age').startAt(25).once('value');
        const queriedUsers = querySnapshot.val();
        console.log('Queried users:', queriedUsers);
        console.log('✅ Query executed successfully\n');

        // 5. Listen for real-time updates
        console.log('5. Setting up real-time listener...');
        const testRef = db.ref('test');

        testRef.on('value', (snapshot) => {
            const data = snapshot.val();
            console.log('📡 Real-time update received:', data);
        });

        // Trigger some updates to test real-time functionality
        setTimeout(() => {
            console.log('Triggering real-time updates...');
            testRef.set({ message: 'Hello Firebase!', timestamp: Date.now() });
        }, 2000);

        setTimeout(() => {
            testRef.update({ message: 'Updated message!', timestamp: Date.now() });
        }, 4000);

        // 6. Delete data (optional)
        setTimeout(async () => {
            console.log('6. Cleaning up test data...');
            await testRef.remove();
            console.log('✅ Test data cleaned up\n');

            console.log('🎉 All tests completed successfully!');
            process.exit(0);
        }, 6000);

    } catch (error) {
        console.error('❌ Error during testing:', error);
        process.exit(1);
    }
}

// Additional helper functions
function createTestData() {
    const testData = {
        products: {
            product1: {
                name: 'Laptop',
                price: 999.99,
                category: 'Electronics',
                inStock: true
            },
            product2: {
                name: 'Book',
                price: 19.99,
                category: 'Education',
                inStock: false
            }
        },
        orders: {
            order1: {
                userId: 'user123',
                items: ['product1'],
                total: 999.99,
                status: 'pending',
                createdAt: admin.database.ServerValue.TIMESTAMP
            }
        }
    };

    return db.ref().set(testData);
}

// Test transaction
async function testTransaction() {
    console.log('Testing transaction...');
    const counterRef = db.ref('counter');

    try {
        const result = await counterRef.transaction((currentValue) => {
            return (currentValue || 0) + 1;
        });

        console.log('Transaction completed. New value:', result.snapshot.val());
    } catch (error) {
        console.error('Transaction failed:', error);
    }
}

// Run tests
console.log('🚀 Initializing Firebase test app...');
testFirebaseOperations();

// Uncomment to test additional features
// setTimeout(() => createTestData(), 8000);
// setTimeout(() => testTransaction(), 10000);