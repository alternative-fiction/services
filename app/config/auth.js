import JWT from "jsonwebtoken"
import createRedisClient from "redis-connection"
import log from "../lib/log"
import uniqueId from "../lib/unique-id"
import prettyjson from "prettyjson"

const redisClient = createRedisClient()
const JWT_SECRET = process.env.JWT_SECRET || `development_${new Date().getUTCFullYear()}`

export function createAuth(user) {
  const session = {
    valid: true,
    uuid: uniqueId(36),
    userUuid: user.uuid
  }

  return {
    session,
    token: JWT.sign(session, JWT_SECRET)
  }
}

function validateFunc(decoded, request, next) {
  // do your checks to see if the session is valid
  redisClient.get(decoded.uuid, (redisError, reply) => {
    let session

    if (redisError) log(redisError)

    if (!reply) return next(redisError, false)

    try {
      session = JSON.parse(reply)
    }
    catch (e) {
      return next(redisError, false)
    }

    log("REDIS".cyan, "\n", prettyjson.render(session))

    if (session.valid) return next(redisError, true)

    return next(redisError, false)
  })
}


export default {
  key: JWT_SECRET,
  validateFunc,
  verifyOptions: {
    algorithms: ["HS256"]
  }
}
