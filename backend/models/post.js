const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  postTitle: { type: String, required: true },
  postContent: { type: String, required: true },
  imagePath: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

module.exports = mongoose.model('Post', postSchema);
