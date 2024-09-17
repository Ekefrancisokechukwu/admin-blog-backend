const { NotFoundError, BadRequestError } = require("../errors");
const User = require("../models/User");
const createTokenUser = require("../utils/createTokenUser");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

const getAllUsers = async (req, res) => {
  const users = await User.find({ role: { $in: ["author", "reader"] } }).select(
    "-password"
  );
  res.status(200).json({ users: users });
};

const getSingleUser = async (req, res) => {
  const id = req.params.id;
  const user = await User.findOne({ _id: id }).select("-password");

  if (!user) {
    throw new NotFoundError(`No user with id:${id} found`);
  }

  const tokenUser = createTokenUser(user);
  res.status(200).json({ user: tokenUser });
};

const getCurrentUser = async (req, res) => {
  res.status(200).json({ user: req.user });
};

const updateUser = async (req, res) => {
  const { bio, username, socials } = req.body;

  const updatedProfile = await User.findOneAndUpdate(
    { _id: req.user.userId },
    {
      bio,
      username,
      socials,
    },
    { new: true }
  ).select("-password");

  res.status(200).json(updatedProfile);
};

const uploadProfilePic = async (req, res) => {
  const userId = req.user.userId;

  const user = await User.findById(userId);

  // If the user has an existing profile picture (and it's not the default one), delete it from Cloudinary
  if (user.cloudinaryPublicId) {
    await cloudinary.uploader.destroy(user.cloudinaryPublicId);
  }

  const uploadResult = await cloudinary.uploader.upload(
    req.files.image.tempFilePath,
    {
      use_filename: true,
      folder: "profile-picture",
    }
  );
  fs.unlinkSync(req.files.image.tempFilePath);

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      profilePicture: uploadResult.secure_url,
      cloudinaryPublicId: uploadResult.public_id,
    },
    { new: true, runValidators: true }
  ).select("-password");

  return res.status(200).json({ user: updatedUser });
};

const updateUserPassword = async (req, res) => {
  res.status(200).json({ users: "users" });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  getCurrentUser,
  updateUser,
  updateUserPassword,
  uploadProfilePic,
};
