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
    this.on("creating", model => model.set("uuid", uniqueId(12)))

    this.on("saving", this.validate)
  },
  validate() {
    Object.keys(this.validations).forEach(key => {
      this.validations[key] = this.validations[key].map(validation => {
        return typeof validation === "function" ? validation.bind(this) : validation
      })
    })
    const checkit = new Checkit(this.validations)

    return checkit
      .run(this.attributes)
      .catch(Checkit.Error, response => {
        const boom = Boom.create(400, response.message)

        boom.output.payload.fields = Object.keys(response.errors).map(field => {
          return {field, message: response.errors[field].message}
        })

        throw boom
      })
  },
  validations: {}
}, {
  authorize: Bluebird.method(function authorize(attributes, userUuid) {
    return new this(attributes)
      .fetch({require: true})
      .tap(model => {
        const expectedUserUuid = model.get("userUuid")

        if (expectedUserUuid !== userUuid) throw Boom.create(401,
          `Given user UUID ${userUuid} does not match expected ${expectedUserUuid}`)
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
