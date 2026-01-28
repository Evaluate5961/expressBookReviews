const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 10: Get the book list available in the shop using Async-Await
public_users.get('/', async function (req, res) {
  try {
    const getBooks = () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(books);
        }, 100);
      });
    };
    const bookList = await getBooks();
    res.status(200).send(JSON.stringify(bookList, null, 4));
  } catch (error) {
    res.status(500).json({message: "Error fetching book list"});
  }
});

// Task 11: Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', function (req, res) {
  const getBook = new Promise((resolve, reject) => {
    const isbn = req.params.isbn;
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject({status: 404, message: "ISBN not found"});
    }
  });

  getBook
    .then((book) => res.status(200).send(JSON.stringify(book, null, 4)))
    .catch((err) => res.status(err.status).json({message: err.message}));
});
  
// Task 12: Get book details based on author using Async-Await
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const getByAuthor = () => {
      return new Promise((resolve, reject) => {
        const authorBooks = [];
        for (const isbn in books) {
          if (books[isbn].author === author) {
            authorBooks.push({ isbn, ...books[isbn] });
          }
        }
        if (authorBooks.length > 0) {
          resolve(authorBooks);
        } else {
          reject({status: 404, message: "No books found for this author"});
        }
      });
    };
    const filteredBooks = await getByAuthor();
    res.status(200).send(JSON.stringify(filteredBooks, null, 4));
  } catch (err) {
    res.status(err.status || 500).json({message: err.message});
  }
});

// Task 13: Get book details based on title using Promises
public_users.get('/title/:title', function (req, res) {
  const getByTitle = new Promise((resolve, reject) => {
    const title = req.params.title;
    const titleBooks = [];
    for (const isbn in books) {
      if (books[isbn].title === title) {
        titleBooks.push({ isbn, ...books[isbn] });
      }
    }
    if (titleBooks.length > 0) {
      resolve(titleBooks);
    } else {
      reject({status: 404, message: "No books found with this title"});
    }
  });

  getByTitle
    .then((result) => res.status(200).send(JSON.stringify(result, null, 4)))
    .catch((err) => res.status(err.status).json({message: err.message}));
});

// Task 5: Get book review (Keeping sync as per standard lab flow)
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.send(JSON.stringify(books[isbn].reviews, null, 4));
  } else {
    res.status(404).json({message: "No reviews found for this ISBN"});
  }
});

module.exports.general = public_users;
