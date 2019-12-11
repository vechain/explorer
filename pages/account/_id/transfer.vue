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
                                name: 'account-id-transfer',
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
                                name: 'account-id-transfer',
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
                    {{transfers.length}}
                    <span class="text-secondary">entries</span>
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
                size="sm"
                limit="4"
                use-router
                :link-gen="linkGen"
                align="right"
            ></b-pagination-nav>
        </div>
        <b-table responsive show-empty empty-text="No Data" :fields="fields" :items="transfers">
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
import { Router } from 'express-serve-static-core'
import { Route } from 'vue-router'
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
        const result = await ctx.$axios.$get(`api/accounts/${ctx.params.id.toLowerCase()}/transfers`, {
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

    get tokens() {
        if (this.$store.state.tokens) {
            return [{
                symbol: 'VET',
                imgUrl: require('~/assets/vet.png')
            }].concat(this.$store.state.tokens)
        } else {
            return []
        }
    }

    @Watch('$route')
    async queryChange(n: Route, o: Route) {
        const pageSize = 10
        let page = (this.$route.query.page as string) || '1'
        if (n.query.token !== o.query.token) {
            page = '1'
        }
        const end = parseInt(page, 10) * pageSize
        const type = (this.$route.query.token as string) || ''
        const params: {
            limit: number,
            offset: number,
            type?: string
        } = {
            limit: pageSize,
            offset: end - pageSize
        }
        if (type) {
            params.type = type
        }
        const result = await this.$axios.$get(`/api/accounts/${this.$route.params.id.toLowerCase()}/transfers`, {
            params
        })
        this.pageCount = Math.floor(result.count / pageSize) + (result.count % pageSize > 0 ? 1 : 0) || 1
        this.currentPage = parseInt(page)
        this.transfers = result.transfers
        this.count = result.count
    }
}
</script>
