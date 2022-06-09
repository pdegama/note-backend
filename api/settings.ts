import { Req, Res, Router, pathParse } from "https://deno.land/x/denorest@v2.1/mod.ts";
import { jsonCheck, Tags } from "../middleware/mod.ts";
import { tokens, notes } from "../model/mod.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.30.0/mod.ts";

let r = new Router();
type ResData = Record<any, any>;

export default r;
