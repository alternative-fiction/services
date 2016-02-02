import unknownError from "../lib/unknown-error"
import {knex} from "../lib/bookshelf"

export default [{
  method: "POST",
  path: "/search",
  handler({payload}, reply) {
    const criteria = (payload.criteria || "").trim()
    // TODO: Accept columns payload.
    const columns = ["uuid", "title", "description", "meta"].join(", ")

    if (criteria.length === 0) return reply({results: []})

    knex
      .raw(`
        SELECT ${columns} FROM (
          SELECT ${columns}, tsv
          FROM stories, plainto_tsquery('${criteria}') AS q WHERE (tsv @@ q)
        ) AS t1 ORDER BY ts_rank_cd(t1.tsv, plainto_tsquery('${criteria}')) DESC LIMIT 50;
      `)
      .then(({rows}) => reply({results: rows}))
      .catch(unknownError(reply))
  }
}]
