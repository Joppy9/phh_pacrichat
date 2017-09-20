const db = require('../db');
const Collection = require('./collection')

class Record {
  static collection() {
    return new Collection(this);
  }
  static tableName() {//静的メソッド
    throw new Error("You should override this method");
  }
  static columns() {
    throw new Error("You should override this method");
  }
  static updateColumns() {
    return this.columns();
  }
  static insertColumns() {
    return this.columns();
  }
  static find(id) {//fileでとってきたやつをぷろみすでかえす
    return new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM ?? `users` WHERE `id` = ? LIMIT 1;",
        [this.tableName(), id]
      ).then((result) => {
        let rows = result[0];
        let fields = result[1];
        if (rows.length < 1) {
          reject(new Error(`${this.name}(${id}) is not found`));
          return;
        }
        resolve(new this(rows[0]));
      }).catch((error) => {
        reject(error);
      })
    });
  }

  constructor(data) {
    this.data = {};//自分のデータに入れる
    this.constructor.columns().forEach((column) => {
      this.data[column] = data[column];
    });
    this.data.id = data.id
  }
  save() {
    if (this.data.id) {//データidが存在したら
      return this.update();//アップデート
    } else {
      return this.insert();//インサート
    }
  }
  update() {
    let sqlValues = [this.constructor.tableName()];
    let attributes = {};//attribute 属性
    this.constructor.updateColumns().forEach((column) => {
      attributes[column] = this.data[column]
    });
    sqlValues.push(attributes);
    sqlValues.push(this.data.id)
    return new Promise((resolve, reject) => {
      db.query(
        "UPDATE ?? SET ? WHERE `id` = ?",
        sqlValues
      ).then((result) => {
        resolve(this);
      }).catch((error) => {
        reject(error);
      })
    })
  }
  insert() {//Promiseオブジェクトを返す
    let sqlValues = [this.constructor.tableName()];//自分のテーブル名がわかる
    sqlValues.push(this.constructor.insertColumns());//じぶんのこんすとらたーのからむずをいれる
    let attributes = this.constructor.insertColumns().map((column) => {
      return this.data[column];
    });
    sqlValues.push(attributes);
    return new Promise((resolve, reject) => {//なにもなし
      db.query(
        "INSERT INTO ?? (??)VALUE(?);",
        sqlValues
      ).then((result) => {//hogehoge.query().then().catch()
        let info = result[0];
        let fields = result[1];
        if (this.data.id === undefined || this.data.id === null) {
          this.data.id = info.insertId;
        }
        resolve(this);
      }).catch((error) => {
        reject(error)
      })
    })
  }
  destroy() {
    return new Promise((resolve, reject) => {
      db.query(
        "DELETE FROM ?? WHERE `id` = ?",
        [this.constructor.tableName(), this.data.id]
      ).then(() => {
        this.data.id = null;
        resolve(this);
      }).catch((error) => {
        reject(error)
      });
    })
  }
  asJSON(){
    return this.data;
  }
  toJSON() {
    return JSON.stringify(this.asJSON());
  }
}
module.exports = Record;