export default [{
  method: "GET",
  path: "/{filename*}",
  handler({params: {filename}}, reply) {
    reply.file(filename)
  }
}]
