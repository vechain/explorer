<template>
    <div>
        <div class="d-flex justify-content-between align-items-center">
            <div class="d-flex align-middle">
                <div>
                    {{blocks.length}}
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
        <b-table show-empty empty-text="No Data" responsive :fields="fields" :items="blocks">
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
        const pageSize = 10
        const page = (ctx.query.page as string) || '1'
        const end = parseInt(page, 10) * pageSize
        const result = await ctx.$axios.$get(`api/accounts/${ctx.params.id}/signed`, {
            params: {
                limit: pageSize,
                offset: end - pageSize
            }
        })
        return {
            ...result,
            currentPage: page,
            pageCount: Math.floor(result.count / pageSize) + (result.count % pageSize > 0 ? 1 : 0) || 1
        }
    }
})
export default class AccountBlocks extends Vue {
    count = 0
    currentPage = 1
    blocks = []
    pageCount = 0
    fields = [{
        key: 'blcok',
        label: 'Block#'
    }, {
        key: 'time',
        label: 'Time'
    }, {
        key: 'txCount',
        label: 'Transactions'
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
        const pageSize = 10
        const page = (this.$route.query.page as string) || '1'
        const end = parseInt(page, 10) * pageSize

        const result = await this.$axios.$get(`/api/accounts/${this.$route.params.id}/signed`, {
            params: {
                limit: pageSize,
                offset: end - pageSize
            }
        })
        this.currentPage = parseInt(page)
        this.pageCount = Math.floor(result.count / pageSize) + (result.count % pageSize > 0 ? 1 : 0) || 1
        this.blocks = result.blocks
        this.count = result.count
    }
}
</script>
