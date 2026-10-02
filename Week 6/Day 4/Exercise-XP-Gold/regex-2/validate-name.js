function isValidFullName(name) {
  return /^\p{Lu}\p{L}* \p{Lu}\p{L}*$/u.test(name.trim())
}

module.exports = isValidFullName