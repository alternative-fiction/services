import Lab from "lab"
import Code from "code"
import server from "../../app"
import Chance from "chance"
import createUserMock from "../mocks/user"

const chance = new Chance()
const lab = exports.lab = Lab.script()

const user = createUserMock()

lab.experiment("Session", () => {
  let authorization

  lab.test("Create user for further tests.", done => {
    const options = {
      method: "POST",
      payload: {user},
      url: "/users"
    }

    server.inject(options, ({headers, result, statusCode}) => {
      Code.expect(statusCode).to.equal(200)
      Code.expect(headers.authorization).to.exist()

      Code.expect(result.username).to.equal(user.username)
      Code.expect(result.bio).to.equal(user.bio)

      server.stop(done)
    })
  })

  lab.test("Authorize", done => {
    const options = {
      method: "POST",
      payload: {
        email: user.email,
        password: user.password
      },
      url: "/auth"
    }

    server.inject(options, ({headers, result, statusCode}) => {
      Code.expect(statusCode).to.equal(200)
      Code.expect(headers.authorization).to.exist()

      authorization = headers.authorization

      Code.expect(result.username).to.equal(user.username)

      server.stop(done)
    })
  })

  lab.test("Unauthorize", done => {
    const options = {
      headers: {authorization},
      method: "POST",
      url: "/unauth"
    }

    server.inject(options, ({headers, statusCode}) => {
      Code.expect(statusCode).to.equal(204)
      Code.expect(headers.authorization).to.not.exist()

      server.stop(done)
    })
  })

  lab.test("Unauthorize error (expired)", done => {
    const options = {
      headers: {authorization},
      method: "POST",
      url: "/unauth"
    }

    server.inject(options, ({headers, statusCode}) => {
      Code.expect(statusCode).to.equal(401)
      Code.expect(headers.authorization).to.not.exist()

      server.stop(done)
    })
  })

  lab.test("Authorize error (Invalid password)", done => {
    const options = {
      method: "POST",
      payload: {
        email: user.email,
        password: chance.word({length: 10})
      },
      url: "/auth"
    }

    server.inject(options, ({headers, statusCode}) => {
      Code.expect(statusCode).to.equal(401)
      Code.expect(headers.authorization).to.not.exist()

      server.stop(done)
    })
  })

  lab.test("Authorize error (unknown user)", done => {
    const options = {
      method: "POST",
      payload: {
        email: chance.email(),
        password: chance.word({length: 10})
      },
      url: "/auth"
    }

    server.inject(options, ({headers, statusCode}) => {
      Code.expect(statusCode).to.equal(404)
      Code.expect(headers.authorization).to.not.exist()

      server.stop(done)
    })
  })
})
