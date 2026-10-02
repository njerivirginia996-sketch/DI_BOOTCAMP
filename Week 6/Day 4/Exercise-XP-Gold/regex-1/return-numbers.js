function returnNumbers(input) {
  return input.match(/\d/g)?.join('') ?? ''
}

module.exports = returnNumbers