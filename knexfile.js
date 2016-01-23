module.exports = {
  development: {
    client: "postgresql",
    connection: {
      database: "af_development",
      host: "localhost",
      password: "af",
      port: 5432,
      user: "af_services"
    },
    debug: true,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    }
  },

  staging: {
    client: "postgresql",
    connection: {
      database: "af_staging",
      host: "localhost",
      password: "af",
      port: 5432,
      user: "af_services"
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    }
  },

  production: {
    client: "postgresql",
    connection: {
      database: process.env.RDS_DB_NAME,
      host: "localhost",
      password: process.env.RDS_DB_PASSWORD,
      port: 5432,
      user: process.env.RDS_DB_USER
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    }
  }
}
