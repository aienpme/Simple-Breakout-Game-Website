"use strict";

// Adding event listener to the form
document.getElementById('login').addEventListener('submit', loginfunc);

function loginfunc(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    console.log("Attempting to log in with username:", username); // Debug log

    const userData = localStorage.getItem(username);

    // Clear previous error message
    const errorMessageDiv = document.getElementById("error-message");
    errorMessageDiv.textContent = ""; // Clear any existing message

    if (userData) {
        const storedUserData = JSON.parse(userData);

        // Check if both username and password are correct
        if (storedUserData.username === username && storedUserData.password === password) {
            sessionStorage.clear();
            sessionStorage.setItem("loggedInUser", username); // The logged-in username gets stored inside sessionStorage
            
            console.log("Login successful, redirecting to logmein.html"); // Debug log
            // Redirect to logmein.html 
            window.location.href = "logmein.html"; // Sends user to the logging in page
        } else {
            console.error('One of the fields is incorrect, try again.'); //this line and next line are for debugging 
            errorMessageDiv.textContent = "Wrong login details, please try again.";
        }
    } else {
        console.error('Incorrect username or password, try again.'); // //this line and next line are for debugging 
        errorMessageDiv.textContent = "Incorrect username or password, please try again."; 
    }
}
