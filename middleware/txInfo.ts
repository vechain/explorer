import { Context } from '@nuxt/types'

export default async function getAccountSummary(ctx: Context) {
  try {
    const result: DTO.TxDetail = await ctx.$axios.$get('/api/transactions/' + ctx.params.id)

    ctx.payload = {
      tx: {},
      clauses: result.tx.clauses,
      outputs: result.receipt.outputs,
      transfers: result.transfers,
      meta: result.meta
    }
    Object.assign(ctx.payload.tx, result.tx)
    Object.assign(ctx.payload.tx, result.receipt)
    Object.assign(ctx.payload.tx, result.meta)
  } catch (error) {
    console.error(error)
  }
}
