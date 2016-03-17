import User from "../models/user"
import unknownError from "../lib/unknown-error"
import {createAuth} from "../config/auth"

const auth = {
  config: {auth: false},
  method: "POST",
  path: "/auth",
  handler({payload}, reply) {
    const email = (payload.email || "").trim()
    const password = payload.password || ""

    if (email.length === 0 || password.length === 0) return reply.unauthorized("Invalid credentials.")

    new User({email})
      .fetch({require: true})
      .then(user => {
        if (!user.authenticate(password)) return reply.unauthorized("Invalid credentials.")

        const auth = createAuth(user)

        reply(user.serialize(null, {revealPrivateAttributes: true}))
          .header("Authorization", auth)
          .header("Access-Control-Expose-Headers", "Authorization")
      })
      .catch(User.NotFoundError, () => reply.unauthorized("An account couldn't be found with the given credentials."))
      .catch(unknownError(reply))
  }
}

export default [
  auth
]
