const commentsRouter = require('express').Router();
const {
  patchComment,
  deleteComment
} = require('../controllers/comments-controllers');
const { server405s } = require('../errors');

commentsRouter
  .route('/:comment_id')
  .patch(patchComment)
  .delete(deleteComment)
  .all(server405s);

module.exports = commentsRouter;
