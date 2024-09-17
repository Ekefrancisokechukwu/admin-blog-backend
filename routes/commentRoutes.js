const express = require("express");
const {
  createComment,
  getAllComments,
  deleteComment,
} = require("../controllers/commentsController");
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/auth");
const router = express.Router();

router
  .route("/")
  .post(
    authenticateUser,
    authorizePermissions(["author", "admin"]),
    createComment
  );
router.route("/").get(getAllComments);

router
  .route("/:id")
  .delete(
    authenticateUser,
    authorizePermissions(["author", "admin"]),
    deleteComment
  );

module.exports = router;
