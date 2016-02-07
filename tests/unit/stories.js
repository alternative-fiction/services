import Lab from "lab"
import Code from "code"
import server from "../../app"
import uniqueId from "../../app/lib/unique-id"
import Chance from "chance"
import createUserMock from "../mocks/user"
import createStoryMock from "../mocks/Story"

const chance = new Chance()
const lab = exports.lab = Lab.script()
const user = createUserMock()
const story = createStoryMock()

lab.experiment("Stories", () => {
  let authorization
  let uuid

  lab.test("Create user for further tests.", done => {
    const options = {
      method: "POST",
      payload: {user},
      url: "/users"
    }

    server.inject(options, ({headers, result, statusCode}) => {
      Code.expect(statusCode).to.equal(200)
      Code.expect(headers.authorization).to.exist()

      authorization = headers.authorization

      Code.expect(result.username).to.equal(user.username)
      Code.expect(result.bio).to.equal(user.bio)

      server.stop(done)
    })
  })

  lab.test("Create", done => {
    const options = {
      headers: {authorization},
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
      headers: {authorization},
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

  lab.test("Destroy", done => {
    const options = {
      headers: {authorization},
      method: "DELETE",
      url: `/stories/${uuid}`
    }

    server.inject(options, ({statusCode}) => {
      Code.expect(statusCode).to.equal(204)

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
