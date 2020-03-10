import { Context } from '@nuxt/types'

const IS_MAIN = (process.env['current'] || '').toLowerCase() === 'mainnet'
console.log(`%cREV.${process.env.Version}`, 'color: #3c5999;')

interface LocalS {
  getItem(key: string): any,
  setItem(key: string, item: any): void
}
declare module '@nuxt/types' {
  interface Context {
    $_localStorage: LocalS
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $_localStorage: LocalS
  }
}
function setItem(key: string, content: any) {
  localStorage.setItem(key, JSON.stringify(content))
}
const getItem = function (key: string) {
  const str = localStorage.getItem(key)
  if (str) {
    return JSON.parse(str)
  }
}

async function fetchTokens() {
  const resp = await fetch(`/api/registry/tokens`)
  if (resp.status !== 200) {
    return
  }
  return await resp.json()
}

async function setToken() {
  const result = await fetchTokens()
  const obj = {
    time: Date.now(),
    list: result.tokens
  }
  setItem('tokens', obj)
}

const _localStorage: LocalS = {
  getItem,
  setItem
}

const initTokens = async () => {
  const tokens = getItem('tokens')
  if (tokens) {
    if ((Date.now() - tokens.time) > 24 * 60 * 60 * 1000) {
      await setToken()
    }
  } else {
    await setToken()
  }
}

const getLocalAbis = (): { key: string, value: object }[] => {
  const keys = Object.keys(localStorage)
  const abiKeys = keys.filter((item: string) => {
    return item && (item.indexOf('0x') === 0) && (item.length === 10 || item.length === 66)
  })

  return abiKeys.map(item => {
    return {
      key: item,
      value: getItem(item)
    }
  })
}

export default async (ctx: Context, inject: any) => {
  await initTokens()
  ctx.store.commit('setTokens', getItem('tokens').list)
  const abis = getLocalAbis()
  abis.forEach(item => {
    ctx.store.commit('setAbi', item)
  })
  ctx.$_localStorage = _localStorage
  inject('_localStorage', _localStorage)
}
