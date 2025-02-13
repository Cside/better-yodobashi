import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  extensionApi: "chrome",
  modules: ["@wxt-dev/module-react"],
  manifest: {
    default_locale: "ja", // for edge
    permissions: ["storage", "unlimitedStorage"],
    action: {}, // entrypoints/popup がある場合は不要になる
  },
});
