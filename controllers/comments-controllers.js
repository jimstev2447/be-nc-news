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
  const { sort_by } = req.query;
  const { order } = req.query;

  const promises = [
    fetchAllCommentsByArticleId(article_id, sort_by, order),
    checkArticleId(article_id)
  ];
  Promise.all(promises)
    .then(([comments]) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.patchComment = (req, res, next) => {
  const comment_id = req.params.comment_id;
  const votes = req.body.inc_votes;
  updateComment(comment_id, votes)
    .then(comment => {
      res.status(200).send({ comment });
    })
    .catch(next);
};

exports.deleteComment = (req, res, next) => {
  const comment_id = req.params.comment_id;
  return Promise.all([removeComment(comment_id), checkComment(comment_id)])
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};
