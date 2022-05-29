import { WebApp, Res, Req } from "https://deno.land/x/denorest@v2.1/mod.ts"
import mainRouter from "./api/router.ts"

let app = new WebApp()

app.set(mainRouter)

// set 404 router
app.set404((req: Req, res: Res) => {
  res.status = 404
  res.reply = JSON.stringify({
    status: false,
    massage: "API not found"
  })
})

// set 500 router
app.set500((req: Req, res: Res) => {
  res.status = 500
  res.reply = JSON.stringify({
    status: false,
    massage: "server error"
  })
})

app.listen(8080)
