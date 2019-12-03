import { Context } from '@nuxt/types'
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
  const resp = await fetch(`https://vechain.github.io/token-registry/main.json`)
  if (resp.status !== 200) {
    return
  }
  return await resp.json()
}

async function setToken() {
  const tokens = await fetchTokens()
  const obj = {
    time: Date.now(),
    list: tokens
  }
  setItem('tokens', obj)
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

export default async (t: Context) => {
  await initTokens()
  t.store.commit('setTokens', getItem('tokens').list)
}
