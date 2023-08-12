// NOTE: esbuild cannot bundle `const` to `var` when target is es5
export function handler(event: AWSCloudFrontFunction.Event): AWSCloudFrontFunction.Request {
  var request = event.request

  var maybeHTML = request.uri.endsWith(".html") || !request.uri.includes(".")
  if (!maybeHTML) return request

  if (new RegExp("^/about/?$").test(request.uri)) request.uri = "/about.html"
  else request.uri = "/index.html"

  return request
}
