<template>
    <div>
        <b-pagination-nav
            class="mt-3"
            :number-of-pages="pageCount"
            v-model="currentPage"
            limit="7"
            use-router
            :link-gen="linkGen"
            align="right"
        ></b-pagination-nav>
        <b-table show-empty responsive :fields="fields" :items="blocks">
            <template v-slot:cell(blcok)="row">
                <nuxt-link
                    class="text-monospace"
                    :to="{name: 'block-id', params: {
                  id: row.item.id
                }}"
                >{{row.item.number | numFmt}}</nuxt-link>
            </template>
            <template v-slot:cell(time)="row">
                <span>{{row.item.timestamp | datetime}}</span>
            </template>
            <template v-slot:cell(reward)="row">
                <Amount :amount="row.item.reward" />
            </template>
        </b-table>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import Amount from '@/components/Amount.vue'
import { Context } from '@nuxt/types'
@Component({
    components: {
        Amount
    },
    async asyncData(ctx: Context) {
        const pageItems = 10
        const page = (ctx.query.page as string) || '1'
        const end = parseInt(page, 10) * pageItems
        const result = await ctx.$axios.$get(`api/accounts/${ctx.params.id}/signed`, {
            params: {
                limit: pageItems,
                offset: end - pageItems
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
export default class AccountBlocks extends Vue {
    count = 0
    currentPage = 1
    blocks = []
    fields = [{
        key: 'blcok',
        label: 'Block#'
    }, {
        key: 'time',
        label: 'Time'
    }, {
        key: 'txCount',
        label: '# fo Txs'
    }, {
        key: 'reward',
        label: 'Reward (VTHO)',
        class: 'text-right'
    }]
    linkGen(pageNum: number) {
        return {
            path: this.$route.path,
            query: { page: pageNum }
        }
    }
    @Watch('$route')
    async queryChange() {
        const pageItems = 10
        const page = (this.$route.query.page as string) || '1'
        const end = parseInt(page, 10) * pageItems
        this.currentPage = parseInt(page)

        const result = await this.$axios.$get(`/api/accounts/${this.$route.params.id}/signed`, {
            params: {
                limit: pageItems,
                offset: end - pageItems
            }
        })
        this.blocks = result.blocks
        this.count = result.count
    }

}
</script>
