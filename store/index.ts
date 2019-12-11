import { Vue } from 'vue-property-decorator'
import { Context } from '@nuxt/types'
import { ActionContext, Plugin } from 'vuex/types'
import { fetchBest, fetchPrice, f } from './plugins/fetchTasks'

export const state = (): App.State => ({
  best: null,
  tokens: [],
  abis: {},
  price: {}
})

export const plugins: Plugin<App.State>[] = [fetchBest, fetchPrice]

export const actions = {
  async nuxtServerInit(actx: ActionContext<App.State, any>, ctx: Context) {
    try {
      const payload = await f()
      actx.commit('setPrice', payload)

      const best: DTO.BlockDetail = await ctx.$svc.block('best')
      actx.commit('setBest', best.block)
    } catch (error) {
      console.log(error)
    }
  },
  async queryAbi(actx: ActionContext<App.State, any>, key: string) {
    let abi
    try {
      const resp = await fetch(`https://b32.vecha.in/q/${key}.json`)
      if (resp.status !== 200) {
        return
      }
      abi = await resp.json()
    } catch (error) {
      console.log(error)
    }

    actx.commit('setAbi', { key, value: abi[0] })
      ; (this as any).$_localStorage.setItem(key, abi[0])
    return abi[0]
  }
}
export const mutations = {
  setPrice(state: App.State, payload: { [symbol: string]: App.Currency }) {
    const symbols = Object.keys(payload)
    symbols.forEach(item => {
      const temp = payload[item]
      if (!state.price[item]) {
        Vue.set(state.price, item, {})
      }
      for (const t in temp) {
        Vue.set(state.price[item], t, temp[t])
      }
    })
  },
  setTokens(state: App.State, payload: DTO.Token[]) {
    state.tokens = payload.map(item => {
      return {
        ...item,
        imgUrl: `https://vechain.github.io/token-registry/assets/${item.icon}`
      }
    })
  },
  setAbi(state: App.State, payload: { key: string, value: Object }) {
    state.abis[payload.key] = payload.value
  },
  setBest(state: App.State, payload: DTO.Block) {
    state.best = payload
  }
}

export const getters = {
  tokenAddressList(state: App.State) {
    if (state.tokens) {
      return state.tokens!.map(item => {
        return item.address
      })
    } else {
      return []
    }
  }
}


