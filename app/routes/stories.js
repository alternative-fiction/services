import Stories from "../collections/stories"
import Story from "../models/story"

export default [
  {
    method: "GET",
    path: "/stories",
    handler({params}, reply) {
      new Stories()
        .query(qb => qb.where({published: false}).orderBy("updatedAt"))
        .fetch({
          columns: ["createdAt", "description", "title", "updatedAt", "uuid"]
        })
        .then(records => reply(records))
        .catch(error => {
          console.error(error)
          reply.boom(500, error)
        })
    }
  },
  {
    method: "GET",
    path: "/stories/{uuid}",
    handler({params: {uuid}}, reply) {
      new Story({uuid})
        .fetch({require: true})
        .then(record => reply(record))
        .catch(Story.NotFoundError, () => reply.notFound())
        .catch(error => {
          console.error(error)
          reply.boom(500, error)
        })
    }
  },
  {
    method: "POST",
    path: "/stories",
    handler({payload}, reply) {
      const {story} = payload || {}

      new Story(story)
        .save()
        .then(record => reply(record))
        .catch(Story.NoRowsUpdatedError, error => reply.badRequest(error))
        .catch(error => {
          console.error(error)
          reply.boom(500, error)
        })
    }
  },
  {
    method: "DELETE",
    path: "/stories/{uuid}",
    handler({params: {uuid}}, reply) {
      new Story({uuid})
        .destroy({require: true})
        .then(() => reply().code(204))
        .catch(Story.NoRowsDeletedError, () => reply.notFound())
        .catch(error => {
          console.error(error)
          reply.boom(500, error)
        })
    }
  }
]
