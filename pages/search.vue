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
        const search = (ctx.query.content as string || '').toString().trim()
        let rt: any = await ctx.$svc.search(search)

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
        const search = (this.$route.query.content as string || '').toString().trim()
        let rt: any = await this.$svc.search(search)

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
