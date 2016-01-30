import {registerModel} from "../lib/bookshelf"
import {createModel} from "./base"

export default registerModel("User", createModel({
  idAttribute: "uuid",
  hasSecurePassword: "passwordDigest",
  serialize() {
    return {
      bio: this.get("bio") || "",
      createdAt: this.get("createdAt"),
      updatedAt: this.get("updatedAt"),
      username: this.get("username") || "Anonymous",
      uuid: this.get("uuid")
    }
  },
  tableName: "users"
}))
