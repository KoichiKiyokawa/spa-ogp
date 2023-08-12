import fs from "fs"

const baseHTML = fs.readFileSync("dist/index.html", "utf-8")

// index.html
const indexHTML = baseHTML.replace(
  "<!-- PLACEHOLDER -->",
  `\
<meta name="description" content="index page description">`
)
fs.writeFileSync("dist/index.html", indexHTML)

// about.html
const aboutHTML = baseHTML.replace(
  "<!-- PLACEHOLDER -->",
  `\
<meta name="description" content="About page description">`
)
fs.writeFileSync("dist/about.html", aboutHTML)
