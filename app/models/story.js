import {Error as ValidationError} from "checkit"
import {createModel} from "./base"
import bookshelf, {registerModel} from "../lib/bookshelf"
import {uniq} from "lodash"

const acceptableMetaKeys = ["tags"]
const tagLimit = 10

export default registerModel("Story", createModel({
  initialize() {
    this.on("creating", (model, {meta}) => {
      if (meta && meta.tags) return

      model.set("meta", {
        tags: []
      })
    })

    this.on("saving", (model, {meta}) => {
      if (!(meta && meta.tags)) return

      meta.tags = uniq(meta.tags)
      model.set("meta", meta)
    })
  },
  isAuthorized(userUuid) {
    return this.get("userUuid") === userUuid
  },
  serialize() {
    return {
      body: this.get("body") || "",
      createdAt: this.get("createdAt"),
      description: this.get("description") || "",
      meta: this.get("meta"),
      published: this.get("published"),
      title: this.get("title") || "",
      updatedAt: this.get("updatedAt"),
      userUuid: this.get("userUuid"),
      user: this.related("user").serialize(),
      uuid: this.get("uuid")
    }
  },
  tableName: "stories",
  user() {
    const User = bookshelf.model("User")

    return this.belongsTo(User, "userUuid")
  },
  validations: {
    description: ["maxLength:254"],
    meta: ["object", value => {
      const invalidKeys = Object.keys(value)
        .filter(key => !acceptableMetaKeys.includes(key))

      if (invalidKeys.length !== 0)
        throw new ValidationError(`Unacceptable meta keys, '${invalidKeys.join(", ")}'.`)

      if (!value.hasOwnProperty("tags") || !Array.isArray(value.tags))
        throw new ValidationError("Meta must include array of tags.")

      if (value.tags.filter(tag => typeof tag !== "string").length !== 0)
        throw new ValidationError("Tags must be an array of strings.")

      if (value.tags.length > tagLimit)
        throw new ValidationError(`Tags must not exceed ${tagLimit}.`)
    }],
    published: ["boolean"],
    title: ["maxLength:254"]
  }
}))
