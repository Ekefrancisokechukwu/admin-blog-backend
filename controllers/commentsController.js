const { NotFoundError } = require("../errors");
const Comment = require("../models/Comment");
const Post = require("../models/Post");
const checkPermissions = require("../utils/checkPermissions");

const createComment = async (req, res) => {
  const { content, post: postId } = req.body;

  const postExist = await Post.findOne({ _id: postId });

  if (!postExist) {
    throw new NotFoundError(`No Post with id : ${postId}`);
  }

  const comment = await Comment.create({
    content,
    author: req.user.userId,
    post: postId,
  });

  res.status(201).json(comment);
};

const getAllComments = async (req, res) => {
  const { postId } = req.body;
  const comments = await Comment.find({ post: postId }).populate({
    path: "author",
    select: "username profilePicture",
  });

  res.status(200).json(comments);
};

const deleteComment = async (req, res) => {
  const { id } = req.params;

  const comment = await Comment.findOne({ _id: id });

  if (!comment) {
    throw new NotFoundError(`No comment with id ${reviewId}`);
  }

  checkPermissions(req.user, comment.author);
  await comment.deleteOne();

  res.status(200).json({ msg: "comment Deleted!" });
};

module.exports = { createComment, getAllComments, deleteComment };
