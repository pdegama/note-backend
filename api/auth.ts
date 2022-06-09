import { Req, Res, Router } from "https://deno.land/x/denorest@v2.1/mod.ts";
import { jsonCheck, uuid } from "../middleware/mod.ts";
import { tokens, users } from "../model/mod.ts";

let r = new Router();
type ResData = Record<any, any>;

// auth handler
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

  res.reply = JSON.stringify({
    status: true,
    api: "login success",
    username: u.username,
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

  let username = body.username.toLowerCase();

  let u = await users.findOne({
    username: username,
    password: body.password,
  });

  let resData: ResData = {};

  if (u) {
    let token = uuid.generate();

    await tokens.insertOne({
      username,
      token,
    }).then((e) => {
      resData.status = true;
      resData.token = token;
      resData.massage = "Login Successfu!";
    }).catch((e) => {
      resData.status = false;
      resData.massage = "Server Error";
    });
  } else {
    resData.status = false;
    resData.massage = "Username or Password is invalid!";
  }

  res.reply = JSON.stringify(resData);
});

// logout handler
r.all("/logout", async (req: Req, res: Res) => {
  let token = req.headers?.get("token");

  if (!token) {
    res.reply = JSON.stringify({
      status: false,
      api: "token not found",
    });
    return;
  }

  await tokens.deleteOne({
    token,
  });

  res.reply = JSON.stringify({
    status: true,
    api: "logout success",
  });
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
