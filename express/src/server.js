const app = require("./app");
const env = require("./config/env");
const { validateEnv } = require("./config/envValidation");

// VALIDATE ENVIRONMENT VARIABLES FIRST (sebelum app starts)
// Ini memastikan semua required vars ada dan valid
validateEnv();

app.listen(env.app.port, () => {
  console.log(`🚀 Server started successfully on port ${env.app.port}`);
});
