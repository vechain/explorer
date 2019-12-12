<template>
    <div>
        <div class="my-3">
            <h3 class="d-inline-block">No Result Found</h3>
        </div>
        <div class="text-break">
            <p class="my-4">Please make sure "{{content}}" is valid</p>
            <b-button squared variant="outline-primary" :to="{name: 'index'}">BACK TO HOMEPAGE</b-button>
        </div>
    </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import { Context } from '@nuxt/types'
@Component({
    async asyncData(ctx: Context) {
        const svc = ctx.$svc
        const search = (ctx.query.content as string || '').trim()
        let rt: any = null
        if (/^0x[0-9a-f]{40}$/i.test(search)) {
            rt = { name: 'accounts-id', params: { id: search.toLowerCase() } }
        } else if (/^[0-9]+$/.test(search)) {
            const bd = await svc.block(search)
            if (bd && bd.block) {
                rt = { name: 'blocks-id', params: { id: bd.block.id } }
            }
        } else if (/^0x[0-9-a-f]{64}$/i.test(search)) {
            const bd = await svc.block(search)
            if (bd && bd.block) {
                rt = { name: 'blocks-id', params: { id: bd.block.id } }
            } else {
                const txDetail = await svc.tx(search)
                if (txDetail) {
                    rt = { name: 'transactions-id', params: { id: txDetail.tx.txID }, hash: '#info' }
                }
            }
        } else {}

        if (rt === null) {
            return {
                content: search
            }
        }
        ctx.redirect(302, '/' + rt.name.split('-')[0] + (rt.params ? ('/' + rt.params.id) : '') + (rt.hash || ''))
    }
})
export default class Search extends Vue {
    content: string = ''
    async search() {
        const svc = this.$svc
        const search = (this.$route.query.content as string || '').trim()
        let rt: any = null
        if (/^0x[0-9a-f]{40}$/i.test(search)) {
            rt = { name: 'accounts-id', params: { id: search } }
        } else if (/^[0-9]+$/.test(search)) {
            const bd = await svc.block(search)
            if (bd && bd.block) {
                rt = { name: 'blocks-id', params: { id: bd.block.id } }
            }
        } else if (/^0x[0-9-a-f]{64}$/i.test(search)) {
            const bd = await svc.block(search)
            if (bd && bd.block) {
                rt = { name: 'blocks-id', params: { id: bd.block.id } }
            } else {
                const txDetail = await svc.tx(search)
                if (txDetail && txDetail.tx) {
                    rt = { name: 'transactions-id', params: { id: txDetail.tx.txID }, hash: '#info' }
                }
            }
        } else {}

        if (rt === null) {
            this.content = search
            return
        }

        this.$router.push(rt)
    }

    @Watch('$route')
    routeChange() {
        this.search()
    }
}
</script>
