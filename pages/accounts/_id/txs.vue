<template>
    <div>
        <div class="d-flex justify-content-between align-items-center px-2">
            <div class="d-flex flex-column align-middle mt-2">
                <div class="mb-1">
                    <span class="text-secondary mr-1">Filter by</span>
                    <b-dropdown no-flip size="sm" variant="outline-secondary">
                        <template v-slot:button-content>
                            <span class="text-capitalize">{{ btnContent }}</span>
                        </template>
                        <b-dropdown-item
                            class="text-left"
                            :to="{
                                name: 'accounts-id-txs',
                                params: {
                                    id: $route.params.id
                                }
                            }"
                        >
                            <span class="text-secondary">All</span>
                        </b-dropdown-item>
                        <b-dropdown-item
                            class="text-left"
                            :to="{
                                name: 'accounts-id-txs',
                                params: {
                                    id: $route.params.id
                                },
                                query: {
                                    type: 'Out'
                                }
                            }"
                        >
                            <span class="text-secondary">Sent</span>
                        </b-dropdown-item>
                        <b-dropdown-item
                            class="text-left"
                            :to="{
                                name: 'accounts-id-txs',
                                params: {
                                    id: $route.params.id
                                },
                                query: {
                                    type: 'In'
                                }
                            }"
                        >
                            <span class="text-secondary">Recevied</span>
                        </b-dropdown-item>
                    </b-dropdown>
                </div>
                <div>
                    <small>
                        {{count | numFmt}}
                        <span class="text-secondary">transactions found</span>
                    </small>
                    <small
                        v-if="count > 50000"
                        class="d-block mount text-secondary"
                    >(Showing the last 50K txns)</small>
                </div>
            </div>
            <b-pagination-nav
                :disabled="loading"
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
        <b-table
            show-empty
            empty-text="No Data"
            responsive
            :fields="fields"
            :items="txs"
            :busy="loading"
        >
            <template v-slot:table-busy>
                <div class="text-center">
                    <b-spinner type="grow"></b-spinner>
                    <div>Loading</div>
                </div>
            </template>
            <template v-slot:head(from-to)>{{tableTitle}}</template>
            <template v-slot:cell(index)="row">{{(currentPage - 1) * perPage + row.index + 1}}</template>
            <template v-slot:cell(txID)="row">
                <RevertedIcon v-if="row.item.receipt.reverted" />
                <TxLink :id="row.item.txID" />
            </template>
            <template v-slot:cell(time)="row">{{row.item.meta.blockTimestamp | datetime}}</template>
            <template v-slot:cell(from-to)="row">
                <div class="d-flex align-items-center">
                    <span
                        v-b-tooltip.hover
                        :title="row.item.origin !== account ? 'From' : 'To'"
                    >
                        <font-awesome-icon
                            small
                            class="mr-1"
                            :icon=" row.item.origin !== account ? 'arrow-left' : 'arrow-right'"
                        />
                    </span>
                    <template v-if="row.item.origin === account">
                        <AccountLink
                            size="sm"
                            v-if="row.item.clauses.length === 1 && row.item.clauses[0].to"
                            :address="row.item.clauses[0].to"
                        />
                        <span
                            v-else-if="row.item.clauses.length === 1 && !row.item.clauses[0].to"
                        >Contract Creation</span>
                        <span v-else-if="row.item.clauses.length > 1">Multiple</span>
                        <span v-else>-</span>
                    </template>
                    <template v-else>
                        <AccountLink size="sm" :address="row.item.origin" />
                    </template>
                </div>
            </template>
            <template v-slot:cell(value)="row">
                <Amount :amount="row.item.clauses | countVal" />
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
import { Route } from 'vue-router'
@Component({
    components: {
        AccountLink,
        Amount,
        TxLink,
        RevertedIcon
    },
    async asyncData(ctx: Context) {
        const page = parseInt((ctx.query.page as string) || '1', 10)
        const action = ctx.query.action && ctx.query.action.toString()
        const type: 'In' | 'Out' | undefined = ['In', 'Out'].includes(action)
            ? (action as 'In' | 'Out')
            : undefined

        const result = await ctx.$svc.accountTxs(ctx.params.id, page, type, 10)
        return {
            ...result,
            currentPage: page
        }
    }
})
export default class AccountTxs extends Vue {
    count = 0
    pageCount = 0
    perPage = 10
    txs: DTO.AccountTx[] = []
    loading = false
    currentPage = 1
    isAuthority = false
    currentType = 'All'
    fields = [
        {
            key: 'index',
            label: 'Index'
        },
        {
            key: 'txID',
            label: 'TXID'
        },
        {
            key: 'time',
            label: 'Time'
        },
        {
            key: 'from-to'
        },
        {
            key: 'value',
            label: 'Total VET',
            class: 'text-right'
        }
    ]

    get btnContent() {
        const action = this.$route.query.type
        let result = 'All'
        switch (action) {
            case 'In':
                result = 'Recevied'
                break
            case 'Out':
                result = 'Sent'
            default:
                break
        }
        return result
    }

    get tableTitle() {
        const action = this.$route.query.type
        const type: 'In' | 'Out' | undefined = ['In', 'Out'].includes(
            action as string
        )
            ? (action as 'In' | 'Out')
            : undefined

        if (type === 'In') {
            return 'From'
        } else if (type === 'Out') {
            return 'To'
        } else {
            return 'From/To'
        }
    }

    linkGen(pageNum: number) {
        return {
            path: this.$route.path,
            query: { page: pageNum, type: this.$route.query.type }
        }
    }
    get account() {
        return this.$route.params.id.toLowerCase()
    }
    mounted() {
        this.$emit('account-isAuthority', this.isAuthority)
    }

    @Watch('$route')
    async queryChange(n: Route, o: Route) {
        this.loading = true
        let page = parseInt((this.$route.query.page as string) || '1', 10)

        if (n.query.type !== o.query.type) {
            page = 1
        }

        const action = this.$route.query.type
        const type: 'In' | 'Out' | undefined = ['In', 'Out'].includes(
            action as string
        )
            ? (action as 'In' | 'Out')
            : undefined

        const result = await this.$svc.accountTxs(
            this.$route.params.id,
            page,
            type,
            this.perPage
        )
        this.currentPage = page
        this.loading = false
        this.pageCount = result.pageCount
        this.txs = result.txs
        this.count = result.count
    }
}
</script>
