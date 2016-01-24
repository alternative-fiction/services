import "babel-polyfill"
import "colors"
import "./lib/bookshelf"

import {Server} from "hapi"
import routes from "./routes"
import plugins from "./plugins"

const server = new Server()

server.connection({
  host: "localhost",
  port: process.env.PORT || 9001,
  routes: {
    cors: true
  }
})

server.route(routes)

server.register(plugins, error => {
  if (error) throw error
})

export default server
