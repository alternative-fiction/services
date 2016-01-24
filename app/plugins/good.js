const reporters = [
  {
    reporter: require("good-console"),
    events: {log: "*", response: "*"}
  }
]

if (process.env.NODE_ENV !== "production") {
  reporters.push({
    reporter: require("good-file"),
    events: {log: "*", response: "*"},
    config: "./tmp/logs.txt"
  })
}

export default {
  register: require("good"),
  options: {
    opsInterval: 1000,
    reporters
  }
}
