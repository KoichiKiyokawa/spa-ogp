import { expect, test } from "vitest"
import { handler } from "./index"

const eventFactory = ({ requestUri }: { requestUri: string }) =>
  ({
    request: { uri: requestUri },
  } as AWSCloudFrontFunction.Event)

test.each([
  { requestUri: "/assets/foo.png", expected: "/assets/foo.png" },
  { requestUri: "/about", expected: "/about.html" },
  { requestUri: "/about/", expected: "/about.html" },
  { requestUri: "/other", expected: "/index.html" },
  { requestUri: "/", expected: "/index.html" },
])("routing $requestUri to $expected", ({ requestUri, expected }) => {
  const res = handler(eventFactory({ requestUri }))

  expect(res).toMatchObject({ uri: expected })
})
