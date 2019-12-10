import { Context } from '@nuxt/types'
import { AxiosError } from 'axios'

declare module 'axios' {
  interface AxiosRequestConfig {
    progress?: boolean
  }
}

export default function (ctx: Context) {
  ctx.$axios.onResponseError((error: AxiosError) => {
    if (error.response) {
      ctx.redirect('/error', {
        code: error.response.status.toString(),
        msg: error.response.statusText
      })
    }
  })

  ctx.$axios.onRequest((config: any) => {
    const urls = ['/api/blocks/best', '/api/blocks/recent', '/api/transactions/recent']
    if (urls.indexOf(config.url) >= 0) {
      config.progress = false
    }
  })
}
