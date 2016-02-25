import Lab from "lab"
import {expect} from "code"
import server from "../../app"
import uniqueId from "../../app/lib/unique-id"
import createUserMock from "../mocks/user"
import createStoryMock from "../mocks/Story"

const {experiment, test} = exports.lab = Lab.script()
const user = createUserMock()
const altUser = createUserMock()
const story = createStoryMock()

experiment("Stories", () => {
  let authorization
  let storyUuid
  let userUuid
  let altAuthorization

  test("Create user for further tests.", done => {
    const options = {
      method: "POST",
      payload: user,
      url: "/users"
    }

    server.inject(options, ({headers, result, statusCode}) => {
      expect(statusCode).to.equal(200)
      expect(headers.authorization).to.exist()

      authorization = headers.authorization
      userUuid = result.uuid

      expect(result.username).to.equal(user.username)
      expect(result.bio).to.equal(user.bio)

      server.stop(done)
    })
  })

  test("Create alt user for authorization tests.", done => {
    const options = {
      method: "POST",
      payload: altUser,
      url: "/users"
    }

    server.inject(options, ({headers, statusCode}) => {
      expect(statusCode).to.equal(200)
      expect(headers.authorization).to.exist()

      altAuthorization = headers.authorization

      server.stop(done)
    })
  })

  test("Create", done => {
    const options = {
      headers: {authorization},
      method: "POST",
      payload: story,
      url: "/stories"
    }

    server.inject(options, ({statusCode, result}) => {
      expect(statusCode).to.equal(200)

      storyUuid = result.uuid

      expect(result.body).to.equal(story.body)
      expect(result.description).to.equal(story.description)
      expect(result.title).to.equal(story.title)
      expect(result.userUuid).to.equal(userUuid)

      story.meta.tags.forEach((tag, i) => expect(result.meta.tags[i]).to.equal(tag))

      server.stop(done)
    })
  })

  test("Retrieve", done => {
    const options = {
      method: "GET",
      url: `/stories/${storyUuid}`
    }

    server.inject(options, ({statusCode, result}) => {
      expect(statusCode).to.equal(200)

      expect(result.body).to.equal(story.body)
      expect(result.description).to.equal(story.description)
      expect(result.title).to.equal(story.title)

      expect(result.userUuid).to.equal(userUuid)
      expect(result.user.uuid).to.equal(userUuid)

      story.meta.tags.forEach((tag, i) => expect(result.meta.tags[i]).to.equal(tag))

      server.stop(done)
    })
  })

  test("Update", done => {
    const {body, meta} = createStoryMock()

    const options = {
      headers: {authorization},
      method: "PATCH",
      payload: {body, meta},
      url: `/stories/${storyUuid}`
    }

    server.inject(options, ({statusCode, result}) => {
      expect(statusCode).to.equal(200)

      expect(result.body).to.equal(options.payload.body)
      meta.tags.forEach((tag, i) => expect(result.meta.tags[i]).to.equal(tag))

      server.stop(done)
    })
  })

  test("Update error (authorization)", done => {
    const {body} = createStoryMock()

    const options = {
      headers: {authorization: altAuthorization},
      method: "PATCH",
      payload: {body},
      url: `/stories/${storyUuid}`
    }

    server.inject(options, ({statusCode}) => {
      expect(statusCode).to.equal(401)

      server.stop(done)
    })
  })

  test("Destroy error (authorization)", done => {
    const options = {
      headers: {authorization: altAuthorization},
      method: "DELETE",
      url: `/stories/${storyUuid}`
    }

    server.inject(options, ({statusCode}) => {
      expect(statusCode).to.equal(401)

      server.stop(done)
    })
  })

  test("Destroy", done => {
    const options = {
      headers: {authorization},
      method: "DELETE",
      url: `/stories/${storyUuid}`
    }

    server.inject(options, ({statusCode}) => {
      expect(statusCode).to.equal(204)

      server.stop(done)
    })
  })

  test("Retrieve error (not found)", done => {
    const options = {
      method: "GET",
      url: `/stories/${uniqueId()}`
    }

    server.inject(options, ({statusCode}) => {
      expect(statusCode).to.equal(404)

      server.stop(done)
    })
  })
})
