import { initializeApp } from "firebase/app";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBsP9SNH1FuRBpbhcvo9flXbAQWydpctd4",
  authDomain: "irishrailtracker.firebaseapp.com",
  projectId: "irishrailtracker",
  storageBucket: "irishrailtracker.appspot.com",
  messagingSenderId: "753565032771",
  appId: "1:753565032771:web:092121cc9d3e254084cff6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;