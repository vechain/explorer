<template>
    <div>
        <div class="d-flex justify-content-between align-items-center px-2">
            <div class="d-flex align-middle">
                <div>
                    <small>
                        {{count | numFmt}}
                        <span class="text-secondary">blocks found</span>
                    </small>
                    <small
                        v-if="count > 50000"
                        class="d-block mount text-secondary"
                    >(Showing the last 50K blocks)</small>
                </div>
            </div>
            <b-pagination-nav
                :disabled="loading"
                class="mt-3 d-flex"
                :number-of-pages="pageCount"
                v-model="currentPage"
                limit="4"
                use-router
                size="sm"
                :link-gen="linkGen"
                align="right"
            ></b-pagination-nav>
        </div>
        <b-table show-empty empty-text="No Data" responsive :fields="fields" :items="blocks" :busy="loading">
            <template v-slot:table-busy>
                <div class="text-center">
                    <b-spinner type="grow"></b-spinner>
                    <div>Loading</div>
                </div>
            </template>
            <template v-slot:cell(index)="row">{{(currentPage - 1) * perPage + row.index + 1}}</template>
            <template v-slot:cell(blcok)="row">
                <nuxt-link
                    class="text-monospace"
                    :to="{name: 'blocks-id', params: {
                  id: row.item.id
                }}"
                >{{row.item.number | numFmt}}</nuxt-link>
            </template>
            <template v-slot:cell(time)="row">
                <span>{{row.item.timestamp | datetime}}</span>
            </template>
            <template v-slot:cell(txCount)="row">
                <nuxt-link
                    :to="{
                        name: 'blocks-id-txs',
                        params: {
                        id: row.item.id
                        }
                    }"
                >{{row.item.txCount}}</nuxt-link>
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
        const page = parseInt((ctx.query.page as string) || '1')
        const result = await ctx.$svc.signedBlocks(
            ctx.params.id,
            page,
            10
        )
        return {
            ...result,
            currentPage: page
        }
    }
})
export default class AccountBlocks extends Vue {
    count = 0
    currentPage = 1
    blocks: DTO.Block[] = []
    perPage = 10
    pageCount = 0
    loading = false
    fields = [
        {
            key: 'index',
            label: 'Index'
        },
        {
            key: 'blcok',
            label: 'Block#'
        },
        {
            key: 'time',
            label: 'Time'
        },
        {
            key: 'txCount',
            label: 'Transactions'
        },
        {
            key: 'reward',
            label: 'Reward (VTHO)',
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
        this.loading = true
        const page = parseInt((this.$route.query.page as string) || '1', 10)
        const result = await this.$svc.signedBlocks(
            this.$route.params.id,
            page,
            this.perPage
        )
        this.loading = false
        this.currentPage = page
        this.pageCount = result.pageCount
        this.blocks = result.blocks
        this.count = result.count
    }
}
</script>
