const jwt = require("jsonwebtoken");
const { parse } = require("cookie");
const { COOKIE_NAME } = require("../modules/auth/auth.service");

function auth(req, res, next) {
  try {
    const cookieHeader = req.headers.cookie;

    if (!cookieHeader) {
      return res.status(401).json({
        statusCode: 401,
        success: false,
        message: "Token tidak ditemukan di cookies"
      });
    }

    const cookies = parse(cookieHeader);
    const token = cookies[COOKIE_NAME];

    if (!token) {
      return res.status(401).json({
        statusCode: 401,
        success: false,
        message: "Token tidak ditemukan"
      });
    }

    // ✅ Verify token dengan JWT_SECRET
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    return next();
  } catch (error) {
    // ✅ Better error handling untuk JWT errors
    const message =
      error.name === "TokenExpiredError"
        ? "Token sudah kadaluarsa"
        : error.name === "JsonWebTokenError"
          ? "Token tidak valid"
          : error.message;

    return res.status(401).json({
      statusCode: 401,
      success: false,
      message: message
    });
  }
}

module.exports = auth;
