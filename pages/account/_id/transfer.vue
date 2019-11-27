<template>
    <div>
        <b-pagination-nav
            class="mt-3"
            :number-of-pages="pageCount"
            v-model="currentPage"
            limit="20"
            use-router
            :link-gen="linkGen"
            align="right"
        ></b-pagination-nav>
        <b-table :fields="fields" :items="transfers">
            <template v-slot:cell(txID)="row">
                <nuxt-link
                    class="text-monospace"
                    :to="{name: 'transaction-id', params: {
                      id: row.item.txID
                  }}"
                >{{row.item.txID | shortAddress}}</nuxt-link>
            </template>
            <template v-slot:cell(time)="row">{{row.item.meta.blockTimestamp | datetime}}</template>
            <template v-slot:cell(from-to)="row">
                <div>
                    <div v-if="account !== row.item.sender" class="text-monospace">
                        From:
                        <AccountLink :address="row.item.sender" />
                    </div>
                    <div v-if="account !== row.item.recipient" class="text-monospace">
                        To:
                        <AccountLink :address="row.item.recipient" />
                    </div>
                </div>
            </template>
            <template v-slot:cell(value)="row">
                <span class="text-monospace">{{row.item.amount | hexToVal | balance}}</span>
            </template>
        </b-table>
    </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import AccountLink from '@/components/AccountLink.vue'
import { Context } from '@nuxt/types'
@Component({
    components: {
        AccountLink
    },
    async asyncData(ctx: Context) {
        const page = (ctx.query.page as string) || '1'
        const limit = parseInt(page, 10) * 20
        const result = await ctx.$axios.$get(`api/accounts/${ctx.params.id}/transfers`, {
            params: {
                limit: 20,
                offset: limit - 20
            }
        })
        return {
            account: ctx.params.id.toLowerCase(),
            ...result,
            currentPage: page,
            pageCount: result.count / 20 + (result.count % 20 && 1)
        }
    }
})
export default class AccountTransfer extends Vue {
    count = 0
    currentPage = 1
    transfers = []
    fields = [
        {
            key: 'txID',
            label: 'TXID',
        }, {
            key: 'time',
            label: 'Time/Block#'
        }, {
            key: 'from-to',
            label: 'From/To'
        }, {
            key: 'token',
            label: 'Token'
        }, {
            key: 'value',
            label: 'Value'
        }
    ]

    linkGen(pageNum: number) {
        return {
            path: this.$route.path,
            query: { page: pageNum }
        }
    }
    @Watch('$route')
    async queryChange() {
        const page = (this.$route.query.page as string) || '1'
        const limit = parseInt(page, 10) * 20

        const result = await this.$axios.$get(`/api/accounts/${this.$route.params.id}/transfers`, {
            params: {
                limit: 20,
                offset: limit - 20
            }
        })
        this.transfers = result.transfers
        this.count = result.count
    }
}
</script>
