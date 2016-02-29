import unknownError from "../lib/unknown-error"
import {knex} from "../lib/bookshelf"
import Stories from "../collections/stories"

export default [{
  config: {auth: false},
  method: "POST",
  path: "/search",
  handler({payload}, reply) {
    const criteria = (payload.criteria || "").trim()
    // TODO: Accept columns payload.

    if (criteria.length === 0) return reply([])

    knex
      .raw(`
        SELECT uuid FROM (
          SELECT uuid, tsv
          FROM stories, plainto_tsquery('${criteria}') AS q WHERE (tsv @@ q)
        ) AS t1 ORDER BY ts_rank_cd(t1.tsv, plainto_tsquery('${criteria}')) DESC LIMIT 50;
      `)
      .then(({rows}) => {
        new Stories()
          .query("where", "uuid", "IN", rows.map(row => row.uuid).join(", "))
          .fetch({
            columns: ["description", "meta", "title", "userUuid", "uuid"]
          })
          .then(reply)
      })
      .catch(unknownError(reply))
  }
}]
