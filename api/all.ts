import { Req, Res, Router } from "https://deno.land/x/denorest@v2.1/mod.ts";
import { jsonCheck, uuid } from "../middleware/mod.ts";
import { tokens, users } from "../model/mod.ts";

let r = new Router();
type ResData = Record<any, any>;

r.all("/", async (req: Req, res: Res) => {
  res.reply = "123"
})

export default r;
