import bookshelf from "../lib/bookshelf"
import Checkit from "checkit"
import uniqueId from "../lib/unique-id"
import Boom from "boom"
import Bluebird from "bluebird"

const baseModel = bookshelf.Model.extend({
  hasTimestamps: ["createdAt", "updatedAt"],
  idAttribute: "uuid",
  isNew() {
    return this.get("uuid") == null
  },
  initialize() {
    this.on("fetched", model => model.persisted = true)
    this.on("creating", model => model.set("uuid", uniqueId(12)))
    this.on("saving", model => model.validate(model.attributes))
  },
  validate(attributes) {
    const validations = {}

    Object.keys(this.validations).forEach(key => {
      validations[key] = this.validations[key].map(validation => {
        return typeof validation === "function" ? validation.bind(this) : validation
      })
    })
    const checkit = new Checkit(validations)

    return checkit
      .run(attributes)
      .catch(Checkit.Error, response => {
        const boom = Boom.create(400, response.message)

        boom.output.payload.fields = Object.keys(response.errors).map(field => ({
          field, message: response.errors[field].message
        }))

        throw boom
      })
  },
  validations: {}
}, {
  authorize: Bluebird.method(function authorize(attributes, credential) {
    return new this(attributes)
      .fetch({require: true})
      .tap(model => {
        if (!model.isAuthorized(credential)) throw Boom.create(401)
      })
  }),
  notFoundHandler(reply, uuid = "unknown") {
    return () => reply.notFound(`Resource UUID ${uuid} not found.`)
  }
})

export function createModel(spec) {
  const childInitialize = spec.initialize || (() => null)

  spec.initialize = function baseInitialize() {
    baseModel.prototype.initialize.apply(this, arguments)
    childInitialize.apply(this, arguments)
  }

  return baseModel.extend(spec)
}

export default baseModel
