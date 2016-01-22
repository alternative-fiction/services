import "babel-polyfill"
import "colors"
import "./lib/bookshelf"

import {Server} from "hapi"
import routes from "./routes"
import plugins from "./plugins"

export const server = new Server()

exports.init = function init() {
  server.connection({
    host: "localhost",
    port: 9001
  })

  server.route(routes)

  server.register(plugins, error => {
    if (error) throw error

    server.start(() => {
      console.log("\n\n===========".green)
      console.log(`${(new Date()).toLocaleTimeString()}: Listening at ${server.info.uri}`)
      console.log("===========\n\n".blue)
    })
  })
}
