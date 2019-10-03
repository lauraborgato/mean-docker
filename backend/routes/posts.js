const express = require('express');
const multer = require('multer');
const checkAuth = require('./../middleware/check-auth');
const Post = require('../models/post');

const router = express.Router();

const MIME_TYPE_MAPS = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAPS[file.mimetype];
    let error = new Error('Invalid mime Type');
    if (isValid) {
      error = null;
    }
    cb(error, 'backend/images');
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAPS[file.mimetype];
    cb(null, `${name}-${Date.now()}.${ext}`);
  }
});

router.get('/:id', (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  })
    .catch(error => {
      res.status(500).json({ message: 'Fetiching post Failed' });
    });
});

router.put('/:id', checkAuth, multer({ storage: storage }).single('postImage'), (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = `${req.protocol}://${req.get('host')}`;
    imagePath = `${url}/images/${req.file.filename}`;
  }
  const post = new Post({
    _id: req.body.id,
    postTitle: req.body.postTitle,
    postContent: req.body.postContent,
    imagePath: imagePath,
    userId: req.userData.userId
  });
  Post.updateOne({ _id: req.params.id, userId: req.userData.userId }, post).then(result => {
    if (result.n > 0) {
      res.status(200).json({ message: 'Update sucessful!', post: result });
    } else {
      res.status(401).json({ message: "Unauthorize user" });
    }
  })
    .catch(error => {
      res.status(500).json({ message: 'Update post failed' })
    })
});

router.post('', checkAuth, multer({ storage: storage }).single('postImage'), (req, res, next) => {
  const url = `${req.protocol}://${req.get('host')}`;
  const post = new Post({
    postTitle: req.body.postTitle,
    postContent: req.body.postContent,
    imagePath: `${url}/images/${req.file.filename}`,
    userId: req.userData.userId
  });
  post.save().then(createdPost => {
    res.status(201).json({
      message: 'Post save succesfully',
      post: {
        ...createdPost,
        id: createdPost._id
      }
    });
  })
    .catch(error => {
      res.status(500).json({
        message: 'Creating a post failed'
      })
    });

})

router.get('', (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  //optmize--
  if (pageSize && currentPage) {
    postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  postQuery
    .then(documents => {
      fetchedPosts = documents;
      return Post.countDocuments();
    })
    .then(count => {
      res.status(200).json({
        message: 'Post fetched succesfully',
        posts: fetchedPosts,
        amountPost: count
      });
    })
    .catch(error => {
      message: 'Fetching post failed'
    });
});

router.delete("/:id", checkAuth, (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, userId: req.userData.userId })
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({ message: 'Post deleted' });
      } else {
        res.status(401).json({ message: "Unauthorize user" });
      }
    })
    .catch(error => {
      res.status(500).json({ message: 'Post deletion failed' })
    });
});


module.exports = router;
