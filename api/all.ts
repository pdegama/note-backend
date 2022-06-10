import { Req, Res, Router } from "https://deno.land/x/denorest@v2.1/mod.ts";
import { jsonCheck, uuid } from "../middleware/mod.ts";
import { tokens, notes } from "../model/mod.ts";

let r = new Router();
type ResData = Record<any, any>;

r.all("/", async (req: Req, res: Res) => {
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

  let n = await notes.find({
    username: u.username
  }).sort({date: -1}).toArray()

  let resData: ResData = {
    status: true,
    massage: "fetch successful",
    data: n
  };
  res.reply = JSON.stringify(resData);
})

r.all("/search", async (req: Req, res: Res) => {
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

  let body = await jsonCheck(req, ["query"]);
  if (body.invalid) {
    res.reply = JSON.stringify({
      status: false,
      api: "field error",
    });
    return;
  }

  let n = await notes.find({
    username: u.username,
    title: {$regex: new RegExp(body.query, "i")}
  }).sort({date: -1}).toArray()

  let resData: ResData = {
    status: true,
    massage: "fetch successful",
    data: n
  };
  res.reply = JSON.stringify(resData);
})

export default r;
