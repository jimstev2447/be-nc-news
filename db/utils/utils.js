exports.formatDates = list => {
  if (!list) return [];
  return list.map(object => {
    let newObj = { ...object };
    newObj.created_at = new Date(object.created_at);
    return newObj;
  });
};

exports.makeRefObj = list => {
  return list.reduce((newRefObject, article) => {
    newRefObject[article.title] = article.article_id;
    return newRefObject;
  }, {});
};

exports.formatComments = (comments, articleRef) => {
  if (!comments) return [];
  return comments.map(({ belongs_to, created_by, created_at, ...article }) => {
    newArticle = { ...article };
    newArticle.author = created_by;
    newArticle.article_id = articleRef[belongs_to];
    newArticle.created_at = new Date(created_at);
    return newArticle;
  });
};
