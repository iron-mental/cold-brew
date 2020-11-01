module.exports = (res, message, code = 200) => {
  let data = {
    result: code < 400 ? true : false,
    message,
  };
  return res.status(code).json(Object.assign({}, data));
};
