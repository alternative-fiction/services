import Chance from "chance"

const chance = new Chance()

export default function createUserMock(overrides = {}) {
  return Object.assign({
    bio: `Tester says "${chance.word({length: 2})}!"`,
    displayName: `Test User ${chance.word({length: 10})}`,
    email: chance.email(),
    password: chance.word({length: 10})
  }, overrides)
}
