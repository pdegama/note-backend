import {Router, Req, Res, pathParse} from "https://deno.land/x/denorest@v2.1/mod.ts";

let r = new Router()

// auth handler
r.all("/", (req: Req, res: Res) => {
  res.reply = JSON.stringify({
    status: true,
    api: "auth"
  })
})

// login handler
r.all("/login", (req: Req, res: Res) => {
  res.reply = JSON.stringify({
    status: true,
    api: "login"
  })
})

// register handler
r.all("/register", (req: Req, res: Res) => {
  res.reply = JSON.stringify({
    status: true,
    api: "register"
  })
})

export default r
