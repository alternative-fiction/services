import server from "../app"

server.start(() => {
  console.log("\n\n===========".green)
  console.log(`${(new Date()).toLocaleTimeString()}: Listening at ${server.info.uri}`)
  console.log("===========\n\n".blue)
})
