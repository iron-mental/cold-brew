class Chat {
  constructor(study_id, message, user_id = 0, nickname = '__SYSTEM__') {
    this.study_id = study_id;
    this.user_id = user_id;
    this.nickname = nickname;
    this.message = message;
    this.date = new Date().getTime();
  }
}
const getUserChat = ({ study_id, message, user_id, nickname }) => {
  return new Chat(study_id, message, user_id, nickname);
};

const getSystemChat = (study_id, message) => {
  return new Chat(study_id, message);
};

module.exports = {
  getUserChat,
  getSystemChat,
};
