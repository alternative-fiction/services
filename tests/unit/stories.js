import Lab from "lab"
import Code from "code"
import server from "../../app"

const lab = exports.lab = Lab.script()

lab.experiment("Stories", () => {
  lab.test("Create", done => {
    const options = {
      method: "POST",
      payload: {
        story: {
          body: "test body"
        }
      },
      url: "/stories"
    }

    server.inject(options, ({statusCode, result}) => {
      Code.expect(statusCode).to.equal(200)
      Code.expect(result.body).to.equal(options.payload.story.body)

      server.stop(done)
    })
  })
})
