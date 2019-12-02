import { Context } from '@nuxt/types'
import { ActionContext, Plugin, Store } from 'vuex/types'
type token = {
  name: string
  symbol: string
  decimals: number
  address: string
  icon: string
  desc: string
}

type State = {
  best: Exp.Block | null
  tokens: token[]
  abis: {
    [key: string]: any
  }
}

export const state = (): State => ({
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

const fetchBest: Plugin<State> = (store: Store<State>) => {
  if (process.browser) {
    setInterval(async () => {
      const best = await store.$axios.$get('/api/blocks/best')
      store.commit('setBest', best)
    }, 10000)
  }
}

export const plugins: Plugin<State>[] = [fetchBest]

export const actions = {
  async nuxtServerInit(actx: ActionContext<State, any>, ctx: Context) {
    const best = await ctx.$axios.$get('/api/blocks/best')
    actx.commit('setBest', best)
  }
}
export const mutations = {
  setTokens(state: State, payload: token[]) {
    state.tokens = payload
  },
  setAbi(state: State, payload: { key: string, value: Object }) {
    state.abis[payload.key] = payload.value
  },
  setBest(state: State, payload: Exp.BlockDetail) {
    state.best = payload
  }
}

export const getters = {
  tokenAddressList(state: State) {
    return state.tokens.map(item => {
      return item.address
    })
  }
}


