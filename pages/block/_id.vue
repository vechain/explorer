<template>
    <div>
        <h1>
            Block
            <small class="text-secondary ml-2">#{{id | numFmt}}</small>
        </h1>
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
            const links = [{
                text: 'Info',
                route: {
                    name: 'block-id',
                    params
                }
            }, {
                text: `Transaction(${ctx.payload.block.txCount})`,
                route: {
                    name: 'block-id-txs',
                    params
                }
            }]

            return { links, id: ctx.payload.block.number }
        }
    }
)
export default class Block extends Vue {
}
</script>
