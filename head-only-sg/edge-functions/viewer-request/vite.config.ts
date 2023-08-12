import { defineConfig } from "vitest/config"

export default defineConfig({
  build: {
    lib: {
      entry: "src/index.ts",
      fileName: () => "index.js",
      formats: ["es"],
    },
    minify: false,
    target: "es5",
  },
  test: {
    includeSource: ["src/**/*.{js,ts}"],
  },
})
