const jwt = require("jsonwebtoken");

const createJwt = (payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
  return token;
};

const isTokenValid = (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded;
};

const attachCookiesToResponse = (res, user) => {
  const token = createJwt(user);
  const oneDay = 1000 * 60 * 60 * 24;

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: true,
    signed: true,
  });
};
module.exports = { createJwt, isTokenValid, attachCookiesToResponse };
