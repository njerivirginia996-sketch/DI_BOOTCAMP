// ============================================
// Interface: Book
// ============================================
interface Book {
  title: string;
  author: string;
  isbn: string;
  publishedYear: number;
  genre?: string;
}

// ============================================
// Class: Library
// ============================================
class Library {
  protected books: Book[] = [];

  public addBook(book: Book): void {
    this.books.push(book);
  }

  public getBookDetails(isbn: string): string {
    const book = this.books.find((b) => b.isbn === isbn);

    if (!book) {
      return `No book found with ISBN: ${isbn}`;
    }

    return `"${book.title}" by ${book.author} (${book.publishedYear})` +
      (book.genre ? ` - Genre: ${book.genre}` : "");
  }
}

// ============================================
// Class: DigitalLibrary (extends Library)
// ============================================
class DigitalLibrary extends Library {
  readonly website: string;

  constructor(website: string) {
    super();
    this.website = website;
  }

  public listBooks(): string[] {
    return this.books.map((book) => book.title);
  }
}

// ============================================
// Usage
// ============================================
const myLibrary = new DigitalLibrary("www.mydigitallibrary.com");

myLibrary.addBook({
  title: "The Hobbit",
  author: "J.R.R. Tolkien",
  isbn: "978-0-345-33968-3",
  publishedYear: 1937,
  genre: "Fantasy",
});

myLibrary.addBook({
  title: "1984",
  author: "George Orwell",
  isbn: "978-0-452-28423-4",
  publishedYear: 1949,
  genre: "Dystopian",
});

myLibrary.addBook({
  title: "Clean Code",
  author: "Robert C. Martin",
  isbn: "978-0-13-235088-4",
  publishedYear: 2008,
  // no genre — optional property omitted
});

console.log(myLibrary.getBookDetails("978-0-345-33968-3"));
// '"The Hobbit" by J.R.R. Tolkien (1937) - Genre: Fantasy'

console.log(myLibrary.getBookDetails("978-0-13-235088-4"));
// '"Clean Code" by Robert C. Martin (2008)'  (no genre suffix)

console.log(myLibrary.getBookDetails("000-0-000-00000-0"));
// "No book found with ISBN: 000-0-000-00000-0"

console.log(myLibrary.listBooks());
// ["The Hobbit", "1984", "Clean Code"]

console.log(myLibrary.website);
// "www.mydigitallibrary.com"

// myLibrary.website = "www.newsite.com";
// Error: Cannot assign to 'website' because it is a read-only property.