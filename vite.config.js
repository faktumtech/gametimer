import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import { visualizer } from 'rollup-plugin-visualizer'
import { VitePWA } from 'vite-plugin-pwa'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls }
    }),
    vuetify({
      autoImport: true
    }),
    /*
     * visualizer plugin to create a stats.html file in the stats folder
     * this sizes (raw, gzip) are different from the sizes indicated by vite build
     * The Visualizer “Rendered” size is uncompressed, pre‑minify module size while Vite's output the size of the minified bundle on disk after build.
     * The visualizer’s gzip size is a sum of per‑module gzips, while Vite’s output of the gzipped bundle on disk after build.     *
     */
    visualizer({
      filename: 'stats/stats.html',
      template: 'treemap', // or "sunburst", "network"
      gzipSize: true
    }),
    VitePWA({
      // service worker file name
      filename: 'service-worker.js',
      // registering done by vite-plugin-pwa
      registerType: 'autoUpdate',
      // service worker strategies: 'generateSW' (default) | 'injectManifest'
      strategies: 'generateSW',
      // provide manifest and SW during dev if enabled
      devOptions: {
        enabled: true // creates dev-dist folder with manifest.json and service-worker.js
      },
      // webmanifest file name
      manifestFilename: 'manifest.json',
      // content copied to /manifest.webmanifest
      manifest: {
        id: 'gametimer.org',
        name: 'GameTimer',
        short_name: 'GameTimer',
        description: 'GameTimer is a small timer application for games like Rummikub.',
        lang: 'en',
        icons: [
          {
            src: './img/icons/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: './img/icons/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: './img/icons/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ],
        start_url: './index.html',
        display: 'standalone',
        background_color: '#000000',
        theme_color: '#4CAF50',
        orientation: 'any',
        categories: [
          'games'
        ],
        prefer_related_applications: false,
        // max 5 screenshots
        screenshots: [
          {
            src: './img/screenshots/screenshot_start.png',
            sizes: '750x1334',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'Start screen in dark mode'
          },
          {
            src: './img/screenshots/screenshot_start_horizontal.png',
            sizes: '1334x750',
            type: 'image/png',
            form_factor: 'wide',
            label: 'Start screen in horizontal mode'
          },
          {
            src: './img/screenshots/screenshot_settings.png',
            sizes: '750x1334',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'Settings screen'
          },
          {
            src: './img/screenshots/screenshot_left_34_secs.png',
            sizes: '750x1334',
            type: 'image/png',
            form_factor: 'narrow',
            label: '34 seconds left'
          },
          {
            src: './img/screenshots/screenshot_left_13_secs.png',
            sizes: '750x1334',
            type: 'image/png',
            form_factor: 'narrow',
            label: '13 seconds left'
          }
        ]
      }

    })
  ],
  define: {
    'process.env.PACKAGE_VERSION': JSON.stringify(process.env.npm_package_version)
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
      '.vue'
    ]
  },
  server: {
    port: 3000
  }
})
