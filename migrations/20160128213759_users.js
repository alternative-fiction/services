
exports.up = function(knex) {
  return knex.schema.createTable("users", t => {
    t.string("uuid", 12)
      .primary()
      .notNullable()
      .index()

    t.specificType("email", "citext")
      .unique()
      .index()

    t.string("passwordDigest")
      .notNullable()
      .defaultTo("")

    t.string("bio")
      .notNullable()
      .defaultTo("")

    t.specificType("displayName", "citext")
      .index()

    t.string("role")
      .defaultTo("user")
      .index()

    t.string("status")
      .defaultTo("active")
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
