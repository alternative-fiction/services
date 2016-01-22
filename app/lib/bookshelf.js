import createBookshelf from "bookshelf"
import knex from "knex"
import environments from "../../knexfile"

const config = environments[process.env.AF_ENV || "development"]
const bookshelf = createBookshelf(knex(config))

bookshelf.plugin("registry")

export const registerCollection = bookshelf.collection.bind(bookshelf)
export const registerModel = bookshelf.model.bind(bookshelf)

export default bookshelf
