import { CloudFrontRequestHandler } from "aws-lambda"

declare global {
  const __SITE_ROOT_INDEX_HTML_CONTENT: string
}

export const handler: CloudFrontRequestHandler = async (event) => {
  const request = event.Records[0].cf.request

  const maybeHTML = request.uri.endsWith(".html") || !request.uri.includes(".")
  if (!maybeHTML) return request

  const jstNow = new Date(Date.now() + (new Date().getTimezoneOffset() + 9 * 60) * 60 * 1000)
  const description: string = (() => {
    if (request.uri === "/") return "root page"
    else if (new RegExp("/posts/\\d+").test(request.uri)) {
      const id = request.uri.match(/\/([\d]+)/)?.[1]
      if (id) return `post ${id} page`
    }

    return "unknown page"
  })()
  const body = __SITE_ROOT_INDEX_HTML_CONTENT.replace(
    "<!-- PLACEHOLDER -->",
    `<meta name="description" content="${description + " | " + jstNow.toLocaleString()}">`,
  )

  return {
    status: "200",
    headers: {
      "contnet-type": [{ key: "contnet-type", value: "text/html" }],
    },
    body,
  }
}
