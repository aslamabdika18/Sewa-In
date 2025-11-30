const { serialize } = require("cookie");
const { registerUser, loginUser, COOKIE_NAME } = require("./auth.service");
const { AppError } = require("../../middlewares/errorHandler");
const { success, error } = require("../../utils/response");

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

async function registerController(req, res, next) {
  try {
    const { email, name, password } = req.validated;

    const user = await registerUser({ email, name, password });

    return success(res, user, "Registrasi berhasil", null, 201);
  } catch (error) {
    // Email sudah terdaftar = 400
    if (error.message.includes("Email sudah terdaftar")) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    next(error);
  }
}

async function loginController(req, res, next) {
  try {
    const { email, password } = req.validated;

    const { token, user } = await loginUser({ email, password });

    res.setHeader("Set-Cookie", createAuthCookie(token));

    return success(res, user, "Login berhasil");
  } catch (error) {
    // Email atau password salah = 401
    if (error.message.includes("Email atau password salah")) {
      return res.status(401).json({
        success: false,
        message: error.message
      });
    }
    next(error);
  }
}

async function meController(req, res, next) {
  try {
    // ✅ FIXED: Return user directly, not wrapped in { user: ... }
    return success(res, req.user, "Data user berhasil diambil");
  } catch (error) {
    next(error);
  }
}

function logoutController(req, res, next) {
  try {
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

    return success(res, null, "Logout berhasil");
  } catch (error) {
    next(error);
  }
}

module.exports = {
  registerController,
  loginController,
  meController,
  logoutController
};
