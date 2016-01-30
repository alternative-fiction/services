import Lab from "lab"
import Code from "code"
import server from "../../app"
import uniqueId from "../../app/lib/unique-id"
import Chance from "chance"

const chance = new Chance()
const lab = exports.lab = Lab.script()

const story = {
  body: chance.paragraph({sentences: 50}),
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

lab.experiment("Stories", () => {
  let uuid

  lab.test("Create", done => {
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

  lab.test("Retrieve", done => {
    const options = {
      method: "GET",
      url: `/stories/${uuid}`
    }

    server.inject(options, ({statusCode, result}) => {
      Code.expect(statusCode).to.equal(200)

      Code.expect(result.body).to.equal(story.body)
      Code.expect(result.description).to.equal(story.description)
      Code.expect(result.title).to.equal(story.title)

      story.meta.tags.forEach((tag, i) => Code.expect(result.meta.tags[i]).to.equal(tag))

      server.stop(done)
    })
  })

  lab.test("Update", done => {
    const options = {
      method: "PUT",
      payload: {
        story: {
          body: chance.paragraph({sentences: 50})
        }
      },
      url: `/stories/${uuid}`
    }

    server.inject(options, ({statusCode, result}) => {
      Code.expect(statusCode).to.equal(200)

      Code.expect(result.body).to.equal(options.payload.story.body)

      server.stop(done)
    })
  })

  lab.test("Retrieve (error)", done => {
    const options = {
      method: "GET",
      url: `/stories/${uniqueId()}`
    }

    server.inject(options, ({statusCode}) => {
      Code.expect(statusCode).to.equal(404)

      server.stop(done)
    })
  })
})
