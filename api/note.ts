import {
  pathParse,
  Req,
  Res,
  Router,
} from "https://deno.land/x/denorest@v2.1/mod.ts";
import { jsonCheck, Tags } from "../middleware/mod.ts";
import { notes, tokens, users } from "../model/mod.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.30.0/mod.ts";

let r = new Router();
type ResData = Record<any, any>;

// new note handler
r.all("/new", async (req: Req, res: Res) => {
  let token = req.headers?.get("token");

  if (!token) {
    res.reply = JSON.stringify({
      status: false,
      api: "token not found",
    });
    return;
  }

  let u = await tokens.findOne({ token });

  if (!u) {
    res.reply = JSON.stringify({
      status: false,
      api: "login error",
    });
    return;
  }

  let body = await jsonCheck(req, ["title", "html", "tags", "visible"]);
  if (body.invalid) {
    res.reply = JSON.stringify({
      status: false,
      api: "field error",
    });
    return;
  }

  // add note
  let resData: ResData = {};
  let tags = new Tags(body.tags);
  await notes.insertOne({
    username: u.username,
    title: body.title,
    date: new Date(),
    html: body.html,
    tags: tags.get(),
    visible: body.visible === "true",
  }).then((e) => {
    resData.status = true;
    resData.massage = "note add successful";
    resData.id = e.toString();
  }).catch((e) => {
    resData.status = false;
    resData.exist = true;
    resData.massage = "note add error";
  });

  res.reply = JSON.stringify(resData);
});

// read note handler
r.all("/read/:id", async (req: Req, res: Res) => {
  let p = pathParse(req);
  let id = p.params.id;

  let token = req.headers?.get("token");

  if (!token) {
    res.reply = JSON.stringify({
      status: false,
      api: "token not found",
    });
    return;
  }

  let u = await tokens.findOne({ token });

  if (!u) {
    res.reply = JSON.stringify({
      status: false,
      api: "login error",
    });
    return;
  }

  let i;
  try {
    i = new ObjectId(id);
  } catch (e) {
    res.reply = JSON.stringify({
      status: false,
      api: "id error",
    });
    return;
  }

  let note = await notes.findOne({
    _id: i,
  });

  
  let user = await users.findOne({
    username: note?.username
  });
  
  if (!user) {
    res.reply = JSON.stringify({
      status: false,
      api: "server error",
    });
    return;
  }

  let resData: ResData = {};
  if (note) {
    if (note.visible) {
      if (note.username === u.username) {
        resData.status = true;
        resData.massage = "note found successful";
        resData.title = note.title;
        resData.html = note.html;
        resData.tags = note.tags;
        resData.edit = true;
        resData.fullname = user.fullname;
        resData.visible = note.visible;
      } else {
        resData.status = false;
        resData.massage = "not found";
      }
    } else {
      resData.status = true;
      resData.massage = "note found successful";
      resData.title = note.title;
      resData.html = note.html;
      resData.tags = note.tags;
      resData.edit = note.username === u.username;
      resData.fullname = user.fullname;
      resData.visible = note.visible;
    }
  } else {
    resData.status = false;
    resData.massage = "not found";
  }

  res.reply = JSON.stringify(resData);
});

// edit note handler
r.all("/edit/:id", async (req: Req, res: Res) => {
  let p = pathParse(req);
  let id = p.params.id;

  let token = req.headers?.get("token");

  if (!token) {
    res.reply = JSON.stringify({
      status: false,
      api: "token not found",
    });
    return;
  }

  let u = await tokens.findOne({ token });

  if (!u) {
    res.reply = JSON.stringify({
      status: false,
      api: "login error",
    });
    return;
  }

  let i;
  try {
    i = new ObjectId(id);
  } catch (e) {
    res.reply = JSON.stringify({
      status: false,
      api: "id error",
    });
    return;
  }

  let note = await notes.findOne({
    _id: i,
    username: u.username,
  });

  if (!note) {
    res.reply = JSON.stringify({
      status: false,
      api: "post not found",
    });
    return;
  }

  let body = await jsonCheck(req, ["title", "html", "tags", "visible"]);
  if (body.invalid) {
    res.reply = JSON.stringify({
      status: false,
      api: "field error",
    });
    return;
  }

  // console.log(body);

  // update note
  let resData: ResData = {};
  let tags = new Tags(body.tags);

  const { matchedCount, modifiedCount, upsertedId } = await notes.updateOne(
    { _id: { $eq: i } },
    {
      $set: {
        title: body.title,
        html: body.html,
        tags: tags.get(),
        visible: body.visible === "true",
      },
    },
  );

  if (matchedCount) {
    resData.status = true;
    resData.massage = "update successful";
  } else {
    resData.status = false;
    resData.massage = "server error";
  }

  res.reply = JSON.stringify(resData);
});

export default r;
