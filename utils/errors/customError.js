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
      // result.message = `${err.details[0].context.label}를 입력하세요`;
      result.message = `값를 입력하세요`;
      return next(result);

    case 'object.unknown':
      result.label = err.details[0].path[0];
      result.message = `허용되지 않은 값입니다`;
      return next(result);

    case 'string.email':
      result.label = err.details[0].context.label;
      // result.message = `${err.details[0].context.value}는 유효하지 않은 이메일입니다`;
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
      // result.message = `${err.details[0].context.label}는 숫자만 입력 가능합니다`;
      result.message = `숫자만 입력 가능합니다`;
      return next(result);

    case 'boolean.base':
      result.label = err.details[0].context.label;
      // result.message = `${err.details[0].context.label}는 Boolean만 입력 가능합니다.`;
      result.message = `true/false만 입력 가능합니다.`;
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
  validError,
  firebaseError,
  customError,
};
