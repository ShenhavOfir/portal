import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    strictPort: true,

    proxy: {
      // ✅ לשפות
      "/lang": {
        target: "https://eve4userver.evepro365.com/api",
        changeOrigin: true,
        secure: false,
        configure: (proxy, _options) => {
          proxy.on("error", (err) => {
            console.log("🛑 Proxy error:", err);
          });
          proxy.on("proxyReq", (proxyReq, req) => {
            console.log("➡️ Proxying request:", req.method, req.url);
          });
          proxy.on("proxyRes", (proxyRes, req) => {
            console.log("⬅️ Response from target:", proxyRes.statusCode, req.url);
          });
        },
      },

      // ✅ ל־API
      "/api": {
        target: "https://eve4userver.evepro365.com",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
