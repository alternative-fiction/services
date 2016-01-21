import "babel-polyfill"
import "colors"

import {Server} from "hapi"
import routes from "./routes"
import plugins from "./plugins"

module.exports = function init() {
  const server = new Server()

  server.connection({
    host: "localhost",
    port: 9001
  })

  server.route(routes)

  server.register(plugins, error => {
    if (error) throw error

    server.start(() => {
      console.log("\n\n\n===========".rainbow)
      console.log(`${(new Date()).toLocaleTimeString()}: Our story begins at ${server.info.uri}`)
      console.log("===========\n\n\n".rainbow)
    })
  })
}
