"use strict"

exports.up = function(knex) {
  return knex.schema.createTable("stories", t => {
    t.string("uuid", 12)
      .primary()
      .notNullable()
      .index()

    t.text("body", "longtext")
      .notNullable()
      .defaultTo("")

    t.json("meta")

    t.string("description")
      .notNullable()
      .defaultTo("")

    t.string("title")
      .notNullable()
      .defaultTo("")

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

    t.specificType("tsv", "tsvector")
      .index("tsv_index", "gin")
  }).raw(`
    CREATE FUNCTION documents_search_trigger() RETURNS trigger AS $$
      begin
        new.tsv :=
          setweight(to_tsvector(coalesce(new.description, '')), 'A') ||
          setweight(to_tsvector(coalesce(new.meta->>'tags', '')), 'A') ||
          setweight(to_tsvector(coalesce(new.title, '')), 'B') ||
          setweight(to_tsvector(coalesce(new.body, '')), 'D');
        return new;
      end
      $$ LANGUAGE plpgsql;

      CREATE TRIGGER tsvectorupdate BEFORE INSERT OR UPDATE
      ON stories FOR EACH ROW EXECUTE PROCEDURE documents_search_trigger();
  `)
}

exports.down = knex => {
  return knex.schema.dropTable("stories")
}
