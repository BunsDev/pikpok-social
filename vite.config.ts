import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  plugins: [react(), visualizer()],
  resolve: {
    alias: {
      "@components": path.resolve(__dirname, "./src/components"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@contexts": path.resolve(__dirname, "./src/contexts"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@config": path.resolve(__dirname, "./src/config"),
      "@icons": path.resolve(__dirname, "./src/icons"),
      "@apis": path.resolve(__dirname, "./src/apis"),
      "@src": path.resolve(__dirname, "./src"),
      "@services": path.resolve(__dirname, "./src/services"),
    },
  },
  build: {
    chunkSizeWarningLimit: 500, // Adjust this if you want to suppress the warning
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            return "vendor"; // Split vendor libraries into their own chunk
          }
          if (id.includes("@components")) {
            return "components"; // You can split specific components into their own chunk
          }
        },
      },
    },
  },
});
