  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-analytics.js";
  import { getAuth } from "firebase/auth";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyDNd7QjJFSZ67Wp4pXXTcnakXD0j4xqSWU",
    authDomain: "earthph-d387f.firebaseapp.com",
    projectId: "earthph-d387f",
    storageBucket: "earthph-d387f.firebasestorage.app",
    messagingSenderId: "348649968616",
    appId: "1:348649968616:web:09684c11399f2002008a5d",
    measurementId: "G-8HKFMKNXHM"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);