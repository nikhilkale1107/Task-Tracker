// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import { getFirestore, collection, getDocs, getDoc, doc, addDoc, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";


const firebaseConfig = {
  apiKey: "AIzaSyB9PxOnK08Y6PtL_Ol5gqK2BBSaiUcoFBs",
  authDomain: "task-tracker-a9c34.firebaseapp.com",
  projectId: "task-tracker-a9c34",
  storageBucket: "task-tracker-a9c34.appspot.com",
  messagingSenderId: "312310149445",
  appId: "1:312310149445:web:571b41b1a1fe0ac6bc0e2c",
  measurementId: "G-ELRHG7M8JQ"
};

// const firebaseConfig = {
//   apiKey: process.env.API_KEY,
//   authDomain: process.env.AUTH_DOMAIN,
//   projectId: process.env.PROJECT_ID,
//   storageBucket: process.env.STORAGE_BUCKET,
//   messagingSenderId: process.env.MESSAGING_SENDER_ID,
//   appId: process.env.APP_ID,
//   measurementId: process.env.MEASUREMENT_ID
// };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth();

// Function to get the current user
const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    }, reject);
  });
};

// Check authentication status
const checkAuthAndRedirect = async () => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      // If not authenticated, redirect to the login page
      window.location.href = "/login.html";
    }
  } catch (error) {
    console.error("Error checking authentication state: ", error);
  }
};

// Call function to check authentication status and redirect
checkAuthAndRedirect();

// Logout event listener
document.getElementById("logout").addEventListener("click", async () => {
  try {
    const user = await getCurrentUser();
    if (user) {
      // Fetch the user data from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const username = userDoc.data().Username;
        await signOut(auth);
        alert(` ${username}, Logged out Successfully!`);
      } else {
        await signOut(auth);
        alert('Log-out successful.');
      }
    } else {
      await signOut(auth);
      alert('Log-out successful.');
    }
    window.location.href = "/login.html";
    // window.location.href = "//login.html";
    // window.location.href = "http://127.0.0.1:5502//login.html";
    document.getElementById('logout').style.display = 'none';
  } catch (error) {
    console.error('An error occurred during sign-out:', error.message);
  }
});

// Function to check authentication state and display tasks
const checkAuthAndDisplayTasks = async () => {
  try {
    const user = await getCurrentUser();
    if (user) {
      // If user is authenticated, display tasks
      displayTasks();
    } else {
      console.error("User not authenticated.");
    }
  } catch (error) {
    console.error("Error checking authentication state: ", error);
  }
};

// Listen for authentication state changes
auth.onAuthStateChanged((user) => {
  if (user) {
    // If user is authenticated, call function to display tasks
    checkAuthAndDisplayTasks();
  }
});

// Task form submission event listener
document.getElementById("taskForm").addEventListener("submit", async (event) => {
  event.preventDefault(); // Prevent default form submission behavior
  
  const taskInput = document.getElementById("task");
  const task = taskInput.value.trim(); // Trim whitespace from input
  
  if (task !== "") { // Check if task input is not empty
    addTask(task); // Call addTask function to add the task
    displayTasks();
    taskInput.value = ""; // Clear input field after adding task
  }
});

// Function to add a task to Firestore
const addTask = async (task) => {
  try {
    const user = await getCurrentUser();
    if (user) {
      await addDoc(collection(db, `tasks`), { userId: user.uid, task });
      console.log("Task added successfully");
      // alert("Task Added");
      // displayTasks();
    } else {
      console.error("User not authenticated.");
    }
  } catch (error) {
    console.error("Error adding task: ", error);
  }
};


// Function to delete a task from Firestore and update display
const deleteTask = async (taskId) => {
  try {
    // Delete the task from the database
    await deleteDoc(doc(db, `tasks/${taskId}`));

    // Remove the task from the display screen
    const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
    if (taskElement) {
      taskElement.remove();
      console.log("Task removed from screen:", taskId);
    } else {
      console.error("Task element not found for taskId:", taskId);
    }
  } catch (error) {
    console.error("Error deleting task: ", error);
  }
};

// Function to mark a task as complete in Firestore
const completeTask = async (taskId) => {
  try {
    // Update the completion status in the database
    await updateDoc(doc(db, `tasks/${taskId}`), {
      completed: true
    });

    // Update the display to show "Completed" message
    const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
    if (taskElement) {
      const completeButton = taskElement.querySelector("button");
      completeButton.textContent = "Completed";
      completeButton.style.backgroundColor = "#28a745";
      completeButton.disabled = true; // Disable the button after completion
    } else {
      console.error("Task element not found for taskId:", taskId);
    }
  } catch (error) {
    console.error("Error updating task completion status: ", error);
  }
};

const displayTasks = async () => {
  try {
    const user = await getCurrentUser();
    if (user) {
      const tasksList = document.getElementById("tasks");
      tasksList.innerHTML = ""; // Clear previous tasks

      const querySnapshot = await getDocs(collection(db, 'tasks'));
      querySnapshot.forEach((doc) => {
        const taskData = doc.data();
        if (taskData.userId === user.uid) {
          const task = taskData.task;
          const taskId = doc.id; // Get the ID of the task document

          // Create list item for task
          const li = document.createElement("li");
          li.textContent = task;
          li.setAttribute("data-task-id", taskId); // Set data-task-id attribute
          li.style.display = "flex";
          li.style.justifyContent = "space-between";
          li.style.alignItems = "center";
          li.style.padding = "10px";
          li.style.borderBottom = "1px solid #ccc";

          // Create div for buttons
          const buttonDiv = document.createElement("div");
          buttonDiv.style.display = "flex";
          buttonDiv.style.alignItems = "center";

          // Create Complete button
          const completeButton = document.createElement("button");
          if (taskData.completed) {
            completeButton.textContent = "Completed";
            completeButton.style.backgroundColor = "#28a745";
            completeButton.disabled = true;
          } else {
            completeButton.textContent = "Complete";
            completeButton.style.backgroundColor = "#007bff";
            completeButton.addEventListener("click", () => completeTask(taskId));
          }
          completeButton.style.padding = "5px";
          completeButton.style.color = "#fff";
          completeButton.style.border = "none";
          completeButton.style.borderRadius = "5px";

          // Create Delete button
          const deleteButton = document.createElement("button");
          deleteButton.textContent = "Delete";
          deleteButton.style.padding = "5px";
          deleteButton.style.backgroundColor = "#dc3545";
          deleteButton.style.color = "#fff";
          deleteButton.style.border = "none";
          deleteButton.style.borderRadius = "5px";
          deleteButton.style.marginLeft = "5px"; // Add margin between the buttons
          deleteButton.addEventListener("click", () => deleteTask(taskId));

          // Append buttons to button div
          buttonDiv.appendChild(completeButton);
          buttonDiv.appendChild(deleteButton);

          // Append button div to list item
          li.appendChild(buttonDiv);

          // Append list item to tasks list
          tasksList.appendChild(li);
        }
      });
    } else {
      console.error("User not authenticated.");
    }
  } catch (error) {
    console.error("Error displaying tasks: ", error);
  }
};
