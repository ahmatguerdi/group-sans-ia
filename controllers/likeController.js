const Like = require("../models/likeModel");

// const likePost = (req, res) => {
//   Like.create(req.body)
//     .then((result) => res.status(200).json({ result }))
//     .catch((error) => res.status(500).json({ msg: error }));
// };

const likePost = (req, res) => {
    Like.findOneAndUpdate({ user_id: req.params.id }, req.body, {
      new: true,
      runValidators: true,
    })
      .then((result) => res.status(200).json({msg: "Vous avez liké avec succès!" }))
      .catch((error) => res.status(404).json({ msg: "Like not found" }));
  };

const deleteLike = (req, res) => {
  Like.findOneAndDelete({ user_id: req.params.id })
    .then((result) => res.status(200).json({ result: "Dommage le like est rétiré!" }))
    .catch((error) => res.status(404).json({ msg: "Like not found" }));
};

module.exports = { likePost, deleteLike };
