import Lab from "lab"
import Chance from "chance"
import {expect} from "code"
import server from "../../app"
import uniqueId from "../../app/lib/unique-id"
import createUserMock from "../mocks/user"
import createStoryMock from "../mocks/story"

const chance = new Chance()
const {experiment, test} = exports.lab = Lab.script()
const user = createUserMock()
const altUser = createUserMock()
const story = createStoryMock()

experiment("Users", () => {
  let authorization
  let altAuthorization
  let uuid
  let storyUuid

  test("Create", done => {
    const options = {
      method: "POST",
      payload: user,
      url: "/users"
    }

    server.inject(options, ({headers, result, statusCode}) => {
      expect(statusCode).to.equal(200)
      expect(headers.authorization).to.exist()

      expect(result.email).to.equal(user.email)
      expect(result.bio).to.equal(user.bio)

      uuid = result.uuid
      authorization = headers.authorization

      server.stop(done)
    })
  })

  test("Create user's story", done => {
    const options = {
      headers: {authorization},
      method: "POST",
      payload: story,
      url: "/stories"
    }

    server.inject(options, ({statusCode, result}) => {
      expect(statusCode).to.equal(200)

      storyUuid = result.uuid
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

  test("Retrieve", done => {
    const options = {
      method: "GET",
      url: `/users/${uuid}`
    }

    server.inject(options, ({result, statusCode}) => {
      expect(statusCode).to.equal(200)

      expect(result.email).to.not.equal(user.email)
      expect(result.uuid).to.equal(uuid)
      expect(result.bio).to.equal(user.bio)

      expect(result.storiesCount).to.equal(1)

      server.stop(done)
    })
  })

  test("Update", done => {
    const options = {
      headers: {authorization},
      method: "PATCH",
      payload: {
        bio: "updated bio",
        email: chance.email()
      },
      url: `/users/${uuid}`
    }

    server.inject(options, ({result, statusCode}) => {
      expect(statusCode).to.equal(200)

      expect(result.bio).to.equal(options.payload.bio)
      expect(result.email).to.equal(options.payload.email)

      server.stop(done)
    })
  })

  test("Update error (authorization)", done => {
    const options = {
      headers: {authorization: altAuthorization},
      method: "PATCH",
      payload: {
        bio: "unauthorized updated bio"
      },
      url: `/users/${uuid}`
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
      url: `/users/${uuid}`
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
      url: `/users/${uuid}`
    }

    server.inject(options, ({statusCode}) => {
      expect(statusCode).to.equal(204)

      server.stop(done)
    })
  })

  test("Update error (user inactive)", done => {
    const options = {
      headers: {authorization},
      method: "PATCH",
      payload: {status: "active"},
      url: `/users/${uuid}`
    }

    server.inject(options, ({statusCode}) => {
      expect(statusCode).to.equal(401)

      server.stop(done)
    })
  })

  test("Retrieve user error (inactive)", done => {
    const options = {
      method: "GET",
      url: `/users/${uuid}`
    }

    server.inject(options, ({statusCode}) => {
      expect(statusCode).to.equal(404)

      server.stop(done)
    })
  })

  test("Retrieve story error (user inactive)", done => {
    const options = {
      method: "GET",
      url: `/stories/${storyUuid}`
    }

    server.inject(options, ({statusCode}) => {
      expect(statusCode).to.equal(404)

      server.stop(done)
    })
  })

  test("Retrieve user error (not found)", done => {
    const options = {
      method: "GET",
      url: `/users/${uniqueId()}`
    }

    server.inject(options, ({statusCode}) => {
      expect(statusCode).to.equal(404)

      server.stop(done)
    })
  })

  test("Create user error (no password)", done => {
    const options = {
      method: "POST",
      payload: {...createUserMock(), password: ""},
      url: "/users"
    }

    server.inject(options, ({statusCode}) => {
      expect(statusCode).to.equal(400)

      server.stop(done)
    })
  })
})
