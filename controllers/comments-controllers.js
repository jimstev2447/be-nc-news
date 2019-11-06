const {
  createComment,
  fetchAllCommentsByArticleId
} = require('../models/comments-models');
exports.postCommentByArticleId = (req, res, next) => {
  const articleId = req.params;
  const comment = req.body;
  createComment(articleId, comment)
    .then(comment => {
      res.status(200).send({ comment });
    })
    .catch(next);
};

exports.getAllCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const sorted_by = req.query.sorted_by;
  const order_by = req.query.order_by;

  fetchAllCommentsByArticleId(article_id, sorted_by, order_by)
    .then(comments => {
      res.status(200).send({ comments });
    })
    .catch(next);
};
