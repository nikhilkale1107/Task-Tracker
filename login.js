// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";


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
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  
  signInWithEmailAndPassword(auth, email, password)
    .then(async(userCredential) => {
      // Signed in 
      const user = userCredential.user;

      // Fetch the user's data from Firestore
      getDoc(doc(db, "users", user.uid))
        .then((userDoc) => {
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const username = userData.Username; // Assuming the field name is 'username'
            alert(`${username}, logged in Successfully!`);
            window.location.href = "/task.html";
            // window.location.href = "http://127.0.0.1:5502/index.html";
          } else {
            alert("User data not found.");
          }
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          alert("An error occurred while fetching user data.");
        });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage)
    });
}
