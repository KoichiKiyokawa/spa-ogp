export function handler(event: AWSCloudFrontFunction.Event): AWSCloudFrontFunction.Request {
  const request = event.request

  const maybeHTML = request.uri.endsWith(".html") || !request.uri.includes(".")
  if (!maybeHTML) return request

  if (new RegExp("^/about/?$").test(request.uri)) request.uri = "/about.html"
  else request.uri = "/index.html"

  return request
}
