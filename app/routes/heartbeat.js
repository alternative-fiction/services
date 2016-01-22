export default {
  method: "GET",
  path: "/heartbeat",
  handler(request, reply) {
    return reply({
      message: `${(new Date()).toLocaleTimeString()}: Still alive :)`,
      statusCode: 200
    })
  }
}
