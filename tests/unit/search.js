import Lab from "lab"
import Code from "code"
import server from "../../app"
import createUserMock from "../mocks/user"
import createStoryMock from "../mocks/Story"

const lab = exports.lab = Lab.script()
const user = createUserMock()
const story = createStoryMock()

lab.experiment("Stories search", () => {
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

  lab.test("Create story", done => {
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
