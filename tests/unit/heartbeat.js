import Lab from "lab"
import {expect} from "code"
import server from "../../app"

const {experiment, test} = exports.lab = Lab.script()

experiment("Basic HTTP Tests", () => {
  test("JSON health check", done => {
    const options = {
      method: "GET",
      url: "/"
    }

    server.inject(options, ({statusCode}) => {
      expect(statusCode).to.equal(200)
      server.stop(done)
    })
  })

  test("Static health check", done => {
    const options = {
      method: "GET",
      url: "/heartbeat.txt"
    }

    server.inject(options, ({statusCode, result}) => {
      expect(statusCode).to.equal(200)
      expect(result).to.equal("Still alive :)\n")
      server.stop(done)
    })
  })
})
