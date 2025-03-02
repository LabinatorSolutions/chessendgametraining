import { defineConfig, loadEnv } from 'vite';
import { splitVendorChunkPlugin } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import { viteStaticCopy } from 'vite-plugin-static-copy';

const DEV = false;

const setHeaders = (req, res) => {
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  if ('/gdrive/index.html' == req.url) {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  } else {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  }
};

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd(), '') };
  return defineConfig({
    build: {
      sourcemap: DEV,
      outDir: '../docs',
      rollupOptions: {
        external: ['lila-stockfish-web/sf16-7.js'],
      },
      modulePreload: {
        polyfill: false
      }
    },
    plugins: [
      splitVendorChunkPlugin(),
      {
        name: "configure-response-headers",
        configureServer: (server) => {
          server.middlewares.use((req, res, next) => {
            setHeaders(req, res);
            next();
          });
        },
      },
      {
        name: "configure-preview-response-headers",
        configurePreviewServer: (server) => {
          server.middlewares.use((req, res, next) => {
            setHeaders(req, res);
            next();
          });
        },
      },
      viteStaticCopy({
        targets: [
          {
            src: 'node_modules/lila-stockfish-web/sf16-7*',
            dest: 'assets/stockfish/'
          },
          {
            src: 'node_modules/stockfish/src/stockfish-nnue-16-no-simd.*',
            dest: 'assets/stockfish/'
          },
        ]
      }),

      VitePWA({
        devOptions: {
          enabled: DEV,
        },
        injectRegister: 'auto',
        registerType: 'autoUpdate',
        manifestFilename: 'manifest.json',
        includeAssets: ['*', '*/*', '*/*/*', '*/*/*/*'],
        workbox: {
          sourcemap: DEV,
          cleanupOutdatedCaches: true,
        },
        manifest: {
          id: 'chess-endgame-trainer',
          name: 'Chess Endgame Trainer',
          short_name: 'Chess Endgame Trainer',
          description: 'Chess Endgame Trainer',
          display: 'fullscreen',
          start_url: '/?fullscreen=true',
          scope: 'https://chess-endgame-trainer.mooo.com',
          scope_extensions: [{ origin: 'https://chess-endgame-trainer.firebaseapp.com' }],
          background_color: '#000000',
          theme_color: '#000000',
          orientation: 'natural',
          dir: 'ltr',
          prefer_related_applications: false,
          categories: ['games'],
          launch_handler: {
            client_mode: ['focus-existing', 'auto']
          },
          icons: [
            {
              src: 'assets/icons/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: 'assets/icons/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
            },
            {
              src: 'assets/icons/pwa-maskable-icon-336x336.png',
              sizes: '336x336',
              type: 'image/png',
              purpose: 'maskable',
            },
            {
              src: 'assets/icons/pwa-any-icon-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            }
          ],
          screenshots: [
            {
              src: "assets/screenshots/screenshot_1.png",
              sizes: "360x740",
              type: "image/png",
              form_factor: "narrow",
              label: "Home"
            },
            {
              src: "assets/screenshots/screenshot_2.png",
              sizes: "360x740",
              type: "image/png",
              form_factor: "narrow",
              label: "Menu"
            },
            {
              src: "assets/screenshots/screenshot_3.png",
              sizes: "360x740",
              type: "image/png",
              form_factor: "narrow",
              label: "Menu"
            },
            {
              src: "assets/screenshots/screenshot_4.png",
              sizes: "360x740",
              type: "image/png",
              form_factor: "narrow",
              label: "List"
            },
            {
              src: "assets/screenshots/screenshot_5.png",
              sizes: "360x740",
              type: "image/png",
              form_factor: "narrow",
              label: "Game"
            },
            {
              src: "assets/screenshots/screenshot_6.png",
              sizes: "360x740",
              type: "image/png",
              form_factor: "narrow",
              label: "Settings"
            },
            {
              src: "assets/screenshots/screenshot_7.png",
              sizes: "360x740",
              type: "image/png",
              form_factor: "narrow",
              label: "Settings"
            },
            {
              src: "assets/screenshots/screenshot_1.png",
              sizes: "360x740",
              type: "image/png",
              form_factor: "wide",
              label: "Home"
            },
            {
              src: "assets/screenshots/screenshot_2.png",
              sizes: "360x740",
              type: "image/png",
              form_factor: "wide",
              label: "Menu"
            },
            {
              src: "assets/screenshots/screenshot_3.png",
              sizes: "360x740",
              type: "image/png",
              form_factor: "wide",
              label: "Menu"
            },
            {
              src: "assets/screenshots/screenshot_4.png",
              sizes: "360x740",
              type: "image/png",
              form_factor: "wide",
              label: "List"
            },
            {
              src: "assets/screenshots/screenshot_5.png",
              sizes: "360x740",
              type: "image/png",
              form_factor: "wide",
              label: "Game"
            },
            {
              src: "assets/screenshots/screenshot_6.png",
              sizes: "360x740",
              type: "image/png",
              form_factor: "wide",
              label: "Settings"
            },
            {
              src: "assets/screenshots/screenshot_7.png",
              sizes: "360x740",
              type: "image/png",
              form_factor: "wide",
              label: "Settings"
            }
          ]
        }
      })
    ],
    optimizeDeps: { exclude: ['lila-stockfish-web'] },
  })
}