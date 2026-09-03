// A function declaration is hoisted, while a function expression is assigned to a variable and is not hoisted in the same way.

function kilogramsToGramsDeclaration(weightInKilograms) {
    return weightInKilograms * 1000;
}

console.log(kilogramsToGramsDeclaration(2));

const kilogramsToGramsExpression = function (weightInKilograms) {
    return weightInKilograms * 1000;
};

console.log(kilogramsToGramsExpression(2));

const kilogramsToGramsArrow = (weightInKilograms) => weightInKilograms * 1000;

console.log(kilogramsToGramsArrow(2));
