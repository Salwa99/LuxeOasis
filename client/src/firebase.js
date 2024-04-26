// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "real-estate-57335.firebaseapp.com",
  projectId: "real-estate-57335",
  storageBucket: "real-estate-57335.appspot.com",
  messagingSenderId: "638684539592",
  appId: "1:638684539592:web:e5ea76246d82cfd4add3fd",
  measurementId: "G-B146TW908P",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

