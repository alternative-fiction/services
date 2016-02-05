import Chance from "chance"

const chance = new Chance()

export default function createUserMock(overrides = {}) {
  return Object.assign({
    bio: `Tester says "${chance.word({length: 2})}!"`,
    email: chance.email(),
    password: chance.word({length: 10}),
    username: `test-user-${chance.word({length: 10})}`
  }, overrides)
}
