import fs from "fs"

const originalOutput = fs.readFileSync("dist/index.js", "utf8")
const output = originalOutput.replace(/export \{[\s\S]+handler[\s\S]+\};/, "")
fs.writeFileSync("dist/index.js", output)
