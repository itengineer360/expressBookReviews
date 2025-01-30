const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  let username = req.body.username
  let password = req.body.password
  if(!username || !password) {
    return res.status(403).json({message:"username and password must be provided"})
  }
  if(!isValid(username)){
    return res.status(403).json({message:"username is already exist"})
  }
  users.push({"username": username, "password": password})
  return res.status(200).json({message: `${username} addedd successfully.`});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn
  return res.status(200).json(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let authorName = req.params.author
  let filtered_books = Object.values(books).filter(book => book.author === authorName);
  return res.status(200).json(filtered_books);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let title = req.params.title
  let filtered_books = Object.values(books).filter(book => book.title === title);
  return res.status(200).json(filtered_books);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn
  let filtered_books = books[isbn].reviews
  return res.status(200).json(filtered_books);
});

module.exports.general = public_users;
