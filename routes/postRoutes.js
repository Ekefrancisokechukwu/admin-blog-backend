const express = require("express");
const router = express.Router();

const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/auth");

const {
  createPost,
  getAllPosts,
  getSinglePost,
  updatePost,
  deletePost,
  getCurrentUserPosts,
} = require("../controllers/postsContoller");

router
  .route("/")
  .post(authenticateUser, authorizePermissions(["author", "admin"]), createPost)
  .get(getAllPosts);

router.route("/my-posts").get(authenticateUser, getCurrentUserPosts);

router
  .route("/:id")
  .get(getSinglePost)
  .patch(authenticateUser, authorizePermissions("author"), updatePost)
  .delete(
    authenticateUser,
    authorizePermissions(["author", "admin"]),
    deletePost
  );

module.exports = router;
