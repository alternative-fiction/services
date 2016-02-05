import Lab from "lab"
import Code from "code"
import server from "../../app"
import uniqueId from "../../app/lib/unique-id"
import createMockUser from "../mocks/user"

const lab = exports.lab = Lab.script()
const user = createMockUser()

lab.experiment("Users", () => {
  let authorization
  let uuid

  lab.test("Create", done => {
    const options = {
      method: "POST",
      payload: {user},
      url: "/users"
    }

    server.inject(options, ({headers, result, statusCode}) => {
      Code.expect(statusCode).to.equal(200)
      Code.expect(headers.authorization).to.exist()

      uuid = result.uuid
      authorization = headers.authorization

      Code.expect(result.username).to.equal(user.username)
      Code.expect(result.bio).to.equal(user.bio)

      server.stop(done)
    })
  })

  lab.test("Retrieve", done => {
    const options = {
      method: "GET",
      url: `/users/${uuid}`
    }

    server.inject(options, ({result, statusCode}) => {
      Code.expect(statusCode).to.equal(200)

      Code.expect(result.username).to.equal(user.username)
      Code.expect(result.bio).to.equal(user.bio)

      server.stop(done)
    })
  })

  lab.test("Update", done => {
    const options = {
      headers: {authorization},
      method: "PUT",
      payload: {
        user: {
          bio: "updated bio"
        }
      },
      url: `/users/${uuid}`
    }

    server.inject(options, ({result, statusCode}) => {
      Code.expect(statusCode).to.equal(200)

      Code.expect(result.bio).to.equal(options.payload.user.bio)

      server.stop(done)
    })
  })

  lab.test("Destroy", done => {
    const options = {
      headers: {authorization},
      method: "DELETE",
      url: `/users/${uuid}`
    }

    server.inject(options, ({statusCode}) => {
      Code.expect(statusCode).to.equal(204)

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
