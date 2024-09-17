const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getCurrentUser,
  getSingleUser,
  updateUser,
  updateUserPassword,
  uploadProfilePic,
} = require("../controllers/usersController");

const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/auth");

router
  .route("/")
  .get(authenticateUser, authorizePermissions(["admin"]), getAllUsers);

router.route("/showMe").get(authenticateUser, getCurrentUser);

router
  .route("/updateUser")
  .patch(authenticateUser, authorizePermissions(["author"]), updateUser);

router
  .route("/upload-profile-picture")
  .post(authenticateUser, authorizePermissions(["author"]), uploadProfilePic);

router.route("/:id").get(authenticateUser, getSingleUser);

module.exports = router;
