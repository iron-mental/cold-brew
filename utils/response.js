module.exports = (res, code = 200, value) => {
  const response = {};

  response.result = code < 400 ? true : false;

  if (typeof value === 'object') {
    response.data = value;
  } else {
    response.message = value;
  }
  return res.status(code).json(response);
};
