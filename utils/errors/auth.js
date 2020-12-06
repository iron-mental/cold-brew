class AuthError extends Error {
  constructor(err) {
    super();
    this.result = false;
    this.type = 'auth-error';
    this.label = err.label;
    this.message = err.message;
  }
}

authError = (err) => {
  switch (err.message) {
    case 'jwt malformed':
      err.message = `토큰 형식이 잘못되었습니다`;
      return new AuthError(err);

    case 'invalid signature':
      err.message = `서명이 올바르지 않습니다`;
      return new AuthError(err);

    case 'jwt signature is required':
      err.message = `서명이 필요합니다`;
      return new AuthError(err);

    case 'jwt expired':
      err.message = `만료된 토큰입니다`;
      return new AuthError(err);

    case 'jwt not exist':
      err.message = `토큰이 입력되지 않았습니다`;
      return new AuthError(err);

    case 'permission error':
      err.message = `권한이 없습니다`;
      return new AuthError(err);

    default:
      err.message = `인증 에러`;
      return new AuthError(err);
  }
};

const authErrorHandler = (err, req, res, next) => {
  if (err instanceof AuthError) {
    return res.status(401).json(err);
  }
  return next(err);
};

module.exports = {
  authError,
  authErrorHandler,
};
