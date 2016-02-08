import Stories from "../collections/stories"
import Story from "../models/story"
import unknownError from "../lib/unknown-error"

const index = {
  config: {auth: false},
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
    const {story} = payload || {}

    story.userUuid = auth.credentials.userUuid

    new Story(story)
      .save()
      .then(reply)
      .catch(Story.NoRowsUpdatedError, error => reply.badRequest(error))
      .catch(unknownError(reply))
  }
}

const update = {
  method: "PATCH",
  path: "/stories/{uuid}",
  handler({auth, params: {uuid}, payload}, reply) {
    const {story} = payload || {}
    const {userUuid} = auth.credentials

    new Story({uuid})
      .where({userUuid})
      .save(story, {require: true, patch: true})
      .then(reply)
      .catch(Story.NoRowsUpdatedError, error => reply.badRequest(error))
      .catch(unknownError(reply))
  }
}

const destroy = {
  method: "DELETE",
  path: "/stories/{uuid}",
  handler({auth, params: {uuid}}, reply) {
    const {userUuid} = auth.credentials

    new Story({uuid})
      .where({userUuid})
      .destroy({require: true})
      .then(() => reply().code(204))
      .catch(Story.NoRowsDeletedError, () => reply.notFound(`Story ID ${uuid} not found.`))
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
