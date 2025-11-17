const app = require("./app");
const env = require("./config/env");

app.listen(env.app.port, () => {
  console.log(`Running on port ${env.app.port}`);
});
