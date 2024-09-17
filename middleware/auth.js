const { UnauthenticatedError, UnauthorizedError } = require("../errors");
const { isTokenValid } = require("../utils/jwt");

const authenticateUser = (async = (req, res, next) => {
  const token = req.signedCookies.token;

  if (!token) {
    throw new UnauthenticatedError("'No token, authorization denied'");
  }

  try {
    const { iat, exp, ...rest } = isTokenValid(token);
    req.user = rest;
    next();
  } catch (error) {
    throw new UnauthenticatedError("Token is not valid");
  }
});

const authorizePermissions = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new UnauthorizedError("Access denied");
    }
    next();
  };
};

module.exports = { authenticateUser, authorizePermissions };
