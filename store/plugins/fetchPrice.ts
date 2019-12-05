import { Plugin, Store } from 'vuex/types'

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

export const fetchPrice: Plugin<Exp.State> = (store: Store<Exp.State>) => {
  if (process.browser) {
    setInterval(async () => {
      const payload = await f()
      store.commit('setPrice', payload)
    }, 300000)
  }
}
