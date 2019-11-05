exports.server500s = (err, res, req, next) => {
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
