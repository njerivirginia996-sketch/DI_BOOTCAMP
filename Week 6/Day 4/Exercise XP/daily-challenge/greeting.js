function greet(name) {
    return `Hello, ${name}! Welcome to Node.js.`;
}

module.exports = greet;
export default function greet(name) {
    return `Hello, ${name}! Welcome to Node.js.`;
}