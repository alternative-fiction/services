import bookshelf, {registerModel} from "../lib/bookshelf"
import {createModel} from "./base"
import {ValidationError} from "checkit"

export default registerModel("User", createModel({
  hasSecurePassword: "passwordDigest",
  isAuthorized(userUuid) {
    return this.get("uuid") === userUuid
  },
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
          if (record) throw new ValidationError("The email address is already in use.")
        })
    }],
    password: ["maxLength:254"],
    username: ["alphaDash", username => {
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
