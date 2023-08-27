// @ts-check
import { spawn } from "node:child_process"
import fs from "node:fs"
import puppeteer from "puppeteer"
import process from "node:process"

const prerenderTargetPathList = ["/about"]

const baseURL = "http://localhost:4173"
const vite = spawn("pnpm", ["preview"])

// =========================================
// wait for vite to start up to 10 seconds
const timer = setTimeout(() => {
  throw Error("timeout")
}, 10000)
// eslint-disable-next-line no-constant-condition
while (true) {
  const res = await fetch(baseURL).catch(() => ({ ok: false }))
  if (res.ok) {
    clearTimeout(timer)
    break
  }
}
// =========================================

// =========================================
// prerender
const browser = await puppeteer.launch({ headless: "new" })
const page = await browser.newPage()
await Promise.all(
  prerenderTargetPathList.map(async (path) => {
    await page.goto(baseURL + path)
    await page.waitForNetworkIdle()
    const html = await page.content()
    fs.writeFileSync(`dist/${path.replace(/^\/|\/$/, "")}.html`, html)
  })
)
console.log("🚀 Prerendered!!")
await browser.close()
// =========================================

vite.kill()
process.exit(0)
