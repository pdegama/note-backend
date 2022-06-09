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

r.all("/get", async (req: Req, res: Res) => {
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

  let user = await users.findOne({
    username: u.username,
  });

  if (!user) {
    res.reply = JSON.stringify({
      status: false,
      api: "server error",
    });
    return;
  }

  let resData: ResData = {};
  resData.status = true;
  resData.massage = "setting get seccessful";
  resData.username = user.username;
  resData.fullname = user.fullname;

  res.reply = JSON.stringify(resData);
});

r.all("/name", async (req: Req, res: Res) => {
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

  let body = await jsonCheck(req, ["fullname"]);
  if (body.invalid) {
    res.reply = JSON.stringify({
      status: false,
      api: "field error",
    });
    return;
  }

  const { matchedCount, modifiedCount, upsertedId } = await users.updateOne(
    { username: { $eq: u.username } },
    {
      $set: {
        fullname: body.fullname,
      },
    },
  );

  let resData: ResData = {};

  if (matchedCount) {
    resData.status = true;
    resData.massage = "update successful";
  } else {
    resData.status = false;
    resData.massage = "server error";
  }
  res.reply = JSON.stringify(resData);
});

r.all("/pass", async (req: Req, res: Res) => {
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

  let body = await jsonCheck(req, ["curpass", "newpass"]);
  if (body.invalid) {
    res.reply = JSON.stringify({
      status: false,
      api: "field error",
    });
    return;
  }

  let user = await users.findOne({
    username: u.username
  })

  if (!user) {
    res.reply = JSON.stringify({
      status: false,
      api: "server error",
    });
    return;
  }

  //console.log(user);
  
  if (user.password !== body.curpass) {
    res.reply = JSON.stringify({
      status: false,
      curpass: true,
      api: "current pass not match",
    });
    return;
  }

  const { matchedCount, modifiedCount, upsertedId } = await users.updateOne(
    { username: { $eq: u.username } },
    {
      $set: {
        password: body.newpass,
      },
    },
  );

  let resData: ResData = {};

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
