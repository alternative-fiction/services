export default {
  register: require("good"),
  options: {
    opsInterval: 1000,
    reporters: [{
      reporter: require("good-console"),
      events: {log: "*", response: "*"}
    }, {
      reporter: require("good-file"),
      events: {log: "*", response: "*"},
      config: "./tmp/logs.txt"
    }]
  }
}
