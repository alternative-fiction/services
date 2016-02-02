import Lab from "lab"
import Code from "code"
import server from "../../app"
import Chance from "chance"

const chance = new Chance()
const lab = exports.lab = Lab.script()

const story = {
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
}

lab.experiment("Stories search", () => {
  let uuid

  lab.test("Create story", done => {
    const options = {
      method: "POST",
      payload: {story},
      url: "/stories"
    }

    server.inject(options, ({statusCode, result}) => {
      Code.expect(statusCode).to.equal(200)

      uuid = result.uuid

      Code.expect(result.body).to.equal(story.body)
      Code.expect(result.description).to.equal(story.description)
      Code.expect(result.title).to.equal(story.title)

      story.meta.tags.forEach((tag, i) => Code.expect(result.meta.tags[i]).to.equal(tag))

      server.stop(done)
    })
  })

  lab.test("Search by title", done => {
    const options = {
      method: "POST",
      payload: {criteria: story.title},
      url: "/search"
    }

    server.inject(options, ({statusCode, result: {results}}) => {
      Code.expect(statusCode).to.equal(200)

      Code.expect(results[0].uuid).to.equal(uuid)

      server.stop(done)
    })
  })
})
