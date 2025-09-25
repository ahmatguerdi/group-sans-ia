const express = require("express");
const routerLike = express.Router();

const { likePost, deleteLike } = require("../controllers/likeController");


// POST    /api/posts/:id/like
// DELETE  /api/posts/:id/like

routerLike.post("/:id", likePost);
routerLike.delete("/:id", deleteLike);

module.exports = routerLike;
