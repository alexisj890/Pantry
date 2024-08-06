// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD4cfHKEYJ8mwxLDyeINasILDYGYXRQVg",
  authDomain: "inventory-51bfb.firebaseapp.com",
  projectId: "inventory-51bfb",
  storageBucket: "inventory-51bfb.appspot.com",
  messagingSenderId: "450231402930",
  appId: "1:450231402930:web:59a57ac31ae240740ca4ab"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore };
