const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please provide username"],
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: [true, "Please provide email"],
      unique: true,
      validate: {
        validator: validator.isEmail,
        message: "Please provide valid email",
      },
    },
    password: {
      type: String,
      required: [true, "Please provide password"],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["admin", "author", "reader"],
      default: "reader",
    },
    profilePicture: {
      type: String,
      default: "default-pic.avif",
    },
    cloudinaryPublicId: { type: String, default: "" },
    bio: {
      type: String,
      maxlength: 300,
      default: "This is my bio",
    },
    socials: {
      twitter: {
        type: String,
        validate: {
          validator: validator.isURL,
          message: "Please provide valid Url",
        },
      },
      linkedin: {
        type: String,
        validate: {
          validator: validator.isURL,
          message: "Please provide valid Url",
        },
      },
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model("User", userSchema);
