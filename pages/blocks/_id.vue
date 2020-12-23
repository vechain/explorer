<template>
    <div>
        <template v-if="item.block">
            <div class="my-3">
                <h3 class="d-inline-block mr-3">Block</h3>
                <h5 class="text-secondary d-inline-block">#{{item.block.number | numFmt}}</h5>
                <b-badge v-if="!item.block.isTrunk" variant="warning" class="text-white">Branch</b-badge>
            </div>
            <b-nav class="border-0" tabs align="left">
                <b-nav-item
                    link-classes="border-0"
                    v-for="item in links"
                    :key="item.route.name"
                    exact
                    exact-active-class="active"
                    :to="item.route"
                >{{item.text}}</b-nav-item>
            </b-nav>
            <nuxt-child style="background-color: #fff" :blockDetail="item" />
        </template>
        <template v-else>
            <div class="my-3">
                <h3 class="d-inline-block mr-3">Sorry we can not lcoate the block</h3>
                <ol class="pl-3 mt-3">
                    <li>The block might be in future the block.</li>
                    <li>Please make sure the block is same as the explorer network.</li>
                    <li>Please make sure the blockID is valid.</li>
                </ol>

                <b-button class="mt-3" squared variant="outline-primary" :to="{name: 'index'}">BACK TO HOMEPAGE</b-button>
            </div>
        </template>
    </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import { Context } from '@nuxt/types'

@Component({
    head() {
        if ((this as Block).item!.block) {
            return {
                titleTemplate: `%s | Block ${(this as Block).item!.block.number.toLocaleString()}`
            }
        } else {
            return {
                titleTemplate: `%s | Block`
            }
        }
    },
    validate({ params }) {
        return !!params.id && /^0x[0-9a-fA-F]{64}$/.test(params.id)
    },
    async asyncData(ctx: Context) {
        const blockDetail = await ctx.$svc.block(ctx.params.id)

        if (!blockDetail.block) {
            return {
                item: blockDetail
            }
        }
        const params = ctx.params
        let bnum = 0
        let txCount = 0

        bnum = blockDetail.block.number
        txCount = blockDetail.block.txCount

        const links = [
            {
                text: 'Info',
                route: {
                    name: 'blocks-id',
                    params
                }
            },
            {
                text: `Transactions(${txCount})`,
                route: {
                    name: 'blocks-id-txs',
                    params
                }
            }
        ]

        return { links, item: blockDetail }
    }
})
export default class Block extends Vue {
    item: DTO.BlockDetail | null = null
}
</script>
