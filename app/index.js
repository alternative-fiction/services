import "babel-polyfill"
import "colors"
import "./lib/bookshelf"

import {Server} from "hapi"
import routes from "./routes"
import path from "path"
import plugins from "./plugins"
import authScheme from "./config/auth"

const server = new Server()

server.connection({
  host: "0.0.0.0",
  port: parseInt(process.env.PORT, 10) || 9001,
  routes: {
    cors: true,
    files: {
      relativeTo: path.join(__dirname, "../public")
    }
  }
})

server.register(plugins, error => {
  if (error) throw error

  server.auth.scheme("custom", authScheme)
  server.auth.strategy("default", "custom", "required")

  server.route(routes)
})

export default server
