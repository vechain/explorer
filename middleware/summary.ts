import { Context } from '@nuxt/types'

export default async function getSummary(ctx: Context) {
  try {
    ctx.payload = await ctx.$axios.$get('/api/accounts/' + ctx.params.id)
  } catch (error) {
    console.error(error)
  }
}
