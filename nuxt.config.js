const morgan = require('morgan')
require('dotenv').config()
const IS_MAIN = process.env['NETWORK'] !== 'testnet'

const title = IS_MAIN ? '' : '(Test)'
export default {
  server: {
    host: '0.0.0.0'
  },
  serverMiddleware: [{ path: '/', handler: morgan('tiny') }],
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    title: `VeChain Explorer${title}`,
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, shrink-to-fit=no'
      },
      {
        hid: 'description',
        name: 'description',
        content:
          'VeChain Explorer enables you to explore and search transactions, addresses,  and other activities taking place on the VeChainThor blockchain'
      },
      {
        name: 'author',
        content: 'vechain.org'
      },
      {
        name: 'keywords',
        content: 'vechain, explorer, vet, vtho, search, blockchain, official'
      },
      {
        name: 'format-detection',
        content: 'telephone=no'
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: `/${IS_MAIN ? '' : 'test.'}favicon.png` }]
  },
  pwa: {
    meta: {
      ogSiteName: 'Vechain Explorer',
      ogTitle: `VeChain Explorer${title}`,
      ogDescription: `VeChain Explorer enables you to explore and search transactions, addresses,  and other activities taking place on the VeChainThor blockchain`,
    }
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: [
    '@fortawesome/fontawesome-svg-core/styles.css',
    '@/assets/css/common.css',
    !IS_MAIN ? '@/assets/css/test.css' : '@/assets/css/main.css'
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '~/plugins/filters.ts',
    '~/plugins/fontawesome.ts',
    '~/plugins/axios.ts',
    { src: '~/plugins/init.ts', mode: 'client' },
    { src: '~/plugins/clipboard.ts', mode: 'client' }
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    '@nuxt/typescript-build'
    // Doc: https://github.com/nuxt-community/eslint-module
    // '@nuxtjs/eslint-module',
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://bootstrap-vue.js.org
    'bootstrap-vue/nuxt',
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa'
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    timeout: 2000,
    proxy: true
  },
  proxy: {
    '/api/': {
      target: process.env['API_URL']
    }
  },
  env: {
    current: !IS_MAIN ? 'Testnet' : 'Mainnet',
    networks: [
      {
        text: 'Main',
        link: 'https://explore.vechain.org'
      },
      {
        text: 'Test',
        link: 'https://explore-testnet.vechain.org'
      }
    ]
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {}
  }
}
