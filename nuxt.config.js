const morgan = require("morgan");

export default {
  server: {
    host: "0.0.0.0",
    timing: true
  },
  serverMiddleware: [{ path: "/", handler: morgan("tiny") }],
  mode: "universal",
  /*
   ** Headers of the page
   */
  head: {
    title: "VeChain Explorer",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: process.env.npm_package_description || ""
      }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: "#fff" },
  /*
   ** Global CSS
   */
  css: ["@fortawesome/fontawesome-svg-core/styles.css"],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    "~/plugins/filters.ts",
    "~/plugins/fontawesome.ts",
    "~/plugins/axios.ts",
    { src: "~/plugins/init.ts", mode: "client" },
    { src: "~/plugins/clipboard.ts", mode: "client" }
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    "@nuxt/typescript-build"
    // Doc: https://github.com/nuxt-community/eslint-module
    // '@nuxtjs/eslint-module',
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://bootstrap-vue.js.org
    "bootstrap-vue/nuxt",
    // Doc: https://axios.nuxtjs.org/usage
    "@nuxtjs/axios",
    "@nuxtjs/pwa"
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
    "/api/": {
      target: "https://explore.digonchain.com/"
    }
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {}
  },
  hooks: {
    "render:routeContext": () => {
      alert("0000");
    }
  }
};
