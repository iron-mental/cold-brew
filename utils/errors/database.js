class DatabaseError extends Error {
  constructor(err) {
    super();
    this.result = false;
    this.type = 'database-error';
    this.message = err.sqlMessage;
  }
}

const databaseError = (err) => {
  if (err.errno === 1451) {
    err.sqlMessage = '해당 사용자에게 종속되어있는 데이터가 존재합니다';
    return new DatabaseError(err);
  }

  if (err.errno === 1452) {
    err.sqlMessage = '조회된 사용자가 없습니다.';
    return new DatabaseError(err);
  }
};
module.exports = {
  DatabaseError,
  databaseError,
};
