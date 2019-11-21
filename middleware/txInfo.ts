import { Context } from '@nuxt/types'

export default async function getAccountSummary(ctx: Context) {
  try {
    const result = await ctx.$axios.$get('/api/transactions/' + ctx.params.id)

    ctx.payload = { tx: {}, clauses: result.tx.clauses, outputs: result.receipt.outputs }
    Object.assign(ctx.payload.tx, result.tx)
    Object.assign(ctx.payload.tx, result.receipt)
  } catch (error) {
    console.error(error)
  }
}
