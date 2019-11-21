import {Context} from '@nuxt/types'

export default async function getBlockInfo(ctx: Context) {
  try {
    ctx.payload = await ctx.$axios.$get('/api/blocks/' + ctx.params.id)
  } catch (error) {
    console.error(error)
  }
}
