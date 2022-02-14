const { Expo } = require('expo-server-sdk');
//let expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN });
let admin = new Expo();
module.exports = admin;
//}

// var admin = require("firebase-admin");

// var serviceAccount = require("./sinbad-delivery-firebase-adminsdk-dfr83-f00e1bcdea.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });
// module.exports = admin;
// const { initializeApp } = require ("firebase/app");
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyDVFvurJK6PyxOgj9jS54HDa6lvSbUlJfI",
//   authDomain: "sinbad-delivery.firebaseapp.com",
//   databaseURL: "https://sinbad-delivery-default-rtdb.europe-west1.firebasedatabase.app",
//   projectId: "sinbad-delivery",
//   storageBucket: "sinbad-delivery.appspot.com",
//   messagingSenderId: "202365528516",
//   appId: "1:202365528516:web:cf5437b1010ba7f40edc91",
//   measurementId: "G-171W97WHT9"
// };

// // Initialize Firebase
// const admin = initializeApp(firebaseConfig);
//  module.exports = admin;
