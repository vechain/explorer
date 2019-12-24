<template>
    <div>
        <div class="d-flex justify-content-between align-items-center px-2">
            <div class="d-flex align-middle">
                <div>
                    {{txs.length}}
                    <span class="text-secondary">entries</span>
                    , {{currentPage}}
                    <span class="text-secondary">of</span>
                    {{pageCount | numFmt}}
                    <span class="text-secondary">pages</span>
                </div>
            </div>
            <b-pagination-nav
                class="mt-3 d-flex"
                size="sm"
                :number-of-pages="pageCount"
                v-model="currentPage"
                limit="4"
                use-router
                :link-gen="linkGen"
                align="right"
            ></b-pagination-nav>
        </div>
        <b-table show-empty empty-text="No Data" responsive :fields="fields" :items="txs">
            <template v-slot:cell(txID)="row">
                <RevertedIcon v-if="row.item.receipt.reverted" />
                <TxLink :id="row.item.txID" />
            </template>
            <template v-slot:cell(time)="row">{{row.item.meta.blockTimestamp | datetime}}</template>
            <template v-slot:cell(to)="row">
                <AccountLink
                    v-if="row.item.clauses.length === 1 && row.item.clauses[0].to"
                    :address="row.item.clauses[0].to"
                />
                <span v-else-if="row.item.clauses.length === 1 && !row.item.clauses[0].to">Contract Creation</span>
                <span v-else-if="row.item.clauses.length > 1">Multiple</span>
                <span v-else>-</span>
            </template>
            <template v-slot:cell(value)="row">
                <Amount :amount="row.item.clauses | countVal"/>
            </template>
        </b-table>
    </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import { Context } from '@nuxt/types'
import AccountLink from '@/components/AccountLink.vue'
import Amount from '@/components/Amount.vue'
import TxLink from '@/components/TxLink.vue'
import RevertedIcon from '@/components/RevertedIcon.vue'
@Component({
    components: {
        AccountLink,
        Amount,
        TxLink,
        RevertedIcon
    },
    async asyncData(ctx: Context) {
        const pageSize = 10
        const page = parseInt((ctx.query.page as string) || '1', 10)

        const result = await ctx.$svc.accountTxs(ctx.params.id, page, pageSize)
        return {
            ...result,
            currentPage: page
        }
    }
})
export default class AccountTxs extends Vue {
    count = 0
    pageCount = 0
    txs: DTO.AccountTx[] = []
    currentPage = 1
    isAuthority = false
    fields = [
        {
            key: 'txID',
            label: 'TXID',
        }, {
            key: 'time',
            label: 'Time'
        }, {
            key: 'to',
            label: 'To'
        }, {
            key: 'value',
            label: 'Total VET',
            class: 'text-right'
        }
    ]

    linkGen(pageNum: number) {
        return {
            path: this.$route.path,
            query: { page: pageNum }
        }
    }

    mounted() {
        this.$emit('account-isAuthority', this.isAuthority)
    }

    @Watch('$route')
    async queryChange() {
        const pageSize = 10
        const page = parseInt((this.$route.query.page as string) || '1', 10)

        const result = await this.$svc.accountTxs(this.$route.params.id, page, pageSize)
        this.currentPage = page
        this.pageCount = result.pageCount
        this.txs = result.txs
        this.count = result.count

    }
}
</script>
