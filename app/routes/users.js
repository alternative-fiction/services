import bookshelf from "../lib/bookshelf"
import Users from "../collections/users"
import User from "../models/user"
import unknownError from "../lib/unknown-error"
import {createAuth} from "../config/auth"

const index = {
  config: {auth: false},
  method: "GET",
  path: "/users",
  handler({params}, reply) {
    new Users()
      .query(qb => qb
        .where({status: "active"})
        .orderBy("createdAt", "desc"))
      .fetch()
      .then(records => reply(records))
      .catch(unknownError(reply))
  }
}

const show = {
  config: {auth: false},
  method: "GET",
  path: "/users/{username}",
  handler({params: {username}}, reply) {
    const Stories = bookshelf.collection("Stories")

    new User({username})
      .where({status: "active"})
      .fetch({
        withRelated: ["stories"],
        require: true
      })
      .then(user => {
        new Stories()
          .query("where", "userUuid", "=", user.get("uuid"))
          .count()
          .then(storiesCount => {
            user.set("storiesCount", storiesCount)
            reply(user)
          })
      })
      .catch(User.NotFoundError, () => reply.notFound(`Username ${username} not found.`))
      .catch(unknownError(reply))
  }
}

const create = {
  config: {auth: false},
  method: "POST",
  path: "/users",
  handler({payload}, reply) {
    payload = payload || {}

    new User()
      .save(payload)
      .then(user => {
        const auth = createAuth(user)

        reply(user.serialize(null, {revealPrivateAttributes: true}))
          .header("Authorization", auth)
          .header("Access-Control-Expose-Headers", "Authorization")
      })
      .catch(User.NoRowsUpdatedError, error => reply.badRequest(error))
      .catch(unknownError(reply))
  }
}

const update = {
  method: "PATCH",
  path: "/users/{username}",
  handler({auth, params: {username}, payload}, reply) {
    payload = payload || {}

    const {userUuid} = auth.credentials

    User.authorize({username}, userUuid)
      .then(model => {
        return model
          .save(payload, {require: true, patch: true})
          .then(updatedUser => reply(updatedUser.serialize(null, {revealPrivateAttributes: true})))
      })
      .catch(User.NoRowsUpdatedError, error => reply.badRequest(error))
      .catch(User.NotFoundError, User.notFoundHandler(reply, username))
      .catch(unknownError(reply))
  }
}

const destroy = {
  method: "DELETE",
  path: "/users/{username}",
  handler({auth, params: {username}}, reply) {
    const {userUuid} = auth.credentials

    User.authorize({username}, userUuid)
      .then(model => {
        model
          .save({status: "inactive"}, {require: true})
          .then(() => reply().code(204))
      })
      .catch(User.NoRowsDeletedError, () => reply.notFound(`Username ${username} not found.`))
      .catch(User.NotFoundError, User.notFoundHandler(reply, username))
      .catch(unknownError(reply))
  }
}

export default [
  index,
  create,
  show,
  update,
  destroy
]
