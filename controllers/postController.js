const Post = require("../models/postsModel");

const getPosts = (req, res) => {
  Post.find({})
    .then((result) => res.status(200).json({ result }))
    .catch((error) => res.status(500).json({ msg: error }));
};

const createPost = (req, res) => {
  Post.create(req.body)
    .then((result) => res.status(200).json({ result }))
    .catch((error) => res.status(500).json({ msg: error }));
};

const updatePost = (req, res) => {
    Post.findOneAndUpdate({ user_id: req.params.id }, req.body, {
      new: true,
      runValidators: true,
    })
      .then((result) => res.status(200).json({ result }))
      .catch((error) => res.status(404).json({ msg: "Post not found" }));
  };

const deletePost = (req, res) => {
  Post.findOneAndDelete({ user_id: req.params.id })
    .then((result) => res.status(200).json({ result }))
    .catch((error) => res.status(404).json({ msg: "Post not found" }));
};



module.exports = { createPost, getPosts, updatePost, deletePost};
