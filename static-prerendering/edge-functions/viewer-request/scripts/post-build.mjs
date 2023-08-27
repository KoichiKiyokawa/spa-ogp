import fs from "fs"

const originalOutput = fs.readFileSync("dist/index.js", "utf8")
const output = originalOutput.replace("export ", "")
fs.writeFileSync("dist/index.js", output)
