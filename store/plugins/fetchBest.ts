import { Plugin, Store } from 'vuex/types'
export const fetchBest: Plugin<Exp.State> = (store: Store<Exp.State>) => {
  if (process.browser) {
    setInterval(async () => {
      const best:Exp.BlockDetail = await store.$axios.$get('/api/blocks/best')
      store.commit('setBest', best.block)
    }, 10000)
  }
}
