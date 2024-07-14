// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Import Firestore
import { getStorage, ref } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCg5NnuBf1r6OlJUa6WO-a2n04Z1db-07I",
  authDomain: "blogify-321e1.firebaseapp.com",
  projectId: "blogify-321e1",
  storageBucket: "blogify-321e1.appspot.com",
  messagingSenderId: "1060263466030",
  appId: "1:1060263466030:web:d76cfab93eeb9ffe44fbbf",
  
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
// Initialize Firestore and get a reference to the service
export const db = getFirestore(app);
// Get a reference to the storage service, which is used to create references in your storage bucket
export const storage = getStorage();

// Create a storage reference from our storage service

// Create a child reference
const imagesRef = ref(storage, 'images');
// imagesRef now points to 'images'

// Child references can also take paths delimited by '/'
const spaceRef = ref(storage, 'images/space.jpg');
// spaceRef now points to "images/space.jpg"
// imagesRef still points to "images"


