import { Handler, CloudFrontResponseEvent } from "aws-lambda"

declare global {
  const __SITE_ROOT_INDEX_HTML_CONTENT: string
}

export const handler: Handler<CloudFrontResponseEvent> = async (event) => {
  const response = event.Records[0].cf.response
  console.log(JSON.stringify({ response }))
  console.log(JSON.stringify({ request: event.Records[0].cf.request }))
  console.log(__SITE_ROOT_INDEX_HTML_CONTENT)

  return response
}
