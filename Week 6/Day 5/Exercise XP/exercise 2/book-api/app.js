const express = require('express');
const app = express();
const PORT = 5000;

app.use(express.json());

const books = [
  { id: 1, title: '1984', author: 'George Orwell', publishedYear: 1949 },
  { id: 2, title: 'Things Fall Apart', author: 'Chinua Achebe', publishedYear: 1958 },
  { id: 3, title: 'The Hobbit', author: 'J.R.R. Tolkien', publishedYear: 1937 },
];

// Read all
app.get('/api/books', (req, res) => {
  res.json(books);
});

// Read one
app.get('/api/books/:bookId', (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.bookId));
  if (!book) return res.status(404).json({ message: 'Book not found' });
  res.status(200).json(book);
});

// Create
app.post('/api/books', (req, res) => {
  const newBook = {
    id: books.length + 1,
    title: req.body.title,
    author: req.body.author,
    publishedYear: req.body.publishedYear,
  };
  books.push(newBook);
  res.status(201).json(newBook);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});