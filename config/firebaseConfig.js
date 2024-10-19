const admin = require('firebase-admin');

// Path to your service account key JSON file
const serviceAccount = require('../firebase.json');

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'snackrmenu.appspot.com' // Replace with your Firebase project ID
});

// Get a reference to Firebase Storage bucket
const bucket = admin.storage().bucket();

module.exports = bucket;
