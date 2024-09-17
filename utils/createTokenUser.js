const createTokenUser = (user) => {
  return {
    userName: user.username,
    email: user.email,
    role: user.role,
    userId: user._id,
    profilePicture: user.profilePicture,
    socials: user.socials,
    bio: user.bio,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

module.exports = createTokenUser;
