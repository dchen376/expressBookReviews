const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {

    const {username, password } = req.body

    // check username or password missing
    if (!username || !password) {
        return res.status(400).json({ message: "Usernmae and password are required."});
    }

    // check if user already exists
    if (users[username]) {
        return res.status(409),json({message: "User already exists"})
    }

    // create new user
    users.push({username, password})

    return res.status(201).json({message : "User registered successfully", user : {username}})

  
});


// Get the book list available in the shop
public_users.get('/',function (req, res) {
    
    return res.status(200).send(JSON.stringify({
        message: "Book list retrieved successfully",
        books: books
    }, null, 3));
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {

    const isbn = req.params.isbn
    const book = books[isbn] // look up this book with the isbn value.

    if (book) {
        return res.status(200).json({
            message: "Book details retrieved successfully",
            book: book
        });

    } else {
        
        return res.status(404).json({ message: "Book not found" });
    
    }
 });
  
 
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author
    const booksByAuthor = Object.values(books).filter((book) => {
        return book.author == author
    })

    if (booksByAuthor.length > 0) {
        return res.status(200).json({
            message: "Book details retrieved successfully",
            booksByAuthor: booksByAuthor
        });

    } else {
        
        return res.status(404).json({ message: "Book not found" });
    
    }


});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  
    const title = req.params.title
    const bookByTitle = Object.values(books).filter((book) => {
        return book.title == title
    })

    if(bookByTitle.length > 0) {
        return res.status(200).json({
            message: "Books retrieved successfully",
            bookByTitle: bookByTitle
        });
    } else {
        return res.status(404).json({ message: "No books found with this title" });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn
    const book = books[isbn] // look up this book with the isbn value.
  

    if (book) {
        return res.status(200).json({
            message: "Book reviews retrieved successfully",
            reviews: book.reviews
        });

    } else {
        
        return res.status(404).json({ message: "Book not found" });
    
    }
});

module.exports.general = public_users;
