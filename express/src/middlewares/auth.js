const jwt = require("jsonwebtoken");
const { parse } = require("cookie");
const { COOKIE_NAME } = require("../modules/auth/auth.service");

function auth(req, res, next) {
  const cookieHeader = req.headers.cookie;

  if (!cookieHeader) {
    return res.status(401).json({ message: "Unauthenticated" });
  }

  const cookies = parse(cookieHeader);
  const token = cookies[COOKIE_NAME];

  if (!token) {
    return res.status(401).json({ message: "Unauthenticated" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

module.exports = auth;
