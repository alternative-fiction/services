import bookshelfSerializer from "hapi-bookshelf-serializer"
import good from "./good"
import boomDecorators from "hapi-boom-decorators"

export default [
  boomDecorators,
  bookshelfSerializer,
  good
]
