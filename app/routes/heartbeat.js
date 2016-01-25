function handler(request, reply) {
  return reply({
    message: `${(new Date()).toLocaleTimeString()}: Still alive :)`,
    statusCode: 200
  })
}

export default [
  {
    handler,
    method: "GET",
    path: "/"
  },
  {
    handler,
    method: "GET",
    path: "/heartbeat"
  }
]
