// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyB9PxOnK08Y6PtL_Ol5gqK2BBSaiUcoFBs",
  authDomain: "task-tracker-a9c34.firebaseapp.com",
  projectId: "task-tracker-a9c34",
  storageBucket: "task-tracker-a9c34.appspot.com",
  messagingSenderId: "312310149445",
  appId: "1:312310149445:web:571b41b1a1fe0ac6bc0e2c",
  measurementId: "G-ELRHG7M8JQ"
};

 // Initialize Firebase
 const app = initializeApp(firebaseConfig);
 const db = getFirestore();
 const auth = getAuth(app);

document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");
  form.addEventListener("submit", register);
});

function register(event) {
  event.preventDefault();
  
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
   
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed up successfully
      const user = userCredential.user;
      alert( name + ", Signed up Successfully!");
      
      // Set user data in Firestore
      return setDoc(doc(db, "users", user.uid), {
        Email: email,
        Username: name
      });
    })
    .then(() => {
      window.location.href = "/login.html";
      // window.location.href = "http://127.0.0.1:5502/login.html";
    })
    .catch((error) => {
      const errorMessage = error.message;
      alert(errorMessage);
    });

}


