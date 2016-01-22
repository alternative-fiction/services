import bookshelf, {registerCollection} from "../lib/bookshelf"
import Story from "../models/story"

export default registerCollection("Stories", bookshelf.Collection.extend({
  model: Story
}))
