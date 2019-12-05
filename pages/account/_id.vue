<template>
    <div>
        <div class="my-3">
            <h3 class="d-inline-block">{{title}}</h3>
            <h5
                class="text-secondary ml-2 d-inline-block"
            >{{address | toChecksumAddress | shortAddress}}</h5>
        </div>
        <b-nav tabs align="left">
            <b-nav-item
                v-for="item in links"
                :key="item.route.name"
                replace
                :active="item.route.name === $route.name"
                :to="item.route"
            >{{item.text}}</b-nav-item>
        </b-nav>
        <nuxt-child />
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { Context } from '@nuxt/types'
import { Route } from 'vue-router'
@Component({
    middleware: 'summary',
    async asyncData(ctx: Context) {
        const params = ctx.params
        const result = ctx.payload
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

        return { links, address: result.account.address, title }
    }
})
export default class Account extends Vue {
    links: any[] = []
    // onGet(isAuthority: boolean) {
    //     if (this.links.length === 4) {
    //         return
    //     }
    //     this.links.push({
    //         text: 'Signed Blocks',
    //         route: {
    //             name: 'account-id-blocks',
    //             params: this.$route.params
    //         }
    //     })
    // }
}
</script>
