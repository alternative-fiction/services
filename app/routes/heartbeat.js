const heartbeat = {
  config: {auth: false},
  handler(request, reply) {
    return reply({
      message: `${(new Date()).toLocaleTimeString()}: Still alive :)`,
      statusCode: 200
    })
  },
  method: "GET",
  path: "/"
}

export default [
  heartbeat
]
