const products = require("./products");

function findProduct(productName) {
    const product = products.find(
        product => product.name.toLowerCase() === productName.toLowerCase()
    );

    if (product) {
        console.log(product);
    } else {
        console.log("Product not found.");
    }
}

findProduct("Laptop");
findProduct("Shoes");
findProduct("Phone");
findProduct("Tablet");