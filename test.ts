import puppeteer from "https://deno.land/x/deno_puppeteer/mod.ts";

const browser = await puppeteer.launch();
const page = await browser.newPage();
//await page.goto("https://alexandrempsantos.com/deno/puppeteer-with-deno/");
await page.setContent("<h1>Hello, Parthka!");
await page.pdf({ path: "example1.pdf" });

await browser.close();