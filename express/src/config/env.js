require("dotenv").config();

// VALIDASI JWT_SECRET - CRITICAL UNTUK SECURITY
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret || jwtSecret.length < 32) {
  console.error("❌ FATAL: JWT_SECRET must be at least 32 characters long!");
  console.error("❌ Set JWT_SECRET in .env file with a strong random secret");
  console.error("❌ Generate: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\"");
  process.exit(1);
}

module.exports = {
  app: {
    port: process.env.PORT,
    env: process.env.NODE_ENV || "development",
  },
  jwt: {
    secret: jwtSecret,
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
