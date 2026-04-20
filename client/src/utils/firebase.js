




// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "interviewiq-99cf6.firebaseapp.com",
  projectId: "interviewiq-99cf6",
  storageBucket: "interviewiq-99cf6.firebasestorage.app",
  messagingSenderId: "82860151741",
  appId: "1:82860151741:web:c7f79a4257373af36238d4"
};
//API KEY   "AIzaSyDtajqtJZyToHeKQuzPK__QFFRf9PURog8"
// Initialize Firebase
const app = initializeApp(firebaseConfig);


const auth = getAuth(app)

const provider = new GoogleAuthProvider()

export {auth, provider}