import {
  bodyParse,
  pathParse,
  Req,
  Res,
  Router,
} from "https://deno.land/x/denorest@v2.2/mod.ts";
import puppeteer from "https://deno.land/x/deno_puppeteer/mod.ts";
import { notes, tokens, users } from "../model/mod.ts";
import { htmlTemplate } from "../middleware/mod.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.30.0/mod.ts";
const browser = await puppeteer.launch();

let r = new Router();
type ResData = Record<any, any>;

r.all("/:id", async (req: Req, res: Res) => {
  let p = pathParse(req);
  let id = p.params.id;
  let b = await bodyParse(req);
  if (!b.field.t) {
    res.reply = "denied";
    return;
  }

  let token = b.field.t;

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

  let i;
  try {
    i = new ObjectId(id);
  } catch (e) {
    res.reply = JSON.stringify({
      status: false,
      api: "id error",
    });
    return;
  }

  let note = await notes.findOne({
    _id: i,
  });

  let user = await users.findOne({
    username: note?.username,
  });

  if (!user) {
    res.reply = JSON.stringify({
      status: false,
      api: "server error",
    });
    return;
  }

  let resData: ResData = {};
  if (!note) {
    resData.status = false;
    resData.massage = "not found";
    res.reply = JSON.stringify(resData);
    return;
  }

  let g = false;
  if (note.visible) {
    if (note.username === u.username) {
      g = true;
    }
  } else {
    g = true;
  }

  let noteUser = await users.findOne({
    username: note.username
  })

  if (!noteUser) {
    res.reply = "denied"
    return;
  }

  const page = await browser.newPage();
  let html = htmlTemplate(note, noteUser.fullname)
  await page.setContent(html);
  await page.pdf({
    path: "/tmp/" + id,
    margin: {
      top: "50px",
      right: "0px",
      bottom: "50px",
      left: "0px",
    },
    printBackground: true,
    
  });
  await page.close();

  let file;

  if (g) {
    try {
      file = await Deno.open("/tmp/" + id, { read: true });
      const readableStream = file.readable;
      res.headers = {
        ...res.headers,
        "Content-Type": "application/pdf",
      };
      res.reply = readableStream;
    } catch (e) {
      res.reply = "denied";
    }
  } else {
    res.reply = "denied";
  }
});

export default r;
