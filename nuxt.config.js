import bvConfig from './bootstrapVue.config'
const morgan = require('morgan')
require('dotenv').config()

const IS_MAIN = process.env['NETWORK'] === 'mainnet'
const IS_DEV = process.env.NODE_ENV === 'development'
const title = IS_MAIN ? '' : '(Test)'
const Version = process.env.COMMIT_REV

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
        content: 'width=device-width, initial-scale=1, shrink-to-fit=no, user-scalable=no, maximum-scale=1'
      },
      {
        hid: 'description',
        name: 'description',
        content:
          `VeChain Explorer${title} enables you to explore and search transactions, addresses,  and other activities taking place on the VeChainThor blockchain`
      },
      {
        name: 'keywords',
        content: 'vechain, explorer, vet, vtho, search, blockchain, official'
      },
      {
        name: 'format-detection',
        content: 'telephone=no'
      },
      IS_MAIN ? {
        name: 'google-site-verification',
        comtent: 'yvT2mNLTy-gN9NFUXxNNJR7zIsWLrEvcWNZg_m91pwA'
      } : {}
    ],
    script: [
      {
        type: 'application/ld+json',
        json: {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          url: `https://explore${IS_MAIN ? '' : '-testnet'}.vechain.org/`,
          potentialAction: {
            '@type': 'SearchAction',
            target:
              `https://explore${IS_MAIN ? '' : '-testnet'}.vechain.org/search?content={search_term_string}`,
            'query-input': 'required name=search_term_string'
          }
        }
      }
    ],
    link: [
      {
        rel: 'icon',
        href: `/favicon.png`
      }, {
        rel: 'search',
        type: 'application/opensearchdescription+xml',
        href: `/opensearch.xml`,
        title: `VeChain ${IS_MAIN ? '' : 'Testnet'} Explorer`
      }
    ]
  },
  pwa: {
    manifest: {
      name: `VeChain Explorer${title}`,
      lang: 'en',
      short_name: `VeChain Explorer${title}`,
      theme_color: '#d2d2d2'
    },
    icon: {
      iconSrc: `./static/icon.png`,
      sizes: [144, 152, 192, 384, 512]
    },
    meta: {
      name: `VeChain Explorer${title}`,
      ogSiteName: `VeChain Explorer${title}`,
      ogTitle: `VeChain Explorer${title}`,
      ogDescription: `VeChain Explorer${title} enables you to explore and search transactions, addresses,  and other activities taking place on the VeChainThor blockchain`
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
    '@/css/common.css',
    !IS_MAIN ? '@/css/test.css' : '@/css/main.css'
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '~/plugins/filters.ts',
    '~/plugins/fontawesome.ts',
    '~/plugins/axios.ts',
    { src: '~/plugins/init.ts', mode: 'client' },
    { src: '~/plugins/clipboard.ts', mode: 'client' },
    { src: '~/plugins/qrcode.ts', mode: 'client' }
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    '@nuxt/typescript-build',
    // Doc: https://github.com/nuxt-community/eslint-module
    // '@nuxtjs/eslint-module',
  ],
  /**
   * Analytics
   * See https://github.com/nuxt-community/analytics-module
   */
  googleAnalytics: {
    id: `UA-132391998-${IS_MAIN ? 3 : 4}`,
    set: [
      {
        field: 'anonymizeIp', value: 1
      }
    ],
    dev: false,
    autoTracking: {
      pageviewTemplate(route) {
        return {
          page: route.path,
          title: route.name,
          location: window.location.href
        }
      }
    }
  },
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://bootstrap-vue.js.org
    'bootstrap-vue/nuxt',
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    '@nuxtjs/google-analytics'
  ],
  /**
   * BootstrapVue Config
   * See https://bootstrap-vue.js.org/docs
   */
  bootstrapVue: bvConfig,
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    proxy: true
  },
  /**
   * https://github.com/chimurai/http-proxy-middleware#appusepath-proxy
   */
  proxy: {
    '/api/': {
      target: process.env['API_URL'],
      timeout: 5000
    }
  },
  env: {
    current: !IS_MAIN ? 'Testnet' : 'Mainnet',
    Version,
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
    extend(config, ctx) { },
    extractCSS: !IS_DEV,
    optimization: {
      splitChunks: {
        cacheGroups: {
          styles: {
            name: 'theme',
            test: /\.(css|vue)$/,
            chunks: 'all',
            enforce: true
          }
        }
      }
    }
  }
}
