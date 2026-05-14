import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database"; // Switch to Realtime Database

const firebaseConfig = {
  apiKey: "AIzaSyCAf-iSb8MKdf7C2FlaFPwALesqfBzH3C8",
  authDomain: "roadsos-c0f5a.firebaseapp.com",
  databaseURL: "https://roadsos-c0f5a-default-rtdb.asia-southeast1.firebasedatabase.app", // This URL is essential now
  projectId: "roadsos-c0f5a",
  storageBucket: "roadsos-c0f5a.firebasestorage.app",
  messagingSenderId: "358951667529",
  appId: "1:358951667529:web:60842fafc581a663e9fc98",
};

const app = initializeApp(firebaseConfig);
export const rtdb = getDatabase(app); // Export the Realtime Database instance
