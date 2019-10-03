const Post = require('../models/post');


exports.addPost = (req, res, next) => {
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

}

exports.getPosts = (req, res, next) => {
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
      res.status(500).json({ message: 'Fetiching posts Failed' });
    });
};

exports.deletePost = (req, res, next) => {
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
};

exports.updatePosts = (req, res, next) => {
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
};

exports.getPostById =  (req, res, next) => {
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
};
