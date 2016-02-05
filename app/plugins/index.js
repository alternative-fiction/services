import bookshelfSerializer from "hapi-bookshelf-serializer"
import boomDecorators from "hapi-boom-decorators"
import good from "./good"
import hapiAuthJw2 from "hapi-auth-jwt2"
import inert from "inert"

export default [
  boomDecorators,
  bookshelfSerializer,
  good,
  hapiAuthJw2,
  inert
]
