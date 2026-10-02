const { faker } = require('@faker-js/faker')

const users = []

function addFakeUser() {
  const user = {
    name: faker.person.fullName(),
    addressStreet: faker.location.streetAddress(),
    country: faker.location.country(),
  }

  users.push(user)
  return user
}

function addUser(name, addressStreet, country) {
  const user = { name, addressStreet, country }
  users.push(user)
  return user
}

module.exports = { users, addFakeUser, addUser }