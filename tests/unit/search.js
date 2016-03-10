import Lab from "lab"
import {expect} from "code"
import server from "../../app"
import createUserMock from "../mocks/user"
import createStoryMock from "../mocks/Story"

const {experiment, test} = exports.lab = Lab.script()
const user = createUserMock()
const story = createStoryMock()

experiment("Stories search", () => {
  let authorization
  let displayName
  let uuid

  test("Create user for further tests.", done => {
    const options = {
      method: "POST",
      payload: user,
      url: "/users"
    }

    server.inject(options, ({headers, result, statusCode}) => {
      expect(statusCode).to.equal(200)
      expect(headers.authorization).to.exist()

      expect(result.displayName).to.equal(user.displayName)
      expect(result.bio).to.equal(user.bio)

      authorization = headers.authorization
      displayName = result.displayName

      server.stop(done)
    })
  })

  test("Create story", done => {
    const options = {
      headers: {authorization},
      method: "POST",
      payload: story,
      url: "/stories"
    }

    server.inject(options, ({statusCode, result}) => {
      expect(statusCode).to.equal(200)

      uuid = result.uuid

      expect(result.body).to.equal(story.body)
      expect(result.description).to.equal(story.description)
      expect(result.title).to.equal(story.title)

      story.meta.tags.forEach((tag, i) => expect(result.meta.tags[i]).to.equal(tag))

      server.stop(done)
    })
  })

  test("Search by title", done => {
    const options = {
      method: "POST",
      payload: {criteria: story.title},
      url: "/search"
    }

    server.inject(options, ({statusCode, result}) => {
      expect(statusCode).to.equal(200)

      const [entry] = result

      expect(entry.uuid).to.equal(uuid)
      expect(entry.user.displayName).to.equal(displayName)
      story.meta.tags.forEach((tag, i) => expect(entry.meta.tags[i]).to.equal(tag))

      server.stop(done)
    })
  })
})
