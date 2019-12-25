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
                        <span class="text-secondary">transfers found </span>
                    </small>
                    <small
                        v-if="count > 50000"
                        class="d-block mount text-secondary"
                    >(Showing the last 50K txns)</small>
                </div>
            </div>
            <b-pagination-nav
                class="mt-3 d-flex"
                :number-of-pages="pageCount"
                v-model="currentPage"
                size="sm"
                limit="4"
                use-router
                :link-gen="linkGen"
                align="right"
            ></b-pagination-nav>
        </div>
        <b-table responsive show-empty empty-text="No Data" :fields="fields" :items="transfers">
            <template v-slot:cell(index)="row">{{(currentPage - 1) * perPage + row.index + 1}}</template>
            <template v-slot:cell(txID)="row">
                <TxLink :id="row.item.txID" />
            </template>
            <template v-slot:cell(time)="row">{{row.item.meta.blockTimestamp | datetime}}</template>
            <template v-slot:cell(from-to)="row">
                <div class="text-monospace d-flex align-items-center">
                    <template v-if="account !== row.item.sender">
                        <font-awesome-icon style="color: green" small icon="arrow-left" />
                        <AccountLink class="ml-1" size="sm" :address="row.item.sender" />
                    </template>
                    <template v-if="account !== row.item.recipient">
                        <font-awesome-icon style="color: red" small icon="arrow-right" />
                        <AccountLink class="ml-1" size="sm" :address="row.item.recipient" />
                    </template>
                    <template v-if="row.item.sender === row.item.recipient">
                        <font-awesome-icon style="color: #666666" small icon="exchange-alt" />
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
                    <Amount :amount="row.item.amount" :sym="row.item.symbol" :showSym="false" />
                </span>
                <span v-else>
                    <Amount :amount="row.item.amount" :sym="row.item.symbol" :showSym="false" />
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
import { Router } from 'express-serve-static-core'
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
            account: ctx.params.id.toLowerCase(),
            ...result,
            currentPage: page
        }
    }
})
export default class AccountTransfer extends Vue {
    count = 0
    currentPage = 1
    pageCount = 0
    perPage = 10
    transfers: DTO.AccountTransfer[] = []
    isAuthority = false
    fields = [
        {
            key: 'index',
            lable: 'Index'
        },
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
        const query: {
            page?: number
            token?: string
        } = { page: pageNum }
        if (this.btnContent) {
            query.token = (this.btnContent as { symbol: string, imgUrl: string }).symbol
        }
        return {
            path: this.$route.path,
            query
        }
    }

    get btnContent() {
        const temp: string = (this.$route.query.token as string) || ''
        if (temp) {
            return this.tokens.find((item: DTO.Token | { symbol: string, imgUrl: string }) => {
                return temp.toLowerCase() === item.symbol.toLowerCase()
            })
        } else {
            return temp
        }
    }

    getDecimals(token: string) {
        const temp = this.tokens.find(item => {
            return item.symbol === token
        })

        if (temp) {
            return temp.decimals
        } else {
            return 18
        }
    }

    get tokens() {
        if (this.$store.state.tokens) {
            return [{
                symbol: 'VET',
                decimals: 18,
                imgUrl: require('~/assets/vet.png')
            }].concat(this.$store.state.tokens)
        } else {
            return []
        }
    }

    @Watch('$route')
    async queryChange(n: Route, o: Route) {
        let page = parseInt((this.$route.query.page as string) || '1', 10)
        if (n.query.token !== o.query.token) {
            page = 1
        }
        const end = page * this.perPage
        const type = (this.$route.query.token as string) || ''

        const result = await this.$svc.accountTfs(this.$route.params.id, page, this.perPage, type)
        this.pageCount = result.pageCount
        this.currentPage = page
        this.transfers = result.transfers
        this.count = result.count
    }
}
</script>
