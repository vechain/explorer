import { Context } from '@nuxt/types'
export default function (ctx: Context) {
  ctx.$axios.onError(error => {
    if (error.code === '404') {
      ctx.redirect('/')
    }
  })
  ctx.$axios.onRequest((config: any) => {
    const urls = ['/api/blocks/best', '/api/blocks/recent', '/api/transactions/recent']
    if (urls.indexOf(config.url) >= 0) {
      config.progress = false
    }
  })
}
