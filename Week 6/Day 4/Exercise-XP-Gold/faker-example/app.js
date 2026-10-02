const { users, addFakeUser } = require('./users')

for (let index = 0; index < 5; index += 1) {
  addFakeUser()
}

console.log(users)