"use strict";

exports.up = function(knex) {
  return knex.raw(`CREATE EXTENSION IF NOT EXISTS citext;`)
}

exports.down = knex => {
  return knex.raw(`DROP EXTENSION IF EXISTS citext;`)
}
