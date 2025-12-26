// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD27p5BJdhQ0LOcdmeH8okcNvfuOJaZ9iM",
  authDomain: "fcm-notification-9fd1f.firebaseapp.com",
  projectId: "fcm-notification-9fd1f",
  storageBucket: "fcm-notification-9fd1f.firebasestorage.app",
  messagingSenderId: "1063781122560",
  appId: "1:1063781122560:web:8a8d847341133db82ecee5",
  measurementId: "G-MZK3D3CDJH",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
