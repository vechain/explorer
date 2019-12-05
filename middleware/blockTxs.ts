import { Context } from '@nuxt/types'

export default async function getBlockTxs(ctx: Context) {
  try {
    ctx.payload = await ctx.$axios.$get(`/api/blocks/${ctx.params.id}/transactions`)
  } catch (error) {
    console.error(error)
  }
}
