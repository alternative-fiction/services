import Lab from "lab"
import {expect} from "code"
import server from "../../app"
import uniqueId from "../../app/lib/unique-id"
import createUserMock from "../mocks/user"

const {experiment, test} = exports.lab = Lab.script()
const user = createUserMock()

experiment("Users", () => {
  let authorization
  let uuid

  test("Create", done => {
    const options = {
      method: "POST",
      payload: {user},
      url: "/users"
    }

    server.inject(options, ({headers, result, statusCode}) => {
      expect(statusCode).to.equal(200)
      expect(headers.authorization).to.exist()

      uuid = result.uuid
      authorization = headers.authorization

      expect(result.username).to.equal(user.username)
      expect(result.bio).to.equal(user.bio)

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

      expect(result.username).to.equal(user.username)
      expect(result.bio).to.equal(user.bio)

      server.stop(done)
    })
  })

  test("Update", done => {
    const options = {
      headers: {authorization},
      method: "PATCH",
      payload: {
        user: {
          bio: "updated bio"
        }
      },
      url: `/users/${uuid}`
    }

    server.inject(options, ({result, statusCode}) => {
      expect(statusCode).to.equal(200)

      expect(result.bio).to.equal(options.payload.user.bio)

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

  test("Retrieve (error)", done => {
    const options = {
      method: "GET",
      url: `/users/${uniqueId()}`
    }

    server.inject(options, ({statusCode}) => {
      expect(statusCode).to.equal(404)

      server.stop(done)
    })
  })
})
