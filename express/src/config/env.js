require("dotenv").config();

module.exports = {
  app: {
    port: process.env.PORT,
    env: process.env.NODE_ENV || "development",
  },
  jwt: {
    secret: process.env.JWT_SECRET || "default-secret",
  },
  db: {
    url: process.env.DATABASE_URL,
  },
  midtrans: {
    production: process.env.MIDTRANS_PRODUCTION === "false",
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY,
  },
};
