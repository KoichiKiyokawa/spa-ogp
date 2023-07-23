import { Handler, CloudFrontResponseEvent } from "aws-lambda"

export const handler: Handler<CloudFrontResponseEvent> = async (event) => {
  const response = event.Records[0].cf.response
  console.log(JSON.stringify({ response }))
  console.log(JSON.stringify({ request: event.Records[0].cf.request }))

  return response
}
