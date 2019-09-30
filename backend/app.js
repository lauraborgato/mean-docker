const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Acept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, PUT, OPTIONS')
  next();
});

app.post('/api/posts', (req, res, next) => {
  const post = req.body;
  console.log(post);
  res.status(201).json({
    message: 'Post save succesfully'
  });
})

app.get('/api/posts', (req, res, next) => {
  const posts = [
    { id: "hjashjdh", postTitle: 'Fisrt post-server', postContent:'testing post-from-server'},
    { id: "sdasdad", postTitle: 'Second post-server', postContent:'testing post-from-server'},
    { id: "JHKJNMN", postTitle: 'third post-server', postContent:'testing post-from-server'}
  ]
  res.status(200).json({
    message: 'Post fetched succesfully',
    posts: posts
  });
});

module.exports = app;
