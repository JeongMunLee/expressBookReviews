const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = {
    "test1": { "password": "test123" }
};

const isValid = (username)=>{ //returns boolean
    if (users.hasOwnProperty(username)) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
    if (!users.hasOwnProperty(username)) {
        return false;
    }
    const user = users[username];
    if (user.password === password) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.status(403).json({message: "wrong request parameters"});
  }
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({message: "invalid username and password"});
  }

  // Generate JWT access token
  let accessToken = jwt.sign({
    password: password
  }, "ACCESS", { expiresIn: 60 * 60 * 1000 });

  // Store access token and username in session
  req.session.authorization = {
    accessToken, username
  }
  return res.status(200).json({ token: accessToken });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];
  const username = req.session.authorization.username;
  if (!book) {
    return res.status(404).json({message: "There is not a book for isbn " + isbn});
  }
  if (book.hasOwnProperty(username)) {
    book.reviews[username] = req.query.review;
  } else {
    book.reviews[username] = req.query.review;
  }
  return res.status(200).json({message: "The review for the book with ISBN " + isbn + " has been added/updated." });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const book = books[isbn];
    const username = req.session.authorization.username;
    if (!book) {
        return res.status(404).json({message: "There is not a book for isbn " + isbn});
    }
    if (!book.reviews.hasOwnProperty(username)) {
        return res.status(404).json({message: "There is not reviews for user " + username});
    }
    delete book.reviews[username];
    return res.status(200).json({message: "Reviews for the ISBN " + isbn + "posted by the user " + username + " deleted"});
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
