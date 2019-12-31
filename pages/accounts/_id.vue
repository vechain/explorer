<template>
    <div>
        <div class="my-3">
            <h3 class="d-inline-block mr-3">{{ title }}</h3>
            <h5
                class="text-secondary d-inline-block"
            >{{ account.address | toChecksumAddress | shortAddress }}</h5>
        </div>
        <b-nav class="border-0" tabs align="left">
            <b-nav-item
                link-classes="border-0"
                v-for="item in links"
                :key="item.route.name"
                :active="item.route.name === $route.name"
                :to="item.route"
            >{{ item.text }}</b-nav-item>
        </b-nav>
        <nuxt-child
            style="background-color: #fff"
            :account="account"
            :authority="authority"
            :tokens="tokens"
        />
    </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import { Context } from '@nuxt/types'
import { Route } from 'vue-router'
@Component({
    head() {
        return {
            titleTemplate: `%s | ${(this as Account).title}`
        }
    },
    async asyncData(ctx: Context) {
        const params = ctx.params
        const result = await ctx.$svc.account(ctx.params.id)
        const links = [
            {
                text: 'Summary',
                route: {
                    name: 'accounts-id',
                    params
                }
            },
            {
                text: 'Transactions',
                route: {
                    name: 'accounts-id-txs',
                    params
                }
            },
            {
                text: 'Transfers',
                route: {
                    name: 'accounts-id-transfer',
                    params
                }
            }
        ]

        if (result && result.authority) {
            links.push({
                text: 'Signed Blocks',
                route: {
                    name: 'accounts-id-blocks',
                    params
                }
            })
        }
        const title = result.account.code
            ? 'Contract'
            : result.authority
            ? 'Authority'
            : 'Account'

        return { links, ...result, title }
    }
})

export default class Account extends Vue {
    links: any[] = []
    account: DTO.Account | null = null
    authority: DTO.Authority | null = null
    tokens: DTO.TokenBalance[] = []
    title: string | null = null
    
    @Watch('$route')
    async onRouterChange(to: Route, from: Route){
        if(to.name === 'accounts-id') {
            const temp = await this.$svc.account(to.params.id)
            this.account = temp.account
            this.authority = temp.authority
            this.tokens = temp.tokens
        }
    }
}
</script>
