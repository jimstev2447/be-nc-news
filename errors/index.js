exports.psql400s = (err, req, res, next) => {
  const codes = ['22P02', '42703', '23502'];
  if (codes.includes(err.code)) {
    res.status(400).send({ msg: 'bad request' });
  } else next(err);
};

exports.psql404s = (err, req, res, next) => {
  const codes = ['23503'];
  if (codes.includes(err.code)) {
    res.status(404).send({ msg: 'article not found' });
  } else next(err);
};

exports.customErrors = (err, req, res, next) => {
  if (err.msg) res.status(err.status).send({ msg: err.msg });
  else next(err);
};

exports.server500s = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: 'Server Error' });
};

//Error handling controllers

exports.server404s = (req, res, next) => {
  res.status(404).send({ msg: 'path not found' });
};

exports.server405s = (req, res, next) => {
  res.status(405).send({ msg: 'method not allowed' });
};
