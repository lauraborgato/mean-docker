const express = require('express');
const extractFile = require('../middleware/file');
const checkAuth = require('./../middleware/check-auth');
const PostController = require('../controllers/post');

const router = express.Router();

router.get('/:id', PostController.getPostById);

router.put('/:id', checkAuth, extractFile, PostController.updatePosts);

router.post('', checkAuth, extractFile, PostController.addPost);

router.get('', PostController.getPosts);

router.delete("/:id", checkAuth, PostController.deletePost);


module.exports = router;
