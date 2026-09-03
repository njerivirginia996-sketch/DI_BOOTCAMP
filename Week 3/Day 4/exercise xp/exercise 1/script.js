// Exercise 1: Scope predictions

// #1
// funcOne() alerts: "inside the funcOne function 3".
// `a` starts as 5, then the if block changes it to 3. The function-scoped
// variable is accessible inside the if block because `let` is block-scoped.
// #1.2 If `a` is declared with const, assigning a = 3 causes a TypeError,
// because a const variable cannot be reassigned.

// #2
// The first funcThree() alerts: "inside the funcThree function 0".
// funcTwo() changes the global `a` from 0 to 5.
// The second funcThree() alerts: "inside the funcThree function 5".
// #2.2 If the global `a` is declared with const, funcTwo() causes a TypeError
// when it tries to assign 5, so the value remains 0.

// #3
// funcFour() creates/updates the global window.a with the value "hello".
// funcFive() therefore alerts: "inside the funcFive function hello".
// In a browser script, a property created on window can be read as a global.

// #4
// funcSix() alerts: "inside the funcSix function test".
// The local `a` declared inside funcSix shadows the outer `a`, whose value is 1.
// #4.2 Changing the local declaration from let to const makes no difference,
// because the local const is only read and is never reassigned.

// #5
// The if block alerts: "in the if block 5".
// The final alert displays: "outside of the if block 2".
// The inner `a` exists only inside the if block; the outer `a` remains 2.
// #5.2 Changing either let declaration to const makes no difference here,
// because neither variable is reassigned. The two block scopes remain separate.
