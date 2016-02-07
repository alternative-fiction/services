import log from "./log"

export default function unknownError(reply) {
  return error => {
    if (error.isBoom) return reply(error)

    log("Unknown error".red, error.constructor.name, error)
    reply.boom(500, error)
  }
}
