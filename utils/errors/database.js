class DatabaseError extends Error {
  constructor(err) {
    super();
    this.result = false;
    this.type = 'database-error';
    this.message = err.sqlMessage;
  }
}

const databaseError = (err) => {
  return new DatabaseError(err);
};

module.exports = {
  DatabaseError,
  databaseError,
};
