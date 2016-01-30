import {registerModel} from "../lib/bookshelf"
import {createModel} from "./base"

const defaultMeta = {
  tags: []
}

export default registerModel("Story", createModel({
  idAttribute: "uuid",
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
  tableName: "stories"
}))
