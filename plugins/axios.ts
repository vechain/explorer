import { Context } from '@nuxt/types'
import { NuxtAxiosInstance } from '@nuxtjs/axios'
import { AxiosError } from 'axios'

declare module 'axios' {
  interface AxiosRequestConfig {
    progress?: boolean
  }
}

declare module '@nuxt/types' {
  interface Context {
    $svc: IfcSvc
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $svc: IfcSvc
  }
}
declare module 'vuex/types/index' {
  interface Store<S> {
    $svc: IfcSvc
  }
}
interface IfcSvc {
  block(id: string): Promise<DTO.BlockDetail>
  blockTxs(id: string): Promise<DTO.BlockTxs>
  tx(id: string): Promise<DTO.TxDetail>
  account(addr: string): Promise<DTO.AccountDetail>
  signedBlocks(addr: string, page: number, pageSize?: number): Promise<DTO.SignedBlocks & { pageCount: number }>
  accountTxs(addr: string, page: number, pageSize?: number): Promise<DTO.AccountTxs & { pageCount: number }>
  accountTfs(addr: string, page: number, pageSize?: number, type?: string): Promise<DTO.AccountTransfers & { pageCount: number }>

  search(id: string): Promise<{
    name: string,
    params: {
      id: string
    },
    hash?: string
  } | null>
}

class Svc implements IfcSvc {
  private axios: NuxtAxiosInstance
  constructor(axios: NuxtAxiosInstance) {
    this.axios = axios
  }

  async blockTxs(id: string): Promise<DTO.BlockTxs> {
    return await this.axios.$get(`/api/blocks/${id.toLowerCase()}/transactions`)
  }

  async block(id: string): Promise<DTO.BlockDetail> {
    return await this.axios.$get(`/api/blocks/${id.toLowerCase()}`)
  }

  async tx(id: string): Promise<DTO.TxDetail> {
    return await this.axios.$get(`/api/transactions/${id.toLowerCase()}`)
  }
  async account(addr: string): Promise<DTO.AccountDetail> {
    return await this.axios.$get(`/api/accounts/${addr.toLowerCase()}`)
  }
  async signedBlocks(addr: string, page: number, pageSize?: number): Promise<DTO.SignedBlocks & { pageCount: number }> {
    const limit = (pageSize || 10)
    const offset = (page - 1) * limit
    const result = await this.axios.$get(`/api/accounts/${addr.toLowerCase()}/signed`, {
      params: {
        limit,
        offset
      }
    })
    const pageCount = Math.floor(result.count / limit) + (result.count % limit > 0 ? 1 : 0) || 1
    return {
      ...result,
      pageCount
    }
  }
  async accountTxs(addr: string, page: number, pageSize?: number): Promise<DTO.AccountTxs & { pageCount: number }> {
    const limit = (pageSize || 10)
    const offset = (page - 1) * limit
    const result = await this.axios.$get(`/api/accounts/${addr.toLowerCase()}/transactions`, {
      params: {
        limit,
        offset
      }
    })
    const pageCount = Math.floor(result.count / limit) + (result.count % limit > 0 ? 1 : 0) || 1
    return {
      ...result,
      pageCount
    }
  }
  async accountTfs(addr: string, page: number, pageSize?: number, type?: string): Promise<DTO.AccountTransfers & { pageCount: number }> {
    const limit = (pageSize || 10)
    const offset = (page - 1) * limit
    const params: {
      limit: number
      offset: number
      type?: string
    } = {
      limit,
      offset
    }
    if (type) {
      params.type = type
    }
    const result = await this.axios.$get(`/api/accounts/${addr.toLowerCase()}/transfers`, {
      params
    })
    const pageCount = Math.floor(result.count / limit) + (result.count % limit > 0 ? 1 : 0) || 1
    return {
      ...result,
      pageCount
    }
  }

  async search(search: string): Promise<{ name: string, params: { id: string }, hash?: string } | null> {
    let rt: any = null
    if (/^0x[0-9a-f]{40}$/i.test(search)) {
      rt = { name: 'accounts-id', params: { id: search.toLowerCase() } }
    } else if (/^[0-9]+$/.test(search)) {
      const bd = await this.block(search)
      if (bd && bd.block) {
        rt = { name: 'blocks-id', params: { id: bd.block.id } }
      }
    } else if (/^0x[0-9-a-f]{64}$/i.test(search)) {
      const bd = await this.block(search)
      if (bd && bd.block) {
        rt = { name: 'blocks-id', params: { id: bd.block.id } }
      } else {
        const txDetail = await this.tx(search)
        if (txDetail && txDetail.tx) {
          rt = { name: 'transactions-id', params: { id: txDetail.tx.txID }, hash: '#info' }
        }
      }
    }

    return rt
  }
}

export default function (ctx: Context, inject: any) {
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
  const svc = new Svc(ctx.$axios)
  ctx.$svc = svc
  inject('svc', svc)
}
