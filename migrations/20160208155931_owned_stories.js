
exports.up = function(knex) {
  return knex.schema.table("stories", t => {
    t.string("userUuid")
      .references("users.uuid")
  })
}

exports.down = function(knex) {
  return knex.schema.table("stories", t => {
    t.dropColumn("userUuid")
  })
}
