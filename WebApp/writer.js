// writer.js - Firebase Data Writer App
const admin = require('firebase-admin');
const readline = require('readline');

// Initialize Firebase Admin SDK
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://test-dfc0e-default-rtdb.firebaseio.com/'
});

const db = admin.database();

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔥 Firebase Writer App Started!');
console.log('Commands:');
console.log('  msg <message> - Send a message');
console.log('  user <name> <email> - Add a user');
console.log('  product <name> <price> - Add a product');
console.log('  counter - Increment counter');
console.log('  auto - Start auto-sending messages every 3 seconds');
console.log('  stop - Stop auto-sending');
console.log('  exit - Exit the app');
console.log('----------------------------------------\n');

let autoInterval = null;

// Helper functions
async function sendMessage(message) {
  try {
    const messagesRef = db.ref('messages');
    await messagesRef.push({
      text: message,
      timestamp: admin.database.ServerValue.TIMESTAMP,
      id: Date.now()
    });
    console.log('✅ Message sent:', message);
  } catch (error) {
    console.error('❌ Error sending message:', error);
  }
}

async function addUser(name, email) {
  try {
    const usersRef = db.ref('users');
    await usersRef.push({
      name: name,
      email: email,
      createdAt: admin.database.ServerValue.TIMESTAMP,
      status: 'online'
    });
    console.log('✅ User added:', { name, email });
  } catch (error) {
    console.error('❌ Error adding user:', error);
  }
}

async function addProduct(name, price) {
  try {
    const productsRef = db.ref('products');
    await productsRef.push({
      name: name,
      price: parseFloat(price),
      createdAt: admin.database.ServerValue.TIMESTAMP,
      inStock: true
    });
    console.log('✅ Product added:', { name, price });
  } catch (error) {
    console.error('❌ Error adding product:', error);
  }
}

async function incrementCounter() {
  try {
    const counterRef = db.ref('counter');
    const result = await counterRef.transaction((currentValue) => {
      return (currentValue || 0) + 1;
    });
    console.log('✅ Counter incremented to:', result.snapshot.val());
  } catch (error) {
    console.error('❌ Error incrementing counter:', error);
  }
}

function startAutoMessages() {
  if (autoInterval) {
    console.log('⚠️ Auto-sending is already active');
    return;
  }
  
  console.log('🤖 Starting auto-message sending every 3 seconds...');
  let messageCount = 1;
  
  autoInterval = setInterval(() => {
    const autoMessage = `Auto message #${messageCount} - ${new Date().toLocaleTimeString()}`;
    sendMessage(autoMessage);
    messageCount++;
  }, 3000);
}

function stopAutoMessages() {
  if (autoInterval) {
    clearInterval(autoInterval);
    autoInterval = null;
    console.log('⏹️ Auto-sending stopped');
  } else {
    console.log('⚠️ Auto-sending is not active');
  }
}

// Command processor
function processCommand(input) {
  const parts = input.trim().split(' ');
  const command = parts[0].toLowerCase();
  
  switch (command) {
    case 'msg':
      if (parts.length > 1) {
        const message = parts.slice(1).join(' ');
        sendMessage(message);
      } else {
        console.log('Usage: msg <message>');
      }
      break;
      
    case 'user':
      if (parts.length >= 3) {
        const name = parts[1];
        const email = parts[2];
        addUser(name, email);
      } else {
        console.log('Usage: user <name> <email>');
      }
      break;
      
    case 'product':
      if (parts.length >= 3) {
        const name = parts[1];
        const price = parts[2];
        addProduct(name, price);
      } else {
        console.log('Usage: product <name> <price>');
      }
      break;
      
    case 'counter':
      incrementCounter();
      break;
      
    case 'auto':
      startAutoMessages();
      break;
      
    case 'stop':
      stopAutoMessages();
      break;
      
    case 'exit':
      console.log('👋 Goodbye!');
      stopAutoMessages();
      process.exit(0);
      break;
      
    default:
      console.log('Unknown command. Try: msg, user, product, counter, auto, stop, or exit');
  }
}

// Main input loop
function promptUser() {
  rl.question('> ', (input) => {
    processCommand(input);
    promptUser();
  });
}

// Start the app
promptUser();

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down gracefully...');
  stopAutoMessages();
  process.exit(0);
});