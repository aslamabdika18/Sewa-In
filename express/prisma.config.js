const { defineConfig, env } = require("prisma/config");

require("dotenv").config(); // Load .env secara manual

module.exports = defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
