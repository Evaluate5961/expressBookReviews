const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  return res.status(300).json({message: "Yet to be implemented"});
});

public_users.get('/', function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.send(JSON.stringify(books[isbn], null, 4));
  } else {
    res.status(404).json({message: "ISBN not found"});
  }
});
  
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const authorBooks = [];
  for (const isbn in books) {
    if (books[isbn].author === author) {
      authorBooks.push({ isbn, ...books[isbn] });
    }
  }
  if (authorBooks.length > 0) {
    res.send(JSON.stringify(authorBooks, null, 4));
  } else {
    res.status(404).json({message: "No books found for this author"});
  }
});

public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const titleBooks = [];
  for (const isbn in books) {
    if (books[isbn].title === title) {
      titleBooks.push({ isbn, ...books[isbn] });
    }
  }
  if (titleBooks.length > 0) {
    res.send(JSON.stringify(titleBooks, null, 4));
  } else {
    res.status(404).json({message: "No books found with this title"});
  }
});

// Task 5: Enhanced Review Route
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
      // This will return {} if empty, or the reviews if they exist
      return res.status(200).send(JSON.stringify(book.reviews, null, 4));
  } else {
      return res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;
