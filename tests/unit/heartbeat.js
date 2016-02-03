import Lab from "lab"
import Code from "code"
import server from "../../app"

const lab = exports.lab = Lab.script()

lab.experiment("Basic HTTP Tests", () => {
  lab.test("JSON health check", done => {
    const options = {
      method: "GET",
      url: "/"
    }

    server.inject(options, ({statusCode}) => {
      Code.expect(statusCode).to.equal(200)
      server.stop(done)
    })
  })

  lab.test("Static health check", done => {
    const options = {
      method: "GET",
      url: "/heartbeat.txt"
    }

    server.inject(options, ({statusCode, result}) => {
      Code.expect(statusCode).to.equal(200)
      Code.expect(result).to.equal("Still alive :)\n")
      server.stop(done)
    })
  })
})
