// Wraps unknown errors with console log.

export default function unknownError(reply) {
  return error => {
    console.error(error)
    reply.boom(500, error)
  }
}
