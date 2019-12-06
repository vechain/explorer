<template>
    <div>
        <div class="my-3">
            <h3 class="d-inline-block mr-3">Block</h3>
            <h5 class="text-secondary d-inline-block">#{{item.block.number | numFmt}}</h5>
        </div>
        <b-nav tabs align="left">
            <b-nav-item
                v-for="item in links"
                :key="item.route.name"
                exact
                replace
                exact-active-class="active"
                :to="item.route"
            >{{item.text}}</b-nav-item>
        </b-nav>
        <nuxt-child :blockDetail="item"/>
    </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import { Context } from '@nuxt/types'

@Component(
    {
        async asyncData(ctx: Context) {
            const blockDetail = await ctx.$axios.$get('/api/blocks/' + ctx.params.id)
            const params = ctx.params
            let bnum = 0
            let txCount = 0

            bnum = blockDetail.block.number
            txCount = blockDetail.block.txCount

            const links = [{
                text: 'Info',
                route: {
                    name: 'block-id',
                    params
                }
            }, {
                text: `Transaction(${txCount})`,
                route: {
                    name: 'block-id-txs',
                    params
                }
            }]

            return { links, item: blockDetail}
        }
    }
)
export default class Block extends Vue {
    item: DTO.BlockDetail | null = null
}
</script>
