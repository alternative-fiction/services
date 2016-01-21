export default {
  register: require("good"),
  options: {
    opsInterval: 1000,
    reporters: [{
      reporter: require("good-console"),
      events: {log: "*", response: "*"}
    }, {
      reporter: require("good-file"),
      events: {ops: "*"},
      config: "./tmp/logs.txt"
    }]
  }
}
