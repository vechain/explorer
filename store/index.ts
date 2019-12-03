import { Context } from '@nuxt/types'
import { ActionContext, Plugin } from 'vuex/types'
import { fetchBest } from './plugins/fetchBest'
export const state = (): Exp.State => ({
  best: null,
  tokens: [],
  abis: {
    '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef':
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "_from",
          "type": "address"
        },
        {
          "indexed": true,
          "name": "_to",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    '0xa9059cbb': {
      "constant": false,
      "inputs": [
        {
          "name": "_to",
          "type": "address"
        },
        {
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "transfer",
      "outputs": [
        {
          "name": "success",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    }
  }
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


