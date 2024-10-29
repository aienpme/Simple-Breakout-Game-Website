"use strict";

function myfunc(event) {
    event.preventDefault(); // This prevents the page from refreshing

    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    var emailaddress = document.getElementById("email").value; 
    var phonenumber = document.getElementById("phonenumber").value;

    // Create an object to store the user data
    var userData = {
        username: username,
        password: password,
        emailAddress: emailaddress,
        phoneNumber: phonenumber
    };

    // Convert the object to a JSON string and store it in local storage
    localStorage.setItem(username, JSON.stringify(userData));

    // Display the message in the designated div
    document.getElementById("registrationMessage").textContent = "You have been registered. Please login.";

    // Clear the fields after the user submits
    document.querySelector('form[name="register-form"]').reset();
}
