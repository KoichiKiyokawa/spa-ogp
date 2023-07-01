import chromium from "@sparticuz/chromium-min";
import puppeteer from "puppeteer-core";

const dynamicRenderHeaderName = "x-need-dynamic-render";
const originUrl = "https://dynamic-rendering.kiyoshiro.ml";

/**
 * 該当するキャッシュがなく、オリジンにリクエストする前に実行される
 * @type {import('aws-lambda').Handler<import('aws-lambda').CloudFrontRequestEvent>}
 */
export const handler = async (event, context) => {
  const request = event.Records[0].cf.request;
  const headers = request.headers;

  // not crawler
  if (!headers[dynamicRenderHeaderName]) return request;

  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    // https://github.com/Sparticuz/chromium/blob/74283507ac24bf17bf306bc4765b94bb48a225b3/examples/remote-min-binary/index.js#L9-L10
    executablePath: await chromium.executablePath(
      "https://github.com/Sparticuz/chromium/releases/download/v114.0.0/chromium-v114.0.0-pack.tar"
    ),
    headless: chromium.headless,
    ignoreHTTPSErrors: true,
  });

  const page = await browser.newPage();
  const targetUrl = `${originUrl}${request.uri}`.replace(/\/index\.html$/, "");
  await page.goto(targetUrl, { waitUntil: "networkidle0" });
  const html = await page.content();
  await browser.close();

  return {
    status: "200",
    statusDescription: "OK",
    headers: {
      "cache-control": [
        {
          key: "Cache-Control",
          value: "max-age=100",
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
  };
};
