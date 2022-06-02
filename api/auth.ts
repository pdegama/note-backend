import { Req, Res, Router } from "https://deno.land/x/denorest@v2.1/mod.ts";
import {jsonCheck, uuid} from "../middleware/mod.ts"
import { token, users } from "../model/mod.ts";

let r = new Router();
type ResData = Record<any, any>;

// auth handler
r.all("/", (req: Req, res: Res) => {
  res.reply = JSON.stringify({
    status: true,
    api: "auth",
  });
});

// login handler
r.all("/login", async (req: Req, res: Res) => {
  let body = await jsonCheck(req, ["username", "password"]);
  if (body.invalid) {
    res.reply = JSON.stringify({
      status: false,
      api: "field error",
    });
    return;
  }

  let u = await users.findOne({
    username: body.username.toLowerCase(),
    password: body.password,
  });

  let resData: ResData = {};

  if (u) {
    let t = uuid.generate();

    resData.status = true;
    resData.massage = "Login Successfu!";
  } else {
    resData.status = false;
    resData.massage = "Username or Password is invalid!";
  }

  res.reply = JSON.stringify(resData);
});

// register handler
r.all("/register", async (req: Req, res: Res) => {
  let body = await jsonCheck(req, ["fullname", "username", "password"]);
  if (body.invalid) {
    res.reply = JSON.stringify({
      status: false,
      api: "field error",
    });
    return;
  }

  let resData: ResData = {};

  await users.insertOne({
    fullname: body.fullname,
    username: body.username.toLowerCase(),
    password: body.password,
  }).then((e) => {
    resData.status = true;
    resData.massage = "register successful";
  }).catch((e) => {
    resData.status = false;
    resData.exist = true;
    resData.massage = "username already exist";
  });

  res.reply = JSON.stringify(resData);
});

export default r;
