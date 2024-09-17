const { BadRequestError, NotFoundError } = require("../errors");
const Post = require("../models/Post");
const checkPermissions = require("../utils/checkPermissions");

const createPost = async (req, res) => {
  const { title, content, tags, categories, status } = req.body;

  if (!title || !content) {
    throw new BadRequestError("All fields are required: title, content, tags");
  }
  if (tags.length < 1) {
    throw new BadRequestError("Tags not supposed to be empty");
  }

  if (categories.length < 1) {
    throw new BadRequestError("Please provide at least one category");
  }

  const newPost = await Post.create({
    title,
    content,
    tags,
    categories,
    status: status || "draft",
    author: req.user.userId,
  });

  res.status(201).json({ newPost });
};

const getAllPosts = async (req, res) => {
  const { tags, category } = req.query;

  const posts = await Post.find({})
    .populate({
      path: "author",
      select: "username bio profilePicture",
    })
    .sort({ createdAt: -1 });

  res.status(200).json({ posts, count: posts.length });
};

const getSinglePost = async (req, res) => {
  const id = req.params.id;
  const post = await Post.findOne({ _id: id }).populate("author", "username");

  if (!post) {
    throw new NotFoundError(`Blog with Id : ${id} Not Found!.`);
  }

  res.status(200).json({ post });
};

const getCurrentUserPosts = async (req, res) => {
  const posts = await Post.find({ author: req.user.userId });
  res.status(200).json({ posts, count: posts.length });
};

const updatePost = async (req, res) => {
  const postId = req.params.id;
  const user = req.user;
  const { title, content, tags } = req.body;
  const post = await Post.findOne({ _id: postId });

  if (!post) {
    throw new NotFoundError("Blog not found");
  }

  checkPermissions(user, post.author);

  post.title = title;
  post.content = content;
  post.tags = tags;
  await post.save();

  res.status(201).json({ post });
};

const deletePost = async (req, res) => {
  const postId = req.params.id;
  const user = req.user;

  const post = await Post.findOne({ _id: postId });

  if (!post) {
    throw new NotFoundError("Blog not found");
  }
  checkPermissions(user, post.author);

  await post.deleteOne();

  res.status(200).json({ msg: "Blog deleted successfully" });
};

module.exports = {
  createPost,
  getAllPosts,
  getSinglePost,
  updatePost,
  deletePost,
  getCurrentUserPosts,
};
