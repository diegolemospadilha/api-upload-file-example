const routes = require("express").Router();
const multer = require("multer");
const multerConfig = require("./config/multer");
const Post = require("./models/Post");

routes.get("/posts", async (req, res) => {
  const posts = await Post.find({});
  if (!posts.length) {
    return res.status(204).json({});
  } else {
    return res.json(posts);
  }
});
routes.post("/posts", multer(multerConfig).single("file"), async (req, res) => {
  const { originalname: name, size, key, location: url = "" } = req.file;

  const post = await Post.create({
    name,
    size,
    key,
    url
  });

  return res.json(post);
});

routes.delete("/posts/:id", async (req, res) => {
  const post = await Post.findById(req.params.id);
  await post.remove();
  return res.json({ message: "Arquivo deletado com sucesso" });
});

module.exports = routes;
