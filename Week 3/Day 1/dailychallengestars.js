//using one loop
let stars = "";

for (let i = 1; i <= 6; i++) {
    stars += "* ";
    console.log(stars);
}


//using two nested loops
for (let i = 1; i <= 6; i++) {
    let stars = "";

    for (let j = 1; j <= i; j++) {
        stars += "* ";
    }

    console.log(stars);
}