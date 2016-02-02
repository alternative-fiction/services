import Users from "../collections/users"
import User from "../models/user"
import unknownError from "../lib/unknown-error"

const index = {
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
  method: "GET",
  path: "/users/{uuid}",
  handler({params: {uuid}}, reply) {
    new User({uuid})
      .fetch({require: true})
      .then(reply)
      .catch(User.NotFoundError, () => reply.notFound())
      .catch(unknownError(reply))
  }
}

const create = {
  method: "POST",
  path: "/users",
  handler({payload}, reply) {
    const {user} = payload || {}

    new User(user)
      .save()
      .then(reply)
      .catch(User.NoRowsUpdatedError, error => reply.badRequest(error))
      .catch(unknownError(reply))
  }
}

const update = {
  method: "PUT",
  path: "/users/{uuid}",
  handler({params: {uuid}, payload}, reply) {
    const {user} = payload || {}

    new User({uuid})
      .save(user, {require: true, patch: true})
      .then(reply)
      .catch(User.NoRowsUpdatedError, error => reply.badRequest(error))
      .catch(unknownError(reply))
  }
}

const destroy = {
  method: "DELETE",
  path: "/users/{uuid}",
  handler({params: {uuid}}, reply) {
    new User({uuid})
      .destroy({require: true})
      .then(() => reply().code(204))
      .catch(User.NoRowsDeletedError, () => reply.notFound())
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
