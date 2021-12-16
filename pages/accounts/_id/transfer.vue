<template>
    <div>
        <div class="d-flex justify-content-between align-items-center px-2">
            <div class="d-flex flex-column align-middle mt-2">
                <div class="mb-1">
                    <span class="text-secondary mr-1">Filter by</span>
                    <b-dropdown no-flip size="sm" variant="outline-secondary">
                        <template v-slot:button-content>
                            <div class="d-inline-flex align-items-center" v-if="btnContent">
                                <img width="15px" :src="btnContent.imgUrl" alt />
                                <span class="ml-2">{{btnContent.symbol}}</span>
                            </div>
                            <span v-else>ALL</span>
                        </template>
                        <b-dropdown-item
                            class="text-center"
                            :to="{
                                name: 'accounts-id-transfer',
                                params: {
                                    id: $route.params.id
                                }
                            }"
                        >
                            <span class="text-secondary">ALL</span>
                        </b-dropdown-item>
                        <b-dropdown-item
                            :key="item.address"
                            v-for="item in tokens"
                            :to="{
                                name: 'accounts-id-transfer',
                                params: {
                                    id: $route.params.id
                                },
                                query: {
                                    token: item.symbol
                                }
                            }"
                        >
                            <div class="d-flex align-items-center">
                                <img width="25px" :src="item.imgUrl" alt />
                                <span class="text-secondary ml-3">{{item.symbol}}</span>
                            </div>
                        </b-dropdown-item>
                    </b-dropdown>
                </div>
                <div>
                    <small>
                        {{count | numFmt}}
                        <span class="text-secondary">transfers found</span>
                    </small>
                    <small
                        v-if="count > 50000"
                        class="d-block mount text-secondary"
                    >(Showing the last 50K transfers)</small>
                </div>
            </div>
            <b-pagination-nav
                class="mt-3 d-flex"
                :disabled="loading"
                :number-of-pages="pageCount"
                v-model="currentPage"
                size="sm"
                limit="4"
                use-router
                :link-gen="linkGen"
                align="right"
            ></b-pagination-nav>
        </div>
        <b-table
            responsive
            show-empty
            empty-text="No Data"
            :fields="fields"
            :items="transfers"
            :busy="loading"
        >
            <template v-slot:table-busy>
                <div class="text-center">
                    <b-spinner type="grow"></b-spinner>
                    <div>Loading</div>
                </div>
            </template>
            <template v-slot:cell(index)="row">{{(currentPage - 1) * perPage + row.index + 1}}</template>
            <template v-slot:cell(txID)="row">
                <TxLink :id="row.item.txID" />
            </template>
            <template v-slot:cell(time)="row">{{row.item.meta.blockTimestamp | datetime}}</template>
            <template v-slot:cell(from-to)="row">
                <div class="text-monospace d-flex align-items-center">
                    <template v-if="account !== row.item.sender">
                        <span v-b-tooltip.hover title="From">
                            <font-awesome-icon style="color: green" small icon="arrow-left" />
                        </span>
                        <AccountLink class="ml-1" size="sm" :address="row.item.sender" />
                    </template>
                    <template v-if="account !== row.item.recipient">
                        <span v-b-tooltip.hover title="To">
                            <font-awesome-icon style="color: red" small icon="arrow-right" />
                        </span>
                        <AccountLink class="ml-1" size="sm" :address="row.item.recipient" />
                    </template>
                    <template v-if="row.item.sender === row.item.recipient">
                        <span v-b-tooltip.hover title="I'm rich">
                            <font-awesome-icon style="color: #666666" small icon="exchange-alt" />
                        </span>
                        <AccountLink class="ml-1" size="sm" :address="row.item.sender" />
                    </template>
                </div>
            </template>
            <template v-slot:cell(value)="row">
                <span
                    v-if="row.item.sender !== row.item.recipient"
                    :class="account === row.item.sender? 'text-danger': 'text-success'"
                    class="text-monospace"
                >
                    <span>{{account !== row.item.sender ? '+' : '-'}}</span>
                    <Amount :amount="row.item.amount" :dec="row.item.decimals" :sym="row.item.symbol" :showSym="false" />
                </span>
                <span v-else>
                    <Amount :amount="row.item.amount" :dec="row.item.decimals" :sym="row.item.symbol" :showSym="false" />
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
import { Route } from 'vue-router'
@Component({
    components: {
        AccountLink,
        Amount,
        TxLink
    },
    async asyncData(ctx: Context) {
        const page = parseInt((ctx.query.page as string) || '1', 10)
        const type = (ctx.query.token as string) || ''

        const result = await ctx.$svc.accountTfs(ctx.params.id, page, 10, type)
        return {
            transferDetail: result,
            currentPage: page
        }
    }
})
export default class AccountTransfer extends Vue {
    transferDetail: DTO.AccountTransfers & { pageCount: number } | null = null
    currentPage = 1
    perPage = 10
    isAuthority = false
    loading = false
    fields = [
        {
            key: 'index',
            lable: 'Index'
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
            key: 'from-to',
            label: 'From/To'
        },
        {
            key: 'value',
            label: 'Value',
            class: 'text-right'
        },
        {
            key: 'symbol',
            label: 'Token',
            class: 'text-right'
        }
    ]

    linkGen(pageNum: number) {
        const query: {
            page?: number
            token?: string
        } = { page: pageNum }
        if (this.btnContent) {
            query.token = (this.btnContent as {
                symbol: string
                imgUrl: string
            }).symbol
        }
        return {
            path: this.$route.path,
            query
        }
    }

    get account() {
        return this.$route.params.id.toLowerCase()
    }

    get btnContent() {
        const temp: string = (this.$route.query.token as string) || ''
        if (temp) {
            return this.tokens.find(
                (item: DTO.Token | { symbol: string; imgUrl: string }) => {
                    return temp.toLowerCase() === item.symbol.toLowerCase()
                }
            )
        } else {
            return temp
        }
    }

    get tokens() {
        if (this.$store.state.tokens) {
            return [
                {
                    symbol: 'VET',
                    decimals: 18,
                    imgUrl: require('~/assets/vet.png')
                }
            ].concat(this.$store.state.tokens)
        } else {
            return []
        }
    }

    get transfers() {
        return this.transferDetail ? this.transferDetail.transfers : []
    }

    get pageCount() {
        return this.transferDetail ? this.transferDetail.pageCount : 0
    }

    get count() {
        return this.transferDetail ? this.transferDetail.count : 0
    }

    @Watch('$route')
    async queryChange(n: Route, o: Route) {
        this.loading = true
        let page = parseInt((this.$route.query.page as string) || '1', 10)
        if (n.query.token !== o.query.token) {
            page = 1
        }
        const end = page * this.perPage
        const type = (this.$route.query.token as string) || ''

        this.transferDetail = await this.$svc.accountTfs(
            this.$route.params.id,
            page,
            this.perPage,
            type
        )
        this.loading = false
        this.currentPage = page
    }
}
</script>
