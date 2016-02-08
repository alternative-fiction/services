import bookshelf from "../lib/bookshelf"
import Checkit from "checkit"
import uniqueId from "../lib/unique-id"
import Boom from "boom"

const baseModel = bookshelf.Model.extend({
  hasTimestamps: ["createdAt", "updatedAt"],
  initialize() {
    this.on("creating", model => {
      if (this.isNew()) model.set("uuid", uniqueId(12))
    })

    this.on("saving", this.validate)
  },
  validate() {
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
  }
})

export function createModel(spec) {
  const childInitialize = spec.initialize || (() => null)

  spec.initialize = function baseInitialize() {
    baseModel.prototype.initialize.call(this)
    childInitialize.apply(this, arguments)
  }

  return baseModel.extend(spec)
}

export default baseModel
