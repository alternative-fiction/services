import Lab from "lab"
import Code from "code"
import server from "../../app"
import uniqueId from "../../app/lib/unique-id"

const lab = exports.lab = Lab.script()

const story = {
  body: "In the beginning...",
  description: "A good description",
  title: "A few good tests"
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

      server.stop(done)
    })
  })

  lab.test("Update", done => {
    const options = {
      method: "PUT",
      payload: {
        story: {
          body: "updated body"
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
