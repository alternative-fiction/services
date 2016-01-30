import bookshelf, {registerCollection} from "../lib/bookshelf"
import User from "../models/user"

export default registerCollection("Users", bookshelf.Collection.extend({
  model: User
}))
