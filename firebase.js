// js/firebase.js

// Import Firebase modules (if using modules)
// Otherwise, include Firebase scripts in HTML

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC56LawqZV4vhslnp6pQLhXD3UxGYST9vY",
    authDomain: "jack-n-poy.firebaseapp.com",
    databaseURL: "https://jack-n-poy-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "jack-n-poy",
    storageBucket: "jack-n-poy.appspot.com",
    messagingSenderId: "706617302358",
    appId: "1:706617302358:web:bc1573c1350cda5b1c4af7",
    measurementId: "G-N2FRK3JL2F"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize services
const auth = firebase.auth();
const db = firebase.database();
