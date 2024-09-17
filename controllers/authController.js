const { BadRequestError, UnauthenticatedError } = require("../errors");
const User = require("../models/User");
const createTokenUser = require("../utils/createTokenUser");
const { attachcookiesToResponse } = require("../utils/jwt");

const register = async (req, res) => {
  const { username, password, email } = req.body;
  const emailAlreadyExists = await User.findOne({ email });

  if (emailAlreadyExists) {
    throw new BadRequestError("Email already exists");
  }

  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? "admin" : "author";

  const user = await User.create({ username, password, email, role });
  const tokenUser = createTokenUser(user);
  attachcookiesToResponse({ res, tokenUser });
  res.status(201).json({ user: tokenUser });
};

const login = async (req, res) => {
  const { password, email } = req.body;
  if (!password || !email) {
    throw new BadRequestError("Please provide email and password");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  const tokenUser = createTokenUser(user);

  attachcookiesToResponse({ res, tokenUser });

  res.status(200).json({ user: tokenUser });
};

const logout = async (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res.status(200).json({ msg: "Logged out" });
};

module.exports = { register, login, logout };
