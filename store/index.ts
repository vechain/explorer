import { Context } from '@nuxt/types'
import { ActionContext, Plugin, Store } from 'vuex/types'


type State = {
  best: Exp.Block | null
  tokens: Exp.Token[]
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
    try {
      const resp = await fetch(`https://vechain.github.io/token-registry/main.json`)
      if (resp.status !== 200) {
        return
      }
      const list = await resp.json()
      actx.commit('setTokens', list)

      const best = await ctx.$axios.$get('/api/blocks/best')
      actx.commit('setBest', best)
    } catch (error) {
      console.log(error)
    }
  }
}
export const mutations = {
  setTokens(state: State, payload: Exp.Token[]) {
    state.tokens = payload.map(item => {
      return {
        ...item,
        imgUrl: `https://vechain.github.io/token-registry/assets/${item.icon}`
      }
    })
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


