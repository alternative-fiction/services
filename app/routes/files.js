export default [{
  config: {auth: false},
  method: "GET",
  path: "/{filename*}",
  handler({params: {filename}}, reply) {
    reply.file(filename)
  }
}]
