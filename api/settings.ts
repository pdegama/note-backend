import {
  pathParse,
  Req,
  Res,
  Router,
} from "https://deno.land/x/denorest@v2.1/mod.ts";
import { jsonCheck, Tags } from "../middleware/mod.ts";
import { notes, tokens } from "../model/mod.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.30.0/mod.ts";

let r = new Router();
type ResData = Record<any, any>;

r.get("/", (req: Req, res: Res) => {
  let resData: ResData = {};
  res.reply = JSON.stringify(resData);
});

export default r;
