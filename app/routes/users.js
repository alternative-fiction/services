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
        .limit(100)
        .orderBy("createdAt", "desc"))
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
      .where({status: "active"})
      .fetch({
        withRelated: ["stories"],
        require: true
      })
      .then(user => {
        new Stories()
          .query("where", "userUuid", "=", uuid)
          .count()
          .then(storiesCount => {
            user.set("storiesCount", storiesCount)
            reply(user)
          })
      })
      .catch(User.NotFoundError, User.notFoundHandler(reply, uuid))
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
  path: "/users/{uuid}",
  handler({auth, params: {uuid}, payload}, reply) {
    payload = payload || {}

    const {userUuid} = auth.credentials

    User.authorize({uuid}, userUuid)
      .then(model => {
        return model
          .save(payload, {require: true, patch: true})
          .then(updatedUser => reply(updatedUser.serialize(null, {revealPrivateAttributes: true})))
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
          .save({status: "inactive"}, {require: true})
          .then(() => reply().code(204))
      })
      .catch(User.NoRowsDeletedError, User.notFoundHandler(reply, uuid))
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
