import server from "./index"
import log from "./lib/log"

server.start(error => {
  if (error) throw error

  log("===========".green)
  log(`Listening at ${server.info.uri}`)
  log("===========\n\n".blue)
})
