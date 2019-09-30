const express = require('express');
const bodyParser = require('body-parser');
const config = require('../utils/config');
const Post = require('./models/post');
const mongoose = require('mongoose');
const app = express();

console.log(config);


mongoose.connect(config.DB.DB_URL)
  .then(() => {
    console.log('DB connected');
  })
  .catch((err) => {
    console.log('Error connecting DB: ' + err.message);
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Acept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, PUT, OPTIONS')
  next();
});

app.post('/api/posts', (req, res, next) => {
  const post = new Post({
    postTitle: req.body.postTitle,
    postContent: req.body.postContent
  });

  post.save().then(createdPost => {
    res.status(201).json({
      message: 'Post save succesfully',
      id: createdPost._id
    });
  });

})

app.get('/api/posts', (req, res, next) => {
  Post.find()
    .then((documents) => {
      res.status(200).json({
        message: 'Post fetched succesfully',
        posts: documents
      });
    });
});

app.delete("/api/posts/:id", (req, res, next) => {
  console.log(req.params.id);
  Post.deleteOne({ _id: req.params.id })
    .then(result => {
      console.log(result);
      res.status(200).json({ message: 'Post deleted' });
    });
});

module.exports = app;
