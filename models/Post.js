const mongoose = require("mongoose");

const Post = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please Provide a post title"],
      trim: true,
      index: true,
    },
    content: {
      type: String,
      required: [true, "Please provide a content"],
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    tags: {
      type: [
        {
          type: String,
          lowercase: true,
          trim: true,
        },
      ],
      required: [true, "Please add a tag for easy filtering"],
      index: true,
    },
    categories: {
      type: [
        {
          type: String,
          lowercase: true,
          trim: true,
        },
      ],
      required: [true, "Please provide at least one category"],
      index: true,
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", Post);
