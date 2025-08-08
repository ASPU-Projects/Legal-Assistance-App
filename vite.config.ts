import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/broadcasting/auth": {
        target: "http://osamanaser2003-21041.portmap.host:21041",
        changeOrigin: true,
        secure: false, // التأكد من أن الاتصال غير مشفر
        rewrite: (path) => path.replace(/^\/broadcasting/, ""),
      },
    },
  },
});
