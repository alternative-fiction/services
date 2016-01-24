import Stories from "../collections/stories"
import Story from "../models/story"
import unknownError from "../lib/unknown-error"

const index = {
  method: "GET",
  path: "/stories",
  handler({params}, reply) {
    new Stories()
      .query(qb => qb.orderBy("updatedAt", "desc"))
      .fetch({
        columns: ["createdAt", "description", "title", "updatedAt", "uuid"]
      })
      .then(records => reply(records))
      .catch(unknownError(reply))
  }
}

const show = {
  method: "GET",
  path: "/stories/{uuid}",
  handler({params: {uuid}}, reply) {
    new Story({uuid})
      .fetch({require: true})
      .then(reply)
      .catch(Story.NotFoundError, () => reply.notFound())
      .catch(unknownError(reply))
  }
}

const create = {
  method: "POST",
  path: "/stories",
  handler({payload}, reply) {
    const {story} = payload || {}

    new Story(story)
      .save()
      .then(reply)
      .catch(Story.NoRowsUpdatedError, error => reply.badRequest(error))
      .catch(unknownError(reply))
  }
}

const update = {
  method: "PUT",
  path: "/stories/{uuid}",
  handler({params: {uuid}, payload}, reply) {
    const {story} = payload || {}

    new Story({uuid})
      .save(story, {require: true, patch: true})
      .then(reply)
      .catch(Story.NoRowsUpdatedError, error => reply.badRequest(error))
      .catch(unknownError(reply))
  }
}

const destroy = {
  method: "DELETE",
  path: "/stories/{uuid}",
  handler({params: {uuid}}, reply) {
    new Story({uuid})
      .destroy({require: true})
      .then(() => reply().code(204))
      .catch(Story.NoRowsDeletedError, () => reply.notFound())
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
