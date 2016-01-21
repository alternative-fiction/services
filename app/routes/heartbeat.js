export default {
  method: "GET",
  path: "/heartbeat",
  handler(request, reply) {
    return reply("hello world")
  }
}
