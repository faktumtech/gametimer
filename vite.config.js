// Plugins
import vue from '@vitejs/plugin-vue'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import { VitePWA } from 'vite-plugin-pwa'

// Utilities
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({ 
      template: { transformAssetUrls }
    }),
    // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
    vuetify({
      autoImport: true,
    }),
    VitePWA({ 
      registerType: 'autoUpdate',
      // https://vite-pwa-org.netlify.app/guide/service-worker-strategies-and-behaviors.html#service-worker-strategies
      strategies: 'generateSW',
      devOptions: {
        // activate service worker in dev mode (true)
        // keep dev builds from generating dev-dist artifacts
        enabled: false
      },
      manifest: {
        name: "GameTimer",
        short_name: "GameTimer",
        description: 'GameTimer is a small timer application for games like Rummikub.',

        icons: [
          {
            src: "./img/icons/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "./img/icons/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: 'any maskable'
          }
        ],
        start_url: "./index.html",
        display: "standalone",
        background_color: "#000000",
        theme_color: "#4CAF50"
      } 

    })
  ],
  define: { 
    'process.env': {},
    'PACKAGE_VERSION': JSON.stringify(process.env.npm_package_version)
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    extensions: [
      '.js',
      '.json',
      '.jsx',
      '.mjs',
      '.ts',
      '.tsx',
      '.vue',
    ],
  },
  server: {
    port: 3000,
  },
})
