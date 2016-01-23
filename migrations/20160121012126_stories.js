"use strict";

exports.up = function(knex) {
  return knex.schema.createTable("stories", t => {
    t.string("uuid", 12)
      .primary()
      .notNullable()
      .index()

    t.text("body", "longtext")
      .notNullable()
      .defaultTo("")
      .index()

    t.string("description")
      .notNullable()
      .defaultTo("")
      .index()

    t.string("title")
      .notNullable()
      .defaultTo("")
      .index()

    t.boolean("published")
      .notNullable()
      .defaultTo(false)

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

exports.down = knex => {
  return knex.schema.dropTable("stories")
}
