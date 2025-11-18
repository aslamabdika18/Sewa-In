const express = require("express");
const {
  registerController,
  loginController,
  meController,
  logoutController
} = require("./auth.controller");
const auth = require("../../middlewares/auth");

const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.get("/me", auth, meController);
router.post("/logout", auth, logoutController);

module.exports = router;
