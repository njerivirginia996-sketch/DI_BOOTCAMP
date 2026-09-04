//exercise 1
function displayNumbersDivisible(divisor = 23) {
  let sum = 0;
  let numbers = [];

  for (let i = 0; i <= 500; i++) {
    if (i % divisor === 0) {
      numbers.push(i);
      sum += i;
    }
  }

  console.log("Outcome : " + numbers.join(" "));
  console.log("Sum : " + sum);
}

// Call function (defaults to 23, or pass custom divisor like displayNumbersDivisible(3))
displayNumbersDivisible();


//exercise 2
const stock = {
  "banana": 6,
  "apple": 0,
  "pear": 12,
  "orange": 32,
  "blueberry": 1
};

const prices = {
  "banana": 4,
  "apple": 2,
  "pear": 1,
  "orange": 1.5,
  "blueberry": 10
};

// 2. Shopping list array
const shoppingList = ["banana", "orange", "apple"];

// 3. Calculate bill function
function myBill() {
  let total = 0;

  for (let item of shoppingList) {
    // Rule 1: Check if item exists in stock and stock > 0
    if (item in stock && stock[item] > 0) {
      total += prices[item]; // Add price
      stock[item] -= 1;      // Bonus: decrease stock by 1
    }
  }

  return total;
}

console.log("Total Bill:", myBill());


//exercise 3
function changeEnough(itemPrice, amountOfChange) {
  // Coin values: Quarters ($0.25), Dimes ($0.10), Nickels ($0.05), Pennies ($0.01)
  const coinValues = [0.25, 0.10, 0.05, 0.01];
  let totalChange = 0;

  for (let i = 0; i < amountOfChange.length; i++) {
    totalChange += amountOfChange[i] * coinValues[i];
  }

  return totalChange >= itemPrice;
}

// Examples
console.log(changeEnough(14.11, [2, 100, 0, 0])); // false
console.log(changeEnough(0.75, [0, 0, 20, 5]));   // true


//exercise 4
// 1. Hotel Cost
function hotelCost(nights) {
  const nightsNumber = Number(nights);
  if (!Number.isFinite(nightsNumber) || nightsNumber <= 0) {
    return 0;
  }
  return nightsNumber * 140;
}

// 2. Plane Ride Cost
function planeRideCost(destination) {
  const normalizedDestination = (destination || "").trim().toLowerCase();
  if (normalizedDestination === "london") return 183;
  if (normalizedDestination === "paris") return 220;
  return 300;
}

// 3. Rental Car Cost
function rentalCarCost(days) {
  const daysNumber = Number(days);
  if (!Number.isFinite(daysNumber) || daysNumber <= 0) {
    return 0;
  }

  let cost = daysNumber * 40;
  if (daysNumber > 10) {
    cost *= 0.95; // 5% discount
  }
  return cost;
}

// 4. Total Vacation Cost
function totalVacationCost(nights, destination, days) {
  const hotel = hotelCost(nights);
  const plane = planeRideCost(destination);
  const car = rentalCarCost(days);
  const total = hotel + plane + car;

  console.log(`The car cost: $${car}, the hotel cost: $${hotel}, the plane tickets cost: $${plane}.`);
  console.log(`Total vacation cost: $${total}`);
  return total;
}

if (typeof document !== "undefined") {
  const form = document.getElementById("vacationForm");
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const nights = document.getElementById("nights").value;
      const destination = document.getElementById("destination").value;
      const days = document.getElementById("days").value;

      const result = totalVacationCost(nights, destination, days);
      const output = document.getElementById("vacationResult");
      if (output) {
        output.textContent = `Total: $${result}`;
      }
    });
  }
}


//exercise 5
// HTML Setup for reference:
// <div id="container">Users:</div>
// <ul class="list"><li>John</li><li>Pete</li></ul>
// <ul class="list"><li>David</li><li>Sarah</li><li>Dan</li></ul>

if (typeof document !== "undefined") {
  // 2.1 Retrieve the div and console.log it
  const containerDiv = document.getElementById("container");
  console.log(containerDiv);

  // 2.2 Change "Pete" to "Richard"
  const allLists = document.querySelectorAll(".list");
  if (allLists[0] && allLists[0].children[1]) {
    allLists[0].children[1].textContent = "Richard";
  }

  // 2.3 Delete second <li> of second <ul> ("Sarah")
  if (allLists[1] && allLists[1].children[1]) {
    allLists[1].children[1].remove();
  }

  // 2.4 Change first <li> of each <ul> to your name
  for (let ul of allLists) {
    if (ul.children[0]) {
      ul.children[0].textContent = "YourName";
    }
  }
}

if (typeof document !== "undefined") {
  const allLists = document.querySelectorAll(".list");

  // 3.1 Add class 'student_list' to both <ul>s
  allLists.forEach(ul => ul.classList.add("student_list"));

  // 3.2 Add classes 'university' and 'attendance' to first <ul>
  allLists[0].classList.add("university", "attendance");

  // 4.1 Add background color lightblue and padding to div
  const containerDiv = document.getElementById("container");
  if (containerDiv) {
    containerDiv.style.backgroundColor = "lightblue";
    containerDiv.style.padding = "10px";
  }

  // 4.2 Hide the <li> containing "Dan"
  const lastLiElement = allLists[1]?.lastElementChild;
  if (lastLiElement && lastLiElement.textContent === "Dan") {
    lastLiElement.style.display = "none";
  }

  // 4.3 Add border to <li> containing "Richard"
  if (allLists[0]?.children[1]) {
    allLists[0].children[1].style.border = "1px solid black";
  }

  // 4.4 Change font size of whole body
  document.body.style.fontSize = "18px";

  // Bonus: Alert if background color is light blue
  if (containerDiv && containerDiv.style.backgroundColor === "lightblue") {
    const user1 = allLists[0].children[0].textContent;
    const user2 = allLists[0].children[1].textContent;
    alert(`Hello ${user1} and ${user2}`);
  }
}


//exercise 6
if (typeof document !== "undefined") {
  const navDiv = document.getElementById("navBar");
  if (navDiv) {
    navDiv.setAttribute("id", "socialNetworkNavigation");

    const ulElement = navDiv.querySelector("ul");
    if (ulElement) {
      const newLi = document.createElement("li");
      newLi.textContent = "Logout";
      ulElement.appendChild(newLi);

      const firstLi = ulElement.firstElementChild;
      const lastLi = ulElement.lastElementChild;
      console.log("First element text:", firstLi ? firstLi.textContent : "");
      console.log("Last element text:", lastLi ? lastLi.textContent : "");
    }
  }
}


//exercise 7
if (typeof document !== "undefined") {
  // HTML Setup: <section class="listBooks"></section>

  // 1. Book Array
  const allBooks = [
    {
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      image: "https://via.placeholder.com/100",
      alreadyRead: true
    },
    {
      title: "1984",
      author: "George Orwell",
      image: "https://via.placeholder.com/100",
      alreadyRead: false
    }
  ];

  // 2. Render books into DOM
  const section = document.querySelector(".listBooks");
  if (section) {
    allBooks.forEach(book => {
      const bookDiv = document.createElement("div");
      
      const bookDetails = document.createElement("p");
      bookDetails.textContent = `${book.title} written by ${book.author}`;
      
      // Color red if already read
      if (book.alreadyRead) {
        bookDetails.style.color = "red";
      }
      
      const bookImg = document.createElement("img");
      bookImg.src = book.image;
      bookImg.style.width = "100px";
      
      bookDiv.appendChild(bookDetails);
      bookDiv.appendChild(bookImg);
      section.appendChild(bookDiv);
    });
  }
}