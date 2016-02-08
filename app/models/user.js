import bookshelf, {registerModel} from "../lib/bookshelf"
import {createModel} from "./base"
import Checkit from "checkit"

export default registerModel("User", createModel({
  idAttribute: "uuid",
  hasSecurePassword: "passwordDigest",
  serialize() {
    return {
      bio: this.get("bio") || "",
      createdAt: this.get("createdAt"),
      storiesCount: parseInt(this.get("storiesCount") || 0, 10),
      updatedAt: this.get("updatedAt"),
      username: this.get("username") || "Anonymous",
      uuid: this.get("uuid")
    }
  },
  stories() {
    const Story = bookshelf.model("Story")

    return this.hasMany(Story, "userUuid")
  },
  tableName: "users",
  validations: {
    email: ["email", "maxLength:254", email => {
      const Users = bookshelf.collection("Users")

      return new Users()
        .query({where: {email}})
        .fetchOne()
        .then(record => {
          if (record) throw new Checkit.Error("The email address is already in use.")
        })
    }],
    username: ["alphaDash", username => {
      const Users = bookshelf.collection("Users")

      return new Users()
        .query({where: {username}})
        .fetchOne()
        .then(record => {
          if (record) throw new Checkit.Error("The username is already in use.")
        })
    }]
  }
}))
