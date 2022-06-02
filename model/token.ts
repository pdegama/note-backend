import { db, ObjectId } from "../middleware/mod.ts";

interface TokenSchema {
  _id: ObjectId;
  token: string;
  username: string;
}

let tokens = db.collection<TokenSchema>("tokens");
tokens.createIndexes({indexes: [{name: "_token", key: {"token": 1}, unique: true}]})
export default tokens
