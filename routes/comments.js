const express = require('express');
const router = express.Router();
const commentsController = require('../controllers/comments');
const verifyToken = require('../middleware/verifyToken');

router.post('/', verifyToken, commentsController.createComment);
router.get('/:movieId', commentsController.getCommentsByMovie);


module.exports = router;
