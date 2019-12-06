<template>
    <div>
        <div class="my-3">
            <h3 class="d-inline-block mr-3">{{title}}</h3>
            <h5
                class="text-secondary d-inline-block"
            >{{account.address | toChecksumAddress | shortAddress}}</h5>
        </div>
        <b-nav class="border-0" tabs align="left">
            <b-nav-item
                link-classes="border-0"
                v-for="item in links"
                :key="item.route.name"
                replace
                :active="item.route.name === $route.name"
                :to="item.route"
            >{{item.text}}</b-nav-item>
        </b-nav>
        <nuxt-child style="background-color: #fff" :account="account" :authority="authority" :token="token"/>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { Context } from '@nuxt/types'
import { Route } from 'vue-router'
@Component({
    async asyncData(ctx: Context) {
        const params = ctx.params
        const result = await ctx.$axios.$get('/api/accounts/' + ctx.params.id)
        const links = [{
            text: 'Summary',
            route: {
                name: 'account-id',
                params
            }
        }, {
            text: 'Transactions',
            route: {
                name: 'account-id-txs',
                params
            }
        }, {
            text: 'Transfers',
            route: {
                name: 'account-id-transfer',
                params
            }
        }]

        if (result && result.authority) {
            links.push({
                text: 'Signed Blocks',
                route: {
                    name: 'account-id-blocks',
                    params
                }
            })
        }
        const title = result.account.code
            ? 'Contract'
            : (result.authority ? 'Authority' : 'Account')

        return { links, ...result, title }
    }
})
export default class Account extends Vue {
    links: any[] = []
    account: any = null
    authority: any = null
    token: DTO.Token[] = []
}
</script>
