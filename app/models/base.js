import bookshelf from "../lib/bookshelf"
import uniqueId from "../lib/unique-id"

const baseModel = bookshelf.Model.extend({
  hasTimestamps: ["createdAt", "updatedAt"],
  initialize() {
    this.on("creating", model => model.set("uuid", uniqueId(12)))
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
