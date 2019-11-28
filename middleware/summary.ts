import { Context } from '@nuxt/types'

export default async function getAccountSummary(ctx: Context) {
  try {
    const result = await ctx.$axios.$get('/api/accounts/' + ctx.params.id)
    ctx.payload = { account: {}, token: result.token, isAuthority: false }

    if (result.account) {
      Object.assign(ctx.payload.account, result.account)
    }
    if (result.authority) {
      Object.assign(ctx.payload.account, result.authority)
      ctx.payload.isAuthority = true
    }
  } catch (error) {
    console.error(error)
  }
}
