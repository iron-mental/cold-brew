const validError = (next, err) => {
  const result = {
    result: false,
    type: 'validation-error',
  };

  switch (err.details[0].type) {
    case 'object.min':
      result.label = 'too few value';
      result.message = `최소 ${err.details[0].context.limit}개 이상의 값을 입력하세요`;
      break;

    case 'any.required':
      result.label = err.details[0].path[0];
      result.message = `${err.details[0].context.label}를 입력하세요`;
      break;

    case 'string.email':
      result.label = err.details[0].context.label;
      // result.message = `${err.details[0].context.value}는 유효하지 않은 이메일입니다`;
      result.message = `유효하지 않은 이메일입니다`;
      break;
    case 'string.max':
      result.label = err.details[0].context.label;
      result.message = `길이는 ${err.details[0].context.limit} 보다 짧아야 합니다`;
      break;
    case 'string.min':
      result.label = err.details[0].context.label;
      result.message = `길이는 ${err.details[0].context.limit} 보다 길어야 합니다`;
      break;

    case 'number.base':
      result.label = err.details[0].context.label;
      // result.message = `${err.details[0].context.label}는 숫자만 입력 가능합니다`;
      result.message = `숫자만 입력 가능합니다`;
      break;

    case 'boolean.base':
      result.label = err.details[0].context.label;
      // result.message = `${err.details[0].context.label}는 Boolean만 입력 가능합니다.`;
      result.message = `true/false만 입력 가능합니다.`;
      break;
  }

  next(result);
};

module.exports = { validError };
