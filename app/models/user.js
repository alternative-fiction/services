import bookshelf, {registerModel} from "../lib/bookshelf"
import {createModel} from "./base"
import {ValidationError} from "checkit"

export default registerModel("User", createModel({
  defaults: {
    role: "user"
  },
  hasSecurePassword: "passwordDigest",
  initialize() {
    this.on("creating", model => model.set("status", "active"))
  },
  isAuthorized(userUuid) {
    return this.get("uuid") === userUuid && this.get("status") === "active"
  },
  serialize(request, {revealPrivateAttributes = false} = {}) {
    return {
      bio: this.get("bio") || "",
      email: revealPrivateAttributes && this.get("email") || "",
      createdAt: this.get("createdAt"),
      storiesCount: parseInt(this.get("storiesCount") || 0, 10),
      updatedAt: this.get("updatedAt"),
      username: this.get("username"),
      uuid: this.get("uuid")
    }
  },
  stories() {
    const Story = bookshelf.model("Story")

    return this.hasMany(Story, "userUuid")
  },
  tableName: "users",
  validations: {
    bio: ["maxLength:254"],
    email: ["required", "email", "maxLength:254", function(email) {
      if (this.persisted && this.previousAttributes().email === email) return

      const Users = bookshelf.collection("Users")

      return new Users()
        .query({where: {email}})
        .fetchOne()
        .then(record => {
          if (record) throw new ValidationError("The email address is already in use.")
        })
    }],
    password: ["maxLength:254"],
    username: ["required", "alphaDash", "maxLength:60", function(username) {
      if (this.persisted && this.previousAttributes().username === username) return

      const Users = bookshelf.collection("Users")

      return new Users()
        .query({where: {username}})
        .fetchOne()
        .then(record => {
          if (record) throw new ValidationError("The username is already in use.")
        })
    }]
  }
}))
