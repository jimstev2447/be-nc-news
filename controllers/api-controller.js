exports.sendDescription = (req, res, next) => {
  res.status(200).send({
    msg: {
      //API description of avaliable endpoints
      '/api/topics': { GET: 'Get topics returns all topics' },
      '/api/users/:username': { GET: 'returns user by username' },
      '/api/articles': {
        GET:
          'returns array of all articles, takes: author, topic, sort_by and order_by as queries, sort by defaults to created_at, order_by defaults to desc'
      },
      '/api/articles/:article_id': {
        GET: 'returns article of specific _id',
        PATCH:
          'increases the vote count of the specified article must take a object in the body {inc_votes:<voteCount>}'
      },
      '/api/articles/:article_id/comments': {
        GET: 'returns all comments for specified article',
        POST:
          'body must contain {username:<username>, body:<body> returns new comment, article_id refrences the relationship to articles, username becomes author and unique commen_id}'
      },
      '/api/comments/:comment_id': {
        PATCH:
          'must contain body of {inc_votes:<increase ammount>} returns comment with votes increased by requested ammount',
        DELETE: 'deletes requested comment'
      }
    }
  });
};
