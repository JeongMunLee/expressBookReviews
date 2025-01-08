const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  if (req.body.username) {
    const username = req.body.username;
    if (users.hasOwnProperty(username)) {
        return res.status(500).json({ message: "Already registered user"});
    }
    users[username] = {
        password: req.body.password
    };
  }
  res.send("Customers successfully registered. Now you can login");
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.send(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn]; 
  return res.send(book);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  // 순회하면서 author를 출력
  for (let key in books) {
    if (books[key].author === author) {
        return res.send(books[key]);
    }
  }
  return res.status(404).json({message: "There is not a book that author is " + author});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    // 순회하면서 author를 출력
    for (let key in books) {
      if (books[key].title === title) {
          return res.send(books[key]);
      }
    }
    return res.status(404).json({message: "There is not a book that title is " + author});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn]; 
  return res.send(book.reviews);
});

  const getBooks = () => {
    axios.get('https://jeongmlee071-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/') // 책 목록 API URL
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error('Error fetching books:', error);
      });
  }
  
  const getBook = (isbn) => { 
    axios.get('https://jeongmlee071-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/isbn/' + isbn)
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.error('Error fetching books:', error);
    });
  }

  const getBookByAuthor = (author) => {
    axios.get('https://jeongmlee071-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/author/' + author)
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.error('Error fetching books:', error);
    });
  }

  const getBookByTitle = (title) => {
    axios.get('https://jeongmlee071-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/title/' + title)
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.error('Error fetching books:', error);
    });
  }  
  // Call the function to fetch books
//   getBooks();
//   getBook(1);
// getBookByAuthor("Dante Alighieri");
getBookByTitle("The Book Of Job");


module.exports.general = public_users;
