import Lab from "lab"
import Code from "code"
import server from "../../app"

const lab = exports.lab = Lab.script()

lab.experiment("Basic HTTP Tests", () => {
  lab.test("Health check", done => {
    const options = {
      method: "GET",
      url: "/heartbeat"
    }

    server.inject(options, ({statusCode}) => {
      Code.expect(statusCode).to.equal(200)
      server.stop(done)
    })
  })
})
