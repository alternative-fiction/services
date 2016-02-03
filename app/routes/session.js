import User from "../models/user"
import unknownError from "../lib/unknown-error"

const create = {
  method: "POST",
  path: "/session",
  handler({payload}, reply) {
    const password = (payload.password || "").trim()
    const email = (payload.email || "").trim()

    if (email.length === 0 || password.length === 0) return reply.unauthorized()

    new User({email})
      .fetch({require: true})
      .then(user => {
        if (!user.authenticate(password)) return reply.unauthorized()

        reply(user)
      })
      .catch(User.NotFoundError, () => reply.notFound())
      .catch(unknownError)
  }
}

export default [
  create
]
