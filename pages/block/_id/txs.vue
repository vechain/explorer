<template>
    <div>
        <div class="mt-3">
            <b-pagination v-model="currentPage" :total-rows="rows" align="right"></b-pagination>
        </div>
        <b-table id="block-txs" :fields="fields" :items="txs">
            <template v-slot:cell(index)="row">{{row.index + 1}}</template>
            <template v-slot:cell(txID)="row">
                <TxLink :id="row.item.txID" />
            </template>
            <template v-slot:cell(clauses)="row">{{row.item.clauses.length}}</template>
            <template v-slot:cell(from-to)="row">
                <nuxt-link
                    :to="{
                    name: 'account-id-summary',
                    params: {
                        id: row.item.origin
                    }
                }"
                    class="text-monospace"
                >{{row.item.origin | toChecksumAddress | shortAddress}}</nuxt-link>
            </template>
        </b-table>
    </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { Context } from '@nuxt/types'
import TxLink from '@/components/TxLink.vue'
@Component({
    components: {
        TxLink
    },
    async asyncData(ctx: Context) {
        const result = await ctx.$axios.$get(`/api/blocks/${ctx.params.id}/transactions`)

        return {
            txs: result.txs,
            rows: result.txs.length
        }
    }
})
export default class BlockTxs extends Vue {
    currentPage = 1
    rows = 220
    perPage = 10
    fields = [
        {
            key: 'index',
            lable: 'Index'
        }, {
            key: 'txID',
            label: 'TxID',
        }, {
            key: 'clauses',
            label: '#Cl'
        }, {
            key: 'from-to',
            label: 'From/To'
        }, {
            key: 'value',
            label: 'Totla VET'
        }
    ]
}
</script>
