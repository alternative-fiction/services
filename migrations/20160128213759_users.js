
exports.up = function(knex) {
  return knex.schema.createTable("users", t => {
    t.string("uuid", 12)
      .primary()
      .notNullable()
      .index()

    t.text("email", "string")
      .unique()
      .index()

    t.text("passwordDigest", "string")
      .notNullable()
      .defaultTo("")

    t.string("bio")
      .notNullable()
      .defaultTo("")

    t.string("username")
      .unique()
      .index()

    t.timestamp("createdAt")
      .notNullable()
      .defaultTo(knex.fn.now())
      .index()

    t.timestamp("updatedAt")
      .notNullable()
      .defaultTo(knex.fn.now())
      .index()
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable("users")
}
