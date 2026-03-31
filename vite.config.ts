// vite.lib.config.ts
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/smart-search.ts",
      name: "SmartSearch",
      fileName: "smart-search",
      formats: ["es"]
    },
    rollupOptions: {
      external: ["lit"]
    }
  }
});