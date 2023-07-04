import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";

// The web app's Firebase configuration.
const firebaseConfig = {
    apiKey: "AIzaSyCsX1whAk_ToRPN2R7Rq47dkvqsK_z5Xrg",
    authDomain: "personality-fd709.firebaseapp.com",
    databaseURL: "https://personality-fd709-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "personality-fd709",
    storageBucket: "personality-fd709.appspot.com",
    messagingSenderId: "153112367535",
    appId: "1:153112367535:web:f4e31cf893f646bf701f5a",
    measurementId: "G-BB0CT37KNC"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Firebase database
export const db = getDatabase(app);