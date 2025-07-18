const express = require('express');
const router = express.Router();
const commentsController = require('../controllers/comments');
const verifyToken = require('../middleware/verifyToken');

router.post('/', verifyToken, commentsController.createComment);
router.get('/:movieId', commentsController.getCommentsByMovie);
router.put('/', verifyToken, commentsController.updateComment);


module.exports = router;
