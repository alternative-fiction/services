import bookshelfSerializer from "hapi-bookshelf-serializer"
import boomDecorators from "hapi-boom-decorators"
import good from "./good"
import inert from "inert"

export default [
  boomDecorators,
  bookshelfSerializer,
  good,
  inert
]
