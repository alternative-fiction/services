import Lab from "lab"
import Code from "code"
import server from "../../app"
import Chance from "chance"

const chance = new Chance()
const lab = exports.lab = Lab.script()

const user = {
  bio: "A logged in writer",
  email: chance.email(),
  password: chance.word({length: 10}),
  username: `test-user-${chance.word({length: 10})}`
}

lab.experiment("Session", () => {
  lab.test("Create user", done => {
    const options = {
      method: "POST",
      payload: {user},
      url: "/users"
    }

    server.inject(options, ({statusCode, result}) => {
      Code.expect(statusCode).to.equal(200)

      Code.expect(result.username).to.equal(user.username)
      Code.expect(result.bio).to.equal(user.bio)

      server.stop(done)
    })
  })

  lab.test("Login", done => {
    const options = {
      method: "POST",
      payload: {
        email: user.email,
        password: user.password
      },
      url: "/session"
    }

    server.inject(options, ({statusCode, result}) => {
      Code.expect(statusCode).to.equal(200)

      Code.expect(result.username).to.equal(user.username)

      server.stop(done)
    })
  })

  lab.test("Login error (Invalid password)", done => {
    const options = {
      method: "POST",
      payload: {
        email: user.email,
        password: chance.word({length: 10})
      },
      url: "/session"
    }

    server.inject(options, ({statusCode}) => {
      Code.expect(statusCode).to.equal(401)

      server.stop(done)
    })
  })

  lab.test("Login error (unknown user)", done => {
    const options = {
      method: "POST",
      payload: {
        email: chance.email(),
        password: chance.word({length: 10})
      },
      url: "/session"
    }

    server.inject(options, ({statusCode}) => {
      Code.expect(statusCode).to.equal(404)

      server.stop(done)
    })
  })
})
