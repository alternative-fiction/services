import Lab from "lab"
import Code from "code"
import server from "../../app"
import uniqueId from "../../app/lib/unique-id"

const lab = exports.lab = Lab.script()

const user = {
  bio: "A great writer",
  email: "foo@bar.baz",
  password: "foobar",
  username: "Testerson"
}

lab.experiment("Users", () => {
  let uuid

  lab.test("Create", done => {
    const options = {
      method: "POST",
      payload: {user},
      url: "/users"
    }

    server.inject(options, ({statusCode, result}) => {
      Code.expect(statusCode).to.equal(200)

      uuid = result.uuid

      Code.expect(result.bio).to.equal(user.bio)

      server.stop(done)
    })
  })

  lab.test("Retrieve", done => {
    const options = {
      method: "GET",
      url: `/users/${uuid}`
    }

    server.inject(options, ({statusCode, result}) => {
      Code.expect(statusCode).to.equal(200)

      Code.expect(result.bio).to.equal(user.bio)

      server.stop(done)
    })
  })

  lab.test("Update", done => {
    const options = {
      method: "PUT",
      payload: {
        user: {
          bio: "updated bio"
        }
      },
      url: `/users/${uuid}`
    }

    server.inject(options, ({statusCode, result}) => {
      Code.expect(statusCode).to.equal(200)

      Code.expect(result.bio).to.equal(options.payload.user.bio)

      server.stop(done)
    })
  })

  lab.test("Retrieve (error)", done => {
    const options = {
      method: "GET",
      url: `/users/${uniqueId()}`
    }

    server.inject(options, ({statusCode}) => {
      Code.expect(statusCode).to.equal(404)

      server.stop(done)
    })
  })
})
