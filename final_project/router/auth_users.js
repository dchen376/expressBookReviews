const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    //write code to check if the username is valid
     // Filter the users array for any user with the same username
     let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return false if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return false;
    } else {
        return true;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
    // if username and password match the one we have in records.

    // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}




//only registered users can login
regd_users.post("/login", (req,res) => {
    const {username, password} = req.body;

    // step1 - check both username and password are provided.
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // step2 - validate user credentials
    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ message: "Invalid username or password" });
    }

    // step3 - Generate a JWT token (valid for 1 hour)
    const token = jwt.sign({ username }, "secret-key", { expiresIn: 60 * 60 });

    // Step 4: Store token and username in session for authentication
    req.session.authorization = { token, username };

    return res.status(200).send("User successfully logged in");

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn; // Extract ISBN from URL
    const review = req.body.review; // Extract review from query parameters
    const username = req.session.authorization?.username; // Get username from session

    // Step 1: Check if user is logged in
    if (!username) {
        return res.status(401).json({ message: "User not authenticated" });
    }

    // Step 2: Check if the book exists
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Step 3: Add or update the review under the username
    books[isbn].reviews[username] = review;

    return res.status(200).json({
        message: "Review added/updated successfully",
        reviews: books[isbn].reviews
    });


});




regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn; // Extract ISBN from URL
    const username = req.session.authorization?.username; // Get username from session

    // Step 1: Check if user is logged in
    if (!username) {
        return res.status(401).json({ message: "User not authenticated" });
    }

    // Step 2: Check if the book exists
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Step 3: Check if reviews exist for the book
    if (!books[isbn].reviews || !books[isbn].reviews[username]) {
        return res.status(404).json({ message: "No review found for this user" });
    }

    // Step 4: Delete the user's review
    delete books[isbn].reviews[username];

    return res.status(200).json({
        message: "Review deleted successfully",
        reviews: books[isbn].reviews // Return updated reviews
    });
});




module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;



