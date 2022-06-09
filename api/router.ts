import {Router, Req, Res} from "https://deno.land/x/denorest@v2.1/mod.ts"
import Auth from "./auth.ts"
import Note from "./note.ts"
import Settings from "./settings.ts"

let r = new Router();

// add defauld handler
r.use((req: Req, res: Res) => {
  res.headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Content-Type": "application/json"
  };
});

// set home router
r.all("/", (req: Req, res: Res) => {
  res.reply = JSON.stringify({
    status: true,
    massage: "note api",
  });
});

// set auth router
r.pre("/auth", Auth);

// set note router
r.pre("/note", Note);

// set pref router
r.pre("/pref", Settings);

r.all("/note", (req: Req, res: Res) => {
  res.reply = {
    status: "assdasd",
  };
});

export default r;
