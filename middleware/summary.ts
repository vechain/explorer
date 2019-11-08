import {Context} from '@nuxt/types'

export default async function getAccountSummary(ctx: Context) {
  try {
    ctx.payload = await ctx.$axios.$get('/api/accounts/' + ctx.params.id)
  } catch (error) {
    console.error(error)
  }
}
