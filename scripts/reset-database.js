import pgtools from "pgtools"
import environments from "../knexfile"

const {database, host, password, port, user} = environments[process.env.AF_ENV || "development"].connection
const log = console.log.bind(console)

log(`Dropping database ${database}`)
pgtools.dropdb({host, password, port, user}, database, error => {
  if (error && error.name !== "invalid_catalog_name") {
    console.error(error)
    process.exit(-1)
  }

  log(`Dropped database ${database}`)
  log(`Creating database ${database}`)

  pgtools.createdb({host, password, port, user}, database, (error, res = null) => {
    if (error) {
      console.error(error, res)
      process.exit(-1)
    }

    log(`Created database ${database}`)
  })
})

