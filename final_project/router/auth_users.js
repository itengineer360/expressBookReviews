const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    let isExist = users.some(user => user.username == username)
    return !isExist;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let isAuthentic = users.some(user=>user.username == username && user.password == password)
    return isAuthentic
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  let username = req.body.username
  let password = req.body.password
  // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let isbn = req.params.isbn
  let review = req.query.review
  let username = req.session.authorization.username
  if(review && review.length > 0) {
    books[isbn].reviews[username] = review
    return res.status(200).json({message: `${review} posted successfully`});
  }
  return res.status(400).json({message: "review must be provided"});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    //Write your code here
    let isbn = req.params.isbn
    let username = req.session.authorization.username
    let review = books[isbn].reviews[username]
    if(review) {
      delete books[isbn].reviews[username]
      return res.status(200).json({message: `${review} deleted successfully`});
    }
    return res.status(400).json({message: "you don't have review"});
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
