const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const config = require("./app/config");
const blogs = require("./blogs");

// const router = require("./app/router");
// router(app);

const app = express();

app.use(bodyParser.json());

app.set("port", config.port);

app.listen(app.get("port"), (err) => {
  if (err) console.log(error);
  console.log(`listening on ${app.get("port")}...`);
  const db = mongoose.connect(config.db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  mongoose.connection.on("connected", () => {
    console.log(`Mongo db connected ${db}`);
  });
});

app.get("/", (req, res) => {
  res.send("The blog API goes here");
});

// GET ALL BLOG POSTS
app.get("/api/blogpost", (req, res) => {
  res.send(blogs);
});

// GET A SINGLE BLOG POST WITH ID
app.get("/api/blogpost/:id", (req, res) => {
  const book = blogs.find((c) => c.id === parseInt(req.params.id));
  if (!blogs)
    res
      .status(404)
      .send(
        '<h2 style="font-family: Malgun Gothic; color: darkred;">Ooops... Cant find what you are looking for!</h2>'
      );
  res.send(book);
});

// CREATE A BLOG POST WITH ID
app.post("/api/blogpost", (req, res) => {
  const { error } = req.body;
  if (error) {
    res
      .status(404)
      .send(
        '<h2 style="font-family: Malgun Gothic; color: darkred;">Ooops... Cant find what you are looking for!</h2>'
      );
  } else {
    const blog = {
      id: blogs.length + 1,
      title: req.body.title,
      body: req.body.body,
      description: req.body.description,
      image: req.body.image,
      date: req.body.date,
    };
    blogs.push(blog);
    res.send(blog);
  }
});

// UPDATE BLOG POST REQUEST HANDLERS
app.put("/api/blogpost/:id", (req, res) => {
  const blog = blogs.find((c) => c.id === parseInt(req.params.id));
  if (!blog)
    res
      .status(404)
      .send(
        '<h2 style="font-family: Malgun Gothic; color: darkred;">Not Found!! </h2>'
      );

  const { error } = validateBook(req.body); //validate book is a function that checks fo whether the book is present or not
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  blog.title = req.body.title;
  blog.description = req.body.description;
  blog.image = req.body.image;
  blog.body = req.body.body;

  res.send(blog);
});
