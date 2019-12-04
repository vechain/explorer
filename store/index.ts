import { Context } from '@nuxt/types'
import { ActionContext, Plugin } from 'vuex/types'
import { fetchBest } from './plugins/fetchBest'
export const state = (): Exp.State => ({
  best: null,
  tokens: [],
  abis: {}
})

export const plugins: Plugin<Exp.State>[] = [fetchBest]

export const actions = {
  async nuxtServerInit(actx: ActionContext<Exp.State, any>, ctx: Context) {
    try {
      const best: Exp.BlockDetail = await ctx.$axios.$get('/api/blocks/best')
      actx.commit('setBest', best.block)
    } catch (error) {
      console.log(error)
    }
  },
  async queryAbi(actx: ActionContext<Exp.State, any>, key: string) {
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
    ;(this as any).$_localStorage.setItem(key, abi[0])
    return abi[0]
  }
}
export const mutations = {
  setTokens(state: Exp.State, payload: Exp.Token[]) {
    state.tokens = payload.map(item => {
      return {
        ...item,
        imgUrl: `https://vechain.github.io/token-registry/assets/${item.icon}`
      }
    })
  },
  setAbi(state: Exp.State, payload: { key: string, value: Object }) {
    state.abis[payload.key] = payload.value
  },
  setBest(state: Exp.State, payload: Exp.Block) {
    state.best = payload
  }
}

export const getters = {
  tokenAddressList(state: Exp.State) {
    if (state.tokens) {
      return state.tokens!.map(item => {
        return item.address
      })
    } else {
      return []
    }
  }
}


