import { CloudFrontResponse, CloudFrontResponseHandler } from "aws-lambda"

declare global {
  const __SITE_ROOT_INDEX_HTML_CONTENT: string
}

export const handler: CloudFrontResponseHandler = async (event) => {
  const response = event.Records[0].cf.response as CloudFrontResponse & { body: string }
  const request = event.Records[0].cf.request

  const maybeHTML = request.uri.endsWith(".html") || !request.uri.includes(".")
  // JS, CSS, images, etc. have a content hash attached by the bundler, so the cache age can be extended
  response.headers["cache-control"] = [
    { key: "cache-control", value: `max-age=${maybeHTML ? 600 : 60 * 60 * 24 * 365}` },
  ]

  return response
}
