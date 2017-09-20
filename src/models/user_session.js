const UUID = require('uuid/v4');
const Record = require('./record');

class UserSession extends Record {
  static tableName() {
    return "user_sessions";
  }
  static columns() {
    return ["user_id"];
  }
  static insertColumns() {
    return ["id", "user_id"];
  }
  static create(user) {
    return new this({ user_id: user.data.id }).save();
  }
  insert() {
    this.data.id = UUID();
    return super.insert();
  }
}

module.exports = UserSession;