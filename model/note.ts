import { db, ObjectId } from "../middleware/mod.ts";

interface NoteSchema {
  _id: ObjectId;
  username: string;
  title: string;
  date: Date;
  html: string;
  tags: string[];
  visible: boolean;
}

let notes = db.collection<NoteSchema>("notes");
//users.createIndexes({indexes: [{name: "_username", key: {"username": 1}, unique: true}]})
export default notes
