import { people } from "./data.js";

function calculateAverageAge() {
    const totalAge = people.reduce((sum, person) => {
        return sum + person.age;
    }, 0);

    const averageAge = totalAge / people.length;

    console.log(`Average age: ${averageAge}`);
}

calculateAverageAge();