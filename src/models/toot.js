const db = require('../db');
const Collection = require('./collection');
const Record = require('./record');
const redis = require('../redis')

class Toot extends Record {
  static tableName() {
    return "toots";
  }
  static columns() {
    return ["user_id", "body", "created_at"]
  }
  static create(user, body) {
    let current_time = Date.now();
    return new this({ user_id: user.data.id, body: body, create_at: current_time }).save();
  }
  static all_toots(){
    return (new Collection(Toot));
  }
  user() {
    const User = require('./user');
    return User.find(this.data.user_id);
    // toot.user().data.nickname
  }
  insert() {//絶対保存されたと・・・promiseをwrapする
    let insertPromise = super.insert()
    return new Promise((resolve, reject) => {//成功した時にradisのpublishを行う
      insertPromise.then((toot) => {
        let conn = redis()
        conn.publish('local',
          JSON.stringify({
            action: "create", toot: this.asJSON()
          })
        );
        resolve(toot);
      }).catch((error) => {
        reject(error);
      })
    });
  }
  destroy() {
    return new Promise((resolve, reject) => {
      let id = this.data.id
      super.destroy().then((toot) => {
        let conn = redis()
        conn.publish('local',
          JSON.stringify({
            action: "delete", toot: { id: id }
          })
        );
        resolve(toot);
      }).catch((error) => {
        reject(error);
      })
    })
  }
}
module.exports = Toot;