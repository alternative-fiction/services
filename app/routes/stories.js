import Stories from "../collections/stories"
import Story from "../models/story"
import unknownError from "../lib/unknown-error"

const index = {
  config: {auth: false},
  method: "GET",
  path: "/stories",
  handler({query: {userUuid}}, reply) {
    let query

    if (userUuid) {
      query = qb => qb
        .where({userUuid})
        .orderBy("updatedAt", "desc")
    }
    else {
      query = qb => qb.orderBy("updatedAt", "desc")
    }

    new Stories()
      .query(query)
      .fetch({
        columns: ["createdAt", "description", "meta", "title", "updatedAt", "userUuid", "uuid"],
        withRelated: ["user"]
      })
      .then(records => reply(records))
      .catch(unknownError(reply))
  }
}

const show = {
  config: {auth: false},
  method: "GET",
  path: "/stories/{uuid}",
  handler({params: {uuid}}, reply) {
    new Story({uuid})
      .fetch({require: true, withRelated: ["user"]})
      .then(reply)
      .catch(Story.NotFoundError, () => reply.notFound(`Story ID ${uuid} not found.`))
      .catch(unknownError(reply))
  }
}

const create = {
  method: "POST",
  path: "/stories",
  handler({auth, payload}, reply) {
    payload = payload || {}

    payload.userUuid = auth.credentials.userUuid

    new Story()
      .save(payload)
      .then(model => {
        return model
          .fetch({withRelated: ["user"]})
          .then(reply)
      })
      .catch(Story.NoRowsUpdatedError, error => reply.badRequest(error))
      .catch(unknownError(reply))
  }
}

const update = {
  method: "PATCH",
  path: "/stories/{uuid}",
  handler({auth, params: {uuid}, payload}, reply) {
    const {userUuid} = auth.credentials

    payload = payload || {}

    Story.authorize({uuid}, userUuid)
      .then(model => {
        return model
          .save(payload, {require: true, patch: true})
          .then(reply)
      })
      .catch(Story.NoRowsUpdatedError, error => reply.badRequest(error))
      .catch(Story.NotFoundError, Story.notFoundHandler(reply, uuid))
      .catch(unknownError(reply))
  }
}

const destroy = {
  method: "DELETE",
  path: "/stories/{uuid}",
  handler({auth, params: {uuid}}, reply) {
    const {userUuid} = auth.credentials

    Story.authorize({uuid}, userUuid)
      .then(model => {
        return model
          .destroy({require: true})
          .then(() => reply().code(204))
      })
      .catch(Story.NoRowsDeletedError, Story.notFoundHandler(reply, uuid))
      .catch(Story.NotFoundError, Story.notFoundHandler(reply, uuid))
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
