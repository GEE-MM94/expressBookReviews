const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  }

  const userExists = users.some((user) => user.username === username);
  if (userExists) {
    return res.status(409).json({ message: "Username already exists." });
  }

  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully." });
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  try {
    const response = await axios.get("http://localhost:5000/");
    res.status(200).json({ books: response.data });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch books." });
  }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
  const isbn = req.params.isbn;

  try {
    const response = await axios.get(`http://localhost:5000/isbn/${isbm}`);
    const book = response.data[isbn];

    if (book) {
      res.status(200).json({ book });
    } else {
      res.status(404).json({ message: "Book not found for the given ISBN." });
    }
  } catch {
    res.status(500).json({ message: "Error fetching book details." });
  }
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  const authorName = req.params.author.toLowerCase();

  try {
    const response = await axios.get(
      `http://localhost:5000/author/${authorName}`
    );
    const booksData = response.data;

    const matchingBooks = Object.values(booksData).filter(
      (book) => book.author.toLowerCase() === authorName
    );

    if (matchingBooks.length > 0) {
      res.status(200).json({ books: matchingBooks });
    } else {
      res.status(404).json({ message: "No books found for the given author." });
    }
  } catch {
    res.status(500).json({ message: "Error fetching books by author." });
  }
});

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
  const title = req.params.title.toLowerCase();

  try {
    const response = await axios.get(`http://localhost:5000/title/${title}`);
    const booksData = response.data;

    const matchingBooks = Object.values(booksData).filter(
      (book) => book.title.toLowerCase() === title
    );

    if (matchingBooks.length > 0) {
      res.status(200).json({ books: matchingBooks });
    } else {
      res.status(404).json({ message: "No book found with the given title." });
    }
  } catch {
    res.status(500).json({ message: "Error fetching books by title." });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).json({ reviews: book.reviews });
  } else {
    return res
      .status(404)
      .json({ message: "Book not found for the given ISBN." });
  }
});

module.exports.general = public_users;
