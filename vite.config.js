import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
     VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["4.png", "favicon.ico"],
      manifest: {
        name: "WhyWhat",
        short_name: "MyApp",
        start_url: ".",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#317EFB",
        icons: [
          {
      "src": "4.png",
      "sizes": "192x192",
      "type": "image/png"
    },
           {
      "src": "favicon.ico",
      "sizes": "512x512",
      "type": "image/ico"
    }
        ]
      }
    })
  ],
})
