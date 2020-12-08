class FirebaseError extends Error {
  constructor(err) {
    super();
    this.result = false;
    this.type = 'auth-error';
    this.message = err.message;
  }
}

firebaseError = (err) => {
  switch (err.code) {
    case 'auth/user-not-found':
      err.status = 404;
      err.message = '조회된 사용자가 없습니다';
      return new FirebaseError(err);

    case 'auth/wrong-password':
      err.status = 400;
      err.message = '비밀번호를 잘못 입력하였습니다';
      return new FirebaseError(err);

    case 'auth/too-many-requests':
      err.status = 400;
      err.message = '잦은 로그인 시도로 인해 계정이 비활성화 되었습니다. 잠시 후 다시 시도하세요. ';
      return new FirebaseError(err);

    default:
      err.message = '인증 에러';
      return new FirebaseError(err);
  }
};
module.exports = {
  FirebaseError,
  firebaseError,
};