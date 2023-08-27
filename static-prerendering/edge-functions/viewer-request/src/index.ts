export function handler(event: AWSCloudFrontFunction.Event): AWSCloudFrontFunction.Request {
  const request = event.request

  const maybeHTML = request.uri.endsWith(".html") || !request.uri.includes(".")
  if (!maybeHTML) return request

  const userAgent = request.headers["user-agent"].value
  if (isBot(userAgent)) {
    if (new RegExp("^/about/?$").test(request.uri)) request.uri = "/about.html"
  } else request.uri = "/index.html"

  return request
}

function isBot(userAgent: string) {
  return [
    "Googlebot",
    "msnbot",
    "bingbot",
    "Yahoo! Slurp",
    "Y!J",
    "facebookexternalhit",
    "Twitterbot",
    "Applebot",
    "Linespider",
    "Baidu",
    "YandexBot",
    "Yeti",
    "dotbot",
    "rogerbot",
    "AhrefsBot",
    "MJ12bot",
    "SMTBot",
    "BLEXBot",
    "linkdexbot",
    "SemrushBot",
    "360Spider",
    "spider",
    "YoudaoBot",
    "DuckDuckGo",
    "Daum",
    "Exabot",
    "SeznamBot",
    "Steeler",
    "Sonic",
    "BUbiNG",
    "Barkrowler",
    "GrapeshotCrawler",
    "MegaIndex.ru",
    "archive.org_bot",
    "TweetmemeBot",
    "PaperLiBot",
    "admantx-apacas",
    "SafeDNSBot",
    "TurnitinBot",
    "proximic",
    "ICC-Crawler",
    "Mappy",
    "YaK",
    "CCBot",
    "Pockey",
    "psbot",
    "Feedly",
    "Superfeedr bot",
    "ltx71",
    "Mail.RU_Bot",
  ].some((botUserAgent) => userAgent.toLowerCase().includes(botUserAgent.toLowerCase()))
}
