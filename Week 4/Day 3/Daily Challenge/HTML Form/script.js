const form = document.getElementById("myForm");
const output = document.getElementById("output");

form.addEventListener("submit", function(event) {

    // Prevent the page from refreshing
    event.preventDefault();

    // Get the values from the inputs
    const name = document.getElementById("name").value;
    const lastName = document.getElementById("lastname").value;

    // Create an object
    const user = {
        name: name,
        lastName: lastName
    };

    // Convert the object to a JSON string
    const jsonString = JSON.stringify(user);

    // Display the JSON string in the DOM
    output.textContent = jsonString;

});

