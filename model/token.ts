import { db, ObjectId } from "../middleware/mod.ts";

interface TokenSchema {
  _id: ObjectId;
  token: string;
  username: string;
}

let token = db.collection<TokenSchema>("tokens");
token.createIndexes({indexes: [{name: "_token", key: {"token": 1}, unique: true}]})
export default token
