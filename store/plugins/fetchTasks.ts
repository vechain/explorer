import { Plugin, Store } from 'vuex/types'

export const fetchBest: Plugin<App.State> = (store: Store<App.State>) => {
  if (process.browser) {
    setInterval(async () => {
      const best: DTO.BlockDetail = await store.$svc.block('best')
      store.commit('setBest', best.block)
    }, 10000)
  }
}

export const f = async () => {
  const resp = await fetch(
    'https://api.coingecko.com/api/v3/simple/price?ids=vechain%2Cvethor-token&vs_currencies=btc'
  )

  if (resp.status === 200) {
    const body = await resp.json()
    const payload = {
      btc: {
        VET: body.vechain.btc,
        VTHO: body['vethor-token'].btc
      }
    }
    return payload
  }
}

export const fetchPrice: Plugin<App.State> = (store: Store<App.State>) => {
  if (process.browser) {
    setInterval(async () => {
      const payload = await f()
      store.commit('setPrice', payload)
    }, 300000)
  }
}
