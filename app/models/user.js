import Boom from "boom"
import {createModel} from "./base"
import bookshelf, {registerModel} from "../lib/bookshelf"
import {ValidationError} from "checkit"

export default registerModel("User", createModel({
  defaults: {
    role: "user"
  },
  hasSecurePassword: "passwordDigest",
  initialize() {
    this.on("creating", model => model.set("status", "active"))

    this.on("saving", (model, {password}) => {
      // The `password` attribute is virtual and can't be detected by validations.
      if (!this.persisted && !password) throw Boom.create(400, "Password required.")
      if (password && password.length > 254) throw Boom.create(400, "Password must be under 254 characters.")
    })
  },
  isAuthorized(userUuid) {
    return this.get("uuid") === userUuid && this.get("status") === "active"
  },
  serialize(request, {revealPrivateAttributes = false} = {}) {
    return {
      bio: this.get("bio") || "",
      displayName: this.get("displayName") || "Anonymous",
      email: revealPrivateAttributes && this.get("email") || "",
      createdAt: this.get("createdAt"),
      storiesCount: parseInt(this.get("storiesCount") || 0, 10),
      updatedAt: this.get("updatedAt"),
      uuid: this.get("uuid")
    }
  },
  stories() {
    const Story = bookshelf.model("Story")

    return this.hasMany(Story, "userUuid")
  },
  tableName: "users",
  validations: {
    displayName: ["maxLength:60"],
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
    }]
  }
}))
