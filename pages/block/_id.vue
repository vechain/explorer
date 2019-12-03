<template>
    <div>
        <div>
        <h3 class="d-inline-block">
            Block
        </h3>
        <h5 class="text-secondary ml-2 d-inline-block">#{{id | numFmt}}</h5>
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
        <nuxt-child />
    </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import { Context } from '@nuxt/types'

@Component(
    {
        async asyncData(ctx: Context) {
            const params = ctx.params
            let bnum = 0
            let txCount = 0
            if (ctx.route.name === 'block-id') {
                bnum = ctx.payload.block.number
                txCount = ctx.payload.block.txCount
            } else {
                bnum = ctx.payload.meta.number
                txCount = ctx.payload.txs.length
            }

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

            return { links, id: bnum }
        }
    }
)
export default class Block extends Vue {
}
</script>
