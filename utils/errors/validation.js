class ValidError extends Error {
  constructor(err) {
    super();
    this.result = false;
    this.type = 'validation-error';
    this.label = err.label;
    this.message = err.message;
  }
}

validError = (err) => {
  switch (err.details[0].type) {
    case 'object.min':
      err.label = 'too few value';
      err.message = `최소 ${err.details[0].context.limit}개 이상의 값을 입력하세요`;
      return new ValidError(err);

    case 'any.required':
      err.label = err.details[0].path[0];
      err.message = `값을 입력하세요`;
      return new ValidError(err);

    case 'object.unknown':
      err.label = err.details[0].path[0];
      err.message = `허용되지 않은 값입니다`;
      return new ValidError(err);

    case 'string.empty':
      err.label = err.details[0].context.label;
      err.message = `공백은 허용되지 않습니다`;
      return new ValidError(err);

    case 'string.email':
      err.label = err.details[0].context.label;
      err.message = `유효하지 않은 이메일입니다`;
      return new ValidError(err);

    case 'string.max':
      err.label = err.details[0].context.label;
      err.message = `길이는 ${err.details[0].context.limit} 보다 짧아야 합니다`;
      return new ValidError(err);

    case 'string.min':
      err.label = err.details[0].context.label;
      err.message = `길이는 ${err.details[0].context.limit} 보다 길어야 합니다`;
      return new ValidError(err);

    case 'number.base':
      err.label = err.details[0].context.label;
      err.message = `숫자만 입력 가능합니다`;
      return new ValidError(err);

    case 'boolean.base':
      err.label = err.details[0].context.label;
      err.message = `true/false만 입력 가능합니다`;
      return new ValidError(err);

    case 'uri.invalidUri':
      err.label = err.details[0].context.label;
      err.message = `유효하지 않은 주소입니다`;
      return new ValidError(err);

    default:
      err.label = err.details[0].context.label;
      err.message = `유효성검사 에러`;
      return new ValidError(err);
  }
};

const validErrorHandler = (err, req, res, next) => {
  if (err instanceof ValidError) {
    return res.status(422).json(err);
  }
  return next(err);
};

module.exports = {
  validError,
  validErrorHandler,
};
