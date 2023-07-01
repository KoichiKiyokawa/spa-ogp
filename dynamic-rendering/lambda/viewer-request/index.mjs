const crawlers = [
  "Googlebot",
  "facebookexternalhit",
  "Twitterbot",
  "bingbot",
  "msnbot",
];

const dynamicRenderHeaderName = "x-need-dynamic-render";

/**
 * キャッシュの有無に関係なく、リクエストされた際に実行される
 * @type {import('aws-lambda').Handler<import('aws-lambda').CloudFrontRequestEvent>}
 */
export const handler = async (event, context) => {
  const request = event.Records[0].cf.request;
  const headers = request.headers;

  const maybeHtml = (() => {
    if (request.uri.endsWith(".html")) return true;
    if (request.uri.includes(".")) return false; // e.g. /foo.png, /bar.css
    return true; // e.g. /
  })();

  if (!maybeHtml) return request;

  const isCrawler = crawlers.some((c) => {
    return headers["user-agent"][0].value.includes(c);
  });

  if (!isCrawler) {
    // routing for SPA
    request.uri = "/index.html";
    return request;
  }

  request.headers[dynamicRenderHeaderName] = [
    {
      key: dynamicRenderHeaderName,
      value: "true",
    },
  ];

  return request;
};
