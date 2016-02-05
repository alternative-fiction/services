const env = process.env.NODE_ENV || "development"

class Timestamp {
  toString() {
    return (new Date()).toLocaleTimeString()
  }
}

const log = env === "development" ? console.log.bind(console, "[%s]", new Timestamp()) : () => {}

export default log
