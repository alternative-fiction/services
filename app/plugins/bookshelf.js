import environments from "../../knexfile"
import uniqueId from "../lib/unique-id"

const {connection} = environments[process.env.AF_ENV || "development"]

export default {
  register: require("hapi-bookshelf-models"),
  options: {
    knex: {
      client: "pg",
      connection
    },
    plugins: ["registry"],
    models: "./app/models",
    base(bookshelf) {
      return bookshelf.Model.extend({
        hasTimestamps: ["createdAt", "updatedAt"],
        initialize() {
          this.set("uuid", uniqueId(12))
        }
      })
    }
  }
}
