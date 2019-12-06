import { Context } from '@nuxt/types'
export default function (ctx: Context) {
  ctx.$axios.onError(error => {
    if (error.code === '404') {
      ctx.redirect('/')
    }
  })
  ctx.$axios.onRequest((config: any) => {
    if (config.url === '/api/blocks/best') {
      config.progress = false
    }
  })
}
