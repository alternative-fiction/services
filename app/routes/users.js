import bookshelf from "../lib/bookshelf"
import Users from "../collections/users"
import User from "../models/user"
import createRedisClient from "redis-connection"
import unknownError from "../lib/unknown-error"
import {createAuth} from "../config/auth"

const redisClient = createRedisClient()

const index = {
  config: {auth: false},
  method: "GET",
  path: "/users",
  handler({params}, reply) {
    new Users()
      .query(qb => qb.orderBy("createdAt", "desc"))
      .fetch()
      .then(records => reply(records))
      .catch(unknownError(reply))
  }
}

const show = {
  config: {auth: false},
  method: "GET",
  path: "/users/{uuid}",
  handler({params: {uuid}}, reply) {
    const Stories = bookshelf.collection("Stories")

    new User({uuid})
      .fetch({require: true})
      .then(user => {
        new Stories()
          .query("where", "userUuid", "=", uuid)
          .count()
          .then(storiesCount => {
            user.set("storiesCount", storiesCount)
            reply(user)
          })
      })
      .catch(User.NotFoundError, () => reply.notFound(`User ID ${uuid} not found.`))
      .catch(unknownError(reply))
  }
}

const create = {
  config: {auth: false},
  method: "POST",
  path: "/users",
  handler({payload}, reply) {
    const {user} = payload || {}

    new User()
      .save(user)
      .then(user => {
        const {session, token} = createAuth(user)

        redisClient.set(session.uuid, JSON.stringify(session))

        reply(user)
          .header("Authorization", token)
          .header("Access-Control-Expose-Headers", "Authorization")
      })
      .catch(User.NoRowsUpdatedError, error => reply.badRequest(error))
      .catch(unknownError(reply))
  }
}

const update = {
  method: "PATCH",
  path: "/users/{uuid}",
  handler({auth, params: {uuid}, payload}, reply) {
    const {user} = payload || {}
    const {userUuid} = auth.credentials

    User.authorize({uuid}, userUuid)
      .then(model => {
        return model
          .save(user, {require: true, patch: true})
          .then(reply)
      })
      .catch(User.NoRowsUpdatedError, error => reply.badRequest(error))
      .catch(User.NotFoundError, User.notFoundHandler(reply, uuid))
      .catch(unknownError(reply))
  }
}

const destroy = {
  method: "DELETE",
  path: "/users/{uuid}",
  handler({auth, params: {uuid}}, reply) {
    const {userUuid} = auth.credentials

    User.authorize({uuid}, userUuid)
      .then(model => {
        model
          .destroy({require: true})
          .then(() => reply().code(204))
      })
      .catch(User.NoRowsDeletedError, () => reply.notFound(`User ID ${uuid} not found.`))
      .catch(User.NotFoundError, User.notFoundHandler(reply, uuid))
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
