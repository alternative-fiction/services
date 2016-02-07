import Chance from "chance"

const chance = new Chance()

export default function createStoryMock(overrides = {}) {
  return Object.assign({
    body: chance.paragraph({sentences: 10}),
    description: chance.sentence(),
    title: chance.sentence(),
    meta: {
      tags: [
        chance.word(),
        chance.word(),
        chance.word()
      ]
    }
  }, overrides)
}
