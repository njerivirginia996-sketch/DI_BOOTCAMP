
import { useState } from "react";
import { useSelector } from "react-redux";

import {
  selectBooks,
  selectHorrorBooks,
  selectFantasyBooks,
  selectScienceFictionBooks,
} from "../features/books/booksSelectors";

function BookList() {
  const [genre, setGenre] = useState("All");

  const allBooks = useSelector(selectBooks);
  const horrorBooks = useSelector(selectHorrorBooks);
  const fantasyBooks = useSelector(selectFantasyBooks);
  const scienceFictionBooks = useSelector(selectScienceFictionBooks);

  const bookLists = {
    All: allBooks,
    Horror: horrorBooks,
    Fantasy: fantasyBooks,
    "Science Fiction": scienceFictionBooks,
  };

  const displayedBooks = bookLists[genre];

  return (
    <main className="book-container">
      <h1>Book Inventory</h1>
      <p>Explore our collection by genre.</p>

      <div className="genre-buttons">
        {Object.keys(bookLists).map((item) => (
          <button
            key={item}
            className={genre === item ? "active" : ""}
            onClick={() => setGenre(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <h2>{genre} Books</h2>
      <p>{displayedBooks.length} book(s) found</p>

      <div className="book-grid">
        {displayedBooks.map((book) => (
          <article className="book-card" key={book.id}>
            <span className="book-genre">{book.genre}</span>
            <h3>{book.title}</h3>
            <p>Author: {book.author}</p>
          </article>
        ))}
      </div>
    </main>
  );
}

export default BookList;
