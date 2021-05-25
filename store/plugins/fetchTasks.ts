import { Plugin, Store } from 'vuex/types'

export const fetchBest: Plugin<App.State> = (store: Store<App.State>) => {
  if (process.browser) {
    setInterval(async () => {
      const best: DTO.BlockDetail = await store.$svc.block('best')
      store.commit('setBest', best.block)
    }, 10000)
  }
}

export const fetchPrice: Plugin<App.State> = (store: Store<App.State>) => {
  if (process.browser) {
    setInterval(async () => {
      const payload = await store.$svc.price()
      store.commit('setPrice', payload)
    }, 300000)
  }
}
