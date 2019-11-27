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
        <b-table responsive :fields="fields" :items="transactions">
            <template v-slot:cell(txID)="row">
                <nuxt-link
                    class="text-monospace"
                    :to="{name: 'transaction-id', params: {
                      id: row.item.txID
                  }}"
                >{{row.item.txID | shortAddress}}</nuxt-link>
            </template>
            <template v-slot:cell(time)="row">
                {{row.item.meta.blockTimestamp | datetime}}
            </template>
            <template v-slot:cell(to)="row">
                <AccountLink
                    v-if="row.item.clauses.length === 1"
                    :address="row.item.clauses[0].to"
                />
                <span v-else-if="row.item.clauses.length > 1">Mutiple</span>
                <span v-else>None</span>
            </template>
            <template v-slot:cell(value)="row">
                <span class="text-monospace">{{ row.item.clauses | countVal | hexToVal | balance}}</span>
                <small class="text-secondary">VET</small>
            </template>
        </b-table>
    </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import { Context } from '@nuxt/types'
import AccountLink from '@/components/AccountLink.vue'
@Component({
    components: {
        AccountLink
    },
    async asyncData(ctx: Context) {
        const page = (ctx.query.page as string) || '1'
        const limit = parseInt(page, 10) * 20

        const result = await ctx.$axios.$get(`/api/accounts/${ctx.params.id}/transactions`, {
            params: {
                limit: 20,
                offset: limit - 20
            }
        })

        return {
            ...result,
            currentPage: page,
            pageCount: result.count / 20 + (result.count % 20 && 1)
        }
    }
})
export default class AccountTxs extends Vue {
    count = 0
    transactions = []
    currentPage = 1
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

    @Watch('$route')
    async queryChange() {
        const page = (this.$route.query.page as string) || '1'
        const limit = parseInt(page, 10) * 20

        const result = await this.$axios.$get(`/api/accounts/${this.$route.params.id}/transactions`, {
            params: {
                limit: 20,
                offset: limit - 20
            }
        })
        this.transactions = result.transactions
        this.count = result.count

    }
}
</script>
