import { CloudFrontResponse, CloudFrontResponseHandler } from "aws-lambda"

declare global {
  const __SITE_ROOT_INDEX_HTML_CONTENT: string
}

export const handler: CloudFrontResponseHandler = async (event) => {
  const response = event.Records[0].cf.response as CloudFrontResponse & { body: string }
  const request = event.Records[0].cf.request

  const maybeHTML = request.uri.endsWith(".html") || !request.uri.includes(".")
  if (maybeHTML) {
    const jstNow = new Date(Date.now() + (new Date().getTimezoneOffset() + 9 * 60) * 60 * 1000)

    const description: string = (() => {
      if (request.uri === "/") return "root page"
      const id = request.uri.match(/\/([\d]+)/)?.[1]
      if (id) return `page ${id}`
      return "unknown page"
    })()

    response.body = __SITE_ROOT_INDEX_HTML_CONTENT.replace(
      "<!-- PLACEHOLDER -->",
      `
      <meta name="description" content="${description + " " + jstNow.toLocaleString()}">
      `
    )
    response.headers["content-type"] = [{ key: "Content-Type", value: "text/html" }]
  }

  // JS, CSS, images, etc. have a content hash attached by the bundler, so the cache age can be extended
  response.headers["cache-control"] = [
    { key: "Cache-Control", value: `max-age=${maybeHTML ? 600 : 60 * 60 * 24 * 365}` },
  ]

  return response
}
