const { createComment } = require('../models/comments-models');
exports.postCommentByArticleId = (req, res, next) => {
  const articleId = req.params;
  const comment = req.body;
  createComment(articleId, comment)
    .then(comment => {
      res.status(200).send({ comment });
    })
    .catch(next);
};
