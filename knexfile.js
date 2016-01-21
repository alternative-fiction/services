module.exports = {
  development: {
    client: "postgresql",
    connection: {
      database: "af_development",
      user: "af_services",
      password: "af"
    },
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
      user: "af_services",
      password: "af"
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
      user: process.env.RDS_DB_USER,
      password: process.env.RDS_DB_PASSWORD
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
