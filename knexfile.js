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

  test: {
    client: "postgresql",
    connection: {
      database: "af_test",
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
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    }
  }
}
