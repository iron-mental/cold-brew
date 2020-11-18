const authError = (next, err) => {
  const result = {
    result: false,
    type: 'auth-error',
    label: err.message,
  };

  switch (err.message) {
    case 'jwt malformed':
      result.message = `토큰 형식이 잘못되었습니다`;
      return next(result);

    case 'invalid signature':
      result.message = `서명이 올바르지 않습니다`;
      return next(result);

    case 'jwt signature is required':
      result.message = `서명이 필요합니다`;
      return next(result);

    case 'jwt expired':
      result.message = `만료된 토큰입니다`;
      return next(result);

    case 'jwt not exist':
      result.message = `토큰이 입력되지 않았습니다`;
      return next(result);

    default:
      result.message = `기타 에러`;
      return next(result);
  }
};

const validError = (next, err) => {
  const result = {
    result: false,
    type: 'validation-error',
  };

  switch (err.details[0].type) {
    case 'object.min':
      result.label = 'too few value';
      result.message = `최소 ${err.details[0].context.limit}개 이상의 값을 입력하세요`;
      return next(result);

    case 'any.required':
      result.label = err.details[0].path[0];
      result.message = `값를 입력하세요`;
      return next(result);

    case 'object.unknown':
      result.label = err.details[0].path[0];
      result.message = `허용되지 않은 값입니다`;
      return next(result);

    case 'string.empty':
      result.label = err.details[0].context.label;
      result.message = `공백은 허용되지 않습니다`;
      return next(result);

    case 'string.email':
      result.label = err.details[0].context.label;
      result.message = `유효하지 않은 이메일입니다`;
      return next(result);

    case 'string.max':
      result.label = err.details[0].context.label;
      result.message = `길이는 ${err.details[0].context.limit} 보다 짧아야 합니다`;
      return next(result);

    case 'string.min':
      result.label = err.details[0].context.label;
      result.message = `길이는 ${err.details[0].context.limit} 보다 길어야 합니다`;
      return next(result);

    case 'number.base':
      result.label = err.details[0].context.label;
      result.message = `숫자만 입력 가능합니다`;
      return next(result);

    case 'boolean.base':
      result.label = err.details[0].context.label;
      result.message = `true/false만 입력 가능합니다`;
      return next(result);
  }
};

const firebaseError = (err) => {
  const result = {
    result: false,
    type: 'firebase-error',
  };

  if (err.code === 'auth/user-not-found') {
    result.status = 404;
    result.message = '조회된 사용자가 없습니다';
    throw result;
  }

  if (err.code === 'auth/wrong-password') {
    result.status = 400;
    result.message = '비밀번호를 잘못 입력하였습니다';
    throw result;
  }

  if (err.code === 'auth/too-many-requests') {
    result.status = 400;
    result.message = '잦은 로그인 시도로 인해 계정이 비활성화 되었습니다. 잠시 후 다시 시도하세요. ';
    throw result;
  }

  result.status = 500;
  result.message = err.message;
  throw result;
};

const customError = (status, message) => {
  const result = {
    result: false,
    message,
    status,
  };

  return result;
};

module.exports = {
  authError,
  validError,
  firebaseError,
  customError,
};
