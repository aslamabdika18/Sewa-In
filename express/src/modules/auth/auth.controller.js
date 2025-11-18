// src/modules/auth/auth.controller.js
const { serialize } = require("cookie");
const { registerUser, loginUser, COOKIE_NAME } = require("./auth.service");

function createAuthCookie(token) {
  const isProd = process.env.NODE_ENV === "production";

  return serialize(COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60
  });
}

async function registerController(req, res) {
  try {
    const { email, name, password } = req.body;

    const user = await registerUser({ email, name, password });

    return res.status(201).json({
      message: "Register berhasil",
      user
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message || "Register gagal"
    });
  }
}

async function loginController(req, res) {
  try {
    const { email, password } = req.body;

    const { token, user } = await loginUser({ email, password });

    res.setHeader("Set-Cookie", createAuthCookie(token));

    return res.json({
      message: "Login berhasil",
      user
    });
  } catch (error) {
    return res.status(401).json({
      message: error.message || "Login gagal"
    });
  }
}

async function meController(req, res) {
  return res.json({
    user: req.user
  });
}

function logoutController(req, res) {
  const isProd = process.env.NODE_ENV === "production";

  res.setHeader(
    "Set-Cookie",
    serialize(COOKIE_NAME, "", {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: 0
    })
  );

  return res.json({ message: "Logout berhasil" });
}

module.exports = {
  registerController,
  loginController,
  meController,
  logoutController
};
