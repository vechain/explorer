<template>
    <div>
        <div class="d-flex justify-content-between align-items-center">
            <div class="d-flex align-middle">
                <div>
                    {{transfers.length}}
                    <span class="text-secondary">items</span>
                    , {{currentPage}}
                    <span class="text-secondary">of</span>
                    {{pageCount | numFmt}}
                    <span class="text-secondary">pages</span>
                </div>
            </div>
            <b-pagination-nav
                class="mt-3 d-flex"
                :number-of-pages="pageCount"
                v-model="currentPage"
                limit="7"
                use-router
                :link-gen="linkGen"
                align="right"
            ></b-pagination-nav>
        </div>
        <b-table show-empty empty-text="no data" :fields="fields" :items="transfers">
            <template v-slot:cell(txID)="row">
                <TxLink :id="row.item.txID" />
            </template>
            <template v-slot:cell(time)="row">{{row.item.meta.blockTimestamp | datetime}}</template>
            <template v-slot:cell(from-to)="row">
                <div>
                    <div v-if="account !== row.item.sender" class="text-monospace">
                        <font-awesome-icon style="color: green" small icon="arrow-left" />
                        <AccountLink size="sm" :address="row.item.sender" />
                    </div>
                    <div v-if="account !== row.item.recipient" class="text-monospace">
                        <font-awesome-icon style="color: red" small icon="arrow-right" />
                        <AccountLink size="sm" :address="row.item.recipient" />
                    </div>
                </div>
            </template>
            <template v-slot:cell(value)="row">
                <span
                    :class="account === row.item.sender? 'text-danger': 'text-success'"
                    class="text-monospace"
                >
                    <span>{{account !== row.item.sender ? '+' : '-'}}</span>
                    <Amount :amount="row.item.amount" />
                </span>
            </template>
        </b-table>
    </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import AccountLink from '@/components/AccountLink.vue'
import { Context } from '@nuxt/types'
import Amount from '@/components/Amount.vue'
import TxLink from '@/components/TxLink.vue'
@Component({
    components: {
        AccountLink,
        Amount,
        TxLink
    },
    async asyncData(ctx: Context) {
        const pageSize = 10
        const page = (ctx.query.page as string) || '1'
        const end = parseInt(page, 10) * pageSize
        const result = await ctx.$axios.$get(`api/accounts/${ctx.params.id}/transfers`, {
            params: {
                limit: pageSize,
                offset: end - pageSize
            }
        })
        return {
            account: ctx.params.id.toLowerCase(),
            ...result,
            currentPage: page,
            pageCount: Math.floor(result.count / pageSize) + (result.count % pageSize > 0 ? 1 : 0) || 1
        }
    }
})
export default class AccountTransfer extends Vue {
    count = 0
    currentPage = 1
    pageCount = 0
    transfers = []
    isAuthority = false
    fields = [
        {
            key: 'txID',
            label: 'TXID',
        }, {
            key: 'time',
            label: 'Time'
        }, {
            key: 'from-to',
            label: 'From/To'
        }, {
            key: 'value',
            label: 'Value',
            class: 'text-right'
        }, {
            key: 'symbol',
            label: 'Token',
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
        const page = (this.$route.query.page as string) || '1'
        const end = parseInt(page, 10) * pageSize


        const result = await this.$axios.$get(`/api/accounts/${this.$route.params.id}/transfers`, {
            params: {
                limit: pageSize,
                offset: end - pageSize
            }
        })
        this.pageCount = Math.floor(result.count / pageSize) + (result.count % pageSize > 0 ? 1 : 0) || 1
        this.currentPage = parseInt(page)
        this.transfers = result.transfers
        this.count = result.count
    }
}
</script>
