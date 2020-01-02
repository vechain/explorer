<template>
    <div>
        <div class="d-flex justify-content-between align-items-center px-2">
            <div class="d-flex align-middle">
                <div>
                    {{pageItems}}
                    <span class="text-secondary">entries</span>
                    , {{currentPage}}
                    <span class="text-secondary">of</span>
                    {{pageCount | numFmt}}
                    <span class="text-secondary">pages</span>
                </div>
            </div>
            <b-pagination
                class="mt-3 d-flex"
                size="sm"
                :per-page="perPage"
                v-model="currentPage"
                :total-rows="rows"
                align="right"
            ></b-pagination>
        </div>
        <b-table
            show-empty
            responsive
            :per-page="perPage"
            :current-page="currentPage"
            empty-text="No Data"
            id="block-txs"
            :fields="fields"
            :items="txs"
        >
            <template v-slot:cell(index)="row">{{(currentPage - 1) * perPage + row.index + 1}}</template>
            <template v-slot:cell(txID)="row">
                <RevertedIcon v-if="row.item.receipt.reverted" />
                <TxLink :id="row.item.txID" />
            </template>
            <template v-slot:cell(clauses)="row">
                <nuxt-link
                    :to="{
                    name: 'transactions-id',
                    params: {
                        id: row.item.txID
                    },
                    hash: '#clauses'
                }"
                >{{row.item.clauses.length}}</nuxt-link>
            </template>
            <template v-slot:cell(origin)="row">
                <AccountLink :address="row.item.origin" />
            </template>
            <template v-slot:cell(value)="row">
                <Amount :amount="row.item.clauses | countVal" />
            </template>
        </b-table>
    </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { Context } from '@nuxt/types'
import TxLink from '@/components/TxLink.vue'
import AccountLink from '@/components/AccountLink.vue'
import Amount from '@/components/Amount.vue'
import RevertedIcon from '@/components/RevertedIcon.vue'
@Component({
    components: {
        TxLink,
        AccountLink,
        Amount,
        RevertedIcon
    },
    async asyncData(ctx: Context) {
        const result = await ctx.$svc.blockTxs(ctx.params.id)
        return {
            txs: result.txs,
            rows: result.txs.length
        }
    }
})
export default class BlockTxs extends Vue {
    currentPage = 1
    rows = 0
    perPage = 10
    fields = [
        {
            key: 'index',
            label: 'Index'
        },
        {
            key: 'txID',
            label: 'TxID'
        },
        {
            key: 'clauses',
            label: 'Clauses'
        },
        {
            key: 'origin',
            label: 'Origin'
        },
        {
            key: 'value',
            label: 'Total VET',
            class: 'text-right'
        }
    ]

    get pageItems() {
        if (this.rows > 0) {
            return this.currentPage === this.pageCount
                ? this.rows % this.perPage || this.perPage
                : this.perPage
        } else {
            return 0
        }
    }

    get pageCount() {
        return (
            Math.floor(this.rows / this.perPage) +
                (this.rows % this.perPage > 0 ? 1 : 0) || 1
        )
    }
}
</script>
