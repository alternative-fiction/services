import {registerModel} from "../lib/bookshelf"
import {createModel} from "./base"
import Checkit from "checkit"
import {uniq} from "lodash"

const defaultMeta = {
  tags: []
}
const acceptableMetaKeys = Object.keys(defaultMeta)
const tagLimit = 10

export default registerModel("Story", createModel({
  idAttribute: "uuid",
  initialize() {
    this.on("saving", (model, {meta}) => {
      if (!(meta && meta.tags)) return

      meta.tags = uniq(meta.tags)
      model.set("meta", meta)
    })
  },
  serialize() {
    return {
      body: this.get("body") || "",
      createdAt: this.get("createdAt"),
      description: this.get("description") || "",
      meta: this.get("meta") || defaultMeta,
      published: this.get("published"),
      title: this.get("title") || "",
      updatedAt: this.get("updatedAt"),
      uuid: this.get("uuid")
    }
  },
  tableName: "stories",
  validations: {
    description: ["maxLength:254"],
    meta: ["object", value => {
      const invalidKeys = Object.keys(value)
        .filter(key => !acceptableMetaKeys.includes(key))

      if (invalidKeys.length !== 0)
        throw new Checkit.Error(`Unacceptable meta keys, '${invalidKeys.join(", ")}'.`)

      if (!value.hasOwnProperty("tags") || !Array.isArray(value.tags))
        throw new Checkit.Error("Meta must include array of tags.")

      if (value.tags.filter(tag => typeof tag !== "string").length !== 0)
        throw new Checkit.Error("Tags must be an array of strings.")

      if (value.tags.length > tagLimit)
        throw new Checkit.Error(`Tags must not exceed ${tagLimit}.`)
    }],
    published: ["boolean"],
    title: ["maxLength:254"]
  }
}))
