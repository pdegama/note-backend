import {
  Bson,
  MongoClient,
  ObjectId,
  Document
} from "https://deno.land/x/mongo@v0.30.0/mod.ts";

const client = new MongoClient();

// Connecting to a Local Database
await client.connect("mongodb://127.0.0.1:27017");
let db = client.database("note");

export type { ObjectId, Document };
export { db };
