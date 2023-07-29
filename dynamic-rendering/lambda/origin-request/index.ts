import chromium from "@sparticuz/chromium-min"
import puppeteer from "puppeteer-core"
import type { Handler, CloudFrontRequestEvent } from "aws-lambda"

const dynamicRenderHeaderName = "x-need-dynamic-render"
const originUrl = "https://dynamic-rendering.kiyoshiro.me"

/**
 * 該当するキャッシュがなく、オリジンにリクエストする前に実行される
 */
export const handler: Handler<CloudFrontRequestEvent> = async (event) => {
  const request = event.Records[0].cf.request
  const headers = request.headers

  // not crawler
  if (!headers[dynamicRenderHeaderName]) return request

  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    // https://github.com/Sparticuz/chromium/blob/74283507ac24bf17bf306bc4765b94bb48a225b3/examples/remote-min-binary/index.js#L9-L10
    executablePath: await chromium.executablePath(
      // @sparticuz/chromium-minとバージョンを一致させること
      "https://github.com/Sparticuz/chromium/releases/download/v112.0.0/chromium-v112.0.0-pack.tar"
    ),
    headless: chromium.headless,
    ignoreHTTPSErrors: true,
  })

  const page = await browser.newPage()
  const targetUrl = `${originUrl}${request.uri}`.replace(/\/index\.html$/, "")
  await page.goto(targetUrl, { waitUntil: "networkidle0" })
  const html = await page.content()
  await browser.close()

  return {
    status: "200",
    statusDescription: "OK",
    headers: {
      "cache-control": [
        {
          key: "Cache-Control",
          value: "max-age=100, stale-while-revalidate=86400",
        },
      ],
      "content-type": [
        {
          key: "Content-Type",
          value: "text/html",
        },
      ],
      "content-encoding": [
        {
          key: "Content-Encoding",
          value: "UTF-8",
        },
      ],
    },
    body: html,
  }
}
