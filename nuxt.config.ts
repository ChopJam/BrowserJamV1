import { fileURLToPath } from 'url'

export default defineNuxtConfig({
  /**
   * 1) Tell Nuxt to use a **relative** base URL (./) so all asset tags
   *    become "./_nuxt/XYZ.js" instead of "/_nuxt/XYZ.js" or "/BrowserJamV1/_nuxt/XYZ.js".
   */
  app: {
    baseURL: './',
    head: {
      title: 'Animal Jam Masterpieces Viewer - Discover Amazing Art',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          hid: 'description',
          name: 'description',
          content: 'Discover the amazing masterpieces from the Animal Jam community!'
        },
        {
          hid: 'keywords',
          name: 'keywords',
          content:
            'Animal Jam, Masterpieces, Art Viewer, Animal Jam Art, Online Community, Game Art, Creative Works'
        },
        { hid: 'og:title', name: 'og:title', content: 'Animal Jam Masterpieces Viewer' },
        {
          hid: 'og:description',
          name: 'og:description',
          content: 'Discover the amazing masterpieces from the Animal Jam community!'
        },
        { hid: 'og:image', name: 'og:image', content: '/images/preview.png' },
        { hid: 'og:url', name: 'og:url', content: 'https://jam.exposed' },
        { hid: 'og:type', name: 'og:type', content: 'website' },
        { hid: 'twitter:card', name: 'twitter:card', content: 'summary_large_image' },
        { hid: 'twitter:title', name: 'twitter:title', content: 'Animal Jam Masterpieces Viewer' },
        {
          hid: 'twitter:description',
          name: 'twitter:description',
          content: 'Discover the amazing masterpieces from the Animal Jam community!'
        },
        { hid: 'twitter:image', name: 'twitter:image', content: '/images/preview.png' },
        { name: 'robots', content: 'index, follow' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap'
        }
      ]
    }
  },

  /**
   * 2) Tell Vite itself to use a **relative** base (`./`),
   *    so it emits asset tags as "./_nuxt/XYZ.js" rather than "/_nuxt/...".
   *    Without this, Vite will default to "/", which again forces absolute URLs.
   */
  vite: {
    base: './',
    assetsInclude: ['**/*.swf']
  },

  /**
   * 3) Generate a 200.html fallback so any direct link (e.g. /about) still serves index.html.
   */
  generate: {
    fallback: true
  },

  /**
   * 4) Prevent @nuxtjs/robots from trying to write a robots.txt at "/robots.txt",
   *    since we’re using a relative base and it would conflict.
   */
  robots: {
    robotsTxt: false
  },

  /**
   * 5) The rest of your config stays unchanged.
   */
  site: {
    url: 'https://jam.exposed',
    title: 'Animal Jam Masterpieces Viewer',
    description: 'Discover the amazing masterpieces from the Animal Jam community!'
  },

  srcDir: 'src',
  serverDir: './src/server',
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  ssr: false,
  components: true,

  nitro: {
    routeRules: {
      '/api/**': {
        cors: true,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE'
        }
      },
      '/proxy/**': {
        proxy: 'https://ajcontent.akamaized.net/**'
      },
      '/socket-proxy': {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
          'Access-Control-Allow-Headers': '*'
        }
      }
    },
    experimental: {
      websocket: true
    }
  },

  hooks: {
    'nitro:config': (nitroConfig) => {
      nitroConfig.handlers = nitroConfig.handlers || []

      nitroConfig.handlers.push({
        route: '/proxy/**',
        handler: '~/server/middleware/proxy'
      })

      nitroConfig.handlers.push({
        route: '/socket-proxy',
        handler: '~/server/websocket'
      })
    }
  },

  plugins: ['~/plugins/fontawesome.ts'],

  modules: [
    '@vueuse/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/robots',
    '@nuxtjs/sitemap',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt'
  ],

  css: ['~/assets/sass/app.scss', '@fortawesome/fontawesome-svg-core/styles.css'],

  alias: {
    assets: fileURLToPath(new URL('./src/assets', import.meta.url))
  }
})
