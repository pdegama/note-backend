import { bodyParse, Req } from "https://deno.land/x/denorest@v2.2/mod.ts";

type JsonBody = Record<string, string>;

export default async (req: Req, f: String[]): Promise<JsonBody> => {
  let b = await bodyParse(req);
  let res: JsonBody = {};
  for (const i of f) {
    if (b.field[`${i}`]) {
      res[`${i}`] = b.field[`${i}`];
    } else {
      res.invalid = "true";
    }
  }
  return res;
};
