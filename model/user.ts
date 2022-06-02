import { db, ObjectId } from "../middleware/mod.ts";

interface UserSchema {
  _id: ObjectId;
  fullname: String;
  username: string;
  email?: string;
  password: string;
  phone?: String;
}

let users = db.collection<UserSchema>("users");
users.createIndexes({indexes: [{name: "_username", key: {"username": 1}, unique: true}]})
export default users
