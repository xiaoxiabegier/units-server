// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAiGmFgzS1HJefVKV-r8El-t7q3kZYXccU",
  authDomain: "cybernetic-stream.firebaseapp.com",
  projectId: "cybernetic-stream",
  storageBucket: "cybernetic-stream.appspot.com",
  messagingSenderId: "134129148133",
  appId: "1:134129148133:web:875effc1d9117b0516f40c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore()