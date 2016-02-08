import Lab from "lab"
import {expect} from "code"
import server from "../../app"
import Chance from "chance"
import createUserMock from "../mocks/user"

const chance = new Chance()
const {experiment, test} = exports.lab = Lab.script()

const user = createUserMock()

experiment("Session", () => {
  let authorization

  test("Create user for further tests.", done => {
    const options = {
      method: "POST",
      payload: {user},
      url: "/users"
    }

    server.inject(options, ({headers, result, statusCode}) => {
      expect(statusCode).to.equal(200)
      expect(headers.authorization).to.exist()

      expect(result.username).to.equal(user.username)
      expect(result.bio).to.equal(user.bio)

      server.stop(done)
    })
  })

  test("Authorize", done => {
    const options = {
      method: "POST",
      payload: {
        email: user.email.toUpperCase(), // Test case insensitivity
        password: user.password
      },
      url: "/auth"
    }

    server.inject(options, ({headers, result, statusCode}) => {
      expect(statusCode).to.equal(200)
      expect(headers.authorization).to.exist()

      authorization = headers.authorization

      expect(result.username).to.equal(user.username)

      server.stop(done)
    })
  })

  test("Unauthorize", done => {
    const options = {
      headers: {authorization},
      method: "POST",
      url: "/unauth"
    }

    server.inject(options, ({headers, statusCode}) => {
      expect(statusCode).to.equal(204)
      expect(headers.authorization).to.not.exist()

      server.stop(done)
    })
  })

  test("Unauthorize error (expired)", done => {
    const options = {
      headers: {authorization},
      method: "POST",
      url: "/unauth"
    }

    server.inject(options, ({headers, statusCode}) => {
      expect(statusCode).to.equal(401)
      expect(headers.authorization).to.not.exist()

      server.stop(done)
    })
  })

  test("Authorize error (Invalid password)", done => {
    const options = {
      method: "POST",
      payload: {
        email: user.email,
        password: chance.word({length: 10})
      },
      url: "/auth"
    }

    server.inject(options, ({headers, statusCode}) => {
      expect(statusCode).to.equal(401)
      expect(headers.authorization).to.not.exist()

      server.stop(done)
    })
  })

  test("Authorize error (unknown user)", done => {
    const options = {
      method: "POST",
      payload: {
        email: chance.email(),
        password: chance.word({length: 10})
      },
      url: "/auth"
    }

    server.inject(options, ({headers, statusCode}) => {
      expect(statusCode).to.equal(404)
      expect(headers.authorization).to.not.exist()

      server.stop(done)
    })
  })
})
