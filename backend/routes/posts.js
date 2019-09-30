const express = require('express');
const Post = require('../models/post');

const router = express.Router();

router.get('/:id', (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  });
});

router.put('/:id', (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    postTitle: req.body.postTitle,
    postContent: req.body.postContent
  });

  Post.updateOne({ _id: req.params.id }, post).then(result => {
    res.status(200).json({ message: 'Update sucessful!' });
  })
});

router.post('', (req, res, next) => {
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

router.get('', (req, res, next) => {
  Post.find()
    .then((documents) => {
      res.status(200).json({
        message: 'Post fetched succesfully',
        posts: documents
      });
    });
});

router.delete("/:id", (req, res, next) => {
  Post.deleteOne({ _id: req.params.id })
    .then(result => {
      res.status(200).json({ message: 'Post deleted' });
    });
});


module.exports = router;
