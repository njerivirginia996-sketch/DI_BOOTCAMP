// ==========================================
// PART 1: QUOTE GENERATOR
// ==========================================

// Array of quote objects
let quotes = [
    {
        id: 0,
        author: "Nelson Mandela",
        quote: "It always seems impossible until it's done.",
        likes: 0
    },
    {
        id: 1,
        author: "Albert Einstein",
        quote: "Life is like riding a bicycle. To keep your balance, you must keep moving.",
        likes: 0
    },
    {
        id: 2,
        author: "Maya Angelou",
        quote: "You will face many defeats in life, but never let yourself be defeated.",
        likes: 0
    },
    {
        id: 3,
        author: "Walt Disney",
        quote: "The way to get started is to quit talking and begin doing.",
        likes: 0
    },
    {
        id: 4,
        author: "Steve Jobs",
        quote: "The only way to do great work is to love what you do.",
        likes: 0
    }
];


// Get HTML elements
const quoteElement = document.getElementById("quote");
const authorElement = document.getElementById("author");
const generateButton = document.getElementById("generate-btn");
const resultElement = document.getElementById("result");


// Keep track of the previous quote
let previousQuoteId = null;

// Currently displayed quote
let currentQuote = null;


// Function to display a quote
const displayQuote = (quoteObject) => {

    currentQuote = quoteObject;

    quoteElement.textContent = `"${quoteObject.quote}"`;
    authorElement.textContent = `— ${quoteObject.author}`;

    resultElement.textContent = `Likes: ${quoteObject.likes}`;
};


// Generate random quote
const generateQuote = () => {

    let randomIndex;

    // Make sure the same quote is not displayed twice
    do {
        randomIndex = Math.floor(Math.random() * quotes.length);
    } while (
        quotes.length > 1 &&
        quotes[randomIndex].id === previousQuoteId
    );

    const randomQuote = quotes[randomIndex];

    previousQuoteId = randomQuote.id;

    displayQuote(randomQuote);
};


// Generate quote when button is clicked
generateButton.addEventListener("click", generateQuote);


// Display the first quote when the page loads
generateQuote();


// ==========================================
// PART 2: ADD A NEW QUOTE
// ==========================================

const addQuoteForm = document.getElementById("add-quote-form");

addQuoteForm.addEventListener("submit", (event) => {

    event.preventDefault();

    const newQuote = document.getElementById("new-quote").value;
    const newAuthor = document.getElementById("new-author").value;

    // Give the new quote the next ID
    const newId = quotes.length;

    const quoteObject = {
        id: newId,
        author: newAuthor,
        quote: newQuote,
        likes: 0
    };

    // Add the new quote to the array
    quotes.push(quoteObject);

    // Clear the form
    addQuoteForm.reset();

    // Display confirmation
    resultElement.textContent =
        `Quote added successfully! ID: ${newId}`;
});


// ==========================================
// CHARACTER COUNT - SPACES INCLUDED
// ==========================================

const charsSpaceButton = document.getElementById("chars-space");

charsSpaceButton.addEventListener("click", () => {

    if (currentQuote) {

        const numberOfCharacters = currentQuote.quote.length;

        resultElement.textContent =
            `Characters including spaces: ${numberOfCharacters}`;
    }
});


// ==========================================
// CHARACTER COUNT - SPACES NOT INCLUDED
// ==========================================

const charsNoSpaceButton = document.getElementById("chars-no-space");

charsNoSpaceButton.addEventListener("click", () => {

    if (currentQuote) {

        const numberOfCharacters =
            currentQuote.quote.replace(/\s/g, "").length;

        resultElement.textContent =
            `Characters excluding spaces: ${numberOfCharacters}`;
    }
});


// ==========================================
// WORD COUNT
// ==========================================

const wordCountButton = document.getElementById("word-count");

wordCountButton.addEventListener("click", () => {

    if (currentQuote) {

        const words = currentQuote.quote.trim().split(/\s+/);

        resultElement.textContent =
            `Number of words: ${words.length}`;
    }
});


// ==========================================
// LIKE BUTTON
// ==========================================

const likeButton = document.getElementById("like-btn");

likeButton.addEventListener("click", () => {

    if (currentQuote) {

        currentQuote.likes++;

        resultElement.textContent =
            `❤️ Likes: ${currentQuote.likes}`;
    }
});


// ==========================================
// PART 3: FILTER BY AUTHOR
// ==========================================

const filterForm = document.getElementById("filter-form");
const authorFilter = document.getElementById("author-filter");


// Array for filtered quotes
let filteredQuotes = [];

// Current position in filtered quotes
let currentIndex = 0;


// Search for quotes by author
filterForm.addEventListener("submit", (event) => {

    event.preventDefault();

    const authorName = authorFilter.value.trim().toLowerCase();

    // Filter the quotes
    filteredQuotes = quotes.filter((quoteObject) => {
        return quoteObject.author.toLowerCase() === authorName;
    });

    currentIndex = 0;

    // Check if quotes were found
    if (filteredQuotes.length === 0) {

        quoteElement.textContent = "No quotes found.";
        authorElement.textContent = "";
        resultElement.textContent = "";

        return;
    }

    // Display the first matching quote
    displayQuote(filteredQuotes[currentIndex]);
});


// ==========================================
// PREVIOUS BUTTON
// ==========================================

const previousButton = document.getElementById("previous-btn");

previousButton.addEventListener("click", () => {

    if (filteredQuotes.length === 0) {
        resultElement.textContent = "Search for an author first.";
        return;
    }

    currentIndex--;

    // If we go before the first quote,
    // go to the last quote
    if (currentIndex < 0) {
        currentIndex = filteredQuotes.length - 1;
    }

    displayQuote(filteredQuotes[currentIndex]);
});


// ==========================================
// NEXT BUTTON
// ==========================================

const nextButton = document.getElementById("next-btn");

nextButton.addEventListener("click", () => {

    if (filteredQuotes.length === 0) {
        resultElement.textContent = "Search for an author first.";
        return;
    }

    currentIndex++;

    // If we go after the last quote,
    // go back to the first quote
    if (currentIndex >= filteredQuotes.length) {
        currentIndex = 0;
    }

    displayQuote(filteredQuotes[currentIndex]);
});
