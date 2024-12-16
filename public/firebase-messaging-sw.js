// import { getMessaging } from "firebase/messaging/sw";
// import { onBackgroundMessage } from "firebase/messaging/sw";
importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyD2fn018hgm2_0PDDV32YdZGlm_9Q3B4nU",
  authDomain: "hyracap.firebaseapp.com",
  projectId: "hyracap",
  storageBucket: "hyracap.firebasestorage.app",
  messagingSenderId: "296459576176",
  appId: "1:296459576176:web:6642a65a943c1336ef25b5",
  measurementId: "G-N52KTFQE8G",
};

firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();
