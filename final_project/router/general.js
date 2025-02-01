const express = require('express');
let books = require("./booksdb.js");
let { isValid, users } = require("./auth_users.js");
const public_users = express.Router();

// User Registration
public_users.post("/register", (req, res) => {
    let { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password must be provided" });
    }

    if (!isValid(username)) {
        return res.status(409).json({ message: "Username already exists" });
    }

    users.push({ username, password });
    return res.status(201).json({ message: `${username} registered successfully.` });
});

// Get all books
public_users.get('/', (req, res) => {
    new Promise((resolve, reject) => {
        if (books) {
            resolve(books);  // Resolve with books data
        } else {
            reject("Error retrieving books");
        }
    })
    .then(data => res.status(200).json(data))  // Send the resolved data as a response
    .catch(error => res.status(500).json({ message: error }));  // Handle errors
});



// Get book details by ISBN
public_users.get('/isbn/:isbn', (req, res) => {
    new Promise((resolve, reject) => {
        let { isbn } = req.params;
        if (!books[isbn]) {
            reject("Book not found")
        } else {
            resolve(books[isbn])
        }
    })
    .then(data=>res.status(200).json(data))
    .catch(error=>res.status(500).json({message: error}));

});

// Get books by author
public_users.get('/author/:author', (req, res) => {
    new Promise((resolve, reject) => {
        let { author } = req.params;
        let filtered_books = Object.values(books).filter(book => book.author === author);
        if (filtered_books.length === 0) {
            reject("No books found for this author");
        } else {
            resolve(filtered_books)
        }
    })
    .then(data=>res.status(200).json(data))
    .catch(error=>res.status(500).json({message: error}));
});

// Get books by title
public_users.get('/title/:title', (req, res) => {
    new Promise((resolve, reject) => {
        let { title } = req.params;
        let filtered_books = Object.values(books).filter(book => book.title === title);
        if (filtered_books.length === 0) {
            reject("No books found for this title");
        } else {
            resolve(filtered_books)
        }
    })
    .then(data=>res.status(200).json(data))
    .catch(error=>res.status(500).json({message: error}));
});

// Get book reviews by ISBN
public_users.get('/review/:isbn', (req, res) => {
    let { isbn } = req.params;

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    return res.status(200).json(books[isbn].reviews);
});

module.exports.general = public_users;
