const {
  createComment,
  fetchAllCommentsByArticleId
} = require('../models/comments-models');
const { checkArticleId } = require('../models/articles-models');
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

  const promises = [
    fetchAllCommentsByArticleId(article_id, sorted_by, order_by),
    checkArticleId(article_id)
  ];
  Promise.all(promises)
    .then(([comments]) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};
