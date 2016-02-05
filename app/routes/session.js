import User from "../models/user"
import createRedisClient from "redis-connection"
import unknownError from "../lib/unknown-error"
import {createAuth} from "../config/auth"

const redisClient = createRedisClient()

const auth = {
  config: {auth: false},
  method: "POST",
  path: "/auth",
  handler({payload}, reply) {
    const password = (payload.password || "").trim()
    const email = (payload.email || "").trim()

    if (email.length === 0 || password.length === 0) return reply.unauthorized()

    new User({email})
      .fetch({require: true})
      .then(user => {
        if (!user.authenticate(password)) return reply.unauthorized()

        const {session, token} = createAuth(user)

        redisClient.set(session.uuid, JSON.stringify(session))
        reply(user).header("Authorization", token)
      })
      .catch(User.NotFoundError, () => reply.notFound("User not found"))
      .catch(unknownError(reply))
  }
}

const unauth = {
  method: "POST",
  path: "/unauth",
  handler({auth}, reply) {
    redisClient.del(auth.credentials.uuid)
    reply().code(204)
  }
}

export default [
  auth,
  unauth
]
