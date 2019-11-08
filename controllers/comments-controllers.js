const {
  createComment,
  fetchAllCommentsByArticleId,
  updateComment,
  removeComment,
  checkComment
} = require('../models/comments-models');

const { checkArticleId } = require('../models/articles-models');

exports.postCommentByArticleId = (req, res, next) => {
  const articleId = req.params;
  const comment = req.body;
  createComment(articleId, comment)
    .then(comment => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.getAllCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { query } = req;

  const promises = [
    fetchAllCommentsByArticleId(article_id, query),
    checkArticleId(article_id)
  ];
  Promise.all(promises)
    .then(([comments]) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.patchComment = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  updateComment(comment_id, inc_votes)
    .then(comment => {
      res.status(200).send({ comment });
    })
    .catch(next);
};

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  return Promise.all([removeComment(comment_id), checkComment(comment_id)])
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};
